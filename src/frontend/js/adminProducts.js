/**
 * Módulo de administração de produtos.
 * 
 * Contém funções para renderizar a página de gerenciamento de produtos, 
 * listar produtos existentes, criar novos produtos, editar produtos 
 * existentes e remover produtos. Também gerencia os campos de upload 
 * de imagens, preview de imagens, e interação com os modais de cadastro 
 * e edição de produtos.
 */
export default function adminProductsPage() {

  return `
    <section class="admin-products">
      <h2>Gerenciar Produtos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody id="product-list">
        </tbody>
      </table>

      <a class="btn btn-primary" style="width:120px" data-bs-toggle="modal" data-bs-target="#modelProductRegister" href="#">Criar Produto</a>

      <div class="modal fade" id="modelProductRegister" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">

                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Cadastrar Produto</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <form id="cadastrar-produto" method="post" enctype="multipart/form-data">
                        <label class="form-label">Imagens do produto</label> <br> <br>

                        <div class="card" style="width: 100%;">
                            <img id="imagem-preview" alt="Imagem Preview">
                        </div> <br>

                        <div id="images-input-container">
                            <button type="button" class="btn btn-danger" id="remove-campo-imagem">Remover Campo</button>
                            <button type="button" class="btn btn-success" id="add-campo-imagem">Adicionar Campo</button>
                            <br> <br>
                            <input type="file" name="images" accept="image/*" class="form-control last-image" id="entrada-imagem">
                            <br>
                        </div> <br> <br>

                        <div class="mb-3">
                            <label class="form-label">Nome do produto</label><br>
                            <input type="text" class="form-control" name="nome-produto" id="nome-produto" required placeholder="(Obrigatório)"> <br>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Descrição do produto</label><br>
                            <textarea class="form-control" name="descricao-produto" id="descricao-produto" placeholder="(Obrigatório)" rows="3"
                                required></textarea><br>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Quantidade do produto</label><br>
                            <input class="form-control" type="number" name="qtd-produto" id="qtd-produto"
                                placeholder="Ex: 23 (Obrigatório)" required><br>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Valor do produto</label><br>
                            <input class="form-control" type="number" step="any" name="valor-produto" id="valor-produto"
                                placeholder="Ex: 2323.23 ou 2323,23 (Obrigatório)" required><br>
                        </div>

                        <button type="reset" class="btn btn-danger">Limpar</button>
                        <button type="submit" class="btn btn-success" id="criar-produto" name="criar-produto">Criar</button> <br>
                        <br>
                    </form>
                </div>
            </div>
          </div>
      </div>
    </section>
  `;
}


export async function initAdminProducts() {
  // Conta quantos campos de entrada de imagem no cadastro
  let contador = 1

  // Limite para a quantidade de entrada de imagem no cadastro
  const contador_limit = 5

  const table = document.querySelector('.admin-products tbody');

  // Seleciona a div de produtos
  const productList = document.getElementById('product-list');
  productList.innerHTML = "";
  // Seleciona o card de preview da imagem
  const previewImage = document.getElementById('imagem-preview');

  // Seleciona o container de imagens para criar os campos de imagens
  const container = document.getElementById('images-input-container');
  const btnAdd = document.getElementById('add-campo-imagem');
  const btnRemove = document.getElementById('remove-campo-imagem');

  // Seleciona o botao de criar produto
  const criarProduto = document.getElementById('criar-produto');


  if (!table) return;

  const request = await fetch('/api/product/get_all_products.php');

  const products = await request.json();

  // Lógica de criar as linhas com os produtos
  JSON.parse(products).forEach(product => {
    const novoProduto = document.createElement("tr");
    novoProduto.innerHTML =
      `<td>${product.id}</td>
        <td>${product.name}</td>
        <td>R$ ${product.price}</td>
        <td>
          <button class="btn-edit btn-edits" type="button" value="${product.id}">Editar</button>
          <button class="btn-delete" value="${product.id}">Excluir</button>`

    novoProduto.querySelector('.btn-delete').addEventListener('click', async function (e) {
      const decision = window.confirm("Tem certeza de que deseja deletar este produto?");
      e.preventDefault();

      if (decision === true) {
        const data = {
          'id': e.target.value
        };
        const request = await fetch('/api/admin/delete_product.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
        });

        const response = await request.json();

        if (response.success === true) {
          window.location.reload(); // atualiza a página
        } else {
          alert('Não foi possível deletar item.');
        }
      } else {
        window.location.reload();
      }
    })


    novoProduto.querySelector(".btn-edits").addEventListener("click", () => {
      const modalEl = document.getElementById(`modal-edit-product-${product.id}`);
      let modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    });

    productList.appendChild(novoProduto);

    let modal = createEditProductModal(product);
    document.body.appendChild(modal);
  })


  // Logica da janela de criar produto
  const form = document.getElementById('cadastrar-produto');

  criarProduto.addEventListener('click', async function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity(); // Mostra mensagens padrão do navegador
      return;
    }

    const name = document.getElementById('nome-produto').value;
    const description = document.getElementById('descricao-produto').value;
    const value = document.getElementById('valor-produto').value;
    const qtd = document.getElementById('qtd-produto').value;
    let imagens = document.querySelectorAll('#entrada-imagem');
    console.log(imagens);

    let formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', parseFloat(value));
    formData.append('qtd', parseInt(qtd));

    imagens.forEach((input) => {
      if (input.files.length > 0) {
        for (let i = 0; i < input.files.length; i++) {
          formData.append('images[]', input.files[i]);
        }
      }
    });

    try {
      const request = await fetch('/api/admin/create_product.php', {
        method: 'POST',
        body: formData,
      });

      if (!request.ok) throw alert('Falha ao enviar os dados');

      const response = await request.json();

      if (response.success == true) {
        alert('Produto cadastrado!');
        window.location.reload();
      } else {
        alert('Problema na requisição.');
      }
    } catch (erro) {
      console.log(`Falha inesperada: ${erro}`)
    }
  })

const preview_image = document.getElementById('imagem-preview');
preview_image.style.display = 'none'; // esconde por padrão
preview_image.style.width = '300px';   // define largura fixa
preview_image.style.height = '200px';  // define altura fixa
preview_image.style.objectFit = 'contain'; // mantém proporção da imagem

// Função para lidar com o preview de qualquer input de imagem
function handlePreview(input) {
  input.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview_image.src = e.target.result;
        preview_image.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      preview_image.style.display = 'none';
    }
  });
}

// Aplica a função a todos os inputs existentes
document.querySelectorAll('#entrada-imagem').forEach(handlePreview);

// Ao criar novos campos, chama handlePreview no novo input
btnAdd.addEventListener('click', function () {
  if (contador < contador_limit) {
    contador++;
    const novoCampo = document.createElement('div');
    novoCampo.classList.add('mb-3');
    novoCampo.innerHTML = `
      <label class="form-label">Imagem-plus</label>
      <input type="file" name="images" accept="image/*" class="form-control" id="entrada-imagem">
    `;
    const novoInput = novoCampo.querySelector('#entrada-imagem');
    handlePreview(novoInput);
    container.appendChild(novoCampo);
  } else {
    alert('O limite foi alcançado!');
  }
});

// Remove campos de imagem
btnRemove.addEventListener('click', function () {
  if (container.children.length > 6) { // mantém pelo menos 6 campos
    container.removeChild(container.lastElementChild);
    preview_image.style.display = 'none';
    contador--;
  } else {
    alert('Não é possível remover o último campo!');
  }
});
}

function createEditProductModal(product) {

  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = `
      <div class="modal fade" id="modal-edit-product-${product.id}" data-bs-backdrop="static" data-bs-keyboard="false"
        tabindex="-1" aria-labelledby="product-modal-label-${product.id}" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">

                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="product-modal-label-${product.id}">
                        ${product.name}
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <form id="editar-produto" method="post" enctype="multipart/form-data">
                        <label class="form-label">Imagens atuais do produto</label> <br> <br>
                        ${(product.images != null) ? (product.images || []).map((img, i) => `
                            <img src="http://api.singlotown.com.br/images_products/${product.name}/${img}"
                                class="d-block w-100" alt="${product.name} - Imagem ${i + 1}"
                                style="object-fit: contain; max-height: 400px;"> <br>
                            <div class="mb-3">
                                <div class="form-check" id="${product.name}-${img}">
                                    <input class="form-check-input" type="checkbox" value="${img}" id="checkbox-remover-imagem">
                                    <label class="form-check-label">É para remover?</label><br> <br>
                                </div>
                            </div>
                        `).join('') : ''}
                        <br>
                        <div class="card" style="width: 100%;">
                            <img id="imagem-preview" alt="Imagem Preview">
                        </div> <br>

                        <div id="images-input-container">
                            <button type="button" class="btn btn-danger" id="remove-campo-imagem">Remover Campo</button>
                            <button type="button" class="btn btn-success" id="add-campo-imagem">Adicionar Campo</button>
                            <br> <br>
                            <input type="file" name="images" accept="image/*" class="form-control last-image"
                                id="entrada-imagem">
                            <br>
                        </div> <br> <br>

                        <div class="mb-3">
                            <label class="form-label">Nome do produto</label><br>
                            <input type="text" class="form-control" name="nome-produto" id="nome-produto"
                                value="${product.name}" readonly> <br>
                            <input class="form-check-input" type="checkbox" id="checkbox-editar-nome">
                            <label class="form-check-label">Quer editar?</label><br> <br>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Descrição do produto</label><br>
                            <textarea class="form-control" name="descricao-produto" id="descricao-produto"
                                rows="3" readonly>${product.description}</textarea><br>
                            <input class="form-check-input" type="checkbox" id="checkbox-editar-descricao">
                            <label class="form-check-label">Quer editar?</label><br> <br>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Quantidade do produto</label><br>
                            <input class="form-control" type="number" name="qtd-produto" id="qtd-produto"
                                value="${product.qtd}" readonly><br>
                            <input class="form-check-input" type="checkbox" id="checkbox-editar-qtd">
                            <label class="form-check-label">Quer editar?</label><br> <br>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Valor do produto</label><br>
                            <input class="form-control" type="number" step="any" name="valor-produto" id="valor-produto"
                                value="${product.price}" readonly><br>
                            <input class="form-check-input" type="checkbox" id="checkbox-editar-valor-produto">
                            <label class="form-check-label">Quer editar?</label><br> <br>
                        </div>

                        <button type="reset" class="btn btn-danger">Limpar</button>
                        <button type="submit" class="btn btn-success" id="editar-produto"
                            name="editar-produto">Concluir</button> <br>
                        <br>
                    </form>
                </div>
            </div>
        </div>
    </div>
  `;

  // Conta quantos campos de entrada de imagem no cadastro
  let countFieldsToImages = 1;
  
  // Limite para a quantidade de entrada de imagem no cadastro
  let qtd_images_exists = (product.images != null) ? (product.images).length : 0;
  let limitImages = 6 - qtd_images_exists;

  // Lista para reunir as imagens para serem removidas
  let urlImagesForRemove = [];

  // Selecionar os campos que estão com a flag de remover ATIVA
  const allCheckboxToRemoveImage = modalContainer.querySelectorAll('#checkbox-remover-imagem')

  // Percorre os campos selecionados em busca das flags ativas ou inativas
  allCheckboxToRemoveImage.forEach(function (checkbox) {

    // Para cada checkbox aguarda alteração
    checkbox.addEventListener('change', function () {

      // Se ativar a checkbox a url é capturada.
      if (checkbox.checked) {
        limitImages++;
        urlImagesForRemove.push(checkbox.value);
        // Alerta o usuário se houver excedido o limite de imagens
        if (countFieldsToImages >= limitImages) {
          alert(`Atenção! Limite de imagens excedido em ${countFieldsToImages - limitImages}`);
        }

      } else { // Se inativar a checkbox a url é removida da lista
        limitImages--;
        urlImagesForRemove = urlImagesForRemove.filter(value => value != checkbox.value);
        // Alerta o usuário se houver excedido o limite de imagens
        if (countFieldsToImages >= limitImages) {
          alert(`Atenção! Limite de imagens excedido em ${countFieldsToImages - limitImages}`);
        }
      }
    })
  })

  // Seleciona todos os campos de entrada de imagens do DOOM
  let fieldsToImages = modalContainer.querySelectorAll('#entrada-imagem');

  // Seleciona o container e botões de gerenciamento dos campos de imagens
  const container = modalContainer.querySelector('#images-input-container');
  const btnAddFieldImage = modalContainer.querySelector('#add-campo-imagem');
  const btnRemoveFieldImage = modalContainer.querySelector('#remove-campo-imagem');

  // Seleciona o campo de preview da última imagem inserida
  const fieldToPreviewImage = modalContainer.querySelector('#imagem-preview');

  // Seleciono o último campo de imagem criado e inserido imagem
  let finalFieldImage = fieldsToImages[fieldsToImages.length - 1];

  // Preview da imagem selecionada
  finalFieldImage.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        fieldToPreviewImage.src = e.target.result;
        fieldToPreviewImage.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      fieldToPreviewImage.style.display = 'none';
    }
  });

  // Adiciona mais campos para imagens no DOM se o limite de imagens não houver sido alcançado
  btnAddFieldImage.addEventListener('click', function () {
    if (countFieldsToImages < limitImages) {
      countFieldsToImages++
      const novoCampo = document.createElement('div')
      novoCampo.classList.add('mb-3')
      novoCampo.innerHTML = `
                <label class="form-label">Imagem-plus</label>
                <input type="file" name="images" accept="image/*" class="form-control" id="entrada-imagem">
                `
      finalFieldImage = novoCampo.querySelector('#entrada-imagem')
      finalFieldImage.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            fieldToPreviewImage.src = e.target.result;
            fieldToPreviewImage.style.display = 'block';
          };
          reader.readAsDataURL(file);
        } else {
          fieldToPreviewImage.style.display = 'none';
        }
      });
      container.appendChild(novoCampo);
    } else {
      alert('O limite foi alcançado!');
    }
  })

  // Remove campos para imagens no DOM se o limite mínimo não tiver sido alcançado
  btnRemoveFieldImage.addEventListener('click', function () {
    if (container.children.length > 6) {
      container.removeChild(container.lastElementChild);
      fieldToPreviewImage.style.display = 'none';
      countFieldsToImages--;
      // Alerta o usuário se houver excedido o limite de imagens
      if (countFieldsToImages >= limitImages) {
        alert(`Atenção! Limite de imagens excedido em ${countFieldsToImages - limitImages}`);
      }
    } else {
      alert('Limite de remoção alcançado');
    }
  })

  // Caso o usuário não queira alterar algum dado do produto

  // Aqui capturo os campos de texto do DOM
  let name = modalContainer.querySelector('#nome-produto');
  let description = modalContainer.querySelector('#descricao-produto');
  let qtd = modalContainer.querySelector('#qtd-produto');
  let value = modalContainer.querySelector('#valor-produto');

  // Aqui capturo as checkbox dos campos de texto do DOM
  const checkboxEditarNome = modalContainer.querySelector('#checkbox-editar-nome');
  const checkboxEditarDescricao = modalContainer.querySelector('#checkbox-editar-descricao');
  const checkboxEditarQtd = modalContainer.querySelector('#checkbox-editar-qtd');
  const checkboxEditarValorProduto = modalContainer.querySelector('#checkbox-editar-valor-produto');

  checkboxEditarNome.addEventListener('change', function () {
    if (checkboxEditarNome.checked) {
      // readOnly = false significa que o campo pode ser alterado
      name.readOnly = false
    } else {
      // Caso o usuário se arrependeu de alterar, então o campo é resetado
      name.value = product.name
      // readOnly = true significa que o campo não pode ser alterado
      name.readOnly = true
    }
  });

  checkboxEditarDescricao.addEventListener('change', function () {
    if (checkboxEditarDescricao.checked) {
      description.readOnly = false
    } else {
      description.value = product.description
      description.readOnly = true
    }
  });

  checkboxEditarQtd.addEventListener('change', function () {
    if (checkboxEditarQtd.checked) {
      qtd.readOnly = false
    } else {
      qtd.value = product.qtd
      qtd.readOnly = true
    }
  });

  checkboxEditarValorProduto.addEventListener('change', function () {
    if (checkboxEditarValorProduto.checked) {
      value.readOnly = false
    } else {
      value.value = product.price
      value.readOnly = true
    }
  });

  // Aqui inicia a montagem e envio para o php os dados do DOOM

  // Seleciona o botão da tela de edição de produtos que inicia a edição do produto
  let btnEditProduct = modalContainer.querySelector('#editar-produto');

  btnEditProduct.addEventListener('submit', async function (e) {
    // Evita que a tela atualize
    e.preventDefault();

    // Captura todos os campos do DOM, necesários para edição
    let name = btnEditProduct.querySelector('#nome-produto').value;
    let description = btnEditProduct.querySelector('#descricao-produto').value;
    let value = btnEditProduct.querySelector('#valor-produto').value;
    let qtd = btnEditProduct.querySelector('#qtd-produto').value;
    let images = btnEditProduct.querySelectorAll('#entrada-imagem');
    let delImages = urlImagesForRemove

    // Executa a função de envio de dados para o php tratar e enviar para a API
    let response = await requestEditProduct(product.id, name, description, value, qtd, images, delImages)

    // Trata a resposta da requisição
    if (response.response == true) {
      alert('Produto editado!');
      window.location.reload();
    } else {
      alert(`Erro inesperado: ${response.response}`)
    }
  })

  return modalContainer.firstElementChild;
};


async function requestEditProduct(id, nam, descriptio, valu, qt, image, urlsToDeleteImages) {

  let name = nam ?? null;
  let description = descriptio ?? null;
  let value = valu ?? null;
  let qtd = qt ?? null;
  let images = image ?? null;
  let delImages = urlsToDeleteImages ?? null;

  let formData = new FormData();

  formData.append('id', id)
  formData.append('name', name);
  formData.append('description', description);
  formData.append('price', parseFloat(value));
  formData.append('qtd', parseInt(qtd));
  formData.append('del_images[]', delImages)

  images.forEach((input) => {
    if (input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        formData.append('images[]', input.files[i]);
      }
    }
  });

  try {
    const request = await fetch('/api/admin/edit_product.php', {
      method: 'POST',
      body: formData,
    });

    if (!request.ok) return { 'response': 'Falha ao enviar os dados' };

    const response = await request.json();

    if (response.success == true) {
      return { 'response': true };
    } else {
      return { 'response': 'Falha na requisição' };
    }
  } catch (erro) {
    return { 'response': erro }
  }
}

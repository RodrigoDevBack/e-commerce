// produtosAdmin.js
// // Lê produtos do localStorage ou cria lista inicial
// const products = JSON.parse(localStorage.getItem('products')) || [
//   { id: 1, name: 'Produto A', price: 19.9 },
//   { id: 2, name: 'Produto B', price: 49.9 }
// ];
// let productsHTML = products.map(p => `
//   <tr>
//     <td>${p.id}</td>
//     <td>${p.name}</td>
//     <td>R$ ${p.price.toFixed(2)}</td>
//     <td>
//       <button class="btn-edit" data-id="${p.id}">Editar</button>
//       <button class="btn-delete" data-id="${p.id}">Excluir</button>
//     </td>
//   </tr>
// `).join('');
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
                            <input class="form-control" type="number" name="valor-produto" id="valor-produto"
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
      const decision = window.confirm();
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

      if (!request.ok) throw new alert('Falha ao enviar os dados');

      const response = await request.json();

      if (response.success == true) {
        alert('Produto cadastrado!');
        window.location.reload();
      } else {
        alert('Problema na requisição.');
      }
    } catch (erro) {
      console.log(`Falha: ${erro}`)
    }
  })

  const preview_image = document.getElementById('imagem-preview');
  let images = document.querySelectorAll("#entrada-imagem");
  let image = images[images.length - 1]
  image.addEventListener('change', function (event) {
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

  btnAdd.addEventListener('click', function () {
    if (contador <= contador_limit) {
      contador++
      const novoCampo = document.createElement('div')
      novoCampo.classList.add('mb-3')
      novoCampo.innerHTML = `
                <label class="form-label">Imagem-plus</label>
                <input type="file" name="images" accept="image/*" class="form-control" id="entrada-imagem">
                `
      image = novoCampo.querySelector('#entrada-imagem')
      image.addEventListener('change', function (event) {
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
      container.appendChild(novoCampo)
    } else {
      alert('O limite foi alcançado!')
    }
  })

  btnRemove.addEventListener('click', function () {
    if (container.children.length > 6) {
      container.removeChild(container.lastElementChild)
      previewImage.style.display = 'none'
      contador--
    } else {
      alert('O limite foi alcançado!')
    }
  })
}
// O código abaixo é um exemplo de como a lista de produtos pode ser renderizada
// e como o filtro pode ser implementado. Ele não faz parte do arquivo adminProducts.js


function createEditProductModal(product) {
  // Conta quantos campos de entrada de imagem no cadastro
  let contador = 1

  // Limite para a quantidade de entrada de imagem no cadastro
  let contador_limit = 6 - (product.images).length;

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

                        ${(product.images || []).map((img, i) => `
                            <img src="http://localhost:5000/images_products/${product.name}/${img}"
                                class="d-block w-100" alt="${product.name} - Imagem ${i + 1}"
                                style="object-fit: contain; max-height: 400px;"> <br>
                            <div class="mb-3">
                                <div class="form-check" id="${product.name}-${img}">
                                    <input class="form-check-input" type="checkbox" value="${img}" id="checkbox-remover-imagem">
                                    <label class="form-check-label">É para remover?</label><br> <br>
                                </div>
                            </div>
                        `).join('')}
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
                            <input class="form-control" type="number" name="valor-produto" id="valor-produto"
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
  
  let urlRemoveImages = []
  const removeImages = modalContainer.querySelectorAll('#checkbox-remover-imagem')
  removeImages.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      if(checkbox.checked) {
        contador_limit++;
        urlRemoveImages.push(checkbox.value);
        if (contador >= contador_limit) {
          alert(`Atenção! Limite de imagens excedido em ${contador - contador_limit}`);
        }
      } else {
        contador_limit--;
        urlRemoveImages = urlRemoveImages.filter(value => value != checkbox.value);
        if (contador >= contador_limit) {
          alert(`Atenção! Limite de imagens excedido em ${contador - contador_limit}`);
        }
      }
    })
  })

  let images = modalContainer.querySelectorAll('#entrada-imagem');
  // Seleciona o container de imagens para criar os campos de imagens
  const container = modalContainer.querySelector('#images-input-container');
  const btnAdd = modalContainer.querySelector('#add-campo-imagem');
  const btnRemove = modalContainer.querySelector('#remove-campo-imagem');
  // Seleciona o card de preview da imagem
  const preview_image = modalContainer.querySelector('#imagem-preview');
  let image = images[images.length - 1];
  // Preview da imagem selecionada
  image.addEventListener('change', function (event) {
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
  // Cria mais algum campo de imagem
  btnAdd.addEventListener('click', function () {
    if (contador < contador_limit) {
      contador++
      const novoCampo = document.createElement('div')
      novoCampo.classList.add('mb-3')
      novoCampo.innerHTML = `
                <label class="form-label">Imagem-plus</label>
                <input type="file" name="images" accept="image/*" class="form-control" id="entrada-imagem">
                `
      image = novoCampo.querySelector('#entrada-imagem')
      image.addEventListener('change', function (event) {
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
      container.appendChild(novoCampo);
    } else {
      alert('O limite foi alcançado!');
    }
  })

  btnRemove.addEventListener('click', function () {
    if (container.children.length > 6) {
      container.removeChild(container.lastElementChild);
      preview_image.style.display = 'none';
      contador--;
      if (contador >= contador_limit) {
          alert(`Atenção! Limite de imagens excedido em ${contador - contador_limit}`);
      }
    } else {
      alert('O limite foi alcançado!');
    }
  })

  var name = modalContainer.querySelector('#nome-produto');
  var description = modalContainer.querySelector('#descricao-produto');
  var qtd = modalContainer.querySelector('#qtd-produto');
  var value = modalContainer.querySelector('#valor-produto');

  const editarNome = modalContainer.querySelector('#checkbox-editar-nome');
  editarNome.addEventListener('change', function () {
    if (editarNome.checked){
      name.readOnly = false
    } else {
      name.value = product.name
      name.readOnly = true
    }
  });
  const editarDescricao = modalContainer.querySelector('#checkbox-editar-descricao');
  editarDescricao.addEventListener('change', function () {
    if (editarDescricao.checked){
      description.readOnly = false
    } else {
      description.value = product.description
      description.readOnly = true
    }
  });
  const editarQtd = modalContainer.querySelector('#checkbox-editar-qtd');
  editarQtd.addEventListener('change', function () {
    if (editarQtd.checked){
      qtd.readOnly = false
    } else {
      qtd.value = product.qtd
      qtd.readOnly = true
    }
  });
  const editarValorProduto = modalContainer.querySelector('#checkbox-editar-valor-produto');
  editarValorProduto.addEventListener('change', function () {
    if (editarValorProduto.checked){
      value.readOnly = false
    } else {
      value.value = product.price
      value.readOnly = true
    }
  });

  // // Seleciona a div de produtos
  // const productList = document.getElementById('product-list');
  var editarProduto = modalContainer.querySelector('#editar-produto');
  editarProduto.addEventListener('submit', async function (e) {
    e.preventDefault();
    var name = editarProduto.querySelector('#nome-produto').value ?? null;
    var description = editarProduto.querySelector('#descricao-produto').value ?? null;
    var value = editarProduto.querySelector('#valor-produto').value ?? null;
    var qtd = editarProduto.querySelector('#qtd-produto').value ?? null;
    let images = editarProduto.querySelectorAll('#entrada-imagem');
    var delImages = urlRemoveImages
    // console.log(imagens);

    let formData = new FormData();

    formData.append('id', product.id)
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

      if (!request.ok) throw new alert('Falha ao enviar os dados');

      const response = await request.json();

      if (response.success == true) {
        alert('Produto editado!');
        window.location.reload();
      } else {
        alert('Problema na requisição.');
      }
    } catch (erro) {
      console.log(`Falha: ${erro}`)
    }
  })

  return modalContainer.firstElementChild;
};





// <div class="modal fade" id="modelProductEdit" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
//   aria-labelledby="staticBackdropLabel" aria-hidden="true">
//   <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
//       <div class="modal-content">

//           <div class="modal-header">
//               <h1 class="modal-title fs-5" id="staticBackdropLabel">Editar Produto</h1>
//               <button type="button" class="btn btn-closer" data-bs-dismiss="modal" aria-label="Close"></button>
//           </div>

//           <div class="modal-body">
//               <form id="editar-produto" method="post" enctype="multipart/form-data">
//                   <label class="form-label">Imagens do produto</label> <br> <br>

//                   <div class="card" style="width: 100%;">
//                       <img id="imagem-preview" alt="Imagem Preview">
//                   </div> <br>

//                   <div id="images-input-container">
//                       <button type="button" class="btn btn-danger" id="remove-campo-imagem">Remover Campo</button>
//                       <button type="button" class="btn btn-success" id="add-campo-imagem">Adicionar Campo</button>
//                       <br> <br>
//                       <input type="file" name="images" accept="image/*" class="form-control" id="entrada-imagem">
//                       <br>
//                   </div> <br> <br>

//                   <div class="mb-3">
//                       <label class="form-label">Nome do produto</label><br>
//                       <input type="text" class="form-control" name="nome-produto" id="nome-produto" placeholder="(Obrigatório)"
//                           required> <br>
//                   </div>

//                   <div class="mb-3">
//                       <label class="form-label">Descrição do produto</label><br>
//                       <textarea class="form-control" name="descricao-produto" id="descricao-produto" placeholder="(Obrigatório)" rows="3"
//                           required></textarea><br>
//                   </div>

//                   <div class="mb-3">
//                       <label class="form-label">Quantidade do produto</label><br>
//                       <input class="form-control" type="number" name="qtd-produto" id="qtd-produto"
//                           placeholder="Ex: 23 (Obrigatório)" required><br>
//                   </div>

//                   <div class="mb-3">
//                       <label class="form-label">Valor do produto</label><br>
//                       <input class="form-control" type="number" name="valor-produto" id="valor-produto"
//                           placeholder="Ex: 2323.23 ou 2323,23 (Obrigatório)" required><br>
//                   </div>

//                   <button type="reset" class="btn btn-danger">Limpar</button>
//                   <button type="submit" class="btn btn-success" id="criar-produto" name="criar-produto">Criar</button> <br>
//                   <br>
//               </form>
//           </div>
//       </div>
//     </div>
// </div>
//     </td>





// Botao de abrir a janela de criar produto

{/* <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasProfile"
  aria-labelledby="offcanvasTitleProfile">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasTitleProfile">Perfil</h5>
    <button type="button" class="btn-closer" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <hr>
      <a data-bs-toggle="modal" data-bs-target="#modelProductRegister" href="#">Criar Produto</a>
  </div>
</div> */}

//Janela de criar produto:
{/* <div class="modal fade" id="modelProductRegister" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                    <button type="button" class="btn-closer" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="cadastrar-produto" enctype="multipart/form-data">
                        <label class="form-label">Imagens do produto</label> <br> <br>

                        <div class="card" style="width: 100%;">
                            <img id="imagem-preview" alt="Imagem Preview">
                        </div> <br>

                        <div id="images-input-container">
                            <button type="button" class="btn btn-danger" id="remove-campo-imagem">Remover Campo</button>
                            <button type="button" class="btn btn-success" id="add-campo-imagem">Adicionar Campo</button>
                            <br> <br>
                            <input type="file" name="image" accept="image/*" class="form-control" id="entrada-imagem">
                            <br>
                        </div> <br> <br>

                        <div class="mb-3">
                            <label class="form-label">Nome do produto</label><br>
                            <input type="text" class="form-control" name="nome-produto" placeholder="(Obrigatório)"
                                required> <br>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Descrição do produto</label><br>
                            <textarea class="form-control" name="descricao-produto" placeholder="(Obrigatório)" rows="3"
                                required></textarea><br>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Valor do produto</label><br>
                            <input class="form-control" type="number" name="valor-produto"
                                placeholder="Ex: 2323.23 ou 2323,23 (Obrigatório)" required><br>
                        </div>

                        <div class="mb-3">
                            <div class="form-check" id="checkbox-container">
                                <input class="form-check-input" type="checkbox" id="checkbox-Register-Promotion">
                                <label class="form-check-label">Em promoção?</label><br> <br>
                            </div>
                        </div>

                        <button type="reset" class="btn btn-danger">Limpar</button>
                        <button type="submit" class="btn btn-success" name="criar-produto">Criar</button> <br>
                        <br>
                    </form>
                </div>
            </div>
        </div>
    </div> */}

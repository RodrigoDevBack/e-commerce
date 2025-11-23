/**
 * Renderiza a seção de produtos da SPA.
 * @returns {string} HTML da página de produtos.
 */
export default function produtosPage() {
  return (`
    <section class="products-section">
      <div class="container">
        <h2>Todos os Produtos</h2>

        <div class="product-filter">
          <label for="filter">Filtrar por preço:</label>
          <select id="filter">
            <option value="all">Todos</option>
            <option value="under50">Até R$ 50</option>
            <option value="50to80">R$ 50 - R$ 80</option>
            <option value="above80">Acima de R$ 80</option>
          </select>
        </div>

        <ul class="product-list" id="product-list"></ul>
      </div>
    </section>
  `);
}

/**
 * Inicializa a lista de produtos, realiza fetch da API, cria cards e modais.
 */
export async function initProductsList() {
  const productList = document.getElementById("product-list");
  if (!productList) return;
  productList.innerHTML = "";

  const request = await fetch("/api/product/get_all_products.php");
  const products = await request.json();

  if (products.success === false) {
    alert("Sem produtos");
    return;
  }

  let data = JSON.parse(products);

  data.forEach(product => {
    let productCard = createProductCard(product);
    productList.appendChild(productCard);

    /** 
    * Cria o modal para cada produto e adiciona ao body 
    */
    let modal = createProductModal(product);
    document.body.appendChild(modal);
  });
  /**
* Adiciona listener para filtrar produtos por preço
*/
  const filter = document.getElementById('filter');
  filter.addEventListener('change', function () {
    if (filter.value == 'all') {
      productList.innerHTML = '';
      data.forEach(product => {
        let productCard = createProductCard(product);
        productList.appendChild(productCard);
      })
    } else if (filter.value == 'under50') {
      productList.innerHTML = '';
      data.forEach(product => {
        if (product.price <= 50) {
          let productCard = createProductCard(product);
          productList.appendChild(productCard);
        }
      })
    } else if (filter.value == '50to80') {
      productList.innerHTML = '';
      data.forEach(product => {
        if (product.price >= 50 && product.price <= 80) {
          let productCard = createProductCard(product);
          productList.appendChild(productCard);
        }
      })
    } else if (filter.value == 'above80') {
      productList.innerHTML = '';
      data.forEach(product => {
        if (product.price >= 80) {
          let productCard = createProductCard(product);
          productList.appendChild(productCard);
        }
      })
    }
  })
}

// Cria o card de produto

function createProductCard(product) {
  const li = document.createElement("li");
  li.classList.add("product-item");
// R: Tela de todos os produtos
 li.innerHTML = `
  ${(product.images != null) ? 
  `<div class="thumb">
    <img 
      src="http://localhost:5000/images_products/${product.name}/${product.images[0]}" 
      width="100%" height="100%" 
      alt="${product.name}" 
      style="object-fit: contain; border-radius: 8px;">
  </div>` : 
  `<div class="thumb">
    <img 
      src="https://img.icons8.com/color/96/no-image.png"
      width="100%" height="100%"
      alt="${product.name} - Sem imagens"
      style="object-fit: contain; border-radius: 8px;">
  </div>`}
  
  <div class="product-item-content">
    <h3>${product.name}</h3>
    <p>Disponível: ${product.qtd}</p>
    <p class="product-price">R$ ${product.price}</p>
  </div>
  <button type="button" 
    class="btn btn-primary btn-details" 
    data-product-id="${product.id}">
    Ver detalhes
  </button>
  <button class="btn add-to-cart" value="${product.id}">Adicionar ao carrinho</button>
`;


  /**
   * Mostra o modal do produto ao clicar no botão de detalhes
   */
  li.querySelector(".btn-details").addEventListener("click", () => {
    const modalEl = document.getElementById(`modal-product-${product.id}`);
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  });

  li.querySelector(".add-to-cart").addEventListener("click", async () => {
    const success = await add_product_cart(product.id, 1);
    if (success) {
      alert('Produto adicionado ao carrinho!');
    } else {
      alert('Falha ao adicionar produto ao carrinho.');
    }
  });
  return li;
}

/**
 * Cria o modal com carousel de imagens e informações detalhadas do produto.
 * @param {Object} product - Objeto do produto
 * @returns {HTMLElement} Elemento do modal do produto
 */
function createProductModal(product) {
  const modalContainer = document.createElement("div");
  // R: Modal de detalhes do produto
  modalContainer.innerHTML = `
    <div class="modal fade" id="modal-product-${product.id}" data-bs-backdrop="static" data-bs-keyboard="false"
         tabindex="-1" aria-labelledby="product-modal-label-${product.id}" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">

          <div class="modal-header">
            <h1 class="modal-title fs-5" id="product-modal-label-${product.id}">
              ${product.name}
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
          </div>

          <div class="modal-body product-card">
            <div class="card p-3 shadow-sm">
              <div id="carousel-${product.id}" class="carousel slide">
                <div class="carousel-inner">
                  ${(product.images != null) ? (product.images || []).map((img, i) => `
                    <div class="carousel-item ${i === 0 ? 'active' : ''}">
                      <img 
                        src="http://localhost:5000/images_products/${product.name}/${img}"
                        class="d-block w-100"
                        alt="${product.name} - Imagem ${i + 1}"
                        style="object-fit: contain; max-height: 400px;">
                    </div>
                  `).join('') : 
                    `<div class="carousel-item}">
                      <img 
                        src="https://img.icons8.com/color/96/no-image.png"
                        class="d-block w-100"
                        alt="${product.name} - Sem imagens"
                        style="object-fit: contain; width="100%"; height="100%";">
                    </div>`}
                
                  </div>

                ${(product.images != null) ? (product.images.length || 0) > 1 ? `
                  <button class="carousel-control-prev" style="filter: invert(1) brightness(2);" type="button" data-bs-target="#carousel-${product.id}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                  </button>
                  <button class="carousel-control-next" style="filter: invert(1) brightness(2);" type="button" data-bs-target="#carousel-${product.id}" data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span>
                  </button>
                ` : '' : ''}
              </div>

              <div class="mt-3">
                <h5>${product.name}</h5>
                <p>Quantidade disponível: ${product.qtd}</p>
                <p class="fw-bold product-price">R$ ${product.price}</p>
                <h6>Descrição:</h6>
                <p>${product.description}</p>
              </div>

              <div class="text-center mt-3">
                <button class="btn btn-success card-add-to-cart" value="${product.id}" id="add-cart-${product.id}">
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  modalContainer.querySelector(`#add-cart-${product.id}`).addEventListener('click', async () => {
    const success = await add_product_cart(product.id, 1);
    if (success) {
      alert('Produto adicionado ao carrinho!');
    }
    else {
      alert('Falha ao adicionar produto ao carrinho.');
    }
  });

  return modalContainer.firstElementChild;
}


async function add_product_cart(id, qtd) {
  let request = await fetch('/api/cart/add_product_cart.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, qtd })
  });

  let response = await request.json();

  if (response.success == true) {
    return true;
  }
  return false;
}

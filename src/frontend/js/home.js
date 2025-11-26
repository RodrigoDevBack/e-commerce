/**
 * Inicializa a Home carregando produtos em destaque no carrossel.
 *
 * Fluxo:
 * - Busca produtos destacados no backend
 * - Converte resposta em JSON
 * - Cria elementos <li> para cada produto e insere no carrossel
 *
 * Observação:
 * - Executa apenas quando a Home está no DOM (SPA)
 * - Depende da API: /api/product/get_featured_products.php
 *
 * Melhorias futuras:
 * - Tratamento de erro com try/catch
 * - Placeholder loading / skeleton UI
 * - Mensagem visual no lugar de alert()
 */

export default function homePage() {
  return (
    `
    <section class="hero-wrapper">
  <div class="hero-swiper swiper">
    <div class="swiper-wrapper">

      <div class="swiper-slide hero-slide" data-bg="./img/background_loja.jpg">
        <h1>Seja bem-vindo!</h1>
        <p>Navegue pelos nossos produtos...</p>
      </div>

      <div class="swiper-slide hero-slide" data-bg="./img/slide2.jpg">
        <h1>Promoções Exclusivas</h1>
        <p>Ofertas especiais da semana.</p>
      </div>

      <div class="swiper-slide hero-slide">
        <h1>Novidades</h1>
        <p>Confira os lançamentos.</p>
      </div>

    </div>

    <div class="swiper-pagination"></div>
  </div>
</section>

  ` +
    `

    <section class="carousel-section">
      <div class="container">
        <h2>Produtos em destaque</h2>

        <!-- Carrossel apenas com rolagem inferior, sem botões laterais -->
        <div class="carousel" aria-roledescription="carousel" aria-label="Produtos em destaque">
          <div class="carousel-track-container" style="overflow-x:auto; white-space: nowrap; scroll-behavior: smooth;">
            <!-- Lista onde os produtos serão injetados dinamicamente -->
            <ul class="carousel-track" id="product-list" style="display: flex; gap: 16px;"></ul>
          </div>
        </div>
      </div>
    </section>
  `
  );
}

/**
 * Inicializa o carrossel da Home com produtos em destaque.
 *
 * - Busca produtos no backend
 * - Cria e insere slides no carrossel
 *
 * Observações:
 * - Executa apenas se o elemento do carrossel existir
 * - Depende da API: /api/product/get_featured_products.php
 *
 * Melhorias futuras:
 * - Tratamento de erro e loading
 *
 * @async
 * @returns {Promise<void>} Não retorna valor
 */
export async function initHomePage() {
  const productList = document.getElementById(`product-list`);
  // Se o elemento não existe, significa que não estamos na Home
  if (!productList) return;

  let response = await fetch(`/api/product/get_featured_products.php`);
  let products = await response.json();

  // API sinaliza falha
  if (products.success === false) {
    alert("Sem produtos");
    return;
  }

  // Backend aparentemente retorna JSON dentro de JSON
  // (pode ser ajustado depois para uma resposta já parseada)
  let data = JSON.parse(products);

  // Para cada produto, cria um card dentro do carrossel
  data.forEach((product) => {
    let li = document.createElement("li");
    li.classList.add("carousel-slide");
    // R: Slide do carrossel na Home
    li.innerHTML = `
      <div class="product-card">
      
        ${(product.images != null) ? `
        <div class="thumb">
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
            alt="${product.name} sem imagens" 
            style="object-fit: contain; border-radius: 8px;">
        </div>`}

        <h3>${product.name}</h3>
        <p>Disponivel: ${product.qtd}</p>
        <p class="product-price">R$ ${product.price}</p>
        <button class="btn add-to-cart" value="${product.id}">Adicionar ao carrinho</button>
      </div>
    `;
    li.querySelector(".btn.add-to-cart").addEventListener("click", async () => {
      const success = await add_product_cart(product.id, 1);
      if (success) {
        alert('Produto adicionado ao carrinho!');
      } else {
        alert('Falha ao adicionar produto ao carrinho.');
      }
    });
    productList.appendChild(li);
  });
  document.querySelectorAll(".hero-slide").forEach((slide) => {
    slide.style.backgroundImage = "url('https://picsum.photos/800/400')";
  });

  // inicia o swiper
  new Swiper(".hero-swiper", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
  });
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


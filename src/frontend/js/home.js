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
  return `
    <section class="hero">
      <div class="container">
        <h1>Bem-vindo à Loja</h1>
        <p>Loja virtual minimalista — navegue pelos produtos e faça seu pedido.</p>
      </div>
    </section>

    <section class="carousel-section">
      <div class="container">
        <h2>Produtos em destaque</h2>

        <!-- Carrossel acessível com botões e faixa deslizante -->
        <div class="carousel" aria-roledescription="carousel" aria-label="Produtos em destaque">
          <button class="carousel-btn prev" aria-label="Anterior">&#10094;</button>

          <div class="carousel-track-container">
            <!-- Lista onde os produtos serão injetados dinamicamente -->
            <ul class="carousel-track" id="product-list"></ul>
          </div>

          <button class="carousel-btn next" aria-label="Próximo">&#10095;</button>
        </div>
      </div>
    </section>
  `;
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
  data.forEach(product => {
    let li = document.createElement("li");
    li.classList.add("carousel-slide");

    li.innerHTML = `
      <div class="product-card">
        <div class="thumb">
          <img 
            src="http://127.0.0.1:5000/images_products/${product.name}/${product.images[0]}" 
            width="100%" height="100%" 
            alt="${product.name}" 
            style="object-fit: contain; border-radius: 8px;">
        </div>
        <h3>${product.name}</h3>
        <p>Quantidade: ${product.qtd}</p>
        <p class="product-price">R$ ${product.price}</p>
        <button class="btn add-to-cart">Adicionar ao carrinho</button>
      </div>
    `;

    productList.appendChild(li);
  });
}
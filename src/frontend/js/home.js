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
        <div class="carousel" aria-roledescription="carousel" aria-label="Produtos em destaque">
          <button class="carousel-btn prev" aria-label="Anterior">&#10094;</button>
          <div class="carousel-track-container">
            <ul class="carousel-track">
              <li class="carousel-slide">
                <div class="product-card">
                  <div class="thumb">
                    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100%" height="100%" fill="#f0a500"/>
                      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="22">Produto A</text>
                    </svg>
                  </div>
                  <h3>Produto A</h3> 
                  <p class="product-price">R$ 49,90</p>
                  <button class="btn add-to-cart">Adicionar ao carrinho</button>
                </div>
              </li>
              <li class="carousel-slide">
                <div class="product-card">
                  <div class="thumb">
                    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100%" height="100%" fill="#0a7a3a"/>
                      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="22">Produto B</text>
                    </svg>
                  </div>
                  <h3>Produto B</h3>
                  <p class="product-price">R$ 79,90</p>
                  <button class="btn add-to-cart">Adicionar ao carrinho</button>
                </div>
              </li>
              <li class="carousel-slide">
                <div class="product-card">
                  <div class="thumb">
                    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100%" height="100%" fill="#007bff"/>
                      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="22">Produto C</text>
                    </svg>
                  </div>
                  <h3>Produto C</h3>
                  <p class="product-price">R$ 29,90</p>
                  <button class="btn add-to-cart">Adicionar ao carrinho</button>
                </div>
              </li>
              <li class="carousel-slide">
                <div class="product-card">
                  <div class="thumb">
                    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100%" height="100%" fill="#ff4c4c"/>
                      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="22">Produto D</text>
                    </svg>
                  </div>
                  <h3>Produto D</h3>
                  <p class="product-price">R$ 99,90</p>
                  <button class="btn add-to-cart">Adicionar ao carrinho</button>
                </div>
              </li>
            </ul>
          </div>

          <button class="carousel-btn next" aria-label="Próximo">&#10095;</button>
        </div>
      </div>
    </section>
  `;
}

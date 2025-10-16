export default function produtosPage() {
  return `
    <section class="products-section">
      <div class="container">
        <h2>Todos os Produtos</h2>

        <!-- filtro -->
        <div class="product-filter">
          <label for="filter">Filtrar por preço:</label>
          <select id="filter">
            <option value="all">Todos</option>
            <option value="under50">Até R$ 50</option>
            <option value="50to80">R$ 50 - R$ 80</option>
            <option value="above80">Acima de R$ 80</option>
          </select>
        </div>

        <!-- lista de produtos -->
        
        <ul class="product-list">
          <li class="product-item" data-price="49.9">
            <div class="thumb">
                <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#f0a500"/>
                  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="22">Produto A</text>
                </svg>
            </div>
            <h3>Produto A</h3>
            <p class="product-price">R$ 49,90</p>
            <button class="btn add-to-cart">Adicionar ao carrinho</button>
          </li>

          <li class="product-item" data-price="79.9">
            <div class="thumb">
                <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#8a3696ff"/>
                  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="22">Produto B</text>
                </svg>
            </div>
            <h3>Produto B</h3>
            <p class="product-price">R$ 79,90</p>
            <button class="btn add-to-cart">Adicionar ao carrinho</button>
          </li>

          <li class="product-item" data-price="29.9">
            <div class="thumb">
                <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#2c5b91ff"/>
                  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="22">Produto C</text>
                </svg>
            </div>
            <h3>Produto C</h3>
            <p class="product-price">R$ 29,90</p>
            <button class="btn add-to-cart">Adicionar ao carrinho</button>
          </li>

          <li class="product-item" data-price="99.9">
            <div class="thumb">
                <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#389247ff"/>
                  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="22">Produto D</text>
                </svg>
            </div>
            <h3>Produto D</h3>
            <p class="product-price">R$ 99,90</p>
            <button class="btn add-to-cart">Adicionar ao carrinho</button>
          </li>
        </ul>
      </div>
    </section>

    <script>
      const filterSelect = document.getElementById('filter');
      const products = document.querySelectorAll('.product-item');

      filterSelect.addEventListener('change', () => {
        const value = filterSelect.value;
        products.forEach(product => {
          const price = parseFloat(product.dataset.price);
          let show = false;

          if (value === 'all') show = true;
          if (value === 'under50' && price <= 50) show = true;
          if (value === '50to80' && price > 50 && price <= 80) show = true;
          if (value === 'above80' && price > 80) show = true;

          product.style.display = show ? 'block' : 'none';
        });
      });
    </script>
  `;
}
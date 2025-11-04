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
            <ul class="carousel-track" id="product-list">
            </ul>
          </div>

          <button class="carousel-btn next" aria-label="Próximo">&#10095;</button>
        </div>
      </div>
    </section>
  `;
}


export async function initHomePage() {

  const productList = document.getElementById(`product-list`)

  let response = await fetch(`/api/product/get_featured_products.php`);

  let products = await response.json();

  if (products.success === false) {
    alert("Sem produtos");
    return;
  }

  let data = JSON.parse(products);

  data.forEach(product => {
    let li = document.createElement("li");
    li.classList.add("carousel-slide");
    li.innerHTML =`
    <div class="product-card">
      <div class="thumb">
          <img 
            src="http://backend:5000/images_products/${product.name}/${product.images[0]}" 
            width="100%" height="100%" 
            alt="${product.name}" 
            style="object-fit: contain; border-radius: 8px;">
        </div>
        <h3>${product.name}</h3>
        <p>Quantidade: ${product.qtd}</p>
        <p class="product-price">R$ ${product.price}</p>
        <button class="btn add-to-cart">Adicionar ao carrinho</button>
      </div>
      `
    productList.appendChild(li)
  });
  
}

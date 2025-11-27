// cart.js
// Módulo único do carrinho — export default exigido

export default function initCart() {
  let cartElement = document.getElementById("cart");
  let cartItemsElement = document.getElementById("cart-items");
  let cartTotalElement = document.getElementById("cart-total");
  let openCartBtn = document.getElementById("open-cart");
  let openCartNavBtn = document.getElementById("open-cart-nav");
  let closeCartBtn = document.getElementById("close-cart");
  let cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  updateCart();
  if (!cartElement || !openCartBtn || !closeCartBtn) return;

  function openCart() {
    cartElement.classList.add("open");
    // Close mobile menu if open when opening cart
    const mobileMenu = document.getElementById("mobile-menu");
    const navToggle = document.getElementById("nav-toggle");
    if (mobileMenu && mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      navToggle.setAttribute("aria-expanded", "false");
    }
  }

  openCartBtn.addEventListener("click", openCart);
  if (openCartNavBtn) {
    openCartNavBtn.addEventListener("click", openCart);
  }
  closeCartBtn.addEventListener("click", () =>
    cartElement.classList.remove("open")
  );

  /**
   * Atualiza visualmente o carrinho
   */
  async function updateCart() {
    let request = await fetch("/api/cart/get_products_cart.php");
    let response = await request.json();
    let serverCart = JSON.parse(response).orders;
    localStorage.setItem("cart", JSON.stringify(serverCart));
    cart = serverCart;
    cartItemsElement.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
      let quantidade = item.qtd || 1;
      let subtotal = item.unity_price * quantidade;
      total += subtotal;

      // Extrai a imagem do produto
      let productName = item.product.name || item.name;
      let thumbHTML = "";
      if (item.product.images && item.product.images.length > 0) {
        thumbHTML = `<img src="http://localhost:5000/images_products/${item.product.name}/${item.product.images[0]}" alt="${productName}" class="cart-thumb">`;
      } else {
        thumbHTML = `<img src="https://img.icons8.com/color/96/no-image.png" alt="${productName}" class="cart-thumb">`;
      }

      let li = document.createElement("li");
      li.classList.add("cart-item");
      li.innerHTML = `
      ${thumbHTML}
    <div>
      <div class="cart-item-name">${productName} (x${quantidade})</div>
      <div class="cart-item-price">R$ ${subtotal.toFixed(2)}</div>
    </div>
    `;
      cartItemsElement.appendChild(li);
    });

    cartTotalElement.textContent = total.toFixed(2);
  }

  /**
   * Delegação de clique para adicionar produtos ao carrinho
   */
  document.addEventListener("click", async (e) => {
    if (
      e.target.classList.contains("add-to-cart") ||
      e.target.classList.contains("card-add-to-cart")
    ) {
      let card = e.target.closest(".product-card, .product-item");
      let name = card.querySelector("h3, h5").textContent;
      let priceText = card.querySelector(".product-price").textContent;
      let price = parseFloat(priceText.replace("R$", "").replace(",", "."));
      let img = card.querySelector("img");
      let thumbHTML = img
        ? `<img src="${img.src}" alt="${name}" class="cart-thumb">`
        : card.querySelector(".thumb").innerHTML;

      updateCart();
      console.log(localStorage.getItem("cart"));
    }
  });
  /**
   * Limpa o carrinho completamente
   */
  const clearCartBtn = document.getElementById("clear-cart");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", async () => {
      cart.length = 0;
      localStorage.removeItem("cart");
      let request = await fetch("/api/cart/delete_cart.php");
      let response = await request.json();
      if (response.success) {
        alert("Carrinho limpo com sucesso!");
      } else {
        alert("Erro ao limpar o carrinho.");
      }
      updateCart();
    });
  }
}

function initCartLoggedOut() {
  let cartElement = document.getElementById("cart");
  let cartItemsElement = document.getElementById("cart-items");
  let cartTotalElement = document.getElementById("cart-total");
  let openCartBtn = document.getElementById("open-cart");
  let openCartNavBtn = document.getElementById("open-cart-nav");
  let closeCartBtn = document.getElementById("close-cart");
  let cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  updateCart();
  if (!cartElement || !openCartBtn || !closeCartBtn) return;

  function openCart() {
    cartElement.classList.add("open");
    // Close mobile menu if open when opening cart
    const mobileMenu = document.getElementById("mobile-menu");
    const navToggle = document.getElementById("nav-toggle");
    if (mobileMenu && mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      navToggle.setAttribute("aria-expanded", "false");
    }
  }

  openCartBtn.addEventListener("click", openCart);
  if (openCartNavBtn) {
    openCartNavBtn.addEventListener("click", openCart);
  }
  closeCartBtn.addEventListener("click", () =>
    cartElement.classList.remove("open")
  );

  /**
   * Atualiza visualmente o carrinho
   */
  function updateCart() {
    cartItemsElement.innerHTML = "";
    let total = 0;
    cartItemsElement.innerHTML = "";

    cart.forEach((item) => {
      let quantidade = item.qtd || 1;
      let subtotal = item.price * quantidade;
      total += subtotal;

      let li = document.createElement("li");
      li.classList.add("cart-item");
      li.innerHTML = `
      ${item.thumbHTML}
      <div>
      <div class="cart-item-name">${item.name} (x${quantidade})</div>
      <div class="cart-item-price">R$ ${subtotal.toFixed(2)}</div>
      </div>
      `;
      cartItemsElement.appendChild(li);
    });

    cartTotalElement.textContent = total.toFixed(2);
  }

  openCartBtn.addEventListener("click", () =>
    cartElement.classList.add("open")
  );
  closeCartBtn.addEventListener("click", () =>
    cartElement.classList.remove("open")
  );

  /**
   * Delegação de clique para adicionar produtos ao carrinho
   */
  document.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("add-to-cart") ||
      e.target.classList.contains("card-add-to-cart")
    ) {
      let card = e.target.closest(".product-card, .product-item");
      let name = card.querySelector("h3, h5").textContent;
      let id = e.target.value;
      let priceText = card.querySelector(".product-price").textContent;
      let price = parseFloat(priceText.replace("R$", "").replace(",", "."));
      let img = card.querySelector("img");
      let thumbHTML = img
        ? `<img src="${img.src}" alt="${name}" class="cart-thumb">`
        : card.querySelector(".thumb").innerHTML;

      let existingItem = cart.find((item) => item.name === name);

      if (existingItem) {
        existingItem.qtd = (existingItem.qtd || 1) + 1;
      } else {
        cart.push({ id, name, price, thumbHTML, qtd: 1 });
      }

      // Atualiza o localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart();
    }
  });

  /**
   * Limpa o carrinho completamente
   */
  let clearCartBtn = document.getElementById("clear-cart");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cart.length = 0;
      localStorage.removeItem("cart");
      updateCart();
    });
  }
}
export { initCart, initCartLoggedOut };

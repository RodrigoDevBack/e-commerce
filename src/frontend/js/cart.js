// --------------------------- MÓDULO PRINCIPAL DO CARRINHO (LOGADO) ---------------------------
// Módulo único do carrinho — export default exigido

/**
 * Inicializa o carrinho para usuários logados.
 * Sincroniza itens com o backend e controla a interface do carrinho.
 * @function initCart
 * @returns {void}
 */
export default function initCart() {
  let cartElement = document.getElementById("cart");
  let cartItemsElement = document.getElementById("cart-items");
  let cartTotalElement = document.getElementById("cart-total");
  let openCartBtn = document.getElementById("open-cart");
  let openCartNavBtn = document.getElementById("open-cart-nav");
  let closeCartBtn = document.getElementById("close-cart");
  let cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : []; // Recupera carrinho do servidor/localStorage

  updateCart(); // Atualiza ao iniciar
  if (!cartElement || !openCartBtn || !closeCartBtn) return; // Segurança

  // --------------------------- ABRIR CARRINHO ---------------------------

  /**
   * Abre o carrinho e fecha o menu mobile caso esteja aberto.
   * @function openCart
   * @returns {void}
   */
  function openCart() {
    cartElement.classList.add("open"); // Mostra o carrinho
    const mobileMenu = document.getElementById("mobile-menu");
    const navToggle = document.getElementById("nav-toggle");

    // Fecha o menu mobile caso esteja aberto (bom comportamento UX)
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
  ); // Fecha carrinho

  // --------------------------- ATUALIZAR CARRINHO (LOGADO) ---------------------------

  /**
   * Atualiza visualmente o carrinho e sincroniza com o backend.
   * Re-renderiza lista de itens e recalcula total.
   * @async
   * @function updateCart
   * @returns {Promise<void>}
   */
  async function updateCart() {
    let request = await fetch("/api/cart/get_products_cart.php");
    let response = await request.json();
    let serverCart = JSON.parse(response).orders; // Dados vindos do backend
    localStorage.setItem("cart", JSON.stringify(serverCart));
    cart = serverCart;

    cartItemsElement.innerHTML = ""; // Limpa lista
    let total = 0;

    // Renderização dos itens
    cart.forEach((item) => {
      let quantidade = item.qtd || 1;
      let subtotal = item.unity_price * quantidade;
      total += subtotal; // Soma total

      let productName = item.product.name || item.name;
      let thumbHTML = "";

      // Gera thumbnail do produto
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
      cartItemsElement.appendChild(li); // Insere item no DOM
    });

    cartTotalElement.textContent = total.toFixed(2); // Atualiza total
  }

  // --------------------------- ADICIONAR ITEM VIA DELEGAÇÃO ---------------------------

  /**
   * Listener global para adicionar um item ao carrinho ao clicar no botão apropriado.
   * @event document#click
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

      updateCart(); // Atualiza após adicionar
      console.log(localStorage.getItem("cart")); // Debug
    }
  });

  // --------------------------- LIMPAR CARRINHO (LOGADO) ---------------------------

  /**
   * Botão que limpa completamente o carrinho (backend + localStorage).
   * @event clearCartBtn#click
   */
  const clearCartBtn = document.getElementById("clear-cart");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", async () => {
      cart.length = 0;
      localStorage.removeItem("cart");

      // Solicita backend para limpar carrinho
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

// --------------------------- MÓDULO DO CARRINHO (DESLOGADO) ---------------------------

/**
 * Inicializa o carrinho para usuários deslogados.
 * Utiliza somente localStorage.
 * @function initCartLoggedOut
 * @returns {void}
 */
function initCartLoggedOut() {
  let cartElement = document.getElementById("cart");
  let cartItemsElement = document.getElementById("cart-items");
  let cartTotalElement = document.getElementById("cart-total");
  let openCartBtn = document.getElementById("open-cart");
  let openCartNavBtn = document.getElementById("open-cart-nav");
  let closeCartBtn = document.getElementById("close-cart");
  let cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : []; // Carrinho somente local

  updateCart();
  if (!cartElement || !openCartBtn || !closeCartBtn) return;

  // --------------------------- ABRIR CARRINHO ---------------------------

  /**
   * Abre o carrinho e fecha o menu mobile, quando necessário.
   * @function openCart
   * @returns {void}
   */
  function openCart() {
    cartElement.classList.add("open");
    const mobileMenu = document.getElementById("mobile-menu");
    const navToggle = document.getElementById("nav-toggle");

    // Fecha o menu mobile automaticamente
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

  // --------------------------- ATUALIZAR CARRINHO (DESLOGADO) ---------------------------

  /**
   * Atualiza visualmente o carrinho (versão offline/deslogado).
   * @function updateCart
   * @returns {void}
   */
  function updateCart() {
    cartItemsElement.innerHTML = ""; // Limpa lista
    let total = 0;

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

    cartTotalElement.textContent = total.toFixed(2); // Atualiza total
  }

  openCartBtn.addEventListener("click", () =>
    cartElement.classList.add("open")
  );
  closeCartBtn.addEventListener("click", () =>
    cartElement.classList.remove("open")
  );

  // --------------------------- ADICIONAR ITEM (DESLOGADO) ---------------------------

  /**
   * Delegação para adicionar itens ao carrinho no modo deslogado.
   * @event document#click
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

      // Verifica se item já existe
      let existingItem = cart.find((item) => item.name === name);

      if (existingItem) {
        existingItem.qtd = (existingItem.qtd || 1) + 1; // Incrementa
      } else {
        cart.push({ id, name, price, thumbHTML, qtd: 1 }); // Cria novo
      }

      localStorage.setItem("cart", JSON.stringify(cart)); // Salva
      updateCart();
    }
  });

  // --------------------------- LIMPAR CARRINHO (DESLOGADO) ---------------------------

  /**
   * Limpa o carrinho (somente localStorage).
   * @event clearCartBtn#click
   */
  let clearCartBtn = document.getElementById("clear-cart");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cart.length = 0;
      localStorage.removeItem("cart");
      updateCart(); // Re-renderiza carrinho
    });
  }
}

export { initCart, initCartLoggedOut };

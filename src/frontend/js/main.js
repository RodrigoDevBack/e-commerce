import homePage, { initHomePage } from "./home.js";
import produtosPage, { initProductsList } from "./produtos.js";
import loginPage, { initLogin } from "./login.js";
import checkoutPage from "./checkout.js";
import cadastroPage, { initRegister } from "./register.js";
import adminProductsPage, { initAdminProducts } from "./adminProducts.js";
import { initApp } from "./appInit.js";
import { initCheckout } from "./checkout.js";

/** Elementos principais da aplicação SPA */
const app = document.getElementById("app");
const navLinks = document.querySelectorAll(".nav-link");

// Mobile menu: toggle + sync
function initMobileMenu() {
  const navToggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!navToggle || !mobileMenu) return;

  function closeMenu() {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    navToggle.setAttribute("aria-expanded", "true");
  }

  navToggle.addEventListener("click", () => {
    if (mobileMenu.classList.contains("open")) closeMenu();
    else openMenu();
  });

  // close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open"))
      closeMenu();
  });

  // Close when clicking any link inside
  mobileMenu.addEventListener("click", (e) => {
    if (
      e.target.matches("a.nav-link") ||
      e.target.matches("a.nav-link-cadastrar") ||
      e.target.matches("button.mobile-close")
    ) {
      closeMenu();
    }
  });
}

// Build mobile menu content from existing navs (called from updateMenu)
function updateMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  if (!mobileMenu) return;

  // Clone left nav links
  const leftNav = document.querySelector(".main-nav");
  const rightNav = document.querySelector(".main-nav-right");
  const rightRight = document.querySelector(".main-nav-right-right");
  const userData = JSON.parse(localStorage.getItem("user"));

  let html = "";
  html += `<button class="mobile-close" aria-label="Fechar menu">×</button>`;

  if (leftNav) {
    leftNav.querySelectorAll("a.nav-link").forEach((a) => {
      html += `<a href="${a.getAttribute("href")}" class="nav-link">${
        a.textContent
      }</a>`;
    });
  }

  if (rightNav) {
    rightNav.querySelectorAll("a.nav-link, button.nav-link").forEach((el) => {
      // Skip "Ver Perfil" button since it's already on navbar
      if (el.textContent.trim() === "Ver Perfil") return;

      if (el.tagName.toLowerCase() === "a") {
        html += `<a href="${el.getAttribute("href")}" class="nav-link">${
          el.textContent
        }</a>`;
      } else {
        html += `<button class="nav-link" type="button">${el.textContent}</button>`;
      }
    });
  }

  // Only show register link if user is NOT logged in
  if (!userData && rightRight) {
    rightRight.querySelectorAll("a, button").forEach((el) => {
      if (el.tagName.toLowerCase() === "a") {
        html += `<a href="${el.getAttribute(
          "href"
        )}" class="nav-link-cadastrar">${el.textContent}</a>`;
      } else {
        html += `<button class="nav-link-cadastrar" type="button">${el.textContent}</button>`;
      }
    });
  }

  // Add logout button if user is logged in
  if (userData) {
    html += `<button id="mobile-logout-btn" class="nav-link-cadastrar">Sair</button>`;
  }

  // Add cart button in mobile menu
  html += `<button id="mobile-cart-btn" class="nav-link" type="button">🛒 Carrinho</button>`;

  mobileMenu.innerHTML = html;

  // Attach logout event if present
  const mobileLogoutBtn = mobileMenu.querySelector("#mobile-logout-btn");
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", async () => {
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      window.cart = [];
      await fetch("api/login/logout.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.location.hash = "#home";
      window.location.reload();
    });
  }

  // Attach cart event in mobile menu - close menu when opening cart
  const mobileCCartBtn = mobileMenu.querySelector("#mobile-cart-btn");
  if (mobileCCartBtn) {
    mobileCCartBtn.addEventListener("click", () => {
      const navToggle = document.getElementById("nav-toggle");
      const mobileMenuElement = document.getElementById("mobile-menu");
      mobileMenuElement.classList.remove("open");
      mobileMenuElement.setAttribute("aria-hidden", "true");
      navToggle.setAttribute("aria-expanded", "false");

      // Open cart
      const cartElement = document.getElementById("cart");
      if (cartElement) {
        cartElement.classList.add("open");
      }
    });
  }
}

/**
 * Define o link de navegação ativo baseado no hash da URL
 * @param {string} hash - Hash atual da URL
 */
function setActiveLink(hash) {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === hash) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/**
 * Router simples baseado em hash
 * Renderiza a página correspondente e inicializa scripts específicos
 */
function router() {
  const hash = window.location.hash || "#home";
  setActiveLink(hash);
  let pageContent = "";

  switch (hash) {
    case "#home":
      pageContent = homePage();
      app.innerHTML = pageContent;
      initHomePage();
      break;

    case "#produtos":
      pageContent = produtosPage();
      app.innerHTML = pageContent;
      initProductsList();
      break;

    case "#login":
      pageContent = loginPage();
      app.innerHTML = pageContent;
      initLogin();
      break;

    case "#checkout":
      pageContent = checkoutPage();
      app.innerHTML = pageContent;
      initCheckout();
      break;

    case "#admin":
      pageContent = adminProductsPage();
      app.innerHTML = pageContent;
      initAdminProducts(app);
      break;

    case "#register":
      pageContent = cadastroPage();
      app.innerHTML = pageContent;
      initRegister();
      break;

    default:
      pageContent = "<h2>Página não encontrada</h2>";
  }
}

/**
 * Atualiza o menu de navegação com base no usuário logado
 */
function updateMenu() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const navRight = document.querySelector(".main-nav-right");
  const registerLink = document.querySelector(".nav-link-cadastrar");

  if (userData) {
    initCart();
    // Usuário logado → mostra Ver Perfil e botão Sair
    navRight.innerHTML = `
      ${
        userData.role === "admin"
          ? '<a href="#admin" class="nav-link admin-only">Gerenciar Produtos</a>'
          : ""
      }
      <button type='button' class="nav-link" data-bs-toggle="offcanvas" data-bs-target="#offcanvasPerfil" aria-controls="offcanvasPerfil">Ver Perfil</button>
      <button id="logout-btn" class="sair-btn">Sair</button>
    `;

    // Garante que o botão de cadastro some completamente
    if (registerLink) registerLink.style.display = "none";
  } else {
    initCartLoggedOut();
    // Usuário deslogado → mostra login e garante que o cadastro reaparece
    navRight.innerHTML = `<a href="#login" class="nav-link">Login</a>`;
    if (registerLink) registerLink.style.display = "";
  }

  // Lida com o logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      window.cart = [];
      await fetch("api/login/logout.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      window.location.hash = "#home";
      window.location.reload();
      updateMenu(); // Atualiza o menu após logout
    });
  }

  // Create offcanvas perfil outside of header to avoid height inflation
  let existingOffcanvas = document.getElementById("offcanvasPerfil");
  if (existingOffcanvas) {
    existingOffcanvas.remove();
  }

  if (userData) {
    const offcanvasHTML = `
      <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasPerfil"
        aria-labelledby="offcanvasTitlePerfil">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasTitlePerfil">Perfil</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div id="info-perfil">
                <!-- Informações do perfil serão carregadas aqui -->
                <p>Nome: ${userData.name}</p>
                <p>Email: ${userData.email}</p>
                <p>Função: ${userData.role}</p>
            </div>
            
            <div id="campo-validar-email"></div> <br>

            <div id="hitorico-pedidos-perfil"> </div> <br>

            <div id="endereco-perfil"> </div> <br>

        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", offcanvasHTML);
    criarCampoDeValidarEmail();
    carregarHistoricoPedidos();
    carregarEnderecoPerfil();
  }
  // ensure mobile menu mirrors changes
  updateMobileMenu();
}

async function carregarEnderecoPerfil() {
  let request = await fetch('/api/address/get.php', {
    credentials: 'same-origin'
  });
  let response = await request.json();
  const enderecoDiv = document.getElementById("endereco-perfil");
  let userData = JSON.parse(localStorage.getItem("user"));
  enderecoDiv.innerHTML = "<h3>Endereço de Entrega</h3>";
  if (userData.address) {
    enderecoDiv.innerHTML += `
      <p>${userData.address.street}, ${userData.address.number}</p>
      <p>${userData.address.city} - ${userData.address.state}, ${userData.address.zip}</p>
    `;
  } else {
    let element = document.createElement('div');
    element.innerHTML = `<button type="button" data-bs-toggle="modal" data-bs-target="#modelAddressRegister">Adicionar Endereço</button>`;
    const modalHTML = ` 
    <div class="modal fade" id="modelAddressRegister" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">

                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Cadastrar Endereço</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body"></div>
                <div class="modal-footer"></div>
              </div>
        </div>
    </div>
`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    enderecoDiv.appendChild(element);
  }
}

function criarCampoDeValidarEmail() {
  const div = document.getElementById("campo-validar-email");

  let userData = JSON.parse(localStorage.getItem("user"));
  if (userData.email_validate == false) {
    const campoHTML = document.createElement("div");
    campoHTML.innerHTML = `
    <hr>
    <h3>Validação de email</h3>
    <form id="validate-email-form">
      <label for="email">Email:</label> <br>
      <input type="email" id="email" required> <br>
      <label for="code">Código de validação:</label> <br>
      <input type="text" id="code" required> <br> <br>
      <button type="submit">Validar</button> 
    </form>
    <hr>
  `;

    const validateEmailForm = campoHTML.querySelector("#validate-email-form");
    validateEmailForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = campoHTML.querySelector("#email").value;
      const code = campoHTML.querySelector("#code").value;
      const body = {
        email: email,
        code: code,
      };

      const request = await fetch("/api/login/validate_email.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const response = await request.json();

      if (response.success == true) {
        alert("Email verificado com sucesso!");
        window.location.hash = "#home";
        window.location.reload();
        userData.email_validate = true;
        localStorage.setItem("user", JSON.stringify(userData));
        div.innerHTML = "<hr><p>Seu email já foi validado.</p>";
      } else {
        alert("Código ou email inválidos.");
      }
    });
    div.appendChild(campoHTML);
  } else {
    div.innerHTML = "<hr><p>Seu email já foi validado.</p>";
  }
}

/** Inicializa o SPA e módulos principais */
initApp(router);
initMobileMenu();
initCarousel();
initHomePage();
initProductsList();

/** Atualiza menu ao carregar a página e ao trocar rota */
window.addEventListener("load", updateMenu);
window.addEventListener("hashchange", updateMenu);

/**
 * Inicializa o carrossel de produtos
 */
function initCarousel() {
  const track = document.querySelector(".carousel-track");
  if (!track) return;

  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".carousel-btn.next");
  const prevButton = document.querySelector(".carousel-btn.prev");
  const slideWidth = slides[0].getBoundingClientRect().width;

  slides.forEach((slide, index) => {
    slide.style.left = slideWidth * index + "px";
  });

  let currentIndex = 0;

  nextButton.addEventListener("click", () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      track.style.transform = `translateX(-${slides[currentIndex].style.left})`;
    }
  });

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      track.style.transform = `translateX(-${slides[currentIndex].style.left})`;
    }
  });
}

/**
 * Inicializa o carrinho e gerencia lógica de adição/remover produtos
 */
function initCart() {
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
        thumbHTML = `<img src="http://127.0.0.1:5000/images_products/${item.product.name}/${item.product.images[0]}" alt="${productName}" class="cart-thumb">`;
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

/** Botão de redirecionamento para checkout */
const checkoutBtn = document.getElementById("checkout");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Se não estiver logado, manda para a página de login
    if (!user) {
      alert("Você precisa estar logado para finalizar o pedido.");
      window.location.hash = "#login";
      const cartElement = document.getElementById("cart");
      if (cartElement) cartElement.classList.remove("open");
      return;
    }

    // Se estiver logado, segue para o checkout normalmente
    window.location.hash = "#checkout";
    const cartElement = document.getElementById("cart");
    if (cartElement) cartElement.classList.remove("open");
  });
}

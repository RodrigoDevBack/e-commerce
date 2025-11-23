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
async function updateMenu() {
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
    let addressRequest = await fetch("/api/address/get.php");
    let addressResponse = await addressRequest.json();

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
            </div> <br>
            <hr>
            <h3> Validação de Email </h3> <br>
            <div id="campo-validar-email"></div> <br>
            <hr>
            <h3> Histórico de Compras </h3> <br>
            <div id="hitorico-pedidos-perfil"> 
            <form id="ver-history">
              <button type="sumbit" class="btn btn-primary" id="openHistory" data-bs-toggle="modal" data-bs-target="#modelHistory">
                Ver Histórico
              </button>
            </form>
              <br>
            </div> <br>
            <hr>
            <h3> Endereço </h3> <br>
            <div id="endereco-perfil"> </div> <br>

        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", offcanvasHTML);
    criarCampoDeValidarEmail();
    carregarHistoricoPedidos();
    carregarEnderecoPerfil(addressResponse);
  }
  // ensure mobile menu mirrors changes
  updateMobileMenu();
}

async function carregarHistoricoPedidos() {
  const form = document.getElementById("ver-history");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    var historyRequest = await fetch("/api/history/get.php");
    var historyResponse = await historyRequest.json();

    const elementModal = document.createElement("div");
    elementModal.innerHTML = `
  <div class="modal fade" id="modelHistory" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="4" aria-labelledby="staticBackdropLabel1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel1">Histórico</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="body">
        ${
          historyResponse.success === false
            ? "<br><h2> Histórico vazio </h2><br>"
            : gerarHistoricoHTML(historyResponse)
        }
        </div>
      </div>
    </div>
  </div>`;

    function formatDateTime(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    function gerarHistoricoHTML(json) {
      let html = "";

      json.orders.forEach((order) => {
        const dataFormatada = formatDateTime(order.created_at);

        html += `
      <div class="order-block" style="border:1px solid #ddd; padding:10px; margin-bottom:15px; border-radius:8px;">
        <h5>Compra em ${dataFormatada}</h5>
    `;

        order.items.forEach((item) => {
          html += `
        <div class="item" style="padding:8px; border-bottom:1px solid #eee;">
          <p><strong>${item.product.name}</strong></p>
          <p>Qtd: ${item.qtd}</p>
          <p>Preço unitário: R$ ${item.unity_price.toFixed(2)}</p>
        </div>
      `;
        });

        html += `
      <p class="order-total mt-2"><strong>Total: R$ ${order.total.toFixed(
        2
      )}</strong></p>
    </div>`;
      });

      return html;
    }

    document.body.appendChild(elementModal);
  });
}

async function carregarEnderecoPerfil(response) {
  const enderecoDiv = document.getElementById("endereco-perfil");

  if (response.success == false) {
    let element = document.createElement("div");
    element.innerHTML = `<p>Sem endereço cadastrado</p> <br> <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modelAddressRegister">Cadastrar Endereço</button>`;
    let offCanva = document.createElement("div");
    offCanva.innerHTML = `
    <div class="modal fade" id="modelAddressRegister" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">

                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Cadastrar Endereço</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                <form id="address-form">
                  <label for="zip" class="form-label">CEP:</label> <br>
                  <input type="text" class="form-control" id="cep" name="cep" required> <br>

                  <label for="street" class="form-label">Rua:</label><br>
                  <input type="text" class="form-control" id="logradouro" name="logradouro" required> <br>

                  <label for="number" class="form-label">Número:</label> <br>
                  <input type="text" class="form-control" id="numero" name="numero" required> <br>
                  
                  <label for="address" class="form-label">Complemento:</label> <br>
                  <input type="text" class="form-control" id="complemento" name="complemento"> <br>
                  
                  <label for="address" class="form-label">Bairro:</label> <br>
                  <input type="text" class="form-control" id="bairro" name="bairro" required> <br>
                  
                  <label for="city" class="form-label">Cidade:</label> <br>
                  <input type="text" class="form-control" id="cidade" name="cidade" required> <br>
                  
                  <label for="state" class="form-label">Estado:</label> <br>
                  <input type="text" class="form-control" id="estado" name="estado" required> <br>
                </form>
                </div>
                <div class="modal-footer justify-content-center">
                  <button type="submit" form="address-form" class="btn btn-primary" id="save-address">Salvar Endereço</button>
                </div>
              </div>
        </div>
    </div>`;
    let addressForm = offCanva.querySelector("#address-form");
    let saveAddressBtn = offCanva.querySelector("#save-address");

    const cep = offCanva.querySelector("#cep");
    cep.addEventListener("change", () => {
      pesquisacep(cep.value);
    });

    function limpa_formulário_cep() {
      //Limpa valores do formulário de cep.
      offCanva.querySelector("#logradouro").value = "";
      offCanva.querySelector("#bairro").value = "";
      offCanva.querySelector("#cidade").value = "";
      offCanva.querySelector("#estado").value = "";
    }

    function meu_callback(conteudo) {
      if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores.
        offCanva.querySelector("#logradouro").value = conteudo.logradouro;
        offCanva.querySelector("#bairro").value = conteudo.bairro;
        offCanva.querySelector("#cidade").value = conteudo.localidade;
        offCanva.querySelector("#estado").value = conteudo.estado;
      } //end if.
      else {
        //CEP não Encontrado.
        limpa_formulário_cep();
        alert("CEP não encontrado.");
      }
    }

    async function pesquisacep(valor) {
      //Nova variável "cep" somente com dígitos.
      var cep = valor.replace(/\D/g, "");

      //Verifica se campo cep possui valor informado.
      if (cep != "") {
        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if (validacep.test(cep)) {
          //Preenche os campos com "..." enquanto consulta webservice.
          offCanva.querySelector("#logradouro").value = "...";
          offCanva.querySelector("#bairro").value = "...";
          offCanva.querySelector("#cidade").value = "...";
          offCanva.querySelector("#estado").value = "...";

          //Sincroniza com o callback.
          let request = await fetch(
            "https://viacep.com.br/ws/" + cep + "/json/"
          );
          let response = await request.json();
          meu_callback(response);
        } //end if.
        else {
          //cep é inválido.
          limpa_formulário_cep();
          alert("Formato de CEP inválido.");
        }
      } //end if.
      else {
        //cep sem valor, limpa formulário.
        limpa_formulário_cep();
      }
    }

    addressForm.appendChild(element);

    saveAddressBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      let addressData = {
        CEP: offCanva.querySelector("#cep").value,
        Logradouro: offCanva.querySelector("#logradouro").value,
        Numero: offCanva.querySelector("#numero").value,
        Complemento: offCanva.querySelector("#complemento").value || "",
        Bairro: offCanva.querySelector("#bairro").value,
        Cidade: offCanva.querySelector("#cidade").value,
        Estado: offCanva.querySelector("#estado").value,
      };
      let response = await fetch("/api/address/create.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });
      let result = await response.json();
      if (result.success) {
        alert("Endereço salvo com sucesso!");
        window.location.reload();
      } else {
        alert("Erro ao salvar endereço.");
      }
    });

    enderecoDiv.appendChild(element);
    document.body.appendChild(offCanva);
  } else {
    let item = document.createElement("div");
    item.innerHTML = `
            <p>${response.Logradouro}, ${response.Numero} ${
      response.Complemento ? "- " + response.Complemento : ""
    }</p>
            <p>${response.Bairro} - ${response.Cidade}/${response.Estado}</p>
            <p>CEP: ${response.CEP}</p> <br>
            <form id="delete-address">
              <button type="submit" form="delete-address" class="btn btn-outline-danger" style="background-color: red;" id="address-delete">Deletar</button>
            </form>
    `;
    let addressDelete = item.querySelector("#delete-address");
    addressDelete.addEventListener("submit", async (e) => {
      e.preventDefault();

      let request = await fetch("/api/address/delete.php");

      let response = await request.json();

      if (response.success == true) {
        alert("Endereço deletado.");
        window.location.reload();
      } else {
        alert("Falha ao tentar deletar o endereço.");
      }
    });

    enderecoDiv.appendChild(item);
  }
}

function criarCampoDeValidarEmail() {
  const div = document.getElementById("campo-validar-email");

  let userData = JSON.parse(localStorage.getItem("user"));
  if (userData.email_validate == false) {
    const campoHTML = document.createElement("div");
    campoHTML.innerHTML = `
    <form id="validate-email-form">
      <label for="email" class="form-label">Email:</label> <br>
      <input type="email" class="form-control" id="email" required> <br>
      <label for="code" class="form-label">Código de validação:</label> <br>
      <input type="text" class="form-control" id="code" required> <br>
      <button type="submit" class="btn btn-secondary">Validar</button> 
    </form>
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
    div.innerHTML = "<p>Seu email já foi validado.</p>";
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
        thumbHTML = `<img src="http:// localhost:5000/images_products/${item.product.name}/${item.product.images[0]}" alt="${productName}" class="cart-thumb">`;
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

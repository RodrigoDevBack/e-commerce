import homePage, { initHomePage } from "./home.js";
import produtosPage, { initProductsList } from "./produtos.js";
import loginPage, { initLogin } from "./login.js";
import checkoutPage from "./checkout.js";
import cadastroPage, { initRegister } from "./register.js";
import adminProductsPage, { initAdminProducts } from "./adminProducts.js";
import { initApp } from "./appInit.js";
import { initCheckout } from "./checkout.js";
import { initMobileMenu, updateMobileMenu } from "./menu.js";
import { initCart, initCartLoggedOut } from "./cart.js";

/** Elementos principais da aplicação SPA */
const app = document.getElementById("app");
const navLinks = document.querySelectorAll(".nav-link");

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
  initMobileMenu();
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

  // =====================================================
  // CASO NÃO TENHA ENDEREÇO
  // =====================================================
  if (response.success == false) {
    let element = document.createElement("div");
    element.innerHTML = `
      <hr>
      <h3>Sem endereço cadastrado</h3>
      <br>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modelAddressRegister">Cadastrar Endereço</button>
    `;

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
                    <label class="form-label">CEP:</label>
                    <input type="text" class="form-control" id="cep" required> <br>

                    <label class="form-label">Rua:</label>
                    <input type="text" class="form-control" id="logradouro" required> <br>

                    <label class="form-label">Número:</label>
                    <input type="text" class="form-control" id="numero" required> <br>

                    <label class="form-label">Complemento:</label>
                    <input type="text" class="form-control" id="complemento"> <br>

                    <label class="form-label">Bairro:</label>
                    <input type="text" class="form-control" id="bairro" required> <br>

                    <label class="form-label">Cidade:</label>
                    <input type="text" class="form-control" id="cidade" required> <br>

                    <label class="form-label">Estado:</label>
                    <input type="text" class="form-control" id="estado" required> <br>
                  </form>
                  </div>

                  <div class="modal-footer justify-content-center">
                    <button type="submit" form="address-form" class="btn btn-primary" id="save-address">Salvar Endereço</button>
                  </div>

                </div>
          </div>
      </div>
    `;

    let addressForm = offCanva.querySelector("#address-form");
    let saveAddressBtn = offCanva.querySelector("#save-address");

    // --------------------------- CEP ---------------------------
    const cepInput = offCanva.querySelector("#cep");

    cepInput.addEventListener("change", () => {
      pesquisacep(cepInput.value);
    });

    function limpa_formulário_cep() {
      offCanva.querySelector("#logradouro").value = "";
      offCanva.querySelector("#bairro").value = "";
      offCanva.querySelector("#cidade").value = "";
      offCanva.querySelector("#estado").value = "";
    }

    function meu_callback(conteudo) {
      if (!("erro" in conteudo)) {
        offCanva.querySelector("#logradouro").value = conteudo.logradouro;
        offCanva.querySelector("#bairro").value = conteudo.bairro;
        offCanva.querySelector("#cidade").value = conteudo.localidade;
        offCanva.querySelector("#estado").value = conteudo.estado;
      } else {
        limpa_formulário_cep();
        alert("CEP não encontrado.");
      }
    }

    async function pesquisacep(valor) {
      let cep = valor.replace(/\D/g, "");

      if (cep !== "") {
        const validacep = /^[0-9]{8}$/;

        if (validacep.test(cep)) {
          offCanva.querySelector("#logradouro").value = "...";
          offCanva.querySelector("#bairro").value = "...";
          offCanva.querySelector("#cidade").value = "...";
          offCanva.querySelector("#estado").value = "...";

          let request = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          let resp = await request.json();
          meu_callback(resp);
        } else {
          limpa_formulário_cep();
          alert("Formato de CEP inválido.");
        }
      } else {
        limpa_formulário_cep();
      }
    }

    // --------------------------- SALVAR ENDEREÇO ---------------------------
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

      let request = await fetch("/api/address/create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      let result = await request.json();

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
    // =====================================================
    // CASO JÁ TENHA ENDEREÇO
    // =====================================================
    let item = document.createElement("div");
    item.innerHTML = `
      <hr>
      <p><strong>Endereço cadastrado:</strong></p>
      <p>${response.Logradouro}, ${response.Numero} ${
      response.Complemento ? "- " + response.Complemento : ""
    }</p>
      <p>${response.Bairro} - ${response.Cidade}/${response.Estado}</p>
      <p>CEP: ${response.CEP}</p>
      <br>
      <form id="delete-address">
        <button type="submit" class="btn btn-outline-danger" style="background-color: red;" id="address-delete">Deletar</button>
      </form>
    `;

    let addressDelete = item.querySelector("#delete-address");

    addressDelete.addEventListener("submit", async (e) => {
      e.preventDefault();

      let request = await fetch("/api/address/delete.php");
      let resp = await request.json();

      if (resp.success == true) {
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

// BOTÃO DE REDIRECIONAR PARA CHECKOUT (PARA USUÁRIOS NÃO LOGADOS)
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

// INICIALIZAÇÃO DA APLICAÇÃO
initApp(router);

// ATUALIZA O MENU NA CARGA INICIAL E MUDANÇA DE HASH
window.addEventListener("load", updateMenu);
window.addEventListener("hashchange", updateMenu);

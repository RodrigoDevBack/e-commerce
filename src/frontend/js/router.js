// --------------------------- IMPORTS DE MÓDULOS ---------------------------
import homePage, { initHomePage } from "./home.js";
import produtosPage, { initProductsList } from "./produtos.js";
import loginPage, { initLogin } from "./login.js";
import checkoutPage, { initCheckout } from "./checkout.js";
import cadastroPage, { initRegister } from "./register.js";
import adminProductsPage, { initAdminProducts } from "./adminProducts.js";
import { initMobileMenu, updateMobileMenu } from "./menu.js";
import { updateMenu } from "./main.js";
import { initCart, initCartLoggedOut } from "./cart.js";
import initPerfilUsuario from "./perfil-usuario.js";

// --------------------------- ELEMENTOS PRINCIPAIS ---------------------------
const app = document.getElementById("app");
const navLinks = document.querySelectorAll(".nav-link");

// --------------------------- FUNÇÃO AUXILIAR ---------------------------
/**
 * Define o link de navegação ativo com base no hash atual.
 * @param {string} hash - Hash da rota atual
 */
function setActiveLink(hash) {
  navLinks.forEach((link) => {
    // Adiciona classe 'active' apenas ao link correspondente
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
}

// --------------------------- FUNÇÃO PRINCIPAL DE ROTEAMENTO ---------------------------
/**
 * Roteador da aplicação.
 * Controla a renderização das páginas, inicializa scripts específicos
 * e gerencia carrinho e perfil do usuário.
 * @function router
 * @returns {void}
 */
export function router() {
  const hash = window.location.hash || "#home";
  setActiveLink(hash);

  let pageContent = "";
  let initFunc = null;

  // --------------------------- SWITCH DE ROTAS ---------------------------
  switch (hash) {
    case "#home":
      pageContent = homePage();
      initFunc = initHomePage;
      break;
    case "#produtos":
      pageContent = produtosPage();
      initFunc = initProductsList;
      break;
    case "#login":
      pageContent = loginPage();
      initFunc = initLogin;
      break;
    case "#checkout":
      pageContent = checkoutPage();
      initFunc = initCheckout;
      break;
    case "#admin":
      pageContent = adminProductsPage();
      initFunc = () => initAdminProducts(app);
      break;
    case "#register":
      pageContent = cadastroPage();
      initFunc = initRegister;
      break;
    default:
      pageContent = "<h2>Página não encontrada</h2>";
  }

  // --------------------------- RENDERIZAÇÃO ---------------------------
  app.innerHTML = pageContent;

  // --------------------------- INICIALIZAÇÃO DE SCRIPT ESPECÍFICO ---------------------------
  if (initFunc) initFunc();

  // --------------------------- CARRINHO ---------------------------
  const cartElement = document.getElementById("cart");
  if (cartElement) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) initCart(); // Usuário logado
    else initCartLoggedOut(); // Usuário não logado
  }

  // --------------------------- MENU & PERFIL ---------------------------
  updateMenu(); // Atualiza menu após DOM estar pronto
  const user = JSON.parse(localStorage.getItem("user"));
  initPerfilUsuario(user); // Inicializa Offcanvas do usuário
}

// --------------------------- INICIALIZAÇÃO DO MENU MOBILE ---------------------------
initMobileMenu();
updateMobileMenu();

// --------------------------- EVENTOS ---------------------------
window.addEventListener("load", router);
window.addEventListener("hashchange", router);

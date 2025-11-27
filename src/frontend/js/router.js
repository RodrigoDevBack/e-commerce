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

const app = document.getElementById("app");
const navLinks = document.querySelectorAll(".nav-link");

function setActiveLink(hash) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
}

export function router() {
  const hash = window.location.hash || "#home";
  setActiveLink(hash);

  let pageContent = "";
  let initFunc = null;

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

  // Renderiza conteúdo
  app.innerHTML = pageContent;

  // Inicializa scripts específicos da página
  if (initFunc) initFunc();

  // Inicializa carrinho se existir
  const cartElement = document.getElementById("cart");
  if (cartElement) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) initCart();
    else initCartLoggedOut();
  }

  // **Chamando updateMenu aqui, após o DOM estar pronto**
  updateMenu();
}

// Inicialização apenas do menu mobile
initMobileMenu();
updateMobileMenu();
initPerfilUsuario(JSON.parse(localStorage.getItem("user")));
window.addEventListener("load", router);
window.addEventListener("hashchange", router);

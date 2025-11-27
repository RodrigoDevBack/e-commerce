/**
 * Inicializa o comportamento do menu mobile.
 *
 * Funções incluídas:
 * - Alternar abertura/fechamento ao clicar no botão hamburguer.
 * - Fechar o menu ao pressionar ESC.
 * - Fechar o menu ao clicar em qualquer link dentro do menu.
 *
 * Observação: Apenas prepara o funcionamento; conteúdo do menu é preenchido em updateMobileMenu().
 */
export function initMobileMenu() {
  const navToggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  // Se algum elemento não existir, não inicializa o menu mobile
  if (!navToggle || !mobileMenu) return;

  /** Fecha o menu mobile */
  function closeMenu() {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    navToggle.setAttribute("aria-expanded", "false");
  }

  /** Abre o menu mobile */
  function openMenu() {
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    navToggle.setAttribute("aria-expanded", "true");
  }

  // Alterna o menu quando o botão hamburguer é clicado
  navToggle.addEventListener("click", () => {
    if (mobileMenu.classList.contains("open")) closeMenu();
    else openMenu();
  });

  // Fecha o menu ao pressionar ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open"))
      closeMenu();
  });

  // Fecha ao clicar em qualquer link interno ou botão de fechar
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

/**
 * Atualiza o conteúdo do menu mobile, copiando links do menu desktop
 * e adaptando conforme o usuário estar logado ou não.
 *
 * Tarefas:
 * - Copiar links da navegação principal (.main-nav)
 * - Copiar links da área direita (.main-nav-right)
 * - Exibir opções especiais para usuários logados (ex.: Logout)
 * - Exibir botões extras como Carrinho
 * - Refazer event listeners após reconstruir o HTML
 *
 * Observação: Sempre recria todo o conteúdo do menu mobile.
 */
export function updateMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  if (!mobileMenu) return;

  const leftNav = document.querySelector(".main-nav");
  const rightNav = document.querySelector(".main-nav-right");
  const rightRight = document.querySelector(".main-nav-right-right");
  const userData = JSON.parse(localStorage.getItem("user"));

  // Base inicial do menu mobile
  let html = `<button class="mobile-close" aria-label="Fechar menu">×</button>`;

  // Copia links da navegação esquerda (menu principal)
  if (leftNav) {
    leftNav.querySelectorAll("a.nav-link").forEach((a) => {
      html += `<a href="${a.getAttribute("href")}" class="nav-link">${
        a.textContent
      }</a>`;
    });
  }

  // Copia links do lado direito da navbar, exceto "Ver Perfil"
  if (rightNav) {
    rightNav.querySelectorAll("a.nav-link, button.nav-link").forEach((el) => {
      // Exclui "Ver Perfil", pois no mobile é tratado de outra forma
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

  // Se o usuário NÃO está logado → adiciona link/botão de Cadastro/Login
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

  // Se o usuário ESTÁ logado → adiciona botão de Logout
  if (userData) {
    html += `<button id="mobile-logout-btn" class="nav-link-cadastrar">Sair</button>`;
  }

  // Botão para abrir o carrinho
  html += `<button id="mobile-cart-btn" class="nav-link" type="button">🛒 Carrinho</button>`;

  // Reescreve o conteúdo completo do menu
  mobileMenu.innerHTML = html;

  /**
   * EVENTOS E AÇÕES DOS BOTÕES RECRIADOS
   */

  // Logout no mobile
  const mobileLogoutBtn = mobileMenu.querySelector("#mobile-logout-btn");
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", async () => {
      // Remove dados do usuário e carrinho
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      window.cart = [];

      // Envia logout para o backend
      await fetch("api/login/logout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // Volta à página inicial
      window.location.hash = "#home";
      window.location.reload();
    });
  }

  // Botão do carrinho no menu mobile
  const mobileCCartBtn = mobileMenu.querySelector("#mobile-cart-btn");
  if (mobileCCartBtn) {
    mobileCCartBtn.addEventListener("click", () => {
      // Fecha o menu mobile
      const navToggle = document.getElementById("nav-toggle");
      const mobileMenuElement = document.getElementById("mobile-menu");
      mobileMenuElement.classList.remove("open");
      mobileMenuElement.setAttribute("aria-hidden", "true");
      navToggle.setAttribute("aria-expanded", "false");

      // Abre o carrinho, se existir
      const cartElement = document.getElementById("cart");
      if (cartElement) cartElement.classList.add("open");
    });
  }
}

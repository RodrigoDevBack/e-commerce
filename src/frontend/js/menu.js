// menu.js

/**
 * Inicializa o menu mobile: toggle, ESC e fechamento ao clicar em links.
 */
export function initMobileMenu() {
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

  // Close on ESC
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

/**
 * Atualiza o conteúdo do menu mobile baseado nos links existentes e estado do usuário.
 */
export function updateMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  if (!mobileMenu) return;

  const leftNav = document.querySelector(".main-nav");
  const rightNav = document.querySelector(".main-nav-right");
  const rightRight = document.querySelector(".main-nav-right-right");
  const userData = JSON.parse(localStorage.getItem("user"));

  let html = `<button class="mobile-close" aria-label="Fechar menu">×</button>`;

  if (leftNav) {
    leftNav.querySelectorAll("a.nav-link").forEach((a) => {
      html += `<a href="${a.getAttribute("href")}" class="nav-link">${
        a.textContent
      }</a>`;
    });
  }

  if (rightNav) {
    rightNav.querySelectorAll("a.nav-link, button.nav-link").forEach((el) => {
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

  if (userData) {
    html += `<button id="mobile-logout-btn" class="nav-link-cadastrar">Sair</button>`;
  }

  html += `<button id="mobile-cart-btn" class="nav-link" type="button">🛒 Carrinho</button>`;

  mobileMenu.innerHTML = html;

  // Logout
  const mobileLogoutBtn = mobileMenu.querySelector("#mobile-logout-btn");
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", async () => {
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      window.cart = [];
      await fetch("api/login/logout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      window.location.hash = "#home";
      window.location.reload();
    });
  }

  // Cart button
  const mobileCCartBtn = mobileMenu.querySelector("#mobile-cart-btn");
  if (mobileCCartBtn) {
    mobileCCartBtn.addEventListener("click", () => {
      const navToggle = document.getElementById("nav-toggle");
      const mobileMenuElement = document.getElementById("mobile-menu");
      mobileMenuElement.classList.remove("open");
      mobileMenuElement.setAttribute("aria-hidden", "true");
      navToggle.setAttribute("aria-expanded", "false");

      const cartElement = document.getElementById("cart");
      if (cartElement) cartElement.classList.add("open");
    });
  }
}

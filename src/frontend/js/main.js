// --------------------------- ATUALIZAÇÃO DO MENU ---------------------------

/**
 * Atualiza a barra de navegação conforme o estado do usuário.
 * - Mostra links/admin buttons se estiver logado.
 * - Exibe botão login e esconde cadastro se não estiver logado.
 * @async
 * @function updateMenu
 */
export async function updateMenu() {
  const userData = JSON.parse(localStorage.getItem("user")); // Pega dados do usuário logado
  const navRight = document.querySelector(".main-nav-right"); // Container dos links à direita
  if (!navRight) return;

  const registerLink = document.querySelector(".nav-link-cadastrar");

  if (userData) {
    // --------------------------- USUÁRIO LOGADO ---------------------------
    navRight.innerHTML = `
      ${
        userData.role === "admin"
          ? '<a href="#admin" class="nav-link admin-only">Gerenciar Produtos</a>'
          : ""
      }
      <button type='button' class="nav-link" data-bs-toggle="offcanvas" data-bs-target="#offcanvasPerfil" aria-controls="offcanvasPerfil">Ver Perfil</button>
      <button id="logout-btn" class="sair-btn">Sair</button>
    `;

    // Esconde o link de cadastro se usuário estiver logado
    if (registerLink) registerLink.style.display = "none";
  } else {
    // --------------------------- USUÁRIO DESLOGADO ---------------------------
    navRight.innerHTML = `<a href="#login" class="nav-link">Login</a>`;

    // Garante que o link de cadastro reapareça
    if (registerLink) registerLink.style.display = "";
  }

  // --------------------------- LOGOUT ---------------------------
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      // Remove dados do usuário e carrinho localmente
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      window.cart = [];

      // Chamada ao backend para finalizar sessão
      await fetch("api/login/logout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // Redireciona para home e recarrega SPA
      window.location.hash = "#home";
      window.location.reload();
    });
  }
}

// --------------------------- BOTÃO DE CHECKOUT ---------------------------

const checkoutBtn = document.getElementById("checkout");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const cartElement = document.getElementById("cart");

    if (!user) {
      // Usuário não logado → redireciona para login
      alert("Você precisa estar logado para finalizar o pedido.");
      window.location.hash = "#login";

      if (cartElement) cartElement.classList.remove("open");
      return;
    }

    // Usuário logado → segue para checkout
    window.location.hash = "#checkout";
    if (cartElement) cartElement.classList.remove("open");
  });
}

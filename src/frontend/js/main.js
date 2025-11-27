export async function updateMenu() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const navRight = document.querySelector(".main-nav-right");
  if (!navRight) return;
  const registerLink = document.querySelector(".nav-link-cadastrar");

  if (userData) {
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
    });
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

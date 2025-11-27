// --------------------------- RENDERIZAÇÃO DA PÁGINA DE CADASTRO ---------------------------

/**
 * Retorna o HTML da página de cadastro.
 * @returns {string} Estrutura HTML da seção de registro
 */
export default function registerPage() {
  return `
    <section class="register">
      <div id="spinner" style="display: none; margin: 150px">
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      <div id="register">
        <h2>Cadastro</h2>
        <form id="register-form">
          <label for="name">Nome:</label>
          <input type="text" id="name" required>

          <label for="email">Email:</label>
          <input type="email" id="email" required>

          <label for="password">Senha:</label>
          <input type="password" id="password" required>

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </section>
  `;
}

// --------------------------- INICIALIZAÇÃO DO FORMULÁRIO DE CADASTRO ---------------------------

/**
 * Inicializa a lógica de cadastro de usuário.
 * - Captura valores do formulário
 * - Envia requisição POST para a API
 * - Redireciona ou exibe mensagem de erro
 */
export async function initRegister() {
  const form = document.getElementById("register-form");
  if (!form) return; // Sai se o formulário não estiver na página

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevê recarregamento padrão

    // --------------------------- CAPTURA DE DADOS ---------------------------
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const registerDiv = document.getElementById("register");
    registerDiv.style.display = "none";

    const spinner = document.getElementById("spinner");
    spinner.style.display = "block";

    const data = {
      name: name,
      email: email,
      password: password,
    };

    console.log("data"); // Debug

    // --------------------------- REQUISIÇÃO DE CADASTRO ---------------------------
    const request = await fetch("/api/login/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const response = await request.json();
    spinner.style.display = "none";

    // --------------------------- TRATAMENTO DA RESPOSTA ---------------------------
    if (response.success === true) {
      let div = document.getElementById("register");
      let confirm = window.confirm("Você deseja validar seu email?");
      if (confirm == true) {
        criarCampoDeValidarEmail(div); // Mostra formulário de validação
      } else {
        alert(
          "Você não poderá recuperar a senha se esquecer ela, mas poderá validar em outro momento."
        );
        window.location.hash = "#home";
        window.location.reload();
      }
    } else {
      // Email já cadastrado
      alert("Email já cadastrado.");
    }
  });

  // --------------------------- FUNÇÃO DE VALIDAÇÃO DE EMAIL ---------------------------
  function criarCampoDeValidarEmail(div) {
    div.innerHTML = "";
    div.innerHTML = `
      <h2>Validação de email</h2>
      <form id="validate-email-form">
        <label for="email">Email:</label>
        <input type="email" id="email" required>

        <label for="code">Código de validação:</label>
        <input type="text" id="code" required>

        <button type="submit">Validar</button>
      </form>`;

    let validateEmailForm = document.getElementById("validate-email-form");
    validateEmailForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // --------------------------- CAPTURA DE DADOS DO FORMULARIO DE VALIDAÇÃO ---------------------------
      let email = document.getElementById("email").value;
      let code = document.getElementById("code").value;

      let body = {
        email: email,
        code: code,
      };

      // --------------------------- REQUISIÇÃO DE VALIDAÇÃO ---------------------------
      let request = await fetch("/api/login/validate_email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let response = await request.json();

      // --------------------------- TRATAMENTO DA RESPOSTA DE VALIDAÇÃO ---------------------------
      if (response.success == true) {
        alert("Email verificado com sucesso!");
        window.location.hash = "#home";
        window.location.reload();
      } else {
        alert("Código ou email inválidos.");
      }
    });
  }
}

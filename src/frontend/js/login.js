// --------------------------- LOGIN PAGE MARKUP ---------------------------
/**
 * Renderiza o markup da página de login.
 * Retorna um template string para ser inserido no DOM pelo router.
 *
 * Responsabilidade:
 * - Exibir formulário de autenticação do usuário.
 *
 * Observação:
 * - A lógica do login fica separada em initLogin() para manter o padrão SPA modular.
 */
export default function loginPage() {
  return `
    <section class="login">
    <div id="login">
      <h2>Login</h2>
      <form id="login-form">
        <label for="email">Email:</label>
        <input type="email" id="email" required>
        
        <label for="password">Senha:</label>
        <input type="password" id="password" required>
        
        <button type="submit">Entrar</button>
        <br> <br>

        <label for="recover-password">Esqueceu sua senha?</label>
        <button type="button" id = "recuperar-senha">Recuperar</button>
      </form>
      </div>
    </section>
  `;
}

// --------------------------- LÓGICA PRINCIPAL DO LOGIN ---------------------------
/**
 * Inicializa toda a lógica da página de login:
 * - Recuperar senha
 * - Validar email
 * - Autenticação normal
 * - Sincronização do carrinho (após login)
 *
 * Observação:
 * - Somente roda se a página de login estiver montada no DOM.
 */
export async function initLogin() {
  const login = document.getElementById("login");
  const btnRecuperarSenha = document.getElementById("recuperar-senha");

  // Botão que inicia o fluxo de recuperação de senha
  btnRecuperarSenha.addEventListener("click", async () => {
    criarCampoDeSolicitarCodigo(login);
  });

  // --------------------------- TELA – SOLICITAR CÓDIGO ---------------------------
  /**
   * Renderiza o primeiro passo do fluxo de recuperação de senha:
   * solicitar o código de verificação.
   *
   * @param {HTMLElement} div - Container principal da área de login.
   */
  function criarCampoDeSolicitarCodigo(div) {
    div.innerHTML = "";
    div.innerHTML = `
      <h2>Recuperar Senha</h2>
      <form id="recuperar-password-form">
        <label for="email">Email:</label>
        <input type="email" id="email" required>
        
        <button type="submit" id="solicitar-codigo">Solicitar Código</button>
        <br> <br>
        <button type="button" id="voltar">Voltar</button>
      </form>`;

    let voltar = document.getElementById(`voltar`);

    // Volta ao login original recarregando a página
    voltar.addEventListener("click", (e) => {
      location.reload();
    });

    let recuperarPasswordForm = document.getElementById(
      "recuperar-password-form"
    );

    recuperarPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let email = document.getElementById("email").value;
      let body = {
        email: email,
      };

      let request = await fetch("api/login/request_recover_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let response = await request.json();

      if (response.success == true) {
        alert("Solicitação bem sucedida!");
        escreverNovaSenha(div);
      } else {
        alert("Usuário não cadastrado ou email inválido.");
      }
    });
  }

  // --------------------------- TELA – DEFINIR NOVA SENHA ---------------------------
  /**
   * Renderiza a segunda etapa da recuperação de senha:
   * usuário insere código + nova senha.
   *
   * @param {HTMLElement} div - Elemento onde o conteúdo será injetado.
   */
  function escreverNovaSenha(div) {
    div.innerHTML = "";
    div.innerHTML = `
      <h2>Recuperar Senha</h2>
      <form id="recuperar-password-form">
        <label for="email">Email:</label>
        <input type="email" id="email" required>

        <label for="code">Código de verificação:</label>
        <input type="text" id="code" required>

        <label for="password">Senha:</label>
        <input type="password" id="password" required>
        
        <button type="submit" id="recover-password">Recuperar a senha</button>
        <br> <br>
        <button type="button" id="voltar">Voltar</button>
      </form>`;

    let voltar = document.getElementById(`voltar`);

    // Retorna para o primeiro passo sem reload
    voltar.addEventListener("click", () => {
      criarCampoDeSolicitarCodigo(div);
    });

    let recuperarPasswordForm = document.getElementById(
      "recuperar-password-form"
    );

    recuperarPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let email = document.getElementById("email").value;
      let code = document.getElementById("code").value;
      let password = document.getElementById("password").value;

      let body = {
        email: email,
        code: code,
        password: password,
      };

      let request = await fetch("api/login/recover_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let response = await request.json();

      if (response.success == true) {
        alert("Senha recuperada com sucesso!");
        alert("Bora fazer login.");
        location.reload();
      } else {
        alert("Falha! Verifique se o email ou código estão corretos.");
      }
    });
  }

  // --------------------------- LOGIN NORMAL ---------------------------
  const form = document.getElementById("login-form");

  // Segurança: função pode ser chamada em outra rota por engano
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const data = {
      username: email,
      password: password,
    };

    // Envia credenciais para API PHP de autenticação
    const request = await fetch("/api/login/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const response = await request.json();
    console.log(response);

    if (response.success === true) {
      // Armazena dados essenciais para manter sessão entre recargas
      const role = response.role;
      const name = response.name;
      const email_validate = response.email_validate;
      localStorage.setItem(
        "user",
        JSON.stringify({ name, email, role, email_validate })
      );

      // Sincroniza carrinho offline → online
      synCartUser();

      if (response.email_validate == false) {
        let div = document.getElementById("login");
        let confirm = window.confirm("Você deseja validar seu email?");
        if (confirm == true) {
          criarCampoDeValidarEmail(div);
        } else {
          alert(
            "Você não poderá recuperar a senha se esquecer ela, mas poderá validar em outro momento."
          );
          window.location.hash = "#home";
        }
      } else {
        window.location.hash = "#home";
      }
    } else {
      alert("Email ou senha incorretos.");
    }
  });

  // --------------------------- TELA – VALIDAR EMAIL ---------------------------
  /**
   * Renderiza interface para validar email após cadastro.
   *
   * @param {HTMLElement} div - Container principal.
   */
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
      let email = document.getElementById("email").value;
      let code = document.getElementById("code").value;

      let body = {
        email: email,
        code: code,
      };

      let request = await fetch("/api/login/validate_email.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let response = await request.json();

      if (response.success == true) {
        alert("Email verificado com sucesso!");
        window.location.hash = "#home";
      } else {
        alert("Código ou email inválidos.");
      }
    });
  }
}

// --------------------------- SINCRONIZAÇÃO DE CARRINHO ---------------------------
/**
 * Sincroniza o carrinho local (localStorage) com o carrinho do usuário logado.
 *
 * - Envia itens offline para o backend
 * - Obtém carrinho atualizado da API
 * - Substitui o localStorage pelo carrinho oficial
 *
 * Observação:
 * - Mantém consistência quando o usuário adiciona itens antes de logar.
 */
async function synCartUser() {
  let itens_localStorage = localStorage.getItem("cart");
  itens_localStorage = itens_localStorage ? JSON.parse(itens_localStorage) : [];

  // Envia cada item do carrinho offline para a API
  if (itens_localStorage) {
    for (const item of itens_localStorage) {
      let body = {
        id: item.id,
        qtd: item.qtd || 1,
      };
      await fetch("/api/cart/add_product_cart.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
  } else {
    null;
  }

  // Recupera carrinho oficial do backend
  let request = await fetch("/api/cart/get_products_cart.php");
  let response = await request.json();

  itens_localStorage ? localStorage.removeItem("cart") : null;

  let cart = JSON.parse(response).orders;

  localStorage.setItem("cart", JSON.stringify(cart));

  console.log(localStorage.getItem("cart"));
}

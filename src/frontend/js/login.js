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


export async function initLogin() {
  const login = document.getElementById('login');
  const btnRecuperarSenha = document.getElementById('recuperar-senha');
  btnRecuperarSenha.addEventListener('click', async () => {
    criarCampoDeSolicitarCodigo(login);
  })

  function criarCampoDeSolicitarCodigo(div) {
    div.innerHTML = ''
    div.innerHTML = `
      <h2>Recuperar Senha</h2>
      <form id="recuperar-password-form">
        <label for="email">Email:</label>
        <input type="email" id="email" required>
        
        <button type="submit" id="solicitar-codigo">Solicitar Código</button>
        <br> <br>
        <button type="button" id="voltar">Voltar</button>
      </form>`

    let voltar = document.getElementById(`voltar`);
    voltar.addEventListener('click', (e) => {
      location.reload();
    })

    let recuperarPasswordForm = document.getElementById('recuperar-password-form')
    recuperarPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let email = document.getElementById('email').value
      let body = {
        'email': email
      };
      let request = await fetch('api/login/request_recover_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      let response = await request.json();

      if (response.success == true) {
        alert('Solicitação bem sucedida!');
        escreverNovaSenha(div);
      } else {
        alert('Usuário não cadastrado ou email inválido.');
      }

    })
  }

  function escreverNovaSenha(div) {
    div.innerHTML = '';
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
      </form>`

    let voltar = document.getElementById(`voltar`);
    voltar.addEventListener('click', () => {
      criarCampoDeSolicitarCodigo(div);
    })

    let recuperarPasswordForm = document.getElementById('recuperar-password-form')
    recuperarPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let email = document.getElementById('email').value;
      let code = document.getElementById('code').value;
      let password = document.getElementById('password').value;

      let body = {
        'email': email,
        'code': code,
        'password': password,
      };

      let request = await fetch('api/login/recover_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      let response = await request.json();

      if (response.success == true) {
        alert('Senha recuperada com sucesso!');
        alert('Bora fazer login.');
        location.reload();
      } else {
        alert('Falha! Verifique se o email ou código estão corretos.');
      }
    })
  }

  const form = document.getElementById('login-form');
  if (!form) return; // Evita erro se função rodar fora da página de login

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const data = {
      'username': email,
      'password': password,
    };

    // Envia credenciais para API PHP de autenticação
    const request = await fetch('/api/login/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const response = await request.json();
    console.log(response);

    if (response.success === true) {
      // Armazena informações essenciais do usuário para persistência de sessão
      const role = response.role;
      const name = response.name;
      localStorage.setItem('user', JSON.stringify({ name, email, role }))

      if (response.email_validate == false) {
        let div = document.getElementById('login');
        let confirm = window.confirm('Você deseja validar seu email?');
        if (confirm) {
          criarCampoDeValidarEmail(div);
        } else {
          alert('Você não poderá recuperar a senha se esquecer ela, mas poderá validar em outro momento.');
          let confirm = window.confirm('Tem certeza que vai deixar para outro momento?');
          if (!confirm) {
            criarCampoDeValidarEmail(div);
          } else {
            window.location.hash = '#home';
            window.location.reload();
          }
        }
      } else {
        window.location.hash = '#home';
        window.location.reload();
      }
    } else {
      alert('Email ou senha incorretos.');
    }

  })

  function criarCampoDeValidarEmail(div) {
    div.innerHTML = ''
    div.innerHTML = `
      <h2>Validação de email</h2>
      <form id="validate-email-form">
        <label for="email">Email:</label>
        <input type="email" id="email" required>

        <label for="code">Código de validação:</label>
        <input type="text" id="code" required>

        <button type="submit">Validar</button>
      </form>`

    let validateEmailForm = document.getElementById('validate-email-form')
    validateEmailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let email = document.getElementById('email').value;
      let code = document.getElementById('code').value;

      let body = {
        'email': email,
        'code': code,
      };

      let request = await fetch('/api/login/validate_email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      let response = await request.json();

      if (response.success == true) {
        alert('Email verificado com sucesso!')
        window.location.hash = '#home';
        window.location.reload();

      } else {
        alert('Código ou email inválidos.')
      }
    })
  }

}

export default function registerPage() {
  return `
    <section class="register">
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

export async function initRegister() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const data = {
      'name': name,
      'email': email,
      'password': password
    };

    console.log("data");

    const request = await fetch('/api/login/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const response = await request.json();

    if (response.success === true) {
      let div = document.getElementById('register');
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
      alert('Email já cadastrado.');
    }
  });

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

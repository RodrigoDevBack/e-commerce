export default function loginPage() {
  return `
    <section class="login">
      <h2>Login</h2>
      <form id="login-form">
        <label for="email">Email:</label>
        <input type="email" id="email" required>
        
        <label for="password">Senha:</label>
        <input type="password" id="password" required>
        
        <button type="submit">Entrar</button>
      </form>
    </section>
  `;
}

export async function initLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const data = {
      'username': email,
      'password': password
    };


    const request = await fetch('https://www.minhalojaminhavida.singlotown.com.br/api/login/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const response = await request.json();
    console.log(response);

    if (response.success === true) {
      const role = response.role;
      const name = response.name;
      localStorage.setItem('user', JSON.stringify({ name, email, role }))
      window.location.hash = '#home';
      window.location.reload();
    } else {
      alert('Email ou senha incorretos.');
    }

  })
}

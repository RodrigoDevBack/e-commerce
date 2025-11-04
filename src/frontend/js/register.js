export default function registerPage() {
  return `
    <section class="register">
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

    const request = await fetch('http://127.0.0.1:8000/api/login/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const response = await request.json();

    if (response.success === true) {
      window.location.hash = '#home';
      window.location.reload();
    } else {
      alert('Email já cadastrado.');
    }
  });
}

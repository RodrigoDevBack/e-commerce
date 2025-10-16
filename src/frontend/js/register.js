// Usuários fictícios (inicialmente os mesmos do login)
const users = JSON.parse(localStorage.getItem('users')) || [
  { email: 'admin@teste.com', password: 'admin', role: 'admin', name: 'Administrador' },
  { email: 'user@teste.com', password: 'user', role: 'user', name: 'Cliente' }
];

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

// Script para tratar cadastro fake
export function initRegister() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Verifica se usuário já existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      alert('Este email já está cadastrado!');
      return;
    }

    // Cria novo usuário
    const newUser = { name, email, password, role: 'user' };
    users.push(newUser);

    // Salva todos usuários no localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Salva sessão do usuário logado
    localStorage.setItem('user', JSON.stringify(newUser));

    // Redireciona para home
    window.location.hash = '#home';
    window.location.reload();
  });
}

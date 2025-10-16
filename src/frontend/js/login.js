// Usuários fictícios
const users = [
  { email: 'admin@teste.com', password: 'admin', role: 'admin', name: 'Administrador' },
  { email: 'user@teste.com', password: 'user', role: 'user', name: 'Cliente' }
];

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

// Script para tratar login fake
export function initLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = email.split('@')[0]; // só pra simular nome
    
    // Definir role
    const role = email === 'admin@teste.com' ? 'admin' : 'user';

    // Salvar no localStorage
    localStorage.setItem('user', JSON.stringify({ name, email, role }));

    // Redirecionar para home
    window.location.hash = '#home';
    window.location.reload(); // força recarregar menu atualizado
  });
}
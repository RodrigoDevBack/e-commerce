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

/**
 * Inicializa a lógica de autenticação na página de login.
 * 
 * Fluxo:
 * - Captura o submit do formulário
 * - Envia credenciais para a API
 * - Lida com resposta (sucesso / erro)
 * 
 * Efeitos colaterais:
 * - Em caso de sucesso, salva dados no localStorage
 * - Redireciona o usuário para a home via hash e recarrega SPA
 * 
 * Observação técnica:
 * - O form só existe quando a página de login está montada no DOM,
 *   por isso verificamos sua existência antes de adicionar o listener.
 */
export async function initLogin() {
  const form = document.getElementById('login-form');
  if (!form) return; // Evita erro se função rodar fora da página de login

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const data = {
      'username': email,
      'password': password
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

      localStorage.setItem('user', JSON.stringify({ name, email, role }));

      // Redireciona e recarrega a SPA para atualizar interface
      window.location.hash = '#home';
      window.location.reload();
    } else {
      alert('Email ou senha incorretos.');
    }
  });
}

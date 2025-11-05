/**
 * Retorna o HTML da página de cadastro.
 * @returns {string} Estrutura HTML da seção de registro
 */
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

/**
 * Inicializa a lógica de cadastro de usuário.
 * - Captura valores do formulário
 * - Envia requisição POST para a API
 * - Redireciona ou exibe mensagem de erro
 */
export async function initRegister() {
  const form = document.getElementById('register-form');
  if (!form) return; // Sai se o formulário não estiver na página

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevê recarregamento padrão

    // Captura dados do formulário e remove espaços extras
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const response = await request.json();

    // Verifica resposta da API
    if (response.success === true) {
      // Redireciona para home após sucesso
      window.location.hash = '#home';
      window.location.reload();
    } else {
      // Mostra alerta caso email já exista
      alert('Email já cadastrado.');
    }
  });
}

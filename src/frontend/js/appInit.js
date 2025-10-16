// appInit.js

// Inicializa eventos globais do app
export function initApp(router) {
  // Executa o roteamento ao carregar a página
  window.addEventListener('load', router);

  // Atualiza o roteamento ao mudar o hash
  window.addEventListener('hashchange', router);

  // Atualiza o ano do footer dinamicamente
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
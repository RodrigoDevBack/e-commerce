// appInit.js

/**
 * Inicializa eventos globais da aplicação, como o roteamento
 * e atualizações automáticas de UI.
 */
export function initApp(router) {
  // Executa o roteamento na primeira carga da página
  window.addEventListener('load', router);

  // Reexecuta o roteamento quando o hash da URL muda
  window.addEventListener('hashchange', router);

  // Atualiza o ano exibido no footer, caso o elemento exista
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

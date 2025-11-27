// --------------------------- INICIALIZAÇÃO GLOBAL DA APLICAÇÃO ---------------------------

/**
 * Inicializa eventos globais da aplicação, como o roteamento
 * e atualizações automáticas de UI.
 * @param {Function} router - Função de roteamento da SPA
 */
export function initApp(router) {
  // --------------------------- ROTEAMENTO NA PRIMEIRA CARGA ---------------------------
  // Executa o roteamento quando a página é carregada pela primeira vez
  window.addEventListener("load", router);

  // --------------------------- ROTEAMENTO EM MUDANÇA DE HASH ---------------------------
  // Reexecuta o roteamento sempre que o hash da URL mudar
  window.addEventListener("hashchange", router);

  // --------------------------- ATUALIZAÇÃO DO ANO NO FOOTER ---------------------------
  // Atualiza o ano exibido no elemento footer, se existir
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

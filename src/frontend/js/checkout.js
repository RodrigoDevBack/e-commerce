/**
 * Renderiza a página de checkout.
 * 
 * Responsabilidade:
 * - Ler itens do carrinho armazenado no localStorage
 * - Exibir formulário de informações do comprador
 * - Mostrar lista de produtos e total da compra
 * 
 * Observação:
 * A lógica final de compra e limpeza do carrinho acontece
 * no router (submit do form), mantendo esta função focada em UI.
 */
export default function checkoutPage() {
  // Recupera itens do carrinho; retorna array vazio se não existir
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Monta a lista em HTML com itens do carrinho
  let cartItemsHTML = '';
  cart.forEach(item => {
    const qtd = item.qtd || 1; // garante que tenha pelo menos 1
    const subtotal = item.price * qtd;

    cartItemsHTML += `
  <li class="checkout-item">
    ${item.thumbHTML}
    <div class="checkout-item-info">
      <span class="checkout-item-name">${item.name}</span>
      <span class="checkout-item-qtd">x${item.qtd}</span>
      <span class="checkout-item-price">R$ ${(item.price * item.qtd).toFixed(2)}</span>
    </div>
  </li>
`;

  });

  // Calcula total da compra
  const total = cart.reduce((sum, item) => sum + item.price * (item.qtd || 1), 0);

  // Retorna HTML da página
  return `
    <section class="checkout">
      <h2>Checkout</h2>

      <!-- Formulário de dados do comprador -->
      <form id="checkout-form">
        <div class="form-group">
          <label for="name">Nome Completo:</label>
          <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
          <label for="address">Endereço:</label>
          <input type="text" id="address" name="address" required>
        </div>

        <div class="form-group">
          <label for="payment">Método de Pagamento:</label>
          <select id="payment" name="payment" required>
            <option value="">Selecione</option>
            <option value="credit-card">Cartão de Crédito</option>
            <option value="paypal">PayPal</option>
            <option value="boleto">Boleto Bancário</option>
          </select>
        </div>

        <button type="submit" id="finalize-checkout-btn">Concluir Compra</button>
      </form>

      <!-- Resumo do carrinho -->
      <aside class="checkout-cart">
        <h3>Resumo do Carrinho</h3>

        <ul class="checkout-list">
          ${cartItemsHTML || '<li>Seu carrinho está vazio.</li>'}
        </ul>

        <p class="checkout-total">Total: <strong>R$ ${total.toFixed(2)}</strong></p>
      </aside>
    </section>
  `;
}
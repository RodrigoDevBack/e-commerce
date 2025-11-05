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
    cartItemsHTML += `
      <li>
        ${item.thumbHTML}
        <span>${item.name}</span> - R$ ${item.price.toFixed(2)}
      </li>
    `;
  });

  // Calcula total da compra
  const total = cart.reduce((sum, item) => sum + item.price, 0);

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

      <!-- Resumo do carrinho ao lado -->
      <aside class="checkout-cart">
        <h3>Carrinho</h3>

        <ul>
          ${cartItemsHTML}
        </ul>

        <p>Total: R$ ${total.toFixed(2)}</p>
      </aside>
    </section>
  `;
}

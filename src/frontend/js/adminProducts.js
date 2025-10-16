// produtosAdmin.js
export default function adminProductsPage() {
  // Lê produtos do localStorage ou cria lista inicial
  const products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: 'Produto A', price: 19.9 },
    { id: 2, name: 'Produto B', price: 49.9 }
  ];

  let productsHTML = products.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>R$ ${p.price.toFixed(2)}</td>
      <td>
        <button class="btn-edit" data-id="${p.id}">Editar</button>
        <button class="btn-delete" data-id="${p.id}">Excluir</button>
      </td>
    </tr>
  `).join('');

  return `
    <section class="admin-products">
      <h2>Gerenciar Produtos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${productsHTML}
        </tbody>
      </table>
      <button id="add-product-btn">Adicionar Produto</button>
    </section>
  `;
}

// Script para manipular produtos fake
export function initAdminProducts() {
  const table = document.querySelector('.admin-products tbody');
  if (!table) return;

  // Delegação de eventos para editar/excluir
  table.addEventListener('click', e => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const id = parseInt(e.target.dataset.id);

    if (e.target.classList.contains('delete-btn')) {
      const filtered = products.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(filtered));
      window.location.reload(); // atualiza a página
    }

    if (e.target.classList.contains('edit-btn')) {
      const newName = prompt('Novo nome do produto:');
      const newPrice = parseFloat(prompt('Novo preço:'));
      const product = products.find(p => p.id === id);
      if (product) {
        product.name = newName || product.name;
        product.price = isNaN(newPrice) ? product.price : newPrice;
      }
      localStorage.setItem('products', JSON.stringify(products));
      window.location.reload();
    }
  });

  // Botão adicionar produto
  const addBtn = document.getElementById('add-product-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const products = JSON.parse(localStorage.getItem('products')) || [];
      const newName = prompt('Nome do produto:');
      const newPrice = parseFloat(prompt('Preço:'));
      const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
      if (newName && !isNaN(newPrice)) {
        products.push({ id: newId, name: newName, price: newPrice });
        localStorage.setItem('products', JSON.stringify(products));
        window.location.reload();
      }
    });
  }
}
// O código abaixo é um exemplo de como a lista de produtos pode ser renderizada
// e como o filtro pode ser implementado. Ele não faz parte do arquivo adminProducts.js

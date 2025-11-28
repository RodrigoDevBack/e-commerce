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
 *
 * @returns {string} HTML da página de checkout
 */
export default function checkoutPage() {
  // --------------------------- RECUPERAÇÃO DO CARRINHO ---------------------------
  // Recupera itens do carrinho; retorna array vazio se não existir
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // --------------------------- MONTAGEM DOS ITENS DO CARRINHO ---------------------------
  // Monta a lista em HTML com itens do carrinho
  let cartItemsHTML = "";
  cart.forEach((item) => {
    const qtd = item.qtd || 1; // garante que tenha pelo menos 1

    // Determina o preço (pode vir de diferentes origens dependendo da estrutura interna)
    const price = item.unity_price || item.product?.price || item.price || 0;
    const subtotal = price * qtd;

    // Extrai o nome do produto — fallback necessário para evitar quebra caso falte dado
    const productName = item.product?.name || item.name || "Produto sem nome";

    // Extrai a imagem do produto — fallback para ícone padrão se não existir
    let thumbHTML = "";
    if (item.product?.images && item.product.images.length > 0) {
      thumbHTML = `<img src="http://localhost:5000/images_products/${item.product.name}/${item.product.images[0]}" alt="${productName}" class="checkout-item-thumb">`;
    } else {
      thumbHTML = `<img src="https://img.icons8.com/color/96/no-image.png" alt="${productName}" class="checkout-item-thumb">`;
    }

    cartItemsHTML += `
  <li class="checkout-item">
    ${thumbHTML}
    <div class="checkout-item-info">
      <span class="checkout-item-name">${productName}</span>
      <span class="checkout-item-qtd">x${qtd}</span>
      <span class="checkout-item-price">R$ ${subtotal.toFixed(2)}</span>
    </div>
  </li>
`;
  });

  // --------------------------- CÁLCULO DO TOTAL ---------------------------
  // Soma total dos itens — reduzindo com fallback de quantidade e preço
  const total = cart.reduce((sum, item) => {
    const price = item.unity_price || item.product?.price || item.price || 0;
    return sum + price * (item.qtd || 1);
  }, 0);

  // --------------------------- RETORNO DA PÁGINA DE CHECKOUT ---------------------------
  // Retorna HTML da página exatamente como está — NÃO modificar template string
  return `
    <section class="checkout">
      <h2>Checkout</h2>

      <!-- Formulário de dados do comprador -->
      <form id="checkout-form">
      <!-- <div class="form-group">
          <label for="name">Nome Completo:</label>
          <input type="text" id="name" name="name" required>
        </div> -->

        <div id="address"></div>

        <!-- <div class="form-group">
          <label for="payment">Método de Pagamento:</label>
          <select id="payment" name="payment" required>
            <option value="">Selecione</option>
            <option value="credit-card">Cartão de Crédito</option>
            <option value="paypal">PayPal</option>
            <option value="boleto">Boleto Bancário</option>
          </select>
        </div> -->

        <div class="checkout-buttons">
          <button type="button" id="save-address-btn">Cadastrar Endereço</button>
          <button type="submit" id="finalize-checkout-btn">Concluir Compra</button>
        </div>
      </form>

      <!-- Resumo do carrinho -->
      <aside class="checkout-cart">
        <h3>Resumo do Carrinho</h3>

        <ul class="checkout-list">
          ${cartItemsHTML || "<li>Seu carrinho está vazio.</li>"}
        </ul>

        <p class="checkout-total">Total: <strong>R$ ${total.toFixed(
          2
        )}</strong></p>
      </aside>
    </section>
  `;
}

/**
 * Inicializa interações da página de checkout.
 * Responsabilidades:
 * - Buscar endereço salvo no backend
 * - Renderizar formulário de endereço ou exibir endereço existente
 * - Cadastrar endereço via API
 * - Finalizar compra e enviar pedido ao backend
 *
 * @returns {Promise<void>}
 */
export async function initCheckout() {
  // --------------------------- BUSCA DE ENDEREÇO NO BACKEND ---------------------------
  let request = await fetch("/api/address/get.php", {
    credentials: "same-origin",
  });
  let response = await request.json();

  const saveAddressBtn = document.getElementById("save-address-btn");
  const finalizeBtnEl = document.getElementById("finalize-checkout-btn");

  // If backend returned an address (HTTP 200) the proxy echoes the address object.
  // The proxy returns { success: false } when no address exists (non-200 path).
  if (response.success == false) {
    // --------------------------- FORMULÁRIO DE NOVO ENDEREÇO ---------------------------
    const address = document.getElementById("address");
    const element = document.createElement("div");
    element.classList.add("form-group");
    element.innerHTML = ` <label for="address">CEP:</label>
          <input type="text" id="cep" name="cep" required>

          <label for="address">Logradouro:</label>
          <input type="text" id="logradouro" name="logradouro" required>

          <label for="address">Numero:</label>
          <input type="text" id="numero" name="numero" required>

          <label for="address">Complemento:</label>
          <input type="text" id="complemento" name="complemento">

          <label for="address">Bairro:</label>
          <input type="text" id="bairro" name="bairro" required>

          <label for="address">Cidade:</label>
          <input type="text" id="cidade" name="cidade" required>

          <label for="address">Estado:</label>
          <input type="text" id="estado" name="estado" required>`;

    // Listener de CEP — consulta automática
    const cep = element.querySelector("#cep");
    cep.addEventListener("change", () => {
      pesquisacep(cep.value);
    });

    function limpa_formulário_cep() {
      // Limpa valores do formulário de CEP
      element.querySelector("#logradouro").value = "";
      element.querySelector("#bairro").value = "";
      element.querySelector("#cidade").value = "";
      element.querySelector("#estado").value = "";
    }

    function meu_callback(conteudo) {
      if (!("erro" in conteudo)) {
        // Preenche campos com dados retornados da API ViaCEP
        element.querySelector("#logradouro").value = conteudo.logradouro;
        element.querySelector("#bairro").value = conteudo.bairro;
        element.querySelector("#cidade").value = conteudo.localidade;
        element.querySelector("#estado").value = conteudo.estado;
      } else {
        // Caso CEP inválido ou inexistente
        limpa_formulário_cep();
        alert("CEP não encontrado.");
      }
    }

    async function pesquisacep(valor) {
      // Nova variável "cep" somente com dígitos
      var cep = valor.replace(/\D/g, "");

      if (cep != "") {
        var validacep = /^[0-9]{8}$/;

        if (validacep.test(cep)) {
          // Preenche com "..." enquanto consulta ViaCEP
          element.querySelector("#logradouro").value = "...";
          element.querySelector("#bairro").value = "...";
          element.querySelector("#cidade").value = "...";
          element.querySelector("#estado").value = "...";

          let request = await fetch(
            "https://viacep.com.br/ws/" + cep + "/json/"
          );
          let response = await request.json();
          meu_callback(response);
        } else {
          limpa_formulário_cep();
          alert("Formato de CEP inválido.");
        }
      } else {
        limpa_formulário_cep();
      }
    }

    address.appendChild(element);

    // --------------------------- BOTÃO "CADASTRAR ENDEREÇO" ---------------------------
    if (saveAddressBtn) {
      // Copia estilo visual — tentativa segura pois finalizeBtn pode não existir
      try {
        if (finalizeBtnEl) saveAddressBtn.className = finalizeBtnEl.className;
      } catch (e) {}

      saveAddressBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        // Coleta dados diretamente dos inputs criados dinamicamente
        let addressData = {
          CEP: element.querySelector("#cep").value,
          Logradouro: element.querySelector("#logradouro").value,
          Numero: element.querySelector("#numero").value,
          Complemento: element.querySelector("#complemento").value || "",
          Bairro: element.querySelector("#bairro").value,
          Cidade: element.querySelector("#cidade").value,
          Estado: element.querySelector("#estado").value,
        };

        let response = await fetch("/api/address/create.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressData),
        });

        let result = await response.json();
        if (result.success) {
          alert("Endereço salvo com sucesso!");
          // Oculta botão após salvamento bem-sucedido
          try {
            saveAddressBtn.style.display = "none";
          } catch (e) {}
        } else {
          alert("Erro ao salvar endereço.");
        }
      });
    }
  } else {
    // --------------------------- ENDEREÇO EXISTENTE ---------------------------
    const addressDiv = document.getElementById("address");
    if (addressDiv) {
      addressDiv.innerHTML = `
        <div class="saved-address">
          <p><strong>Endereço cadastrado:</strong></p>
          <p>${response.Logradouro}, ${response.Numero} ${
        response.Complemento ? "- " + response.Complemento : ""
      }</p>
          <p>${response.Bairro} - ${response.Cidade}/${response.Estado}</p>
          <p>CEP: ${response.CEP}</p>
        </div>`;
    }

    if (saveAddressBtn) {
      try {
        saveAddressBtn.style.display = "none";
        if (finalizeBtnEl) saveAddressBtn.className = finalizeBtnEl.className;
      } catch (e) {}
    }
  }

  // --------------------------- FINALIZAÇÃO DO PEDIDO ---------------------------
  const checkoutForm = document.getElementById("checkout-form");

  if (finalizeBtnEl && checkoutForm) {
    checkoutForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        // Envia o pedido ao backend
        let orderRequest = await fetch("/api/cart/order_product_cart.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        let orderResponse = await orderRequest.json();

        if (orderResponse.success === false || !orderRequest.ok) {
          alert("Erro ao finalizar a compra. Tente novamente.");
          return;
        }

        // Limpa carrinho local — mantém consistência após compra
        localStorage.removeItem("cart");
        if (window.cart) window.cart.length = 0;

        // Renderiza tela de sucesso
        const app = document.getElementById("app");
        app.innerHTML = `
          <section class="checkout-success">
            <h2>Compra Concluída!</h2>
            <p>Obrigado por comprar conosco!</p>
            <p>Seu pedido foi registrado com sucesso.</p>
            <button id="back-home-btn">Voltar para Home</button>
          </section>
        `;

        document
          .getElementById("back-home-btn")
          .addEventListener("click", () => {
            window.location.hash = "#home";
          });
      } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao processar a compra. Tente novamente.");
      }
    });
  }
}

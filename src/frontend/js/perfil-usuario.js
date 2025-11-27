/**
 * Inicializa o offcanvas de perfil do usuário.
 * Cria dinamicamente a interface do perfil apenas caso ainda não exista
 * e carrega dados adicionais (endereços, histórico, validação de email).
 * @async
 * @function initPerfilUsuario
 * @param {Object} userData - Dados do usuário logado.
 * @returns {Promise<void>}
 */
export default async function initPerfilUsuario(userData) {
  // Evita duplicar o offcanvas quando trocam de rota rapidamente
  if (document.getElementById("offcanvasPerfil")) return;

  // Remove instâncias antigas caso algum fluxo tenha duplicado o componente
  let existingOffcanvas = document.getElementById("offcanvasPerfil");
  if (existingOffcanvas) {
    existingOffcanvas.remove();
  }

  if (userData) {
    // Obtém endereço do usuário antes de renderizar UI
    let addressRequest = await fetch("/api/address/get.php");
    let addressResponse = await addressRequest.json();

    // Monta o HTML do offcanvas — inserção direta no body evita conflito com layout do header
    const offcanvasHTML = `
      <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasPerfil"
        aria-labelledby="offcanvasTitlePerfil">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasTitlePerfil">Perfil</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div id="info-perfil">
                <!-- Informações carregadas dinamicamente -->
                <p>Nome: ${userData.name}</p>
                <p>Email: ${userData.email}</p>
                <p>Função: ${userData.role}</p>
            </div> <br>
            <hr>
            <h3> Validação de Email </h3> <br>
            <div id="campo-validar-email"></div> <br>
            <hr>
            <h3> Histórico de Compras </h3> <br>
            <div id="hitorico-pedidos-perfil"> 
            <form id="ver-history">
              <button type="sumbit" class="btn btn-primary" id="openHistory" data-bs-toggle="modal" data-bs-target="#modelHistory">
                Ver Histórico
              </button>
            </form>
              <br>
            </div> <br>
            <hr>
            <h3> Endereço </h3> <br>
            <div id="endereco-perfil"> </div> <br>

        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", offcanvasHTML);

    // Componentes dinâmicos do perfil
    criarCampoDeValidarEmail(); // Campo depende do estado do usuário
    carregarHistoricoPedidos(); // Aciona modal de histórico
    carregarEnderecoPerfil(addressResponse); // Carrega endereço ou formulário
  }
}

/**
 * Cria modal e interface para exibição do histórico de pedidos.
 * Ativado ao clicar no botão "Ver Histórico".
 * @async
 * @function carregarHistoricoPedidos
 * @returns {Promise<void>}
 */
async function carregarHistoricoPedidos() {
  const form = document.getElementById("ver-history");

  // Listener preventDefault é essencial para evitar reload do formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtém histórico atualizado a cada clique
    var historyRequest = await fetch("/api/history/get.php");
    var historyResponse = await historyRequest.json();

    // Cria modal dinamicamente a cada abertura (estrutura reutilizável pelo Bootstrap)
    const elementModal = document.createElement("div");
    elementModal.innerHTML = `
  <div class="modal fade" id="modelHistory" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="4" aria-labelledby="staticBackdropLabel1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel1">Histórico</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="body">
        ${
          historyResponse.success === false
            ? "<br><h2> Histórico vazio </h2><br>"
            : gerarHistoricoHTML(historyResponse)
        }
        </div>
      </div>
    </div>
  </div>`;

    /**
     * Formata datas no padrão brasileiro.
     * @param {string} dateStr - Data no formato timestamp/string.
     * @returns {string}
     */
    function formatDateTime(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    /**
     * Gera blocos HTML com pedidos e seus itens.
     * @param {Object} json - JSON retornado da API.
     * @returns {string} HTML pronto
     */
    function gerarHistoricoHTML(json) {
      let html = "";

      json.orders.forEach((order) => {
        const dataFormatada = formatDateTime(order.created_at);

        html += `
      <div class="order-block" style="border:1px solid #ddd; padding:10px; margin-bottom:15px; border-radius:8px;">
        <h5>Compra em ${dataFormatada}</h5>
    `;

        order.items.forEach((item) => {
          html += `
        <div class="item" style="padding:8px; border-bottom:1px solid #eee;">
          <p><strong>${item.product.name}</strong></p>
          <p>Qtd: ${item.qtd}</p>
          <p>Preço unitário: R$ ${item.unity_price.toFixed(2)}</p>
        </div>
      `;
        });

        html += `
      <p class="order-total mt-2"><strong>Total: R$ ${order.total.toFixed(
        2
      )}</strong></p>
    </div>`;
      });

      return html;
    }

    // Modal é adicionado ao body pois o Bootstrap exige que modais fiquem no topo da hierarquia visual
    document.body.appendChild(elementModal);
  });
}

/**
 * Gerencia toda a lógica de exibição/edição do endereço cadastrado.
 * Cria o formulário de cadastro caso não exista um endereço.
 * @async
 * @function carregarEnderecoPerfil
 * @param {Object} response - Resposta da API contendo endereço ou erro.
 * @returns {Promise<void>}
 */
async function carregarEnderecoPerfil(response) {
  const enderecoDiv = document.getElementById("endereco-perfil");

  if (response.success == false) {
    // Bloco de aviso de ausência de endereço
    let element = document.createElement("div");
    element.innerHTML = `
      <hr>
      <h3>Sem endereço cadastrado</h3>
      <br>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modelAddressRegister">Cadastrar Endereço</button>
    `;
    enderecoDiv.appendChild(element);

    // Cria modal no DOM imediatamente
    let offCanva = document.createElement("div");
    offCanva.innerHTML = `
      <div class="modal fade" id="modelAddressRegister" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
          aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div class="modal-content">

                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="staticBackdropLabel">Cadastrar Endereço</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>

                  <div class="modal-body">
                  <form id="address-form">
                    <label class="form-label">CEP:</label>
                    <input type="text" class="form-control" id="cep" required> <br>
                    <label class="form-label">Rua:</label>
                    <input type="text" class="form-control" id="logradouro" required> <br>
                    <label class="form-label">Número:</label>
                    <input type="text" class="form-control" id="numero" required> <br>
                    <label class="form-label">Complemento:</label>
                    <input type="text" class="form-control" id="complemento"> <br>
                    <label class="form-label">Bairro:</label>
                    <input type="text" class="form-control" id="bairro" required> <br>
                    <label class="form-label">Cidade:</label>
                    <input type="text" class="form-control" id="cidade" required> <br>
                    <label class="form-label">Estado:</label>
                    <input type="text" class="form-control" id="estado" required> <br>
                  </form>
                  </div>

                  <div class="modal-footer justify-content-center">
                    <button type="submit" form="address-form" class="btn btn-primary" id="save-address">Salvar Endereço</button>
                  </div>

                </div>
          </div>
      </div>
    `;

    document.body.appendChild(offCanva);

    // Seleciona elementos dentro do modal já inserido
    const addressForm = document.getElementById("address-form");
    const saveAddressBtn = document.getElementById("save-address");
    const cepInput = document.getElementById("cep");

    cepInput.addEventListener("change", async () => {
      let cep = cepInput.value.replace(/\D/g, "");
      if (cep !== "" && /^[0-9]{8}$/.test(cep)) {
        document.getElementById("logradouro").value = "...";
        document.getElementById("bairro").value = "...";
        document.getElementById("cidade").value = "...";
        document.getElementById("estado").value = "...";

        let request = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        let resp = await request.json();

        if (!("erro" in resp)) {
          document.getElementById("logradouro").value = resp.logradouro;
          document.getElementById("bairro").value = resp.bairro;
          document.getElementById("cidade").value = resp.localidade;
          document.getElementById("estado").value = resp.uf;
        } else {
          document.getElementById("logradouro").value = "";
          document.getElementById("bairro").value = "";
          document.getElementById("cidade").value = "";
          document.getElementById("estado").value = "";
          alert("CEP não encontrado.");
        }
      } else {
        document.getElementById("logradouro").value = "";
        document.getElementById("bairro").value = "";
        document.getElementById("cidade").value = "";
        document.getElementById("estado").value = "";
        if (cep !== "") alert("Formato de CEP inválido.");
      }
    });

    saveAddressBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      let addressData = {
        CEP: document.getElementById("cep").value,
        Logradouro: document.getElementById("logradouro").value,
        Numero: document.getElementById("numero").value,
        Complemento: document.getElementById("complemento").value || "",
        Bairro: document.getElementById("bairro").value,
        Cidade: document.getElementById("cidade").value,
        Estado: document.getElementById("estado").value,
      };

      let request = await fetch("/api/address/create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });

      let result = await request.json();

      if (result.success) {
        alert("Endereço salvo com sucesso!");
        window.location.reload();
      } else {
        alert("Erro ao salvar endereço.");
      }
    });
  } else {
    // ENDEREÇO JÁ CADASTRADO
    let item = document.createElement("div");
    item.innerHTML = `
      <hr>
      <p><strong>Endereço cadastrado:</strong></p>
      <p>${response.Logradouro}, ${response.Numero} ${
      response.Complemento ? "- " + response.Complemento : ""
    }</p>
      <p>${response.Bairro} - ${response.Cidade}/${response.Estado}</p>
      <p>CEP: ${response.CEP}</p>
      <br>
      <form id="delete-address">
        <button type="submit" class="btn btn-outline-danger" style="background-color: red;" id="address-delete">Deletar</button>
      </form>
    `;

    item
      .querySelector("#delete-address")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        let request = await fetch("/api/address/delete.php");
        let resp = await request.json();

        if (resp.success) {
          alert("Endereço deletado.");
          window.location.reload();
        } else {
          alert("Falha ao tentar deletar o endereço.");
        }
      });

    enderecoDiv.appendChild(item);
  }
}

/**
 * Cria o campo de validação de email caso o usuário ainda não esteja validado.
 * Envia código + email para a API.
 * @function criarCampoDeValidarEmail
 * @returns {void}
 */
function criarCampoDeValidarEmail() {
  const div = document.getElementById("campo-validar-email");

  // Obtém dados do usuário atual do localStorage
  let userData = JSON.parse(localStorage.getItem("user"));

  if (userData.email_validate == false) {
    // Renderiza formulário somente quando realmente necessário
    const campoHTML = document.createElement("div");
    campoHTML.innerHTML = `
    <form id="validate-email-form">
      <label for="email" class="form-label">Email:</label> <br>
      <input type="email" class="form-control" id="email" required> <br>
      <label for="code" class="form-label">Código de validação:</label> <br>
      <input type="text" class="form-control" id="code" required> <br>
      <button type="submit" class="btn btn-secondary">Validar</button> 
    </form>
  `;

    const validateEmailForm = campoHTML.querySelector("#validate-email-form");

    validateEmailForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = campoHTML.querySelector("#email").value;
      const code = campoHTML.querySelector("#code").value;

      const body = { email, code };

      // Envia para API de validação
      const request = await fetch("/api/login/validate_email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const response = await request.json();

      if (response.success == true) {
        alert("Email verificado com sucesso!");
        window.location.hash = "#home";
        window.location.reload();

        userData.email_validate = true;
        localStorage.setItem("user", JSON.stringify(userData));

        div.innerHTML = "<hr><p>Seu email já foi validado.</p>";
      } else {
        alert("Código ou email inválidos.");
      }
    });

    div.appendChild(campoHTML);
  } else {
    div.innerHTML = "<p>Seu email já foi validado.</p>";
  }
}

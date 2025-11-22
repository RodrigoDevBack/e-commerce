let element = document.createElement('div');
    element.innerHTML = `
      <p>Nenhum endereço cadastrado.</p>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modelAddressRegister">
        Cadastrar Endereço
      </button>
    `;

    // Modal HTML
    element.querySelector('button').addEventListener('click', () => {
      setTimeout(() => {
        const modalBody = document.querySelector('#modelAddressRegister .modal-body');
        const modalFooter = document.querySelector('#modelAddressRegister .modal-footer');
        modalBody.innerHTML = `
          <form id="address-form">
            <label for="street">Rua:</label><br>
            <input type="text" id="street" name="street" required><br>
            <label for="number">Número:</label><br>
            <input type="text" id="number" name="number" required><br>
            <label for="city">Cidade:</label><br>
            <input type="text" id="city" name="city" required><br>
            <label for="state">Estado:</label><br>
            <input type="text" id="state" name="state" required><br>
            <label for="zip">CEP:</label><br>
            <input type="text" id="zip" name="zip" required><br><br>
          </form>
        `;
        modalFooter.innerHTML = `
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
          <button type="submit" form="address-form" class="btn btn-primary">Salvar Endereço</button>
        `;

        const addressForm = document.getElementById('address-form');
        addressForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(addressForm);
          const addressData = {
            street: formData.get('street'),
            number: formData.get('number'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip'),
          };
          const response = await fetch('/api/address/create.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(addressData),
          });
          const result = await response.json();

          if (result.success) {
            alert('Endereço cadastrado com sucesso!');
            userData.address = addressData;
            localStorage.setItem('user', JSON.stringify(userData));
            window.location.reload();
          } else {
            alert('Erro ao cadastrar endereço. Tente novamente.');
          }
        });
      }, 100);
    });
    bootstrap.Modal.getOrCreateInstance(modalHTML).show();
    enderecoDiv.appendChild(element);
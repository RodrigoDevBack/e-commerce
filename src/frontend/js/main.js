import homePage, { initHomePage } from './home.js';
import produtosPage, { initProductsList } from './produtos.js';
import loginPage, { initLogin } from './login.js';
import checkoutPage from './checkout.js';
import cadastroPage, { initRegister } from './register.js';
import adminProductsPage, { initAdminProducts } from './adminProducts.js';
import { initApp } from './appInit.js';
import { initCheckout } from './checkout.js';

/** Elementos principais da aplicação SPA */
const app = document.getElementById('app');
const navLinks = document.querySelectorAll('.nav-link');

/**
 * Define o link de navegação ativo baseado no hash da URL
 * @param {string} hash - Hash atual da URL
 */
function setActiveLink(hash) {
  navLinks.forEach(link => {
    if (link.getAttribute('href') === hash) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Router simples baseado em hash
 * Renderiza a página correspondente e inicializa scripts específicos
 */
function router() {
  const hash = window.location.hash || '#home';
  setActiveLink(hash);
  let pageContent = '';

  switch (hash) {
    case '#home':
      pageContent = homePage();
      app.innerHTML = pageContent;
      initHomePage();
      break;

    case '#produtos':
      pageContent = produtosPage();
      app.innerHTML = pageContent;
      initProductsList();
      break;

    case '#login':
      pageContent = loginPage();
      app.innerHTML = pageContent;
      initLogin();
      break;

    case '#checkout':
      pageContent = checkoutPage();
      app.innerHTML = pageContent;
      initCheckout();
      break;

    case '#admin':
      pageContent = adminProductsPage();
      app.innerHTML = pageContent;
      initAdminProducts(app);
      break;

    case '#register':
      pageContent = cadastroPage();
      app.innerHTML = pageContent;
      initRegister();
      break;

    default:
      pageContent = '<h2>Página não encontrada</h2>';
  }

}

/**
 * Atualiza o menu de navegação com base no usuário logado
 */
function updateMenu() {
  const userData = JSON.parse(localStorage.getItem('user'));
  const navRight = document.querySelector('.main-nav-right');
  const registerLink = document.querySelector('.nav-link-cadastrar');

  if (userData) {
    initCart();
    // Usuário logado → mostra saudação e botão sair
    navRight.innerHTML = `
      <span class="user-btn">Olá, ${userData.name}</span>
      ${userData.role === 'admin' ? '<a href="#admin" class="nav-link">Gerenciar Produtos</a>' : ''}
      <button type='button' class="nav-link" data-bs-toggle="offcanvas" data-bs-target="#offcanvasPerfil" aria-controls="offcanvasPerfil">Ver Perfil</button>
      <button id="logout-btn" class="sair-btn">Sair</button>
      
      <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasPerfil"
        aria-labelledby="offcanvasTitlePerfil">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasTitlePerfil">Perfil</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div id="info-perfil">
                <!-- Informações do perfil serão carregadas aqui -->
                <p>Nome: ${userData.name}</p>
                <p>Email: ${userData.email}</p>
                <p>Função: ${userData.role}</p>
            </div>
        </div>
    </div>
    `;

    // Garante que o botão de cadastro some completamente
    if (registerLink) registerLink.style.display = 'none';
  } else {
    initCartLoggedOut();
    // Usuário deslogado → mostra login e garante que o cadastro reaparece
    navRight.innerHTML = `<a href="#login" class="nav-link">Login</a>`;
    if (registerLink) registerLink.style.display = '';
  }

  // Lida com o logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      window.cart = [];
      await fetch('api/login/logout.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      window.location.hash = '#home';
      window.location.reload();
      updateMenu(); // Atualiza o menu após logout
    });
  }
}


/** Inicializa o SPA e módulos principais */
initApp(router);
initCarousel();
initHomePage();
initProductsList();

/** Atualiza menu ao carregar a página e ao trocar rota */
window.addEventListener('load', updateMenu);
window.addEventListener('hashchange', updateMenu);

/**
 * Inicializa o carrossel de produtos
 */
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.carousel-btn.next');
  const prevButton = document.querySelector('.carousel-btn.prev');
  const slideWidth = slides[0].getBoundingClientRect().width;

  slides.forEach((slide, index) => {
    slide.style.left = slideWidth * index + 'px';
  });

  let currentIndex = 0;

  nextButton.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      track.style.transform = `translateX(-${slides[currentIndex].style.left})`;
    }
  });

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      track.style.transform = `translateX(-${slides[currentIndex].style.left})`;
    }
  });
}

/**
 * Inicializa o carrinho e gerencia lógica de adição/remover produtos
 */
function initCart() {
  let cartElement = document.getElementById('cart');
  let cartItemsElement = document.getElementById('cart-items');
  let cartTotalElement = document.getElementById('cart-total');
  let openCartBtn = document.getElementById('open-cart');
  let closeCartBtn = document.getElementById('close-cart');
  let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
  updateCart();
  if (!cartElement || !openCartBtn || !closeCartBtn) return;

  openCartBtn.addEventListener('click', () => cartElement.classList.add('open'));
  closeCartBtn.addEventListener('click', () => cartElement.classList.remove('open'));

  /**
   * Atualiza visualmente o carrinho
   */
  async function updateCart() {
    let request = await fetch('/api/cart/get_products_cart.php');
    let response = await request.json();
    let serverCart = JSON.parse(response).orders;
    localStorage.setItem('cart', JSON.stringify(serverCart));
    cart = serverCart;
    cartItemsElement.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
      let quantidade = item.qtd || 1;
      let subtotal = (item.unity_price) * quantidade;
      total += subtotal;

      // Extrai a imagem do produto
      let productName = item.product.name || item.name;
      let thumbHTML = '';
      if (item.product.images && item.product.images.length > 0) {
        thumbHTML = `<img src="http://api.singlotown.com.br/images_products/${item.product.name}/${item.product.images[0]}" alt="${productName}" class="cart-thumb">`;
      } else {
        thumbHTML = `<img src="https://img.icons8.com/color/96/no-image.png" alt="${productName}" class="cart-thumb">`;
      }

      let li = document.createElement('li');
      li.classList.add('cart-item');
      li.innerHTML = `
    ${thumbHTML}
    <div>
      <div class="cart-item-name">${productName} (x${quantidade})</div>
      <div class="cart-item-price">R$ ${subtotal.toFixed(2)}</div>
    </div>
  `;
      cartItemsElement.appendChild(li);
    });

    cartTotalElement.textContent = total.toFixed(2);
  }

  /**
   * Delegação de clique para adicionar produtos ao carrinho
   */
  document.addEventListener('click', async e => {
    if (e.target.classList.contains('add-to-cart') || e.target.classList.contains('card-add-to-cart')) {
      let card = e.target.closest('.product-card, .product-item');
      let name = card.querySelector('h3, h5').textContent;
      let priceText = card.querySelector('.product-price').textContent;
      let price = parseFloat(priceText.replace('R$', '').replace(',', '.'));
      let img = card.querySelector('img');
      let thumbHTML = img
        ? `<img src="${img.src}" alt="${name}" class="cart-thumb">`
        : card.querySelector('.thumb').innerHTML;

      updateCart();
      console.log(localStorage.getItem('cart'));
    }
  });
  /**
   * Limpa o carrinho completamente
   */
  const clearCartBtn = document.getElementById('clear-cart');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', async () => {
      cart.length = 0;
      localStorage.removeItem('cart');
      let request = await fetch('/api/cart/delete_cart.php');
      let response = await request.json();
      if (response.success) {
        alert('Carrinho limpo com sucesso!');
      } else { 
        alert('Erro ao limpar o carrinho.');
      }
      updateCart();
    });
  }
}


function initCartLoggedOut() {
  let cartElement = document.getElementById('cart');
  let cartItemsElement = document.getElementById('cart-items');
  let cartTotalElement = document.getElementById('cart-total');
  let openCartBtn = document.getElementById('open-cart');
  let closeCartBtn = document.getElementById('close-cart');
  let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
  updateCart();
  if (!cartElement || !openCartBtn || !closeCartBtn) return;

  /**
   * Atualiza visualmente o carrinho
   */
  function updateCart() {
    cartItemsElement.innerHTML = '';
    let total = 0;
    cartItemsElement.innerHTML = '';

    cart.forEach(item => {
      let quantidade = item.qtd || 1;
      let subtotal = item.price * quantidade;
      total += subtotal;

      let li = document.createElement('li');
      li.classList.add('cart-item');
      li.innerHTML = `
    ${item.thumbHTML}
    <div>
      <div class="cart-item-name">${item.name} (x${quantidade})</div>
      <div class="cart-item-price">R$ ${subtotal.toFixed(2)}</div>
    </div>
  `;
      cartItemsElement.appendChild(li);
    });

    cartTotalElement.textContent = total.toFixed(2);
  }

  openCartBtn.addEventListener('click', () => cartElement.classList.add('open'));
  closeCartBtn.addEventListener('click', () => cartElement.classList.remove('open'));

  /**
   * Delegação de clique para adicionar produtos ao carrinho
   */
  document.addEventListener('click', e => {
    if (e.target.classList.contains('add-to-cart') || e.target.classList.contains('card-add-to-cart')) {
      let card = e.target.closest('.product-card, .product-item');
      let name = card.querySelector('h3, h5').textContent;
      let id = e.target.value;
      let priceText = card.querySelector('.product-price').textContent;
      let price = parseFloat(priceText.replace('R$', '').replace(',', '.'));
      let img = card.querySelector('img');
      let thumbHTML = img
        ? `<img src="${img.src}" alt="${name}" class="cart-thumb">`
        : card.querySelector('.thumb').innerHTML;

      let existingItem = cart.find(item => item.name === name);

      if (existingItem) {
        existingItem.qtd = (existingItem.qtd || 1) + 1;
      } else {
        cart.push({ id, name, price, thumbHTML, qtd: 1 });
      }

      // Atualiza o localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    }
  });

  /**
   * Limpa o carrinho completamente
   */
  let clearCartBtn = document.getElementById('clear-cart');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      cart.length = 0;
      localStorage.removeItem('cart');
      updateCart();
    });
  }
}

/** Botão de redirecionamento para checkout */
const checkoutBtn = document.getElementById('checkout');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    // Se não estiver logado, manda para a página de login
    if (!user) {
      alert('Você precisa estar logado para finalizar o pedido.');
      window.location.hash = '#login';
      const cartElement = document.getElementById('cart');
      if (cartElement) cartElement.classList.remove('open');
      return;
    }

    // Se estiver logado, segue para o checkout normalmente
    window.location.hash = '#checkout';
    const cartElement = document.getElementById('cart');
    if (cartElement) cartElement.classList.remove('open');
  });
}

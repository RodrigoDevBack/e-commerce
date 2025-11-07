import homePage, { initHomePage } from './home.js';
import produtosPage, { initProductsList } from './produtos.js';
import loginPage, { initLogin } from './login.js';
import checkoutPage from './checkout.js';
import cadastroPage, { initRegister } from './register.js';
import adminProductsPage, { initAdminProducts } from './adminProducts.js';
import { initApp } from './appInit.js';

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

  switch(hash) {
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

  // Lógica de finalização do checkout e exibição de mensagem de sucesso
  if (hash === '#checkout') {
    const checkoutForm = document.getElementById('checkout-form');
    const finalizeBtn = document.getElementById('finalize-checkout-btn');

    if (finalizeBtn && checkoutForm) {
      checkoutForm.addEventListener('submit', e => {
        e.preventDefault();

        // Limpa carrinho (localStorage e memória)
        localStorage.removeItem('cart');
        if (window.cart) window.cart.length = 0;

        app.innerHTML = `
          <section class="checkout-success">
            <h2>Compra Concluída!</h2>
            <p>Obrigado por comprar conosco, ${document.getElementById('name').value}!</p>
            <button id="back-home-btn">Voltar para Home</button>
          </section>
        `;

        // Botão de retorno para a página Home
        document.getElementById('back-home-btn').addEventListener('click', () => {
          window.location.hash = '#home';
        });
      });
    }
  }

  // Garantia de inicialização do login somente quando necessário
  if (hash === '#login') initLogin();
}

/**
 * Atualiza o menu de navegação com base no usuário logado
 */
function updateMenu() {
  const userData = JSON.parse(localStorage.getItem('user'));
  const navRight = document.querySelector('.main-nav-right');
  const registerLink = document.querySelector('.nav-link-cadastrar');

  if (userData) {
    // Usuário logado → mostra saudação e botão sair
    navRight.innerHTML = `
      <span class="user-btn">Olá, ${userData.name}</span>
      ${userData.role === 'admin' ? '<a href="#admin" class="nav-link">Gerenciar Produtos</a>' : ''}
      <button id="logout-btn" class="sair-btn">Sair</button>
    `;

    // Garante que o botão de cadastro some completamente
    if (registerLink) registerLink.style.display = 'none';
  } else {
    // Usuário deslogado → mostra login e garante que o cadastro reaparece
    navRight.innerHTML = `<a href="#login" class="nav-link">Login</a>`;
    if (registerLink) registerLink.style.display = '';
  }

  // Lida com o logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      window.location.hash = '#home';
      updateMenu(); // Atualiza o menu após logout
    });
  }
}


/** Inicializa o SPA e módulos principais */
initApp(router);
initCarousel();
initCart();
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
  const cartElement = document.getElementById('cart');
  const cartItemsElement = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const openCartBtn = document.getElementById('open-cart');
  const closeCartBtn = document.getElementById('close-cart');
  const cart = [];

  if (!cartElement || !openCartBtn || !closeCartBtn) return;

  /**
   * Atualiza visualmente o carrinho
   */
  function updateCart() {
    cartItemsElement.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      total += item.price;
      const li = document.createElement('li');
      li.classList.add('cart-item');
      li.innerHTML = `
        ${item.thumbHTML}
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
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
      const card = e.target.closest('.product-card, .product-item');
      const name = card.querySelector('h3, h5').textContent;
      const priceText = card.querySelector('.product-price').textContent;
      const price = parseFloat(priceText.replace('R$', '').replace(',', '.'));
      const img = card.querySelector('img');
      const thumbHTML = img 
        ? `<img src="${img.src}" alt="${name}" class="cart-thumb">`
        : card.querySelector('.thumb').innerHTML;

      cart.push({ name, price, thumbHTML });
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    }
  });

  /**
   * Limpa o carrinho completamente
   */
  const clearCartBtn = document.getElementById('clear-cart');
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
    window.location.hash = '#checkout';
    const cartElement = document.getElementById('cart');
    if (cartElement) cartElement.classList.remove('open');
  });
}

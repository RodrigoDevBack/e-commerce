import homePage from '/js/home.js';
import produtosPage from '/js/produtos.js';
import loginPage from '/js/login.js';
import checkoutPage from '/js/checkout.js';
import { initApp } from '/js/appInit.js';
import { initLogin } from '/js/login.js';
import cadastroPage, { initRegister } from './register.js';
import adminProductsPage, { initAdminProducts } from '/js/adminProducts.js';
// --- Inicializa o app ---
initApp(router);


// --- Elementos principais ---
const app = document.getElementById('app');
const navLinks = document.querySelectorAll('.nav-link');

// ---- FUNÇÃO PARA DEIXAR NAV ATIVAR ---
function setActiveLink(hash) {
  navLinks.forEach(link => {
    if (link.getAttribute('href') === hash) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// --- ROUTER SIMPLES ---
function router() {
  const hash = window.location.hash || '#home';
  setActiveLink(hash);
  let pageContent = '';

  switch(hash) {
    case '#home':
      pageContent = homePage();
      break;
    case '#produtos':
      pageContent = produtosPage();
      break;
    case '#login':
      pageContent = loginPage();
      break;
    case '#checkout':
      pageContent = checkoutPage();
      break;
    case '#admin':
      pageContent = adminProductsPage();
      initAdminProducts();
      break;
    case '#register':
      pageContent = cadastroPage();
      initRegister();
      break;
    default:
      pageContent = '<h2>Página não encontrada</h2>';
  }
  
  app.innerHTML = pageContent;
  if (hash === '#checkout') {
 
    // Depois de renderizar a tela de sucesso
 const checkoutForm = document.getElementById('checkout-form');
const finalizeBtn = document.getElementById('finalize-checkout-btn');

if (finalizeBtn && checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpa o localStorage
    localStorage.removeItem('cart');

    // Limpa o carrinho em memória (se estiver acessível aqui)
    if (window.cart) {
      window.cart.length = 0; 
    }

    // Substitui o conteúdo do app pelo agradecimento
    const app = document.getElementById('app');
    app.innerHTML = `
      <section class="checkout-success">
        <h2>Compra Concluída!</h2>
        <p>Obrigado por comprar conosco, ${document.getElementById('name').value}!</p>
        <button id="back-home-btn">Voltar para Home</button>
      </section>
    `;

    // Botão para voltar à home
    const backHomeBtn = document.getElementById('back-home-btn');
    backHomeBtn.addEventListener('click', () => {
      window.location.hash = '#home';
    });
  });
}
  }
  // Inicializa componentes específicos da página
  initCarousel();
  initCart();
   if (hash === '#login') initLogin(); // <-- só chama login quando renderizar login

}

// --- Login ---
function updateMenu() {
  const userData = JSON.parse(localStorage.getItem('user'));
  const navRight = document.querySelector('.main-nav-right');

  if (userData) {
    navRight.innerHTML = `
      <span class="user-btn">Olá, ${userData.name}</span>
      ${userData.role === 'admin' ? '<a href="#admin" class="nav-link">Gerenciar Produtos</a>' : ''}
      <button id="logout-btn" class="sair-btn">Sair</button>
    `;

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      window.location.hash = '#home';
      updateMenu();
    });
  } else {
    navRight.innerHTML = `<a href="#login" class="nav-link">Login</a>`;
  }
}

// Chama sempre que a página carregar ou mudar hash
window.addEventListener('load', updateMenu);
window.addEventListener('hashchange', updateMenu);


  // --- INICIALIZAÇÃO DO CAROUSEL ---
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

// --- INICIALIZAÇÃO DO CARRINHO ---
function initCart() {
  const cartElement = document.getElementById('cart');
  const cartItemsElement = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const openCartBtn = document.getElementById('open-cart');
  const closeCartBtn = document.getElementById('close-cart');
  const cart = [];

  if (!cartElement || !openCartBtn || !closeCartBtn) return;

  // Atualiza visualmente o carrinho: mostra itens, miniaturas e total
  // Função updateCart() que exibe os itens no carrinho
  function updateCart() {
  cartItemsElement.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const li = document.createElement('li');
    li.classList.add('cart-item'); // adiciona classe para CSS
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

// Delegação de clique para adicionar produtos ao carrinho e navegar para checkout
// Delegação de clique para adicionar produtos ao carrinho
document.addEventListener('click', e => {
  if (e.target.classList.contains('add-to-cart')) {
    const card = e.target.closest('.product-card, .product-item');
    const name = card.querySelector('h3').textContent;
    const priceText = card.querySelector('.product-price').textContent;
    const price = parseFloat(priceText.replace('R$', '').replace(',', '.'));
    let thumbHTML;
    const img = card.querySelector('img');
    if (img) {
      thumbHTML = `<img src="${img.src}" alt="${name}" class="cart-thumb">`;
    } else {
      thumbHTML = card.querySelector('.thumb').innerHTML; // pega SVG
    }

    // Adiciona o item ao carrinho em memória
    cart.push({ name, price, thumbHTML });

    // Salva no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Atualiza visualmente o carrinho
    updateCart();
  }  
});

// --- AQUI fora do listener add-to-cart ---
const clearCartBtn = document.getElementById('clear-cart');
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    cart.length = 0; // limpa carrinho em memória
    localStorage.removeItem('cart'); // limpa localStorage
    updateCart(); // atualiza visualmente
  });
}


}

// Redireciona para a página de checkout ao clicar no botão "Finalizar Compra"
const checkoutBtn = document.getElementById('checkout');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    window.location.hash = '#checkout';
    const cartElement = document.getElementById('cart');
    if (cartElement) cartElement.classList.remove('open');
  });
}

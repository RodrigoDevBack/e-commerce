/**
 * Inicializa o carrossel da página.
 *
 * Responsabilidades:
 * - Ajustar posição horizontal de cada slide
 * - Controlar navegação via botões anterior/próximo
 * - Gerenciar estado do slide ativo
 *
 * Notas:
 * - Assumimos que todos os slides têm a mesma largura
 * - Requer botões com classes `.carousel-btn.next` e `.carousel-btn.prev`
 *
 * @returns {void} Não retorna nenhum valor
 */
export function initCarousel() {
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

initCarousel();
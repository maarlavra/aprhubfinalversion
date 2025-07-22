// 1. Inicialização do Popup WhatsApp
// ================================
// Toca som e exibe popup quando o usuário rola mais de 300px

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("whatsapp-popup");
  const sound = document.getElementById("whatsapp-sound");
  let hasPlayedSound = false;

  function checkScroll() {
    if (window.scrollY > 300) {
      if (!popup.classList.contains("visible")) {
        popup.classList.add("visible");
        if (!hasPlayedSound) {
          sound.currentTime = 0;
          sound.play().catch(e => console.warn("Falha ao tocar som:", e));
          hasPlayedSound = true;
        }
      }
    } else {
      popup.classList.remove("visible");
      hasPlayedSound = false;
    }
  }

  window.addEventListener('scroll', checkScroll);
  window.addEventListener('wheel', checkScroll);
  window.addEventListener('touchmove', checkScroll);

  window.addEventListener('keydown', e => {
    const keysThatScroll = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space'];
    if (keysThatScroll.includes(e.code)) {
      setTimeout(checkScroll, 50);
    }
  });
});


// 2. Carrossel Infinito com Clones nas Extremidades
// ================================================
// Cria efeito infinito clonando primeiro e último slide, loop automático

const track = document.querySelector('.carousel__track');
let slides = Array.from(track.children);
const prevButton = document.querySelector('.carousel__nav--prev');
const nextButton = document.querySelector('.carousel__nav--next');
let currentIndex = 1; // começa no slide real (após clone inicial)

// 2.1 Clonar primeiro e último slides
const firstClone = slides[0].cloneNode(true);
const lastClone  = slides[slides.length - 1].cloneNode(true);
firstClone.classList.add('first-clone');
lastClone.classList.add('last-clone');
track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

// 2.2 Atualizar lista de slides com clones
slides = Array.from(track.children);

// 2.3 Definir largura e posicionamento inicial
const slideWidth = slides[0].getBoundingClientRect().width;
track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

// 2.4 Função de movimentação com animação
function moveToSlide(index) {
  track.style.transition = 'transform 0.4s ease-in-out';
  track.style.transform  = `translateX(-${slideWidth * index}px)`;
  currentIndex = index;
}

// 2.5 Eventos dos botões
nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));

// 2.6 Rebobinagem ao atingir clones
track.addEventListener('transitionend', () => {
  if (slides[currentIndex].classList.contains('first-clone')) {
    track.style.transition = 'none';
    currentIndex = 1;
    track.style.transform  = `translateX(-${slideWidth * currentIndex}px)`;
  }
  if (slides[currentIndex].classList.contains('last-clone')) {
    track.style.transition = 'none';
    currentIndex = slides.length - 2;
    track.style.transform  = `translateX(-${slideWidth * currentIndex}px)`;
  }
});

// 2.7 Responsividade: recalcular ao redimensionar
window.addEventListener('resize', () => {
  const newWidth = slides[0].getBoundingClientRect().width;
  track.style.transition = 'none';
  track.style.transform  = `translateX(-${newWidth * currentIndex}px)`;
});

// 3. Lightbox para Ampliar Slides
// ==============================
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = lightbox.querySelector('.lightbox__img');
const lightboxClose = lightbox.querySelector('.lightbox__close');

// 3.1 Abrir lightbox ao clicar na imagem do slide
document.querySelectorAll('.carousel__slide img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.style.display = 'flex';
  });
});

// 3.2 Fechar lightbox
lightboxClose.addEventListener('click', () => lightbox.style.display = 'none');
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});

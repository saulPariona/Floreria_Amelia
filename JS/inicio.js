/* ========== LAZY LOADING PARA IMAGEN ABOUT ========== */
const aboutImageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const skeleton = img.nextElementSibling;
      
      // Cargar la imagen real
      img.src = img.dataset.src;
      
      img.onload = () => {
        img.classList.add('loaded');
        if (skeleton && skeleton.classList.contains('skeleton-loader-about')) {
          skeleton.style.display = 'none';
        }
      };
      
      img.onerror = () => {
        img.src = 'Imágenes/Inicio/Flor_morada.png';
        img.classList.add('loaded');
        if (skeleton && skeleton.classList.contains('skeleton-loader-about')) {
          skeleton.style.display = 'none';
        }
      };
      
      observer.unobserve(img);
    }
  });
}, {
  root: null,
  rootMargin: '100px',
  threshold: 0.01
});

// Observar la imagen de la sección about
const aboutImg = document.querySelector('.lazy-img-about');
if (aboutImg) {
  aboutImageObserver.observe(aboutImg);
}

/* ========== CAROUSEL ========== */
class AutoCarousel {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.currentSlide = 0;
    this.intervalTime = 4000;
    this.intervalId = null;

    if (this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    this.startAutoPlay();
    this.addHoverPause();
    this.addIndicatorEvents();
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, this.intervalTime);
  }

  stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    this.goToSlide((this.currentSlide + 1) % this.slides.length);
  }

  goToSlide(slideIndex) {

    this.slides[this.currentSlide].classList.remove('active');
    this.indicators[this.currentSlide].classList.remove('active');

    this.currentSlide = slideIndex;

    this.slides[this.currentSlide].classList.add('active');
    this.indicators[this.currentSlide].classList.add('active');
  }

  addHoverPause() {
    const carousel = document.querySelector('.carousel-background');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => {
        this.stopAutoPlay();
      });

      carousel.addEventListener('mouseleave', () => {
        this.startAutoPlay();
      });
    }
  }

  addIndicatorEvents() {
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.stopAutoPlay();
        this.goToSlide(index);
        this.startAutoPlay();
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AutoCarousel();
});

document.addEventListener('DOMContentLoaded', function () {
  const dropdowns = document.querySelectorAll('.dropdown');

  // Para móviles - toggle al hacer click
  dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.dropdown-btn');

    btn.addEventListener('click', function (e) {
      if (window.innerWidth <= 1060) {
        e.preventDefault();
        e.stopPropagation();

        dropdowns.forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('active');
          }
        });

        dropdown.classList.toggle('active');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 1060) {
      if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1060) {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
});
function updateCartBadge() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const badge = document.getElementById("cart-count");

  if (!badge) return;

  if (totalItems > 0) {
    badge.textContent = totalItems;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", updateCartBadge);

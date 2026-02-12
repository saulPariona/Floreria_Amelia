/**
 * SPLASH SCREEN CONTROLLER
 * Maneja la reproducción del video de introducción y la transición a la página principal
 */

document.addEventListener('DOMContentLoaded', function () {
    const splashScreen = document.getElementById('splashScreen');
    const splashVideo = document.getElementById('splashVideo');
    const body = document.body;

    // Marcar el body como activo con splash
    body.classList.add('splash-active');

    // Función para ocultar el splash y mostrar el contenido
    function hideSplash() {
        // Agregar clase de fade-out al splash
        splashScreen.classList.add('fade-out');

        // Remover clase splash-active y agregar splash-loaded
        body.classList.remove('splash-active');
        body.classList.add('splash-loaded');

        // Remover el splash del DOM después de la transición
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 800); // Coincide con la duración de la transición CSS
    }

    // Opción 1: Esperar a que termine el video
    splashVideo.addEventListener('ended', function () {
        hideSplash();
    });

    // Opción 2: Timeout de seguridad (8 segundos + 0.5s de margen)
    setTimeout(() => {
        if (!splashScreen.classList.contains('fade-out')) {
            hideSplash();
        }
    }, 8500);

    // Intentar reproducir el video con audio
    const playPromise = splashVideo.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Reproducción exitosa con audio
            console.log('Video reproduciéndose con audio');
        }).catch(error => {
            console.warn('No se pudo reproducir automáticamente con audio:', error);

            // Si falla el autoplay con audio, crear un botón para que el usuario inicie la reproducción
            const playButton = document.createElement('button');
            playButton.textContent = '▶ Click para iniciar';
            playButton.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 40px;
        font-size: 20px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50px;
        cursor: pointer;
        z-index: 100000;
        font-weight: bold;
        color: #333;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
      `;

            playButton.addEventListener('mouseenter', function () {
                this.style.background = 'rgba(255, 255, 255, 1)';
                this.style.transform = 'translate(-50%, -50%) scale(1.05)';
            });

            playButton.addEventListener('mouseleave', function () {
                this.style.background = 'rgba(255, 255, 255, 0.9)';
                this.style.transform = 'translate(-50%, -50%) scale(1)';
            });

            playButton.addEventListener('click', function () {
                splashVideo.play().then(() => {
                    playButton.remove();
                }).catch(err => {
                    console.error('Error al reproducir el video:', err);
                    // Si aún así falla, ocultar el splash después de 1 segundo
                    setTimeout(hideSplash, 1000);
                });
            });

            splashScreen.appendChild(playButton);
        });
    }
});

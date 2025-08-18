document.addEventListener('DOMContentLoaded', () => {
    // --- CONTROLES DO PLAYER DE ÁUDIO ---
    const audio = document.getElementById('audio-stream');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const volumeSlider = document.getElementById('volume-slider');

    const togglePlayPause = () => {
        if (audio.paused || audio.ended) {
            audio.play().catch(error => {
                console.error("Erro ao tentar tocar o áudio:", error);
            });
        } else {
            audio.pause();
        }
    };

    const updateIcon = () => {
        if (audio.paused) {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        } else {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }
    };

    playPauseBtn.addEventListener('click', togglePlayPause);
    audio.addEventListener('play', updateIcon);
    audio.addEventListener('pause', updateIcon);
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });
    updateIcon();

    // --- LÓGICA DE NAVEGAÇÃO POR ABAS (PÁGINAS) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetPageId = link.getAttribute('data-page');

            navLinks.forEach(navLink => navLink.classList.remove('active'));
            pageContents.forEach(page => page.classList.remove('active'));

            link.classList.add('active');
            const targetPage = document.getElementById(targetPageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
        });
    });

    // --- LÓGICA DO MENU HORIZONTAL SCROLLÁVEL ---
    const navPrev = document.getElementById('nav-prev');
    const navNext = document.getElementById('nav-next');
    const mainNav = document.querySelector('.main-nav');
    const navLinksWrapper = document.querySelector('.nav-links-wrapper');
    
    let currentTranslateX = 0;
    const SCROLL_AMOUNT = 100; // Quanto rolar por clique

    const checkNavOverflow = () => {
        if (!mainNav || !navLinksWrapper) return;

        const maxScroll = navLinksWrapper.scrollWidth - mainNav.clientWidth;

        if (maxScroll > 0) {
            // Se houver overflow, atualiza a visibilidade das setas
            navPrev.classList.toggle('hidden', currentTranslateX === 0);
            navNext.classList.toggle('hidden', Math.abs(currentTranslateX) >= maxScroll - 1);
        } else {
            // Se não houver overflow, esconde ambas as setas e reseta a posição
            navPrev.classList.add('hidden');
            navNext.classList.add('hidden');
            currentTranslateX = 0;
            navLinksWrapper.style.transform = `translateX(0px)`;
        }
    };

    navNext.addEventListener('click', () => {
        const maxScroll = navLinksWrapper.scrollWidth - mainNav.clientWidth;
        currentTranslateX -= SCROLL_AMOUNT;
        
        if (Math.abs(currentTranslateX) > maxScroll) {
            currentTranslateX = -maxScroll;
        }

        navLinksWrapper.style.transform = `translateX(${currentTranslateX}px)`;
        checkNavOverflow();
    });

    navPrev.addEventListener('click', () => {
        currentTranslateX += SCROLL_AMOUNT;

        if (currentTranslateX > 0) {
            currentTranslateX = 0;
        }

        navLinksWrapper.style.transform = `translateX(${currentTranslateX}px)`;
        checkNavOverflow();
    });

    // Verifica o overflow ao carregar e ao redimensionar a janela
    window.addEventListener('resize', checkNavOverflow);
    checkNavOverflow(); // Executa uma vez ao carregar a página
});

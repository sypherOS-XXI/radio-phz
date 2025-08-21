// PHZ Music Script v4.2 - Correção Definitiva do Deslizamento de Menu
console.log('PHZ Music Script v4.2 Loaded.');

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO POPUP (EXECUTADA QUANDO O HTML ESTÁ PRONTO) ---
    console.log('DOM Ready. Setting up popup.');
    const popupOverlay = document.getElementById('popup-overlay');
    const closeBtn = document.getElementById('popup-close-btn');
    const countdownTimer = document.getElementById('countdown-timer');
    const closeIcon = document.getElementById('close-icon');

    if (popupOverlay) {
        console.log('Popup element found.');
        const closePopup = () => { popupOverlay.classList.add('hidden'); };
        const startCountdown = () => {
            let count = 10;
            countdownTimer.textContent = count;
            const interval = setInterval(() => {
                count--;
                countdownTimer.textContent = count;
                if (count <= 0) {
                    clearInterval(interval);
                    countdownTimer.classList.add('hidden');
                    closeIcon.classList.remove('hidden');
                    closeBtn.disabled = false;
                }
            }, 1000);
        };
        closeBtn.addEventListener('click', closePopup);
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay && !closeBtn.disabled) {
                closePopup();
            }
        });
        setTimeout(() => {
            console.log('2-second timer finished. Showing popup.');
            popupOverlay.classList.remove('hidden');
            startCountdown();
        }, 2000);
    } else {
        console.error('Popup element (#popup-overlay) not found in the DOM.');
    }

    // --- CONTROLES DO PLAYER DE ÁUDIO ---
    const audio = document.getElementById('audio-stream');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const volumeSlider = document.getElementById('volume-slider');

    const togglePlayPause = () => {
        if (audio.paused || audio.ended) {
            audio.play().catch(error => { console.error("Erro ao tocar áudio:", error); });
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
    volumeSlider.addEventListener('input', (e) => { audio.volume = e.target.value; });
    updateIcon();
});

// --- LÓGICA DO MENU E NAVEGAÇÃO (EXECUTADA QUANDO TUDO, INCLUINDO FONTES, ESTÁ CARREGADO) ---
window.addEventListener('load', () => {
    console.log('Window Loaded. Setting up navigation menu.');

    // --- Elementos da Navegação ---
    const navPill = document.querySelector('.nav-pill');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    const readMoreLink = document.getElementById('read-more-construcao');
    const mainNav = document.querySelector('.main-nav');
    const navLinksWrapper = document.querySelector('.nav-links-wrapper');
    const navPrev = document.getElementById('nav-prev');
    const navNext = document.getElementById('nav-next');
    
    // --- Funções da Navegação ---
    const showPage = (pageId) => {
        pageContents.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.classList.add('active');
    };

    const movePill = (targetLink) => {
        if (!targetLink || !navPill) return;
        navPill.style.display = 'block';
        const linkRect = targetLink.getBoundingClientRect();
        const wrapperRect = targetLink.parentElement.getBoundingClientRect();
        navPill.style.width = `${linkRect.width}px`;
        navPill.style.transform = `translateX(${linkRect.left - wrapperRect.left}px)`;
    };

    // --- Lógica de clique nos links do menu principal ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageId = link.getAttribute('data-page');
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            movePill(link);
            showPage(targetPageId);
        });
    });
    
    // --- Lógica para o link "Leia Mais" ---
    if(readMoreLink) {
        readMoreLink.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageId = readMoreLink.getAttribute('data-page');
            showPage(targetPageId);
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            if (navPill) navPill.style.width = '0';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Lógica das Setas de Navegação para Telas Pequenas ---
    let currentTranslateX = 0;
    const scrollStep = 150;

    const updateNavState = () => {
        if (!mainNav || !navLinksWrapper || !navPrev || !navNext) return;

        const maxScroll = navLinksWrapper.scrollWidth - mainNav.clientWidth;

        // Atualiza a posição atual (caso a janela tenha sido redimensionada)
        if (Math.abs(currentTranslateX) > maxScroll) {
            currentTranslateX = -maxScroll;
        }

        // Aplica a transformação
        navLinksWrapper.style.transform = `translateX(${currentTranslateX}px)`;

        // Mostra ou esconde as setas
        const showArrows = maxScroll > 1;
        navPrev.classList.toggle('hidden', !showArrows || currentTranslateX === 0);
        navNext.classList.toggle('hidden', !showArrows || Math.abs(currentTranslateX) >= maxScroll - 1);
    };

    if (navNext && navPrev) {
        navNext.addEventListener('click', () => {
            const maxScroll = navLinksWrapper.scrollWidth - mainNav.clientWidth;
            currentTranslateX -= scrollStep;
            if (Math.abs(currentTranslateX) > maxScroll) {
                currentTranslateX = -maxScroll;
            }
            updateNavState();
        });

        navPrev.addEventListener('click', () => {
            currentTranslateX += scrollStep;
            if (currentTranslateX > 0) {
                currentTranslateX = 0;
            }
            updateNavState();
        });
    }
    
    // --- Inicialização do Menu ---
    const initMenu = () => {
        const initialActiveLink = document.querySelector('.nav-link.active');
        if (initialActiveLink) movePill(initialActiveLink);
        updateNavState();
    };

    // Usar um pequeno timeout para garantir que o DOM está totalmente renderizado
    setTimeout(initMenu, 100);
    
    window.addEventListener('resize', () => {
        updateNavState();
        movePill(document.querySelector('.nav-link.active'));
    });
});

// PHZ Music Script v4.4 - Menu Deslizável (Swipe)
console.log('PHZ Music Script v4.4 Loaded.');

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO POPUP ---
    const popupOverlay = document.getElementById('popup-overlay');
    if (popupOverlay) {
        const closeBtn = document.getElementById('popup-close-btn');
        const countdownTimer = document.getElementById('countdown-timer');
        const closeIcon = document.getElementById('close-icon');

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
            if (e.target === popupOverlay && !closeBtn.disabled) closePopup();
        });
        setTimeout(() => {
            popupOverlay.classList.remove('hidden');
            startCountdown();
        }, 2000);
    }

    // --- CONTROLES DO PLAYER DE ÁUDIO ---
    const audio = document.getElementById('audio-stream');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const volumeSlider = document.getElementById('volume-slider');

    const togglePlayPause = () => {
        if (audio.paused || audio.ended) {
            audio.play().catch(error => console.error("Erro ao tocar áudio:", error));
        } else {
            audio.pause();
        }
    };
    const updateIcon = () => {
        playIcon.style.display = audio.paused ? 'block' : 'none';
        pauseIcon.style.display = audio.paused ? 'none' : 'block';
    };
    playPauseBtn.addEventListener('click', togglePlayPause);
    audio.addEventListener('play', updateIcon);
    audio.addEventListener('pause', updateIcon);
    volumeSlider.addEventListener('input', (e) => { audio.volume = e.target.value; });
    updateIcon();
});

// --- LÓGICA DO MENU E NAVEGAÇÃO (EXECUTADA QUANDO TUDO ESTÁ CARREGADO) ---
window.addEventListener('load', () => {
    console.log('Window Loaded. Setting up navigation menu.');

    // --- Elementos da Navegação ---
    const navPill = document.querySelector('.nav-pill');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    const readMoreLink = document.getElementById('read-more-construcao');
    
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
        // Ajuste no cálculo para compensar a rolagem
        navPill.style.transform = `translateX(${targetLink.offsetLeft}px)`;
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageId = link.getAttribute('data-page');
            
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            movePill(link);
            showPage(targetPageId);
            
            // Centraliza o link clicado na tela de forma suave
            link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    });
    
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
    
    // --- Inicialização do Menu ---
    const initMenu = () => {
        const initialActiveLink = document.querySelector('.nav-link.active');
        if (initialActiveLink) {
            movePill(initialActiveLink);
        }
    };
    
    // Espera as fontes carregarem para garantir o cálculo correto da pílula
    if (document.fonts) {
        document.fonts.ready.then(initMenu);
    } else {
        setTimeout(initMenu, 300);
    }
    
    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) movePill(activeLink);
    });
});

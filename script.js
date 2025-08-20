// PHZ Music Script v4
console.log('PHZ Music Script v4 Loaded.');

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

    // --- LÓGICA DE NAVEGAÇÃO POR ABAS (PÁGINAS) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    const readMoreLink = document.getElementById('read-more-construcao');
    
    const showPage = (pageId) => {
        pageContents.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.classList.add('active');
    };
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageId = link.getAttribute('data-page');
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            showPage(targetPageId);
        });
    });
    
    readMoreLink.addEventListener('click', (e) => {
        e.preventDefault();
        const navPill = document.querySelector('.nav-pill');
        const targetPageId = readMoreLink.getAttribute('data-page');
        showPage(targetPageId);
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        if (navPill) navPill.style.width = '0';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// --- LÓGICA DO MENU (EXECUTADA QUANDO TUDO, INCLUINDO FONTES, ESTÁ CARREGADO) ---
window.addEventListener('load', () => {
    console.log('Window Loaded. Setting up menu.');

    const navPill = document.querySelector('.nav-pill');
    const navLinks = document.querySelectorAll('.nav-link');

    const movePill = (targetLink) => {
        if (!targetLink || !navPill) return;
        navPill.style.display = 'block';
        const linkRect = targetLink.getBoundingClientRect();
        const wrapperRect = targetLink.parentElement.getBoundingClientRect();
        navPill.style.width = `${linkRect.width}px`;
        navPill.style.transform = `translateX(${linkRect.left - wrapperRect.left}px)`;
    };
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            movePill(link);
            link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    });

    const initialActiveLink = document.querySelector('.nav-link.active');
    if (initialActiveLink) movePill(initialActiveLink);
    
    const mainNav = document.querySelector('.main-nav');
    const navLinksWrapper = document.querySelector('.nav-links-wrapper');
    const checkNavOverflow = () => {
        if (!mainNav || !navLinksWrapper) return;
        const navPrev = document.getElementById('nav-prev');
        const navNext = document.getElementById('nav-next');
        let currentTranslateX = 0;
        
        setTimeout(() => {
            const maxScroll = navLinksWrapper.scrollWidth - mainNav.clientWidth;
            if (maxScroll > 1) {
                navPrev.classList.toggle('hidden', currentTranslateX === 0);
                navNext.classList.toggle('hidden', Math.abs(currentTranslateX) >= maxScroll - 1);
            } else {
                navPrev.classList.add('hidden');
                navNext.classList.add('hidden');
                currentTranslateX = 0;
                navLinksWrapper.style.transform = `translateX(0px)`;
            }
        }, 100);
    };
    checkNavOverflow();
    
    window.addEventListener('resize', () => {
        checkNavOverflow();
        movePill(document.querySelector('.nav-link.active'));
    });
});

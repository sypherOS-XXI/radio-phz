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

    // --- Lógica para buscar informações da música (Now Playing) ---
    const albumArt = document.getElementById('album-art');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');
    const defaultAlbumArt = 'https://raw.githubusercontent.com/sypherOS-XXI/PHZ-MUSIC/main/phz%20perfil.jpg';

    const fetchNowPlaying = async () => {
        try {
            const response = await fetch('https://stream.zeno.fm/api/new_nowplaying/41virxfygt0uv');
            const data = await response.json();
            let artist = 'PHZ Music', song = 'Sua rádio, seu hit!', art = defaultAlbumArt;
            if (data && data.title && data.title !== '') {
                const parts = data.title.split(' - ');
                if (parts.length > 1) {
                    artist = parts[0].trim();
                    song = parts[1].trim();
                } else {
                    song = data.title.trim();
                    artist = '';
                }
            }
            if (data && data.image_url && data.image_url !== '') art = data.image_url;
            if (songTitle.textContent !== song) songTitle.textContent = song;
            if (artistName.textContent !== artist) artistName.textContent = artist;
            if (albumArt.src !== art) albumArt.src = art;
        } catch (error) {
            console.error('Erro ao buscar informações da música:', error);
            songTitle.textContent = 'PHZ Music';
            artistName.textContent = 'Sua rádio, seu hit!';
            albumArt.src = defaultAlbumArt;
        }
    };
    fetchNowPlaying();
    setInterval(fetchNowPlaying, 7000);

    // --- LÓGICA DE NAVEGAÇÃO POR ABAS (PÁGINAS) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    const navPill = document.querySelector('.nav-pill');
    const readMoreLink = document.getElementById('read-more-construcao');

    const movePill = (targetLink) => {
        if (!targetLink || !navPill) return;
        navPill.style.display = 'block';
        const linkRect = targetLink.getBoundingClientRect();
        const wrapperRect = targetLink.parentElement.getBoundingClientRect();
        
        navPill.style.width = `${linkRect.width}px`;
        navPill.style.transform = `translateX(${linkRect.left - wrapperRect.left}px)`;
    };

    const showPage = (pageId) => {
        pageContents.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPageId = link.getAttribute('data-page');

            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            showPage(targetPageId);
            movePill(link);
            
            link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    });
    
    readMoreLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPageId = readMoreLink.getAttribute('data-page');
        
        showPage(targetPageId);
        
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        
        if (navPill) {
            navPill.style.width = '0';
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const initialActiveLink = document.querySelector('.nav-link.active');
    setTimeout(() => movePill(initialActiveLink), 50);

    // --- LÓGICA DO MENU HORIZONTAL SCROLLÁVEL ---
    const navPrev = document.getElementById('nav-prev');
    const navNext = document.getElementById('nav-next');
    const mainNav = document.querySelector('.main-nav');
    const navLinksWrapper = document.querySelector('.nav-links-wrapper');
    
    let currentTranslateX = 0;
    const SCROLL_AMOUNT = 100;

    const checkNavOverflow = () => {
        if (!mainNav || !navLinksWrapper) return;
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
    };

    navNext.addEventListener('click', () => {
        const maxScroll = navLinksWrapper.scrollWidth - mainNav.clientWidth;
        currentTranslateX -= SCROLL_AMOUNT;
        if (Math.abs(currentTranslateX) > maxScroll) currentTranslateX = -maxScroll;
        navLinksWrapper.style.transform = `translateX(${currentTranslateX}px)`;
        checkNavOverflow();
    });

    navPrev.addEventListener('click', () => {
        currentTranslateX += SCROLL_AMOUNT;
        if (currentTranslateX > 0) currentTranslateX = 0;
        navLinksWrapper.style.transform = `translateX(${currentTranslateX}px)`;
        checkNavOverflow();
    });

    // --- VERIFICAÇÕES DE REDIMENSIONAMENTO ---
    window.addEventListener('resize', () => {
        checkNavOverflow();
        movePill(document.querySelector('.nav-link.active'));
    });
    checkNavOverflow();
});

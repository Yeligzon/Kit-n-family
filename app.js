// ============================================
// 📺 CONFIGURACIÓN DE VIDEOS (IDs DE YOUTUBE)
// ============================================
// Solo pon los 11 caracteres del ID del video de YouTube:

const INTRO_CHANNEL     = "4KJ4UbKHL3k";      // Tu Intro principal
const BUMPER_COMERCIAL  = "ID_BUMPER_YOUTUBE";     // Bumper "Ya volvemos"
const BUMPER_REGRESO    = "ID_REGRESO_YOUTUBE";    // Bumper "Estamos de vuelta"

// Serie estrella:
const WOLFBLOOD_EP1     = "ID_WOLFBLOOD_YOUTUBE";   // Episodio de Wolfblood

// Comerciales o Anuncios (IDs de YouTube)
const anuncios = [
    "ID_ANUNCIO_1",
    "ID_ANUNCIO_2"
];

const SECUENCIA_LOGOS = [
    "logo_kiton_family_2.png",
    "logo_kiton_family_3.png",
    "logo_kiton_family_1.png"
];

// Configuración del gatito
const GATITO_APARECE_MS = 8000;
const GATITO_DURA_MS    = 5000;

// ============================================
// VARIABLES GLOBALES Y YOUTUBE API
// ============================================
const logo             = document.getElementById('logo-container');
const logoImg          = document.getElementById('logo-img');
const particlesCont    = document.getElementById('particles-container');
const cat              = document.getElementById('cat-mascot');
const loadingScreen    = document.getElementById('loading-screen');
const startBtn         = document.getElementById('start-btn');

let ytPlayer           = null;
let ytReady            = false;
let resolveVideoActual = null;
let gatitoTimeout1     = null;
let gatitoTimeout2     = null;
let secuenciaTimeouts  = [];

// Inicialización de la API de YouTube
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            'autoplay': 1,
            'controls': 0,        // Oculta controles de YouTube
            'disablekb': 1,       // Desactiva teclado
            'modestbranding': 1,  // Oculta marcas de YouTube
            'rel': 0,             // No muestra videos recomendados al final
            'showinfo': 0,
            'fs': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    ytReady = true;
    console.log("🚀 Motor de YouTube de Kitón Family LISTO");
    startBtn.style.display = 'block';
    document.getElementById('loading-text').textContent = '¡Listo!';
}

// Detectar cuando termina un video de YouTube
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        if (resolveVideoActual) {
            let callback = resolveVideoActual;
            resolveVideoActual = null;
            callback();
        }
    }
}

// Función mágica para reproducir cualquier ID de YouTube
function reproducirYouTube(videoId, conLogo = false) {
    return new Promise((resolve) => {
        resolveVideoActual = resolve;
        activarLogo(conLogo);
        ytPlayer.loadVideoById(videoId);
    });
}

// ============================================
// EFECTOS VISUALES Y ANIMACIONES (TUS FUNCIONES)
// ============================================
function crearParticulasDePolvo() {
    const totalParticulas = 20;
    const colores = ['rgba(255, 220, 150, 0.9)', 'rgba(255, 200, 120, 0.85)'];
    for (let i = 0; i < totalParticulas; i++) {
        const p = document.createElement('div');
        p.className = 'dust-particle';
        const size = Math.random() * 8 + 3;
        p.style.width = size + 'px'; p.style.height = size + 'px';
        const color = colores[Math.floor(Math.random() * colores.length)];
        p.style.background = color;
        
        const angle = Math.random() * Math.PI * 2;
        const distMid = Math.random() * 40 + 20;
        const distEnd = Math.random() * 80 + 60;
        
        p.style.setProperty('--mid-x', (Math.cos(angle) * distMid) + 'px');
        p.style.setProperty('--mid-y', (Math.sin(angle) * distMid) + 'px');
        p.style.setProperty('--end-x', (Math.cos(angle) * distEnd) + 'px');
        p.style.setProperty('--end-y', (Math.sin(angle) * distEnd - 20) + 'px');
        
        const duration = Math.random() * 0.6 + 0.7;
        p.style.animation = `dust-fly ${duration}s ease-out forwards`;
        
        particlesCont.appendChild(p);
        setTimeout(() => p.remove(), (duration + 0.3) * 1000);
    }
}

function girarYCambiar(nuevaSrc) {
    crearParticulasDePolvo();
    logoImg.classList.remove('spin-transform');
    void logoImg.offsetWidth;
    logoImg.classList.add('spin-transform');
    setTimeout(() => { logoImg.src = nuevaSrc; }, 400);
}

function activarLogo(mostrar) {
    clearTimeout(gatitoTimeout1);
    clearTimeout(gatitoTimeout2);
    ocultarGatito();

    if (mostrar) {
        logoImg.src = "logo_kiton_family_1.png";
        logo.style.transform = "translate(0, 0)";
        logo.classList.remove('mode-transparent', 'glitch-anim');
        setTimeout(() => {
            logo.style.bottom = "30px"; 
            logo.style.left = "40px";
            programarGatito();
        }, 800);
    } else {
        logo.style.transform = "translate(0, 0)";
        logo.style.bottom = "-200px"; 
        logo.style.left = "-300px";
    }
}

function animarSalidaLogo() {
    logo.classList.add('glitch-anim');
    setTimeout(() => { logo.style.transform = "translate(200vw, -200vh)"; }, 30);
}

function mostrarGatito() { cat.classList.remove('cat-leaving'); cat.classList.add('cat-visible'); }
function ocultarGatito() { if (cat.classList.contains('cat-visible')) { cat.classList.remove('cat-visible'); cat.classList.add('cat-leaving'); } }
function programarGatito() { gatitoTimeout1 = setTimeout(() => { mostrarGatito(); gatitoTimeout2 = setTimeout(() => { ocultarGatito(); }, GATITO_DURA_MS); }, GATITO_APARECE_MS); }

// ============================================
// RONDA DE COMERCIALES
// ============================================
async function rondaDeComerciales() {
    animarSalidaLogo();
    await reproducirYouTube(BUMPER_COMERCIAL, false);
    
    // Reproducir 1 o 2 anuncios aleatorios
    const anuncioElegido = anuncios[Math.floor(Math.random() * anuncios.length)];
    await reproducirYouTube(anuncioElegido, false);
    
    await reproducirYouTube(BUMPER_REGRESO, false);
}

// ============================================
// 🎬 TRANSMISIÓN EN VIVO DE KITÓN FAMILY
// ============================================
startBtn.onclick = async () => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => loadingScreen.style.display = 'none', 800);

    try {
        console.log("📺 1. Reproduciendo INTRO");
        await reproducirYouTube(INTRO_CHANNEL, false);

        console.log("🐺 2. TRANSMITIENDO: WOLFBLOOD (Episodio 1)");
        await reproducirYouTube(WOLFBLOOD_EP1, true); // true = Muestra logo y gatito

        console.log("📺 3. Entrando a Comerciales");
        await rondaDeComerciales();

        console.log("✅ Fin de la transmisión de hoy");
    } catch (err) {
        console.error("❌ Error en la transmisión:", err);
    }
};

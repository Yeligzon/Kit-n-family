// ============================================
// 📺 CONFIGURACIÓN DE VIDEOS (IDs DE YOUTUBE)
// ============================================
const INTRO_CHANNEL     = "4KJ4UbKHL3k";   // Reemplaza por tu ID de Intro
const BUMPER_COMERCIAL  = "dQw4w9WgXcQ";   // Reemplaza por tu ID de Bumper
const BUMPER_REGRESO    = "dQw4w9WgXcQ";   // Reemplaza por tu ID de Regreso

// Serie estrella:
const WOLFBLOOD_EP1     = "dQw4w9WgXcQ";   // Reemplaza por ID de Wolfblood

const anuncios = [
    "dQw4w9WgXcQ"
];

const SECUENCIA_LOGOS = [
    "logo_kiton_family_2.png",
    "logo_kiton_family_3.png",
    "logo_kiton_family_1.png"
];

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

let ytPlayer           = null;
let resolveVideoActual = null;
let gatitoTimeout1     = null;
let gatitoTimeout2     = null;

// EFECTOS EN PANTALLA DE CARGA
function crearBurbujas() {
    for (let i = 0; i < 15; i++) {
        const b = document.createElement('div');
        b.className = 'bubble';
        const size = Math.random() * 60 + 20;
        b.style.width  = size + 'px'; b.style.height = size + 'px';
        b.style.left   = Math.random() * 100 + 'vw';
        b.style.animationDuration = (Math.random() * 8 + 6) + 's';
        b.style.animationDelay    = Math.random() * 5 + 's';
        loadingScreen.appendChild(b);
    }
}
crearBurbujas();

// INICIALIZAR YOUTUBE
window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'disablekb': 1,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    console.log("🚀 Motor de YouTube LISTO. Iniciando transmisión...");
    
    // Ocultar pantalla de carga automáticamente
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.style.display = 'none', 800);
        iniciarTransmision();
    }, 1500);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        if (resolveVideoActual) {
            let callback = resolveVideoActual;
            resolveVideoActual = null;
            callback();
        }
    }
}

function reproducirYouTube(videoId, conLogo = false) {
    return new Promise((resolve) => {
        resolveVideoActual = resolve;
        activarLogo(conLogo);
        ytPlayer.loadVideoById(videoId);
    });
}

// ============================================
// ANIMACIONES Y LOGO
// ============================================
function crearParticulasDePolvo() {
    const totalParticulas = 20;
    const colores = ['rgba(144, 224, 239, 0.9)', 'rgba(0, 180, 216, 0.85)'];
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
// 🎬 TRANSMISIÓN AUTOMÁTICA
// ============================================
async function iniciarTransmision() {
    try {
        console.log("📺 1. Reproduciendo INTRO");
        await reproducirYouTube(INTRO_CHANNEL, false);

        console.log("🐺 2. TRANSMITIENDO: WOLFBLOOD");
        await reproducirYouTube(WOLFBLOOD_EP1, true);

        console.log("📺 3. Entrando a Comercial");
        animarSalidaLogo();
        await reproducirYouTube(BUMPER_COMERCIAL, false);
        await reproducirYouTube(anuncios[0], false);
        await reproducirYouTube(BUMPER_REGRESO, false);

        console.log("✅ Fin de transmisión");
    } catch (err) {
        console.error("❌ Error en transmisión:", err);
    }
}

// Respaldo por si el navegador exige un clic para activar audio
document.body.addEventListener('click', () => {
    if (ytPlayer && ytPlayer.playVideo) {
        ytPlayer.playVideo();
    }
}, { once: true });

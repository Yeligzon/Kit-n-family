// ============================================
// CONFIGURACIÓN DE ARCHIVOS
// ============================================
const ID                = "intro_kiton_family.mp4";
const VAMOS_COMERCIALES = "corto1.mp4";
const FIN_COMERCIALES   = "corto2.mp4";
const BLUEY             = "bluey_episodio.mp4";
const PELICULA          = "pelicula1.mp4";
const MR_BEAN           = "mr bean.mp4";

const anuncios = [
    "anuncio1.mp4",
    "anuncio2.mp4",
    "anuncio3.mp4",
    "anuncio4.mp4"
];

const SECUENCIA_LOGOS = [
    "logo_kiton_family_2.png",
    "logo_kiton_family_3.png",
    "logo_kiton_family_1.png"
];

// ============================================
// CONFIGURACIÓN DE TIEMPOS
// ============================================
const PELICULA_INICIO = 10;
const PELICULA_FIN    = 5539;

const INTERVALO_CORTE    = 1200;
const ANUNCIOS_POR_CORTE = 2;

const GATITO_APARECE_MS = 8000;
const GATITO_DURA_MS    = 5000;

// ============================================
// VARIABLES GLOBALES
// ============================================
const player           = document.getElementById('video-player');
const logo             = document.getElementById('logo-container');
const logoImg          = document.getElementById('logo-img');
const particlesCont    = document.getElementById('particles-container');
const cat              = document.getElementById('cat-mascot');
const loadingScreen    = document.getElementById('loading-screen');
const startBtn         = document.getElementById('start-btn');

let playTime           = 0;
let nextBreak          = INTERVALO_CORTE;
let videoActual        = "";
let enCorte            = false;
let videoAntesDeCorte  = "";
let tiempoAntesDeCorte = 0;
let onendedGuardado    = null;
let gatitoTimeout1     = null;
let gatitoTimeout2     = null;
let secuenciaTimeouts  = [];

// ============================================
// LÓGICA DE LA INTERFAZ
// ============================================
function crearParticulasDePolvo() {
    const totalParticulas = 25;
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

// Pantalla de Carga
setTimeout(() => {
    startBtn.style.display = 'block';
    document.getElementById('loading-text').textContent = '¡Listo!';
}, 2600);

// ============================================
// FUNCIONES DE REPRODUCCIÓN
// ============================================
function esVideoConLogo(src) {
    return src.includes(PELICULA) || src.includes(BLUEY) || src.includes(MR_BEAN);
}
function esVideoConCortes(src) {
    return src.includes(PELICULA) || src.includes(BLUEY) || src.includes(MR_BEAN);
}

function activarLogo(mostrar) {
    if (mostrar) {
        logoImg.src = "logo_kiton_family_1.png";
        logo.style.transform = "translate(0, 0)";
        logo.classList.remove('mode-transparent', 'glitch-anim');
        setTimeout(() => {
            logo.style.bottom = "30px"; logo.style.left = "40px";
            programarGatito();
        }, 800);
    } else {
        logo.style.transform = "translate(0, 0)";
        logo.style.bottom = "-200px"; logo.style.left = "-300px";
    }
}

function animarSalidaLogo() {
    logo.classList.add('glitch-anim');
    setTimeout(() => { logo.style.transform = "translate(200vw, -200vh)"; }, 30);
}

function mostrarGatito() { cat.classList.remove('cat-leaving'); cat.classList.add('cat-visible'); }
function ocultarGatito() { if (cat.classList.contains('cat-visible')) { cat.classList.remove('cat-visible'); cat.classList.add('cat-leaving'); } }
function programarGatito() { setTimeout(() => { mostrarGatito(); setTimeout(() => { ocultarGatito(); }, GATITO_DURA_MS); }, GATITO_APARECE_MS); }

function cargarVideoEnTiempo(src, tiempo) {
    return new Promise((resolve) => {
        player.onloadedmetadata = () => {
            player.onloadedmetadata = null;
            player.currentTime = tiempo;
            resolve();
        };
        player.src = src; player.load();
    });
}

function reproducir(src, permiteLogo) {
    return new Promise((resolve) => {
        player.src = src;
        activarLogo(permiteLogo && esVideoConLogo(src));
        player.onended = () => { player.onended = null; resolve(); };
        player.play().catch(e => setTimeout(resolve, 500));
    });
}

async function rondaDeComerciales(cantidad) {
    enCorte = true; animarSalidaLogo();
    await new Promise(res => setTimeout(res, 700));
    await reproducir(VAMOS_COMERCIALES, false);
    
    const ronda = [...anuncios].sort(() => 0.5 - Math.random()).slice(0, cantidad);
    for (const a of ronda) await reproducir(a, false);
    
    await reproducir(FIN_COMERCIALES, false);
    enCorte = false;
}

// ============================================
// CORTES AUTOMÁTICOS
// ============================================
player.ontimeupdate = async () => {
    if (enCorte) return;
    if (!esVideoConCortes(player.src)) return;

    playTime = player.currentTime;
    
    if (playTime >= nextBreak && (player.duration - playTime) > 60) {
        enCorte = true;
        videoAntesDeCorte = player.src; tiempoAntesDeCorte = player.currentTime;
        onendedGuardado = player.onended;
        
        player.pause(); player.onended = null;
        await rondaDeComerciales(ANUNCIOS_POR_CORTE);
        
        await cargarVideoEnTiempo(videoAntesDeCorte, tiempoAntesDeCorte);
        player.onended = onendedGuardado;
        player.play(); activarLogo(true);
        nextBreak += INTERVALO_CORTE; enCorte = false;
    }
};

// ============================================
// 🎬 EJECUCIÓN PRINCIPAL
// ============================================
startBtn.onclick = async () => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => loadingScreen.style.display = 'none', 800);

    try {
        await reproducir(ID, false);
        await rondaDeComerciales(2);
        
        // Aquí es donde meteremos YouTube luego 🚀
        await reproducir(BLUEY, true); 

    } catch (err) { console.error(err); }
};

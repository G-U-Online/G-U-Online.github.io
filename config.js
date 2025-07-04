/*
 * ==========================================================================
 * CONFIGURACIÓN DEL PORTAFOLIO
 * ==========================================================================
 * Este archivo contiene las configuraciones principales del sitio.
 * Modifica estos valores para personalizar tu portafolio sin tocar el código principal.
 */

const PORTFOLIO_CONFIG = {
    // ==========================================================================
    // INFORMACIÓN PERSONAL
    // ==========================================================================
    personal: {
        artistName: "Tu Nombre Artístico",
        subtitle: "Ilustrador Digital | Diseñador Creativo",
        email: "tu_email@ejemplo.com",
        profileImage: "imagenes/mi_foto_perfil.jpg",
        
        // Biografía (puede incluir HTML básico)
        biography: `
            ¡Hola! Soy un ilustrador digital apasionado por crear mundos visuales únicos. 
            Me especializo en diferentes estilos, desde el arte semi-realista hasta 
            ilustraciones de estilo cómic vibrantes.
            <br><br>
            Con más de [X años] de experiencia en ilustración digital, he trabajado 
            en diversos proyectos que van desde comisiones personales hasta 
            colaboraciones comerciales. Mi objetivo es siempre capturar la esencia 
            y emoción de cada proyecto.
            <br><br>
            Cuando no estoy dibujando, puedes encontrarme explorando nuevas técnicas, 
            jugando videojuegos para inspiración, o disfrutando de una buena taza de café 
            mientras planifico mi próxima creación.
        `
    },

    // ==========================================================================
    // REDES SOCIALES
    // ==========================================================================
    socialLinks: {
        instagram: {
            url: "https://instagram.com/tu_usuario",
            icon: "fab fa-instagram",
            enabled: true
        },
        twitter: {
            url: "https://twitter.com/tu_usuario",
            icon: "fab fa-twitter",
            enabled: true
        },
        artstation: {
            url: "https://artstation.com/tu_usuario",
            icon: "fab fa-artstation",
            enabled: true
        },
        deviantart: {
            url: "https://deviantart.com/tu_usuario",
            icon: "fab fa-deviantart",
            enabled: true
        },
        behance: {
            url: "https://behance.net/tu_usuario",
            icon: "fab fa-behance",
            enabled: false
        },
        dribbble: {
            url: "https://dribbble.com/tu_usuario",
            icon: "fab fa-dribbble",
            enabled: false
        }
    },

    // ==========================================================================
    // CONFIGURACIÓN DE ADMINISTRADOR
    // ==========================================================================
    admin: {
        // IMPORTANTE: Cambia esta contraseña por una segura
        password: "admin123",
        
        // Configuraciones de subida de imágenes
        upload: {
            maxFileSize: 5 * 1024 * 1024, // 5MB en bytes
            allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
            imageQuality: 0.8 // Calidad de compresión (0.1 - 1.0)
        }
    },

    // ==========================================================================
    // CATEGORÍAS DE ILUSTRACIONES
    // ==========================================================================
    categories: {
        "comic-style": {
            name: "Comic Style",
            icon: "fas fa-mask",
            description: "Ilustraciones con estilo de cómic, personajes animados y escenas dinámicas"
        },
        "semi-realism": {
            name: "Semi-Realism",
            icon: "fas fa-user",
            description: "Retratos y arte con un enfoque semi-realista, técnicas de pintura digital"
        },
        "commissions": {
            name: "Commissions",
            icon: "fas fa-handshake",
            description: "Trabajos por encargo, proyectos personalizados para clientes"
        },
        "personal-drawings": {
            name: "Personal Drawings",
            icon: "fas fa-heart",
            description: "Arte personal, experimentos creativos y estudios artísticos"
        }
    },

    // ==========================================================================
    // CONFIGURACIÓN VISUAL
    // ==========================================================================
    theme: {
        // Colores principales
        colors: {
            primary: "#667eea",
            secondary: "#764ba2",
            success: "#4CAF50",
            error: "#f44336",
            info: "#2196F3",
            background: "#f8f9fa"
        },
        
        // Configuración del carrusel
        carousel: {
            autoplaySpeed: 20, // segundos
            itemWidth: 400, // píxeles
            pauseOnHover: true
        },
        
        // Efectos de animación
        animations: {
            transitionSpeed: "0.3s",
            hoverScale: 1.05,
            modalFadeSpeed: "0.3s"
        }
    },

    // ==========================================================================
    // IMÁGENES DESTACADAS PARA EL CARRUSEL
    // ==========================================================================
    featuredImages: [
        {
            src: "imagenes/mi_ilustracion_1.jpg",
            title: "Comic Style Artwork",
            description: "Una de mis últimas creaciones",
            category: "comic-style"
        },
        {
            src: "imagenes/mi_ilustracion_2.jpg",
            title: "Semi-Realistic Portrait",
            description: "Retrato digital detallado",
            category: "semi-realism"
        },
        {
            src: "imagenes/mi_ilustracion_3.jpg",
            title: "Commission Work",
            description: "Trabajo personalizado para cliente",
            category: "commissions"
        }
    ],

    // ==========================================================================
    // CONFIGURACIÓN DE LA GALERÍA
    // ==========================================================================
    gallery: {
        // Número de columnas por tamaño de pantalla
        columns: {
            desktop: "repeat(auto-fill, minmax(280px, 1fr))",
            tablet: "repeat(auto-fill, minmax(250px, 1fr))",
            mobile: "1fr"
        },
        
        // Altura de las imágenes en píxeles
        imageHeight: 250,
        
        // Espaciado entre elementos
        gap: "2rem",
        
        // Mostrar información adicional
        showImageInfo: true,
        
        // Lazy loading para mejor rendimiento
        lazyLoad: true
    },

    // ==========================================================================
    // TEXTOS DEL SITIO
    // ==========================================================================
    texts: {
        siteTitle: "Mi Portafolio de Ilustraciones",
        featuredSection: "Ilustraciones Destacadas",
        aboutSection: "Sobre Mí",
        contactSection: "Contáctame",
        contactDescription: "¿Interesado en trabajar juntos? ¡Me encantaría saber de ti!",
        emailButtonText: "Enviar Correo",
        
        // Mensajes del sistema
        messages: {
            noImages: "No hay imágenes en esta categoría aún.",
            adminHint: "Como administrador, puedes agregar imágenes usando el panel de admin.",
            loginSuccess: "¡Acceso de administrador concedido!",
            loginError: "Contraseña incorrecta",
            uploadSuccess: "¡Imagen subida exitosamente!",
            deleteConfirm: "¿Estás seguro de que quieres eliminar esta imagen?",
            deleteSuccess: "Imagen eliminada exitosamente",
            saveSuccess: "Descripción guardada exitosamente!",
            logoutMessage: "Sesión de administrador cerrada"
        }
    },

    // ==========================================================================
    // CONFIGURACIÓN TÉCNICA
    // ==========================================================================
    technical: {
        // Clave para localStorage
        storageKey: "portfolioGalleryData",
        
        // Configuración de notificaciones
        notifications: {
            duration: 3000, // milisegundos
            position: "top-right" // top-right, top-left, bottom-right, bottom-left
        },
        
        // Configuración de modal
        modal: {
            sidebarWidth: "350px",
            closeOnClickOutside: true,
            closeOnEscape: true
        },
        
        // Debug mode (mostrar logs en consola)
        debug: false
    }
};

// ==========================================================================
// FUNCIONES DE CONFIGURACIÓN
// ==========================================================================

/**
 * Obtiene un valor de configuración usando notación de puntos
 * Ejemplo: getConfig('theme.colors.primary')
 */
function getConfig(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], PORTFOLIO_CONFIG);
}

/**
 * Actualiza un valor de configuración
 * Ejemplo: setConfig('admin.password', 'nueva_contraseña')
 */
function setConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key], PORTFOLIO_CONFIG);
    target[lastKey] = value;
}

/**
 * Aplica la configuración al sitio web
 * Esta función debe llamarse después de cargar la página
 */
function applyConfig() {
    // Aplicar información personal
    const artistName = document.querySelector('.artist-name');
    if (artistName) {
        artistName.textContent = PORTFOLIO_CONFIG.personal.artistName;
    }
    
    const subtitle = document.querySelector('.artist-subtitle');
    if (subtitle) {
        subtitle.textContent = PORTFOLIO_CONFIG.personal.subtitle;
    }
    
    // Aplicar biografía
    const biography = document.querySelector('.about-section .col-md-8');
    if (biography && PORTFOLIO_CONFIG.personal.biography) {
        biography.innerHTML = PORTFOLIO_CONFIG.personal.biography;
    }
    
    // Aplicar enlaces sociales
    const socialContainer = document.querySelector('.social-links');
    if (socialContainer) {
        socialContainer.innerHTML = '';
        
        Object.entries(PORTFOLIO_CONFIG.socialLinks).forEach(([key, social]) => {
            if (social.enabled) {
                const link = document.createElement('a');
                link.href = social.url;
                link.className = 'social-link';
                link.target = '_blank';
                link.innerHTML = `<i class="${social.icon}"></i>`;
                socialContainer.appendChild(link);
            }
        });
    }
    
    // Aplicar email de contacto
    const emailButton = document.querySelector('.contact-btn');
    if (emailButton) {
        emailButton.href = `mailto:${PORTFOLIO_CONFIG.personal.email}`;
    }
    
    // Aplicar título del sitio
    document.title = PORTFOLIO_CONFIG.texts.siteTitle;
    
    // Aplicar colores del tema (opcional)
    if (PORTFOLIO_CONFIG.theme.colors) {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', PORTFOLIO_CONFIG.theme.colors.primary);
        root.style.setProperty('--color-secondary', PORTFOLIO_CONFIG.theme.colors.secondary);
        root.style.setProperty('--color-success', PORTFOLIO_CONFIG.theme.colors.success);
        root.style.setProperty('--color-error', PORTFOLIO_CONFIG.theme.colors.error);
    }
    
    console.log('Configuración aplicada correctamente');
}

// ==========================================================================
// EXPORTAR CONFIGURACIÓN
// ==========================================================================
// Si estás usando módulos ES6, descomenta la siguiente línea:
// export default PORTFOLIO_CONFIG;

// Para uso en navegador (sin módulos):
window.PORTFOLIO_CONFIG = PORTFOLIO_CONFIG;
window.getConfig = getConfig;
window.setConfig = setConfig;
window.applyConfig = applyConfig; 
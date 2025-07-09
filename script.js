/*
 * ==========================================================================
 * PORTAFOLIO DE ILUSTRACIONES DIGITALES - JAVASCRIPT
 * ==========================================================================
 */

// ==========================================================================
// VARIABLES GLOBALES
// ==========================================================================
let isAdmin = false;
let currentCategory = 'comic-style';

// Configuración del sitio
let siteConfig = {
    artistName: "G_U_Sketch",
    subtitle: "Ilustrador Digital | Diseñador Creativo",
    email: "gu.sketxh@gmail.com",
    profileImage: "imagenes/mi_foto_perfil.jpg",
    biography: "",
    featuredTitle: "Ilustraciones Destacadas",
    aboutTitle: "Sobre Mí",
    contactTitle: "Visita mis redes sociales",
    contactDescription: "¡Me apoyarías mucho si me sigues en mis redes sociales!"
};

// Datos del carrusel
let carouselData = [];

// Categorías dinámicas
let categories = {
    "comic-style": {
        name: "Estilo Cómic",
        icon: "fas fa-mask",
        description: "Ilustraciones con estilo de cómic, personajes animados y escenas dinámicas"
    },
    "semi-realism": {
        name: "Semi-Realismo",
        icon: "fas fa-user",
        description: "Retratos y arte con un enfoque semi-realista, técnicas de pintura digital"
    },
    "commissions": {
        name: "Comisiones",
        icon: "fas fa-handshake",
        description: "Trabajos por encargo, proyectos personalizados para clientes"
    },
    "personal-drawings": {
        name: "Dibujos Personales",
        icon: "fas fa-heart",
        description: "Arte personal, experimentos creativos y estudios artísticos"
    }
};

// Simulamos una base de datos local con localStorage
let galleryData = {
    'comic-style': [],
    'semi-realism': [],
    'commissions': [],
    'personal-drawings': []
};

// Redes sociales
let socialLinks = {
    instagram: {
        url: "https://www.instagram.com/g_u_sketch/",
        icon: "fab fa-instagram",
        enabled: true
    },
    x: {
        url: "https://x.com/G_U_Sketch",
        icon: "custom-x-icon",
        enabled: true
    },
    tumblr: {
        url: "https://www.tumblr.com/blog/g-u-sketch",
        icon: "fab fa-tumblr",
        enabled: true
    },
    tiktok: {
        url: "https://www.tiktok.com/@g_u_sketch",
        icon: "fab fa-tiktok",
        enabled: true
    },
    deviantart: {
        url: "https://www.deviantart.com/g-u-sketch",
        icon: "fab fa-deviantart",
        enabled: true
    }
};

// Valores por defecto de socialLinks
const defaultSocialLinks = {
    instagram: {
        url: "https://www.instagram.com/g_u_sketch/",
        icon: "fab fa-instagram",
        enabled: true
    },
    x: {
        url: "https://x.com/G_U_Sketch",
        icon: "custom-x-icon",
        enabled: true
    },
    tumblr: {
        url: "https://www.tumblr.com/blog/g-u-sketch",
        icon: "fab fa-tumblr",
        enabled: true
    },
    tiktok: {
        url: "https://www.tiktok.com/@g_u_sketch",
        icon: "fab fa-tiktok",
        enabled: true
    },
    deviantart: {
        url: "https://www.deviantart.com/g-u-sketch",
        icon: "fab fa-deviantart",
        enabled: true
    }
};

// Carrusel automático
let carouselCurrentIndex = 0;
let carouselInterval = null;

let isAnimating = false;

function showCarouselImage(index, direction = 0) {
    const carouselItems = document.querySelectorAll('.carousel-item');
    if (carouselItems.length === 0) return;
    if (isAnimating) return;
    if (index === carouselCurrentIndex) return;
    isAnimating = true;
    const current = carouselItems[carouselCurrentIndex];
    const next = carouselItems[index];
    // Limpia clases de animación
    carouselItems.forEach(item => {
        item.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right', 'active');
    });
    // Prepara ambas imágenes visibles
    current.classList.add('active');
    next.classList.add('active');
    // Aplica animaciones
    if (direction === 1) {
        // Siguiente: actual sale a la izquierda, nueva entra desde la derecha
        current.classList.add('slide-out-left');
        next.classList.add('slide-in-right');
    } else if (direction === -1) {
        // Anterior: actual sale a la derecha, nueva entra desde la izquierda
        current.classList.add('slide-out-right');
        next.classList.add('slide-in-left');
    } else {
        // Sin animación, solo muestra
        next.classList.add('active');
        isAnimating = false;
        carouselCurrentIndex = index;
        return;
    }
    // Al terminar la animación, oculta la saliente
    setTimeout(() => {
        current.classList.remove('active', 'slide-out-left', 'slide-out-right');
        next.classList.remove('slide-in-left', 'slide-in-right');
        next.classList.add('active');
        isAnimating = false;
        carouselCurrentIndex = index;
    }, 510);
}

function showNextCarouselImage(manual = false) {
    const carouselItems = document.querySelectorAll('.carousel-item');
    if (carouselItems.length === 0) return;
    let nextIndex = (carouselCurrentIndex + 1) % carouselItems.length;
    showCarouselImage(nextIndex, 1);
    if (manual && carouselInterval) {
        clearInterval(carouselInterval);
        startCarouselAutoSlide();
    }
}

function showPrevCarouselImage() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    if (carouselItems.length === 0) return;
    let prevIndex = (carouselCurrentIndex - 1 + carouselItems.length) % carouselItems.length;
    showCarouselImage(prevIndex, -1);
    if (carouselInterval) {
        clearInterval(carouselInterval);
        startCarouselAutoSlide();
    }
}

// ==========================================================================
// INICIALIZACIÓN
// ==========================================================================
document.addEventListener('DOMContentLoaded', async function() {
    // FORZAR que el panel admin esté oculto al inicio
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.classList.remove('show');
    }
    
    await loadAllData();
    applySiteConfig();
    setupCategoryNavigation();
    
    // Cargar datos desde Firebase si está configurado
    if (isFirebaseConfigured()) {
        await loadCarouselFromFirebase();
        await loadGalleryFromFirebase();
    } else {
        setupCarousel();
    }
    
    loadGallery(currentCategory);
    setupEventListeners();
    checkSecretAccess(); // Verificar acceso secreto mediante URL
});

// ==========================================================================
// GESTIÓN DE DATOS
// ==========================================================================
// === FIRESTORE CONFIG ===
const SITE_CONFIG_DOC = 'siteConfig/main';

async function saveSiteConfigToFirestore() {
    try {
        await firebase.firestore().doc(SITE_CONFIG_DOC).set(siteConfig);
        showNotification('Configuración guardada en Firebase', 'success');
    } catch (error) {
        showNotification('Error al guardar configuración en Firebase', 'error');
        console.error(error);
    }
}

async function loadSiteConfigFromFirestore() {
    try {
        const doc = await firebase.firestore().doc(SITE_CONFIG_DOC).get();
        if (doc.exists) {
            siteConfig = { ...siteConfig, ...doc.data() };
            // Si falta socialLinks, usar los valores por defecto
            if (!siteConfig.socialLinks) {
                siteConfig.socialLinks = defaultSocialLinks;
            }
        } else {
            // Si no existe el doc, inicializar socialLinks
            siteConfig.socialLinks = defaultSocialLinks;
        }
    } catch (error) {
        showNotification('Error al cargar configuración de Firebase', 'error');
        console.error(error);
        // En caso de error, usar valores por defecto
        if (!siteConfig.socialLinks) {
            siteConfig.socialLinks = defaultSocialLinks;
        }
    }
}

// Sobrescribir loadAllData para usar Firestore
async function loadAllData() {
    await loadSiteConfigFromFirestore();
    // Cargar datos del carrusel
    const savedCarousel = localStorage.getItem('portfolioCarouselData');
    if (savedCarousel) {
        carouselData = JSON.parse(savedCarousel);
        carouselData = convertBase64ToRelativePaths(carouselData);
    }
    // Cargar categorías
    const savedCategories = localStorage.getItem('portfolioCategories');
    if (savedCategories) {
        categories = { ...categories, ...JSON.parse(savedCategories) };
    }
    // Cargar datos de galería
    const savedGallery = localStorage.getItem('portfolioGalleryData');
    if (savedGallery) {
        galleryData = { ...galleryData, ...JSON.parse(savedGallery) };
    }
}

// Modificar saveAllData para guardar en Firestore
function saveAllData() {
    localStorage.setItem('portfolioSiteConfig', JSON.stringify(siteConfig));
    localStorage.setItem('portfolioCarouselData', JSON.stringify(carouselData));
    localStorage.setItem('portfolioCategories', JSON.stringify(categories));
    localStorage.setItem('portfolioGalleryData', JSON.stringify(galleryData));
    // Asegurar que socialLinks siempre esté presente
    if (!siteConfig.socialLinks) siteConfig.socialLinks = defaultSocialLinks;
    saveSiteConfigToFirestore();
}

// ==========================================================================
// APLICACIÓN DE CONFIGURACIÓN
// ==========================================================================
function applySiteConfig() {
    document.querySelectorAll('[data-field="artistName"]').forEach(el => el.textContent = siteConfig.artistName || '');
    document.querySelectorAll('[data-field="subtitle"]').forEach(el => el.textContent = siteConfig.subtitle || '');
    document.querySelectorAll('[data-field="aboutTitle"]').forEach(el => el.textContent = siteConfig.aboutTitle || '');
    document.querySelectorAll('[data-field="contactTitle"]').forEach(el => el.textContent = siteConfig.contactTitle || '');
    document.querySelectorAll('[data-field="contactDescription"]').forEach(el => el.textContent = siteConfig.contactDescription || '');
    // Biografía
    const bio = document.querySelector('.biography-content');
    if (bio && siteConfig.biography) bio.innerHTML = `<p class='lead'>${siteConfig.biography}</p>`;
    // Foto de perfil
    const profileImg = document.querySelector('.profile-image');
    if (profileImg && siteConfig.profileImage) profileImg.src = siteConfig.profileImage;
}

// ==========================================================================
// NAVEGACIÓN DE CATEGORÍAS
// ==========================================================================
function setupCategoryNavigation() {
    const categoryTabs = document.getElementById('categoryTabs');
    categoryTabs.innerHTML = '';

    Object.entries(categories).forEach(([key, category], index) => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
            <button class="nav-link ${index === 0 ? 'active' : ''}" data-category="${key}">
                <i class="${category.icon}"></i> ${category.name}
            </button>
        `;
        categoryTabs.appendChild(li);
    });

    // Event listeners para las categorías
    categoryTabs.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link')) {
            // Remover clase active de todos los tabs
            document.querySelectorAll('#categoryTabs .nav-link').forEach(t => t.classList.remove('active'));
            // Agregar clase active al tab clickeado
            e.target.classList.add('active');
            
            // Ocultar todas las secciones
            document.querySelectorAll('.gallery-section').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Mostrar la sección seleccionada
            const category = e.target.getAttribute('data-category');
            currentCategory = category;
            const section = document.getElementById(category);
            if (section) {
                section.classList.remove('hidden');
            }
            loadGallery(category);
        }
    });
}

// ==========================================================================
// CARRUSEL
// ==========================================================================
function setupCarousel() {
    loadCarousel();
    
    // Opcional: Pausar el carrusel al hacer hover
    const carousel = document.querySelector('.carousel-track');
    if (carousel) {
        carousel.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        carousel.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    }
}

function startCarouselAutoSlide() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        showNextCarouselImage();
    }, 4000); // 4 segundos
}

function loadCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) {
        console.error('No se encontró el elemento carouselTrack');
        return;
    }

    carouselTrack.innerHTML = '';
    
    console.log('Cargando carrusel con', carouselData.length, 'imágenes');
    console.log('Datos del carrusel:', carouselData);

    // Verificar si hay imágenes en el carrusel
    if (carouselData.length === 0) {
        console.log('No hay imágenes en el carrusel, mostrando placeholder');
        carouselTrack.innerHTML = `
            <div class="carousel-item active">
                <img src="imagenes/sin-foto.png" alt="Sin imágenes">
                <div class="carousel-overlay">
                    <h5>No hay imágenes en el carrusel</h5>
                    <p>Agrega imágenes desde el panel de administración</p>
                </div>
            </div>
        `;
        return;
    }

    // Crear elementos del carrusel
    carouselData.forEach((item, index) => {
        console.log(`Creando elemento ${index + 1}:`, item);
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item' + (index === 0 ? ' active' : '');
        carouselItem.innerHTML = `
            <img src="${item.src}" alt="${item.title}" onerror="this.src='imagenes/sin-foto.png'">
            <div class="carousel-overlay">
                <h5>${item.title}</h5>
                <p>${item.description}</p>
            </div>
        `;
        carouselTrack.appendChild(carouselItem);
        
        // Verificar si la imagen se carga correctamente
        const img = carouselItem.querySelector('img');
        img.onload = () => console.log(`Imagen ${index + 1} cargada correctamente:`, item.src);
        img.onerror = () => console.error(`Error cargando imagen ${index + 1}:`, item.src);
    });

    // Mostrar solo la primera imagen
    carouselCurrentIndex = 0;
    showCarouselImage(0);
    startCarouselAutoSlide();
}

// ==========================================================================
// GALERÍA
// ==========================================================================
function loadGallery(category) {
    // Crear sección de galería si no existe
    createGallerySection(category);
    
    const galleryContainer = document.getElementById(category + '-gallery');
    if (!galleryContainer) return;
    
    galleryContainer.innerHTML = '';

    const images = galleryData[category] || [];
    
    images.forEach(image => {
        const galleryItem = createGalleryItem(image);
        galleryContainer.appendChild(galleryItem);
    });

    // Mostrar mensaje si no hay imágenes
    if (images.length === 0) {
        galleryContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No hay imágenes en esta categoría aún.</p>
                ${isAdmin ? '<p><small>Como administrador, puedes agregar imágenes usando el panel de admin.</small></p>' : ''}
            </div>
        `;
    }
}

function createGallerySection(category) {
    const gallerySections = document.getElementById('gallerySections');
    if (!gallerySections) return;

    // Verificar si la sección ya existe
    if (document.getElementById(category)) return;

    const section = document.createElement('section');
    section.className = `gallery-section ${currentCategory === category ? '' : 'hidden'}`;
    section.id = category;
    
    section.innerHTML = `
        <div class="gallery-grid" id="${category}-gallery">
            <!-- Las imágenes se cargarán dinámicamente -->
        </div>
    `;
    
    gallerySections.appendChild(section);
}

function createGalleryItem(image) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
        <img src="${image.src}" alt="${image.title}" onerror="this.src='imagenes/sin-foto.png'">
        <div class="gallery-overlay">
            <button class="view-btn" onclick="openImageModal('${image.id}')">
                Ver
            </button>
        </div>
        <div class="admin-controls admin-only ${isAdmin ? '' : 'hidden'}">
            <button class="admin-btn" onclick="editImage('${image.id}')" title="Editar">
                <i class="fas fa-edit"></i>
            </button>
            <button class="admin-btn" onclick="deleteImageFromGallery('${image.id}')" title="Eliminar">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    return item;
}

// ==========================================================================
// MODAL DE IMAGEN
// ==========================================================================
function openImageModal(imageId) {
    const image = findImageById(imageId);
    if (!image) return;

    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalDate = document.getElementById('modalDate');
    const overlay = document.getElementById('imageModalOverlay');

    if (modalImage) {
        modalImage.src = image.src;
        setImageFallback(modalImage);
    }
    if (modalTitle) {
        modalTitle.textContent = image.title || '';
    }
    if (modalDescription) {
        modalDescription.innerHTML = `<p>${image.description || ''}</p>`;
    }
    if (modalDate) {
        let fecha = image.timestamp ? new Date(image.timestamp) : null;
        modalDate.textContent = fecha ? fecha.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Sin fecha';
    }
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    if (overlay) {
        overlay.classList.add('show');
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    const overlay = document.getElementById('imageModalOverlay');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    if (overlay) {
        overlay.classList.remove('show');
    }
}

function findImageById(id) {
    for (let category in galleryData) {
        const image = galleryData[category].find(img => img.id == id);
        if (image) return image;
    }
    return null;
}

function formatCategoryName(category) {
    return categories[category] ? categories[category].name : category;
}

// ==========================================================================
// ADMINISTRACIÓN
// ==========================================================================
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    // Remover estilos inline que puedan estar ocultando el panel
    panel.style.removeProperty('display');
    panel.style.removeProperty('visibility');
    panel.style.removeProperty('opacity');
    panel.classList.add('show');
    document.getElementById('adminPassword').focus();
}

// Función para acceso secreto al admin mediante URL
function checkSecretAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const secretKey = urlParams.get('admin');
    
    if (secretKey === 'true') {
        // Mostrar el panel de admin automáticamente SOLO si la URL lo pide
        const panel = document.getElementById('adminPanel');
        panel.style.removeProperty('display');
        panel.style.removeProperty('visibility');
        panel.style.removeProperty('opacity');
        panel.classList.add('show');
        // Enfocar el campo de contraseña
        const passwordField = document.getElementById('adminPassword');
        if (passwordField) {
            passwordField.focus();
        }
    } else {
        // Por defecto, ocultar el panel de admin
        const panel = document.getElementById('adminPanel');
        if(panel) {
            panel.classList.remove('show');
            panel.style.display = 'none';
            panel.style.visibility = 'hidden';
            panel.style.opacity = '0';
        }
    }
}

// Función para resetear datos del carrusel (solución temporal)
function resetCarouselData() {
    if (confirm('¿Estás seguro de que quieres resetear los datos del carrusel? Esto eliminará todas las imágenes subidas desde el admin.')) {
        localStorage.removeItem('portfolioCarouselData');
        location.reload();
    }
}

// Función para convertir imágenes Base64 a rutas relativas
function convertBase64ToRelativePaths(data) {
    if (!Array.isArray(data)) return data;
    
    return data.map(item => {
        if (item.src && item.src.startsWith('data:image/')) {
            // Es una imagen Base64, convertir a ruta relativa
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `carousel_converted_${timestamp}.jpg`;
            const filePath = `imagenes/${fileName}`;
            
            // Crear un enlace temporal para descargar la imagen
            const link = document.createElement('a');
            link.href = item.src;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Actualizar la ruta
            item.src = filePath;
            item.fileName = fileName;
            
            showNotification(`Imagen convertida y descargada: ${fileName}`, 'info');
        }
        return item;
    });
}

// Función para cargar carrusel desde Firebase
async function loadCarouselFromFirebase() {
    try {
        if (showFirebaseConfigError()) {
            // Si Firebase no está configurado, usar datos locales
            loadCarousel();
            return;
        }

        const carouselItems = await getFromFirestore('carousel', 'timestamp', 'desc');
        
        // Convertir formato de Firebase a formato local
        carouselData = carouselItems.map(item => ({
            id: item.id,
            src: item.imageUrl,
            title: item.title,
            description: item.description,
            category: item.category || 'featured',
            fileName: item.fileName
        }));

        loadCarousel();
    } catch (error) {
        console.error('Error cargando carrusel desde Firebase:', error);
        // Fallback a datos locales
        loadCarousel();
    }
}

// Función para cargar galería desde Firebase
async function loadGalleryFromFirebase() {
    try {
        if (showFirebaseConfigError()) {
            // Si Firebase no está configurado, usar datos locales
            return;
        }

        const galleryItems = await getFromFirestore('gallery', 'timestamp', 'desc');
        
        // Organizar por categorías
        const newGalleryData = {};
        
        galleryItems.forEach(item => {
            const category = item.category;
            if (!newGalleryData[category]) {
                newGalleryData[category] = [];
            }
            
            newGalleryData[category].push({
                id: item.id,
                src: item.imageUrl,
                title: item.title,
                description: item.description,
                category: category,
                fileName: item.fileName,
                timestamp: item.timestamp
            });
        });

        // Actualizar datos globales
        Object.keys(newGalleryData).forEach(category => {
            galleryData[category] = newGalleryData[category];
        });

    } catch (error) {
        console.error('Error cargando galería desde Firebase:', error);
        // Fallback a datos locales
    }
}

// Función para verificar el estado del carrusel
function checkCarouselStatus() {
    console.log('Estado actual del carrusel:', carouselData);
    
    if (carouselData.length === 0) {
        showNotification('El carrusel está vacío. Agrega imágenes desde el admin.', 'info');
        return;
    }
    
    // Verificar elementos del DOM
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselItems = carouselTrack ? carouselTrack.querySelectorAll('.carousel-item') : [];
    console.log('Elementos del carrusel en el DOM:', carouselItems.length);
    
    carouselData.forEach((item, index) => {
        console.log(`Imagen ${index + 1}:`, {
            title: item.title,
            src: item.src,
            isBase64: item.src && item.src.startsWith('data:image/'),
            isRelative: item.src && item.src.startsWith('imagenes/'),
            isFirebase: item.src && item.src.includes('firebase'),
            isUrl: item.src && (item.src.startsWith('http://') || item.src.startsWith('https://'))
        });
        
        if (item.src && item.src.startsWith('data:image/')) {
            showNotification(`Imagen ${index + 1} está en Base64. Usa "Resetear Carrusel" para solucionarlo.`, 'warning');
        }
        
        if (!item.src) {
            showNotification(`Imagen ${index + 1} no tiene URL válida.`, 'error');
        }
    });
    
    // Verificar si Firebase está configurado
    if (isFirebaseConfigured()) {
        console.log('Firebase está configurado correctamente');
    } else {
        console.log('Firebase NO está configurado');
    }
}

// Función para descargar imágenes automáticamente
function downloadImage(file, fileName) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ==========================================================================
// FUNCIONES DE ADMINISTRACIÓN
// ==========================================================================
async function addCarouselImage() {
    if (showFirebaseConfigError()) return;
    // Mostrar modal de opciones
    const modal = document.createElement('div');
    modal.className = 'image-modal show';
    modal.id = 'addCarouselOptionModal';
    modal.innerHTML = `
        <div class="modal-ig-content" style="max-width:400px;min-width:320px;flex-direction:column;align-items:center;">
            <h4>¿Qué deseas hacer?</h4>
            <div style="display:flex;gap:1.5rem;justify-content:center;margin:2rem 0;">
                <button class="btn btn-primary" id="btnUploadNewCarousel">Subir nueva imagen</button>
                <button class="btn btn-secondary" id="btnChooseExistingCarousel">Elegir existente</button>
            </div>
            <button class="btn btn-link" style="position:absolute;top:10px;right:18px;font-size:1.5rem;" onclick="document.body.removeChild(document.getElementById('addCarouselOptionModal'))">&times;</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('btnUploadNewCarousel').onclick = function() {
        document.body.removeChild(modal);
        showCarouselUploadForm();
    };
    document.getElementById('btnChooseExistingCarousel').onclick = async function() {
        document.body.removeChild(modal);
        await openSelectExistingImageModal();
    };
}

function showCarouselUploadForm() {
    document.getElementById('carouselAddOptions').style.display = 'none';
    document.getElementById('carouselUploadForm').style.display = 'block';
}

function addCarouselImage_upload() {
    const fileInput = document.getElementById('carouselImageFile');
    const titleInput = document.getElementById('carouselImageTitle');
    const descInput = document.getElementById('carouselImageDesc');
    const file = fileInput.files[0];
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    if (!file) {
        showNotification('Por favor, selecciona una imagen.', 'error');
        return;
    }
    if (!title) {
        showNotification('Por favor, proporciona un título para la imagen.', 'error');
        return;
    }
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor, selecciona un archivo de imagen válido.', 'error');
        return;
    }
    if (file.size > 50 * 1024 * 1024) {
        showNotification('El archivo es demasiado grande. Máximo 50MB.', 'error');
        return;
    }
    showNotification('Comprimiendo y subiendo imagen...', 'info');
    uploadImageToFirebase(file).then(uploadResult => {
        // Mostrar información de compresión
        if (uploadResult.compressionInfo) {
            const info = uploadResult.compressionInfo;
            showNotification(`Imagen comprimida exitosamente! Reducción: ${info.compressionRatio}% (${info.sizeReductionKB}KB ahorrados)`, 'success');
        }
        
        const carouselDataObj = {
            title: title,
            description: description || 'Sin descripción',
            category: 'featured',
            imageUrl: uploadResult.url,
            fileName: uploadResult.fileName,
            timestamp: uploadResult.timestamp,
            originalSize: uploadResult.originalSize,
            compressedSize: uploadResult.compressedSize,
            compressionInfo: uploadResult.compressionInfo
        };
        return saveToFirestore('carousel', carouselDataObj);
    }).then(async () => {
        await loadCarouselFromFirebase();
        loadCarouselEditor();
        // Limpiar formulario y volver a opciones
        fileInput.value = '';
        titleInput.value = '';
        descInput.value = '';
        document.getElementById('carouselUploadForm').style.display = 'none';
        document.getElementById('carouselAddOptions').style.display = 'block';
        showNotification('Imagen agregada al carrusel exitosamente!', 'success');
    }).catch(error => {
        console.error('Error al agregar imagen al carrusel:', error);
        showNotification('Error al subir la imagen. Intenta de nuevo.', 'error');
    });
}

function addCarouselImage_selectExisting() {
    openSelectExistingImageModal();
}

async function openSelectExistingImageModal() {
    const panel = document.getElementById('selectExistingImagePanel');
    const gallery = document.getElementById('existingImagesGallery');
    const form = document.getElementById('existingImageForm');
    const titleInput = document.getElementById('existingImageTitle');
    const descInput = document.getElementById('existingImageDesc');
    let selectedImg = null;
    // Limpiar
    gallery.innerHTML = '';
    form.style.display = 'none';
    titleInput.value = '';
    descInput.value = '';
    // Unir imágenes de galería y carrusel (sin duplicados por src)
    let images = [];
    Object.values(galleryData).forEach(arr => images.push(...arr));
    images.push(...carouselData);
    const seen = new Set();
    images = images.filter(img => {
        if (!img.src || seen.has(img.src)) return false;
        seen.add(img.src);
        return true;
    });
    // Mostrar miniaturas
    images.forEach(img => {
        const thumb = document.createElement('img');
        thumb.src = img.src;
        thumb.alt = img.title || '';
        thumb.style = 'width:90px;height:90px;object-fit:cover;cursor:pointer;border:2px solid transparent;border-radius:8px;margin:4px;';
        thumb.onclick = function() {
            // Seleccionar
            Array.from(gallery.children).forEach(el => el.style.border = '2px solid transparent');
            thumb.style.border = '2px solid #667eea';
            selectedImg = img;
            form.style.display = 'block';
            titleInput.value = img.title || '';
            descInput.value = img.description || '';
        };
        gallery.appendChild(thumb);
    });
    // Submit
    form.onsubmit = async function(e) {
        e.preventDefault();
        if (!selectedImg) return;
        // Guardar en carrusel
        const carouselDataObj = {
            title: titleInput.value.trim() || selectedImg.title || '',
            description: descInput.value.trim() || '',
            category: 'featured',
            imageUrl: selectedImg.src,
            fileName: selectedImg.fileName,
            timestamp: Date.now()
        };
        await saveToFirestore('carousel', carouselDataObj);
        await loadCarouselFromFirebase();
        loadCarouselEditor();
        closeSelectExistingImagePanel();
        showNotification('Imagen agregada al carrusel exitosamente!', 'success');
    };
    // Mostrar panel
    panel.style.display = 'flex';
    setTimeout(()=>panel.classList.add('show'),10);
}

function closeSelectExistingImagePanel() {
    const panel = document.getElementById('selectExistingImagePanel');
    panel.classList.remove('show');
    setTimeout(()=>{panel.style.display='none';},200);
}

async function addImageToGallery() {
    if (showFirebaseConfigError()) return;
    openGalleryEditor();
}

// ==========================================================================
// EDITOR DE GALERÍA
// ==========================================================================
function openGalleryEditor() {
    const editor = document.getElementById('galleryEditor');
    editor.style.display = 'block';
    loadGalleryEditor();
}

function closeGalleryEditor() {
    document.getElementById('galleryEditor').style.display = 'none';
}

function loadGalleryEditor() {
    const container = document.getElementById('galleryItemsList');
    const categorySelect = document.getElementById('galleryImageCategory');
    const fileInput = document.getElementById('galleryImageFile');
    const previewImg = document.getElementById('galleryImagePreview');
    // Preview de imagen
    if (fileInput && previewImg) {
        fileInput.onchange = function() {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    previewImg.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                previewImg.src = '';
                previewImg.style.display = 'none';
            }
        };
    }
    
    // Cargar opciones de categorías
    categorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';
    Object.entries(categories).forEach(([key, category]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
    
    // Mostrar todas las imágenes de la galería
    container.innerHTML = '';
    
    Object.entries(galleryData).forEach(([categoryKey, images]) => {
        if (images.length > 0) {
            const categoryTitle = document.createElement('h6');
            categoryTitle.textContent = categories[categoryKey]?.name || categoryKey;
            categoryTitle.className = 'text-muted mb-2';
            container.appendChild(categoryTitle);
            
            images.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'gallery-item-admin';
                itemDiv.innerHTML = `
                    <img src="${item.src}" alt="${item.title}" onerror="this.src='imagenes/sin-foto.png'">
                    <div class="item-info">
                        <h6>${item.title}</h6>
                        <p class="text-muted mb-0">${item.description}</p>
                        <small class="text-muted">Categoría: ${categories[item.category]?.name || item.category}</small>
                    </div>
                    <div class="item-controls">
                        <button class="btn btn-sm btn-outline-primary" onclick="editGalleryItem('${item.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteGalleryItem('${item.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                container.appendChild(itemDiv);
            });
        }
    });
}

async function addGalleryImage() {
    if (showFirebaseConfigError()) return;
    const fileInput = document.getElementById('galleryImageFile');
    const titleInput = document.getElementById('galleryImageTitle');
    const descInput = document.getElementById('galleryImageDesc');
    const dateInput = document.getElementById('galleryImageDate');
    const categorySelect = document.getElementById('galleryImageCategory');
    const file = fileInput.files[0];
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const categoryKey = categorySelect.value;
    const dateValue = dateInput.value;
    if (!file) {
        showNotification('Por favor, selecciona una imagen.', 'error');
        return;
    }
    if (!title) {
        showNotification('Por favor, proporciona un título para la imagen.', 'error');
        return;
    }
    if (!categoryKey) {
        showNotification('Por favor, selecciona una categoría.', 'error');
        return;
    }
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor, selecciona un archivo de imagen válido.', 'error');
        return;
    }
    if (file.size > 50 * 1024 * 1024) {
        showNotification('El archivo es demasiado grande. Máximo 50MB.', 'error');
        return;
    }
    showNotification('Comprimiendo y subiendo imagen...', 'info');
    try {
        const uploadResult = await uploadImageToFirebase(file);
        
        // Mostrar información de compresión
        if (uploadResult.compressionInfo) {
            const info = uploadResult.compressionInfo;
            showNotification(`Imagen comprimida exitosamente! Reducción: ${info.compressionRatio}% (${info.sizeReductionKB}KB ahorrados)`, 'success');
        }
        
        const galleryDataObj = {
            title: title,
            description: description || '',
            category: categoryKey,
            imageUrl: uploadResult.url,
            fileName: uploadResult.fileName,
            timestamp: dateValue ? new Date(dateValue).getTime() : uploadResult.timestamp,
            originalSize: uploadResult.originalSize,
            compressedSize: uploadResult.compressedSize,
            compressionInfo: uploadResult.compressionInfo
        };
        await saveToFirestore('gallery', galleryDataObj);
        await loadGalleryFromFirebase();
        loadGallery(currentCategory);
        loadGalleryEditor();
        // Limpiar formulario
        fileInput.value = '';
        titleInput.value = '';
        descInput.value = '';
        dateInput.value = '';
        categorySelect.value = '';
        const previewImg = document.getElementById('galleryImagePreview');
        if (previewImg) {
            previewImg.src = '';
            previewImg.style.display = 'none';
        }
        showNotification('Imagen agregada a la galería exitosamente!', 'success');
    } catch (error) {
        console.error('Error al agregar imagen a la galería:', error);
        showNotification('Error al subir la imagen. Intenta de nuevo.', 'error');
    }
}

function editGalleryItem(imageId) {
    const image = findImageById(imageId);
    if (!image) return;
    const newTitle = prompt('Nuevo título:', image.title);
    if (newTitle === null) return;
    const newDesc = prompt('Nueva descripción:', image.description);
    if (newDesc === null) return;
    // Mostrar opciones de categoría
    const categoryOptions = Object.keys(categories).map(key => `${key}: ${categories[key].name}`).join('\n');
    const newCategory = prompt(`Nueva categoría (escribe la clave):\n${categoryOptions}`, image.category);
    if (newCategory === null) return;
    if (!categories[newCategory]) {
        showNotification('Categoría inválida', 'error');
        return;
    }
    // Editar fecha
    let currentDate = image.timestamp ? new Date(image.timestamp).toISOString().slice(0,10) : '';
    const newDate = prompt('Nueva fecha (YYYY-MM-DD):', currentDate);
    let newTimestamp = image.timestamp;
    if (newDate !== null && newDate !== '') {
        newTimestamp = new Date(newDate).getTime();
    }
    image.title = newTitle;
    image.description = newDesc;
    image.category = newCategory;
    image.timestamp = newTimestamp;
    saveAllData();
    loadGallery(currentCategory);
    loadGalleryEditor();
    showNotification('Imagen de galería actualizada', 'success');
}

async function deleteGalleryItem(imageId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen de la galería?')) {
        return;
    }
    
    const image = findImageById(imageId);
    if (!image) return;
    
    try {
        if (isFirebaseConfigured() && image.id) {
            // Eliminar de Firebase
            await deleteFromFirestore('gallery', image.id);
            
            // Eliminar imagen de Storage si existe
            if (image.fileName) {
                try {
                    await deleteImageFromStorage(image.fileName);
                } catch (storageError) {
                    console.warn('No se pudo eliminar la imagen de Storage:', storageError);
                }
            }
            
            // Recargar desde Firebase
            await loadGalleryFromFirebase();
        } else {
            // Eliminar de datos locales
            const category = image.category;
            const index = galleryData[category].findIndex(img => img.id === imageId);
            if (index !== -1) {
                galleryData[category].splice(index, 1);
                saveAllData();
                loadGallery(currentCategory);
            }
        }
        
        loadGalleryEditor();
        showNotification('Imagen eliminada de la galería', 'success');
    } catch (error) {
        console.error('Error eliminando imagen de la galería:', error);
        showNotification('Error al eliminar la imagen', 'error');
    }
}

function closeAdminPanel() {
    const panel = document.getElementById('adminPanel');
    panel.classList.remove('show');
    panel.style.display = 'none';
    panel.style.visibility = 'hidden';
    panel.style.opacity = '0';
}

function adminLogin() {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            isAdmin = true;
            document.getElementById('adminLogin').classList.add('hidden');
            document.getElementById('adminInterface').classList.remove('hidden');
            document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
            loadGallery(currentCategory);
            showNotification('¡Acceso de administrador concedido!', 'success');
            
            // Cerrar el panel de admin y redirigir a la página principal
            closeAdminPanel();
            setTimeout(() => {
                window.location.href = window.location.origin + window.location.pathname;
            }, 1000); // Esperar 1 segundo para que se vea la notificación
        })
        .catch(error => {
            showNotification('Correo o contraseña incorrectos', 'error');
            document.getElementById('adminPassword').value = '';
        });
}

function adminLogout() {
    firebase.auth().signOut().then(() => {
        isAdmin = false;
        document.getElementById('adminLogin').classList.remove('hidden');
        document.getElementById('adminInterface').classList.add('hidden');
        document.getElementById('adminEmail').value = '';
        document.getElementById('adminPassword').value = '';
        document.querySelectorAll('.admin-only').forEach(el => el.classList.add('hidden'));
        loadGallery(currentCategory);
        closeAdminPanel();
        showNotification('Sesión de administrador cerrada', 'info');
        setTimeout(() => { window.location.href = '/'; }, 500);
    });
}

// Mantener estado admin si el usuario ya está logueado
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        isAdmin = true;
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminInterface').classList.remove('hidden');
        document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
        loadGallery(currentCategory);
        // NO mostrar el panel admin automáticamente
        // document.getElementById('adminPanel').style.display = 'block';
    } else {
        isAdmin = false;
        document.getElementById('adminLogin').classList.remove('hidden');
        document.getElementById('adminInterface').classList.add('hidden');
        document.querySelectorAll('.admin-only').forEach(el => el.classList.add('hidden'));
        loadGallery(currentCategory);
        // document.getElementById('adminPanel').style.display = 'none';
    }
});

// ==========================================================================
// EDITOR DE CARRUSEL
// ==========================================================================
function openCarouselEditor() {
    const editor = document.getElementById('carouselEditor');
    editor.style.display = 'block';
    loadCarouselEditor();
    // Resetear panel derecho
    const addOptions = document.getElementById('carouselAddOptions');
    const uploadForm = document.getElementById('carouselUploadForm');
    if (addOptions) addOptions.style.display = 'block';
    if (uploadForm) {
        uploadForm.style.display = 'none';
        // Limpiar campos
        uploadForm.reset && uploadForm.reset();
        const fileInput = document.getElementById('carouselImageFile');
        const titleInput = document.getElementById('carouselImageTitle');
        const descInput = document.getElementById('carouselImageDesc');
        if (fileInput) fileInput.value = '';
        if (titleInput) titleInput.value = '';
        if (descInput) descInput.value = '';
    }
}

function closeCarouselEditor() {
    document.getElementById('carouselEditor').style.display = 'none';
}

function loadCarouselEditor() {
    const container = document.getElementById('carouselItemsList');
    container.innerHTML = '';

    carouselData.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'carousel-item-admin';
        itemDiv.innerHTML = `
            <img src="${item.src}" alt="${item.title}" onerror="this.src='imagenes/sin-foto.png'">
            <div class="item-info">
                <h6>${item.title}</h6>
                <p class="text-muted mb-0">${item.description}</p>
            </div>
            <div class="item-controls">
                <button class="btn btn-sm btn-outline-primary" onclick="editCarouselItem(${index})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" onclick="moveCarouselItem(${index}, -1)" title="Mover arriba" ${index === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" onclick="moveCarouselItem(${index}, 1)" title="Mover abajo" ${index === carouselData.length - 1 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteCarouselItem(${index})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(itemDiv);
    });
}



async function editCarouselItem(index) {
    const item = carouselData[index];
    if (!item) return;

    const newTitle = prompt('Nuevo título:', item.title);
    if (newTitle === null) return;

    const newDesc = prompt('Nueva descripción:', item.description);
    if (newDesc === null) return;

    // Actualizar datos locales
    item.title = newTitle;
    item.description = newDesc;

    try {
        if (isFirebaseConfigured() && item.id) {
            // Actualizar en Firebase
            const updateData = {
                title: newTitle,
                description: newDesc
            };
            await updateInFirestore('carousel', item.id, updateData);
            showNotification('Elemento del carrusel actualizado en Firebase', 'success');
        } else {
            // Solo guardar localmente si no hay Firebase
            saveAllData();
            showNotification('Elemento del carrusel actualizado localmente', 'success');
        }
        
        // Actualizar vista
        loadCarousel();
        loadCarouselEditor();
    } catch (error) {
        console.error('Error actualizando elemento del carrusel:', error);
        showNotification('Error al actualizar el elemento', 'error');
        // Revertir cambios locales si falla Firebase
        await loadCarouselFromFirebase();
        loadCarouselEditor();
    }
}

async function moveCarouselItem(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= carouselData.length) return;

    // Mover elemento en datos locales
    const item = carouselData.splice(index, 1)[0];
    carouselData.splice(newIndex, 0, item);

    try {
        if (isFirebaseConfigured()) {
            // Actualizar orden en Firebase - necesitamos actualizar los timestamps
            // para que el orden se mantenga correcto
            const now = Date.now();
            const updatePromises = carouselData.map((item, idx) => {
                if (item.id) {
                    const newTimestamp = now - (carouselData.length - idx) * 1000; // Espaciar timestamps
                    return updateInFirestore('carousel', item.id, { timestamp: newTimestamp });
                }
                return Promise.resolve();
            });
            
            await Promise.all(updatePromises);
            showNotification('Orden del carrusel actualizado en Firebase', 'success');
        } else {
            // Solo guardar localmente si no hay Firebase
            saveAllData();
            showNotification('Orden del carrusel actualizado localmente', 'success');
        }
        
        // Actualizar vista
        loadCarousel();
        loadCarouselEditor();
    } catch (error) {
        console.error('Error actualizando orden del carrusel:', error);
        showNotification('Error al actualizar el orden', 'error');
        // Revertir cambios locales si falla Firebase
        await loadCarouselFromFirebase();
        loadCarouselEditor();
    }
}

async function deleteCarouselItem(index) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen del carrusel?')) {
        return;
    }

    const item = carouselData[index];
    if (!item) return;

    try {
        if (isFirebaseConfigured() && item.id) {
            // Eliminar de Firebase
            await deleteFromFirestore('carousel', item.id);
            
            // Eliminar imagen de Storage si existe
            if (item.fileName) {
                try {
                    await deleteImageFromStorage(item.fileName);
                } catch (storageError) {
                    console.warn('No se pudo eliminar la imagen de Storage:', storageError);
                }
            }
            
            // Recargar desde Firebase
            await loadCarouselFromFirebase();
        } else {
            // Eliminar de datos locales
            carouselData.splice(index, 1);
            saveAllData();
            loadCarousel();
        }
        
        loadCarouselEditor();
        showNotification('Imagen eliminada del carrusel', 'success');
    } catch (error) {
        console.error('Error eliminando imagen del carrusel:', error);
        showNotification('Error al eliminar la imagen', 'error');
    }
}

// ==========================================================================
// EDITOR DE SECCIONES
// ==========================================================================
function editAboutSection() {
    openSectionEditor('about', 'Editor de Perfil', {
        title: siteConfig.aboutTitle,
        biography: siteConfig.biography,
        profileImage: siteConfig.profileImage
    });
}

function editContactSection() {
    openSectionEditor('contact', 'Editor de Contacto', {
        title: siteConfig.contactTitle,
        description: siteConfig.contactDescription,
        email: siteConfig.email,
        socialLinks: socialLinks
    });
}

function openSectionEditor(section, title, data) {
    const editor = document.getElementById('sectionEditor');
    const editorTitle = document.getElementById('sectionEditorTitle');
    const editorContent = document.getElementById('sectionEditorContent');

    editorTitle.textContent = title;
    editor.style.display = 'block';

    if (section === 'about') {
        editorContent.innerHTML = `
            <form class="section-editor-form" onsubmit="saveAboutSection(event)">
                <div class="form-group">
                    <label for="aboutTitle">Título de la sección:</label>
                    <input type="text" class="form-control" id="aboutTitle" value="${data.title}" required>
                </div>
                <div class="form-group">
                    <label for="aboutBiography">Biografía:</label>
                    <textarea class="form-control" id="aboutBiography" rows="8" required>${data.biography}</textarea>
                </div>
                <div class="form-group">
                    <label for="profileImage">URL de la imagen de perfil:</label>
                    <input type="text" class="form-control" id="profileImage" value="${data.profileImage}">
                </div>
                <div class="form-group">
                    <label for="profileImageFile">O subir nueva imagen:</label>
                    <input type="file" class="form-control" id="profileImageFile" accept="image/*">
                </div>
                <button type="submit" class="btn btn-primary">Guardar Cambios</button>
            </form>
        `;
    } else if (section === 'contact') {
        let socialLinksHtml = '';
        Object.entries(data.socialLinks).forEach(([key, social]) => {
            socialLinksHtml += `
                <div class="form-group">
                    <label for="${key}Url">${key.charAt(0).toUpperCase() + key.slice(1)} URL:</label>
                    <input type="url" class="form-control" id="${key}Url" value="${social.url}">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="${key}Enabled" ${social.enabled ? 'checked' : ''}>
                        <label class="form-check-label" for="${key}Enabled">
                            Mostrar ${key}
                        </label>
                    </div>
                </div>
            `;
        });

        editorContent.innerHTML = `
            <form class="section-editor-form" onsubmit="saveContactSection(event)">
                <div class="form-group">
                    <label for="contactTitle">Título de la sección:</label>
                    <input type="text" class="form-control" id="contactTitle" value="${data.title}" required>
                </div>
                <div class="form-group">
                    <label for="contactDescription">Descripción:</label>
                    <textarea class="form-control" id="contactDescription" rows="3" required>${data.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="contactEmail">Email de contacto:</label>
                    <input type="email" class="form-control" id="contactEmail" value="${data.email}" required>
                </div>
                <h6>Redes Sociales</h6>
                ${socialLinksHtml}
                <button type="submit" class="btn btn-primary">Guardar Cambios</button>
            </form>
        `;
    }
}

function closeSectionEditor() {
    document.getElementById('sectionEditor').style.display = 'none';
}

function saveAboutSection(event) {
    event.preventDefault();
    
    siteConfig.aboutTitle = document.getElementById('aboutTitle').value;
    siteConfig.biography = document.getElementById('aboutBiography').value;
    siteConfig.profileImage = document.getElementById('profileImage').value;

    // Manejar subida de nueva imagen
    const fileInput = document.getElementById('profileImageFile');
    if (fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            siteConfig.profileImage = e.target.result;
            saveAllData();
            applySiteConfig();
            closeSectionEditor();
            showNotification('Perfil actualizado exitosamente!', 'success');
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveAllData();
        applySiteConfig();
        closeSectionEditor();
        showNotification('Perfil actualizado exitosamente!', 'success');
    }
}

function saveContactSection(event) {
    event.preventDefault();
    
    siteConfig.contactTitle = document.getElementById('contactTitle').value;
    siteConfig.contactDescription = document.getElementById('contactDescription').value;
    siteConfig.email = document.getElementById('contactEmail').value;

    // Actualizar redes sociales
    Object.keys(socialLinks).forEach(key => {
        socialLinks[key].url = document.getElementById(key + 'Url').value;
        socialLinks[key].enabled = document.getElementById(key + 'Enabled').checked;
    });

    saveAllData();
    applySiteConfig();
    closeSectionEditor();
    showNotification('Información de contacto actualizada!', 'success');
}

// ==========================================================================
// EDITOR DE CAMPOS INDIVIDUALES
// ==========================================================================
function editField(button) {
    const container = button.parentElement;
    const currentText = container.textContent.trim();
    const field = container.getAttribute('data-field');
    
    const newValue = prompt(`Editar ${field}:`, currentText);
    if (newValue === null || newValue.trim() === '') return;

    // Actualizar el texto
    container.textContent = newValue;
    
    // Actualizar configuración
    if (field === 'artistName') {
        siteConfig.artistName = newValue;
    } else if (field === 'subtitle') {
        siteConfig.subtitle = newValue;
    } else if (field === 'featuredTitle') {
        siteConfig.featuredTitle = newValue;
    } else if (field === 'aboutTitle') {
        siteConfig.aboutTitle = newValue;
    } else if (field === 'contactTitle') {
        siteConfig.contactTitle = newValue;
    } else if (field === 'contactDescription') {
        siteConfig.contactDescription = newValue;
    } else if (field === 'email') {
        siteConfig.email = newValue;
        container.href = `mailto:${newValue}`;
    }

    saveAllData();
    showNotification('Campo actualizado exitosamente!', 'success');
}

// ==========================================================================
// GESTIÓN DE CATEGORÍAS
// ==========================================================================
function addNewCategory() {
    const name = prompt('Nombre de la nueva categoría:');
    if (!name || name.trim() === '') return;

    const key = name.toLowerCase().replace(/\s+/g, '-');
    const icon = prompt('Icono (ej: fas fa-palette):', 'fas fa-palette');
    const description = prompt('Descripción de la categoría:');

    categories[key] = {
        name: name,
        icon: icon || 'fas fa-palette',
        description: description || ''
    };

    galleryData[key] = [];

    saveAllData();
    setupCategoryNavigation();
    showNotification('Nueva categoría creada!', 'success');
}

function manageCategories() {
    let categoriesList = 'Categorías actuales:\n\n';
    Object.entries(categories).forEach(([key, category]) => {
        categoriesList += `${category.name} (${key})\n`;
    });
    
    alert(categoriesList);
}

// ==========================================================================
// GESTIÓN DE IMÁGENES
// ==========================================================================
function saveImageChanges() {
    const modal = document.getElementById('imageModal');
    const imageId = modal.getAttribute('data-current-image-id');
    const newTitle = document.getElementById('modalTitleInput').value;
    const newDescription = document.getElementById('modalCaption').value;
    const newCategory = document.getElementById('modalCategorySelect').value;

    const image = findImageById(imageId);
    if (!image) return;

    // Remover de categoría anterior
    for (let category in galleryData) {
        galleryData[category] = galleryData[category].filter(img => img.id != imageId);
    }

    // Actualizar imagen
    image.title = newTitle;
    image.description = newDescription;
    image.category = newCategory;

    // Agregar a nueva categoría
    if (!galleryData[newCategory]) {
        galleryData[newCategory] = [];
    }
    galleryData[newCategory].push(image);

    saveAllData();
    loadGallery(currentCategory);
    closeImageModal();
    showNotification('Imagen actualizada exitosamente!', 'success');
}

function deleteImageFromGallery(imageId) {
    const image = findImageById(imageId);
    if (!image) return;
    
    if (!confirm(`¿Estás seguro de que quieres eliminar "${image.title}"?`)) {
        return;
    }

    // Encontrar y eliminar la imagen
    for (let category in galleryData) {
        galleryData[category] = galleryData[category].filter(img => img.id != imageId);
    }

    saveAllData();
    loadGallery(currentCategory);
    closeImageModal();
    showNotification('Imagen eliminada exitosamente', 'success');
}

function editImage(imageId) {
    openImageModal(imageId);
}

function deleteImage() {
    const modal = document.getElementById('imageModal');
    const imageId = modal.getAttribute('data-current-image-id');
    deleteImageFromGallery(imageId);
}

// ==========================================================================
// REDES SOCIALES
// ==========================================================================
function loadSocialLinks() {
    const container = document.getElementById('socialLinks');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(socialLinks).forEach(([key, social]) => {
        if (social.enabled) {
            const link = document.createElement('a');
            link.href = social.url;
            link.className = 'social-link';
            link.target = '_blank';
            link.innerHTML = `<i class="${social.icon}"></i>`;
            container.appendChild(link);
        }
    });
}

function changeProfileImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            showNotification('Por favor, selecciona un archivo de imagen válido.', 'error');
            return;
        }
        
        if (file.size > 50 * 1024 * 1024) {
            showNotification('El archivo es demasiado grande. Máximo 50MB.', 'error');
            return;
        }
        
        try {
            showNotification('Comprimiendo y subiendo imagen...', 'info');
            const uploadResult = await uploadImageToFirebase(file);
            
            // Mostrar información de compresión
            if (uploadResult.compressionInfo) {
                const info = uploadResult.compressionInfo;
                showNotification(`Imagen comprimida exitosamente! Reducción: ${info.compressionRatio}% (${info.sizeReductionKB}KB ahorrados)`, 'success');
            }
            
            siteConfig.profileImage = uploadResult.url;
            saveAllData();
            applySiteConfig();
            showNotification('Foto de perfil actualizada!', 'success');
        } catch (error) {
            console.error('Error al subir imagen de perfil:', error);
            showNotification('Error al subir la imagen de perfil.', 'error');
        }
    };
    
    input.click();
}

// ==========================================================================
// EVENTOS Y UTILIDADES
// ==========================================================================
function setupEventListeners() {
    // Eventos del teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
            closeAdminPanel();
            closeCarouselEditor();
            closeGalleryEditor();
            closeSectionEditor();
        }
    });

    // Cerrar modales al hacer clic fuera de ellos
    const modals = ['imageModal', 'adminPanel', 'carouselEditor', 'galleryEditor', 'sectionEditor'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    if (modalId === 'imageModal') closeImageModal();
                    else if (modalId === 'adminPanel') closeAdminPanel();
                    else if (modalId === 'carouselEditor') closeCarouselEditor();
                    else if (modalId === 'galleryEditor') closeGalleryEditor();
                    else if (modalId === 'sectionEditor') closeSectionEditor();
                }
            });
        }
    });

    // Permitir enter en el campo de contraseña
    const passwordField = document.getElementById('adminPassword');
    if (passwordField) {
        passwordField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                adminLogin();
            }
        });
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar notificación después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Eliminar la función initializeExampleData si existe
delete window.initializeExampleData;

// Llamar a la inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    const yearSpan = document.getElementById('footerYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    // Ya no se cargan datos de ejemplo locales
    // Solo se cargan datos desde Firebase
    loadCarouselFromFirebase();
    loadGalleryFromFirebase();
    // ... otras inicializaciones ...
    const prevBtn = document.getElementById('carouselPrevBtn');
    const nextBtn = document.getElementById('carouselNextBtn');
    if (prevBtn) prevBtn.onclick = () => showPrevCarouselImage(true);
    if (nextBtn) nextBtn.onclick = () => showNextCarouselImage(true);

    // Swipe events
    let startX = null;
    const track = document.getElementById('carouselTrack');
    if (track) {
        track.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
        });
        track.addEventListener('touchend', e => {
            if (startX === null) return;
            let endX = e.changedTouches[0].clientX;
            let diff = endX - startX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) showPrevCarouselImage(true);
                else showNextCarouselImage(true);
            }
            startX = null;
        });
    }

    // Cambia el botón de 'Agregar Imagen a Galería' para que invoque el nuevo flujo
    const btnAddGallery = document.querySelector('button.btn-success[onclick="addImageToGallery()"]');
    if (btnAddGallery) {
        btnAddGallery.onclick = addImageToGallery;
    }
});

// Asegurar fallback universal a 'imagenes/sin-foto.png' para cualquier imagen que falle
function setImageFallback(imgElement) {
    imgElement.onerror = function() {
        this.onerror = null;
        this.src = 'imagenes/sin-foto.png';
    };
} 
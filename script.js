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
    artistName: "Tu Nombre Artístico",
    subtitle: "Ilustrador Digital | Diseñador Creativo",
    email: "tu_email@ejemplo.com",
    profileImage: "imagenes/mi_foto_perfil.jpg",
    biography: "¡Hola! Soy un ilustrador digital apasionado por crear mundos visuales únicos...",
    featuredTitle: "Ilustraciones Destacadas",
    aboutTitle: "Sobre Mí",
    contactTitle: "Contáctame",
    contactDescription: "¿Interesado en trabajar juntos? ¡Me encantaría saber de ti!"
};

// Datos del carrusel
let carouselData = [];

// Categorías dinámicas
let categories = {
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
    }
};

// ==========================================================================
// INICIALIZACIÓN
// ==========================================================================
document.addEventListener('DOMContentLoaded', async function() {
    loadAllData();
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
    applySiteConfig();
    checkSecretAccess(); // Verificar acceso secreto mediante URL
});

// ==========================================================================
// GESTIÓN DE DATOS
// ==========================================================================
function loadAllData() {
    // Cargar configuración del sitio
    const savedConfig = localStorage.getItem('portfolioSiteConfig');
    if (savedConfig) {
        siteConfig = { ...siteConfig, ...JSON.parse(savedConfig) };
    }

    // Cargar datos del carrusel
    const savedCarousel = localStorage.getItem('portfolioCarouselData');
    if (savedCarousel) {
        carouselData = JSON.parse(savedCarousel);
        // Convertir imágenes Base64 a rutas relativas si es necesario
        carouselData = convertBase64ToRelativePaths(carouselData);
    }

    // Cargar categorías
    const savedCategories = localStorage.getItem('portfolioCategories');
    if (savedCategories) {
        categories = JSON.parse(savedCategories);
    }

    // Cargar datos de galería
    const savedGallery = localStorage.getItem('portfolioGalleryData');
    if (savedGallery) {
        galleryData = JSON.parse(savedGallery);
    }

    // Cargar redes sociales
    const savedSocial = localStorage.getItem('portfolioSocialLinks');
    if (savedSocial) {
        socialLinks = JSON.parse(savedSocial);
    }
}

function saveAllData() {
    localStorage.setItem('portfolioSiteConfig', JSON.stringify(siteConfig));
    localStorage.setItem('portfolioCarouselData', JSON.stringify(carouselData));
    localStorage.setItem('portfolioCategories', JSON.stringify(categories));
    localStorage.setItem('portfolioGalleryData', JSON.stringify(galleryData));
    localStorage.setItem('portfolioSocialLinks', JSON.stringify(socialLinks));
}

// ==========================================================================
// APLICACIÓN DE CONFIGURACIÓN
// ==========================================================================
function applySiteConfig() {
    // Aplicar nombre del artista
    const artistNameElements = document.querySelectorAll('[data-field="artistName"]');
    artistNameElements.forEach(el => {
        el.textContent = siteConfig.artistName;
    });

    // Aplicar subtítulo
    const subtitleElements = document.querySelectorAll('[data-field="subtitle"]');
    subtitleElements.forEach(el => {
        el.textContent = siteConfig.subtitle;
    });

    // Aplicar títulos de secciones
    const featuredTitle = document.querySelector('[data-field="featuredTitle"]');
    if (featuredTitle) featuredTitle.textContent = siteConfig.featuredTitle;

    const aboutTitle = document.querySelector('[data-field="aboutTitle"]');
    if (aboutTitle) aboutTitle.textContent = siteConfig.aboutTitle;

    const contactTitle = document.querySelector('[data-field="contactTitle"]');
    if (contactTitle) contactTitle.textContent = siteConfig.contactTitle;

    // Aplicar descripción de contacto
    const contactDesc = document.querySelector('[data-field="contactDescription"]');
    if (contactDesc) contactDesc.textContent = siteConfig.contactDescription;

    // Aplicar email
    const emailElements = document.querySelectorAll('[data-field="email"]');
    emailElements.forEach(el => {
        el.href = `mailto:${siteConfig.email}`;
    });

    // Aplicar biografía
    const biographyContent = document.querySelector('.biography-content');
    if (biographyContent) {
        biographyContent.innerHTML = siteConfig.biography;
    }

    // Aplicar imagen de perfil
    const profileImage = document.querySelector('.profile-image');
    if (profileImage && siteConfig.profileImage) {
        profileImage.src = siteConfig.profileImage;
        setImageFallback(profileImage);
    }

    // Cargar redes sociales
    loadSocialLinks();
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

function loadCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    if (!carouselTrack) return;

    carouselTrack.innerHTML = '';

    // Verificar si hay imágenes en el carrusel
    if (carouselData.length === 0) {
        carouselTrack.innerHTML = `
            <div class="carousel-item">
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
    carouselData.forEach(item => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        carouselItem.innerHTML = `
            <img src="${item.src}" alt="${item.title}" onerror="this.src='imagenes/sin-foto.png'">
            <div class="carousel-overlay">
                <h5>${item.title}</h5>
                <p>${item.description}</p>
            </div>
        `;
        carouselTrack.appendChild(carouselItem);
    });

    // Duplicar elementos para efecto infinito
    carouselData.forEach(item => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        carouselItem.innerHTML = `
            <img src="${item.src}" alt="${item.title}" onerror="this.src='imagenes/sin-foto.png'">
            <div class="carousel-overlay">
                <h5>${item.title}</h5>
                <p>${item.description}</p>
            </div>
        `;
        carouselTrack.appendChild(carouselItem);
    });
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
    const modalCategory = document.getElementById('modalCategory');
    const modalDescription = document.getElementById('modalDescription');
    const modalTitleInput = document.getElementById('modalTitleInput');
    const modalCaption = document.getElementById('modalCaption');
    const modalCategorySelect = document.getElementById('modalCategorySelect');

    modalImage.src = image.src;
    setImageFallback(modalImage);
    
    modalTitle.textContent = image.title;
    modalCategory.textContent = formatCategoryName(image.category);
    modalDescription.innerHTML = `<p>${image.description}</p>`;
    
    // Campos de edición
    modalTitleInput.value = image.title;
    modalCaption.value = image.description;
    
    // Cargar opciones de categoría
    modalCategorySelect.innerHTML = '';
    Object.entries(categories).forEach(([key, category]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = category.name;
        if (key === image.category) option.selected = true;
        modalCategorySelect.appendChild(option);
    });

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Mostrar controles de admin si está logueado
    document.querySelectorAll('.admin-only').forEach(el => {
        if (isAdmin) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

    // Guardar ID de imagen actual para funciones de admin
    modal.setAttribute('data-current-image-id', imageId);
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
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
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('adminPassword').focus();
}

// Función para acceso secreto al admin mediante URL
function checkSecretAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const secretKey = urlParams.get('admin');
    
    if (secretKey === 'true') {
        // Mostrar el panel de admin automáticamente
        const panel = document.getElementById('adminPanel');
        panel.style.display = 'block';
        // Enfocar el campo de contraseña
        const passwordField = document.getElementById('adminPassword');
        if (passwordField) {
            passwordField.focus();
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
                fileName: item.fileName
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
    
    carouselData.forEach((item, index) => {
        console.log(`Imagen ${index + 1}:`, {
            title: item.title,
            src: item.src,
            isBase64: item.src && item.src.startsWith('data:image/'),
            isRelative: item.src && item.src.startsWith('imagenes/'),
            isFirebase: item.src && item.src.includes('firebase')
        });
        
        if (item.src && item.src.startsWith('data:image/')) {
            showNotification(`Imagen ${index + 1} está en Base64. Usa "Resetear Carrusel" para solucionarlo.`, 'warning');
        }
    });
}

// Función para descargar imágenes automáticamente
function downloadImage(file, fileName) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// Función para agregar imagen a la galería
async function addImageToGallery() {
    // Verificar configuración de Firebase
    if (showFirebaseConfigError()) return;

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

        // Solicitar información de la imagen
        const title = prompt('Título de la imagen:');
        if (!title) return;

        const description = prompt('Descripción de la imagen:');
        if (!description) return;

        // Seleccionar categoría
        const categoryOptions = Object.keys(categories).map(key => `${key}: ${categories[key].name}`).join('\n');
        const categoryKey = prompt(`Selecciona la categoría (escribe la clave):\n${categoryOptions}`);
        
        if (!categoryKey || !categories[categoryKey]) {
            showNotification('Categoría inválida', 'error');
            return;
        }

        try {
            showNotification('Subiendo imagen...', 'info');

            // Subir imagen a Firebase Storage
            const uploadResult = await uploadImageToFirebase(file, 'gallery');
            
            // Guardar datos en Firestore
            const galleryData = {
                title: title,
                description: description,
                category: categoryKey,
                imageUrl: uploadResult.url,
                fileName: uploadResult.fileName,
                timestamp: uploadResult.timestamp
            };

            await saveToFirestore('gallery', galleryData);

            // Recargar galería
            await loadGalleryFromFirebase();
            loadGallery(currentCategory);

            showNotification('Imagen agregada a la galería exitosamente!', 'success');
        } catch (error) {
            console.error('Error agregando imagen a la galería:', error);
            showNotification('Error al subir la imagen. Intenta de nuevo.', 'error');
        }
    };
    input.click();
}

function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
}

function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    // Contraseña simple para demo - en producción usar autenticación real
    if (password === 'admin123') {
        isAdmin = true;
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminInterface').classList.remove('hidden');
        
        // Mostrar controles de admin en la galería
        document.querySelectorAll('.admin-only').forEach(el => {
            el.classList.remove('hidden');
        });
        
        // Recargar la galería actual para mostrar controles de admin
        loadGallery(currentCategory);
        
        showNotification('¡Acceso de administrador concedido!', 'success');
    } else {
        showNotification('Contraseña incorrecta', 'error');
        document.getElementById('adminPassword').value = '';
    }
}

function adminLogout() {
    isAdmin = false;
    document.getElementById('adminLogin').classList.remove('hidden');
    document.getElementById('adminInterface').classList.add('hidden');
    document.getElementById('adminPassword').value = '';
    
    // Ocultar controles de admin
    document.querySelectorAll('.admin-only').forEach(el => {
        el.classList.add('hidden');
    });
    
    // Recargar la galería para ocultar controles de admin
    loadGallery(currentCategory);
    
    closeAdminPanel();
    showNotification('Sesión de administrador cerrada', 'info');
}

// ==========================================================================
// EDITOR DE CARRUSEL
// ==========================================================================
function openCarouselEditor() {
    const editor = document.getElementById('carouselEditor');
    editor.style.display = 'block';
    loadCarouselEditor();
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

async function addCarouselImage() {
    // Verificar configuración de Firebase
    if (showFirebaseConfigError()) return;

    const fileInput = document.getElementById('carouselImageFile');
    const titleInput = document.getElementById('carouselImageTitle');
    const descInput = document.getElementById('carouselImageDesc');

    if (!fileInput.files[0] || !titleInput.value.trim()) {
        showNotification('Por favor, selecciona una imagen y proporciona un título.', 'error');
        return;
    }

    const file = fileInput.files[0];
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor, selecciona un archivo de imagen válido.', 'error');
        return;
    }

    if (file.size > 50 * 1024 * 1024) {
        showNotification('El archivo es demasiado grande. Máximo 50MB.', 'error');
        return;
    }

    try {
        showNotification('Subiendo imagen...', 'info');

        // Subir imagen a Firebase Storage
        const uploadResult = await uploadImageToFirebase(file, 'carousel');
        
        // Guardar datos en Firestore
        const carouselData = {
            title: titleInput.value,
            description: descInput.value || 'Sin descripción',
            category: 'featured',
            imageUrl: uploadResult.url,
            fileName: uploadResult.fileName,
            timestamp: uploadResult.timestamp
        };

        const docId = await saveToFirestore('carousel', carouselData);

        // Limpiar formulario
        fileInput.value = '';
        titleInput.value = '';
        descInput.value = '';

        // Recargar carrusel
        await loadCarouselFromFirebase();
        loadCarouselEditor();

        showNotification('Imagen agregada al carrusel exitosamente!', 'success');
    } catch (error) {
        console.error('Error agregando imagen al carrusel:', error);
        showNotification('Error al subir la imagen. Intenta de nuevo.', 'error');
    }
}

function editCarouselItem(index) {
    const item = carouselData[index];
    if (!item) return;

    const newTitle = prompt('Nuevo título:', item.title);
    if (newTitle === null) return;

    const newDesc = prompt('Nueva descripción:', item.description);
    if (newDesc === null) return;

    item.title = newTitle;
    item.description = newDesc;

    saveAllData();
    loadCarousel();
    loadCarouselEditor();
    showNotification('Elemento del carrusel actualizado', 'success');
}

function moveCarouselItem(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= carouselData.length) return;

    const item = carouselData.splice(index, 1)[0];
    carouselData.splice(newIndex, 0, item);

    saveAllData();
    loadCarousel();
    loadCarouselEditor();
    showNotification('Orden del carrusel actualizado', 'success');
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
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // Generar nombre único para el archivo
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const originalName = file.name.replace(/\.[^/.]+$/, ""); // Sin extensión
            const extension = file.name.split('.').pop();
            const fileName = `perfil_${originalName}_${timestamp}.${extension}`;
            const filePath = `imagenes/${fileName}`;

            const reader = new FileReader();
            reader.onload = function(e) {
                siteConfig.profileImage = filePath; // Usar ruta relativa
                const profileImg = document.querySelector('.profile-image');
                profileImg.src = filePath;
                setImageFallback(profileImg);
                saveAllData();
                
                // Descargar la imagen automáticamente
                downloadImage(file, fileName);
                
                showNotification(`Foto de perfil actualizada! Archivo: ${fileName}`, 'success');
                showNotification('Recuerda hacer commit y push para que los cambios sean visibles en GitHub Pages', 'info');
            };
            reader.readAsDataURL(file);
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
            closeSectionEditor();
        }
    });

    // Cerrar modales al hacer clic fuera de ellos
    const modals = ['imageModal', 'adminPanel', 'carouselEditor', 'sectionEditor'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    if (modalId === 'imageModal') closeImageModal();
                    else if (modalId === 'adminPanel') closeAdminPanel();
                    else if (modalId === 'carouselEditor') closeCarouselEditor();
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
    // Ya no se cargan datos de ejemplo locales
    // Solo se cargan datos desde Firebase
    loadCarouselFromFirebase();
    loadGalleryFromFirebase();
    // ... otras inicializaciones ...
});

// Asegurar fallback universal a 'imagenes/sin-foto.png' para cualquier imagen que falle
function setImageFallback(imgElement) {
    imgElement.onerror = function() {
        this.onerror = null;
        this.src = 'imagenes/sin-foto.png';
    };
} 
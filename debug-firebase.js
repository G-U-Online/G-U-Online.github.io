// Script de depuración para verificar Firebase
console.log('=== DEBUG FIREBASE ===');

// Verificar configuración
console.log('Firebase config:', firebaseConfig);
console.log('isFirebaseConfigured():', isFirebaseConfigured());

// Verificar servicios
console.log('Firebase db:', db);
console.log('Firebase storage:', storage);
console.log('Firebase auth:', auth);

// Verificar datos actuales
console.log('galleryData actual:', galleryData);
console.log('carouselData actual:', carouselData);

// Función para probar carga desde Firebase
async function testFirebaseLoad() {
    console.log('=== PROBANDO CARGA DESDE FIREBASE ===');
    
    try {
        console.log('1. Probando getFromFirestore...');
        const galleryItems = await getFromFirestore('gallery', 'timestamp', 'desc');
        console.log('Gallery items from Firebase:', galleryItems);
        
        console.log('2. Probando loadGalleryFromFirebase...');
        await loadGalleryFromFirebase();
        console.log('galleryData después de loadGalleryFromFirebase:', galleryData);
        
        console.log('3. Probando loadAllData...');
        await loadAllData();
        console.log('galleryData después de loadAllData:', galleryData);
        
    } catch (error) {
        console.error('Error en testFirebaseLoad:', error);
    }
}

// Función para probar edición
async function testEditGalleryItem(imageId) {
    console.log('=== PROBANDO EDICIÓN ===');
    console.log('Editando imagen ID:', imageId);
    
    const image = findImageById(imageId);
    console.log('Imagen encontrada:', image);
    
    if (image) {
        console.log('1. Probando updateInFirestore...');
        const updatedData = {
            title: image.title + ' (TEST)',
            description: image.description + ' (TEST)',
            category: image.category,
            timestamp: image.timestamp,
            imageUrl: image.imageUrl || image.src,
            fileName: image.fileName
        };
        
        try {
            await updateInFirestore('gallery', image.id, updatedData);
            console.log('✅ updateInFirestore exitoso');
            
            console.log('2. Probando recarga...');
            await loadGalleryFromFirebase();
            console.log('✅ loadGalleryFromFirebase exitoso');
            
            const updatedImage = findImageById(imageId);
            console.log('Imagen después de actualizar:', updatedImage);
            
        } catch (error) {
            console.error('❌ Error en testEditGalleryItem:', error);
        }
    }
}

// Ejecutar pruebas cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM CARGADO ===');
    setTimeout(() => {
        testFirebaseLoad();
    }, 2000);
});

// Hacer funciones disponibles globalmente
window.testFirebaseLoad = testFirebaseLoad;
window.testEditGalleryItem = testEditGalleryItem; 
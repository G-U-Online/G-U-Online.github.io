// ==========================================================================
// CONFIGURACIÓN DE FIREBASE
// ==========================================================================
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase

const firebaseConfig = {
    apiKey: "AIzaSyChwtFB7_RTOvobdTWPcTG3H7THTFbKaqk",
    authDomain: "g-u-online.firebaseapp.com",
    databaseURL: "https://g-u-online-default-rtdb.firebaseio.com",
    projectId: "g-u-online",
    storageBucket: "g-u-online.firebasestorage.app",
    messagingSenderId: "81026595753",
    appId: "1:81026595753:web:deb393adb13a8f8d7362b8",
    measurementId: "G-EXLC3711B7"
  };

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar servicios
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// ==========================================================================
// FUNCIONES DE FIREBASE
// ==========================================================================

// ==========================================================================
// COMPRESIÓN DE IMÁGENES CON BROTLI
// ==========================================================================

// Función para comprimir imagen usando Brotli
async function compressImageWithBrotli(file, quality = null) {
    return new Promise((resolve, reject) => {
        // Usar configuración global si no se especifica calidad
        const config = typeof getCompressionConfig === 'function' ? getCompressionConfig() : { quality: 0.85, maxDimensions: { width: 1920, height: 1080 } };
        const compressionQuality = quality || config.quality;
        const maxDimensions = config.maxDimensions || { width: 1920, height: 1080 };
        
        // Verificar si el archivo debe comprimirse
        if (typeof shouldCompressFile === 'function' && !shouldCompressFile(file)) {
            console.log('Archivo no requiere compresión, usando original');
            resolve(file);
            return;
        }
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Calcular dimensiones manteniendo proporción
            let { width, height } = img;
            
            if (width > maxDimensions.width || height > maxDimensions.height) {
                const ratio = Math.min(maxDimensions.width / width, maxDimensions.height / height);
                width *= ratio;
                height *= ratio;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Dibujar imagen en canvas
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convertir a Blob manteniendo formato original
            const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            canvas.toBlob(async (blob) => {
                try {
                    // Comprimir con Brotli
                    const compressedBlob = await compressBlobWithBrotli(blob);
                    resolve(compressedBlob);
                } catch (error) {
                    console.warn('Error en compresión Brotli, usando imagen original:', error);
                    
                    // Usar fallback según configuración
                    if (config.fallback && config.fallback.useOriginalOnError) {
                        resolve(blob); // Fallback a imagen sin comprimir
                    } else {
                        reject(error);
                    }
                }
            }, outputFormat, compressionQuality);
        };
        
        img.onerror = function() {
            reject(new Error('Error cargando imagen'));
        };
        
        img.src = URL.createObjectURL(file);
    });
}

// Función para comprimir Blob usando Brotli
async function compressBlobWithBrotli(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            try {
                const arrayBuffer = e.target.result;
                const uint8Array = new Uint8Array(arrayBuffer);
                
                // Comprimir con Brotli usando la API Web Compression
                const compressedData = await compressWithBrotli(uint8Array);
                
                // Crear nuevo Blob con datos comprimidos
                const compressedBlob = new Blob([compressedData], {
                    type: 'application/octet-stream'
                });
                
                resolve(compressedBlob);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = function() {
            reject(new Error('Error leyendo archivo'));
        };
        
        reader.readAsArrayBuffer(blob);
    });
}

// Función para comprimir datos usando Brotli
async function compressWithBrotli(data) {
    // Verificar si la API de compresión está disponible
    if (typeof CompressionStream !== 'undefined') {
        try {
            const stream = new CompressionStream('br');
            const writer = stream.writable.getWriter();
            const reader = stream.readable.getReader();
            
            // Escribir datos
            await writer.write(data);
            await writer.close();
            
            // Leer datos comprimidos
            const chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
            
            // Combinar chunks
            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const result = new Uint8Array(totalLength);
            let offset = 0;
            
            for (const chunk of chunks) {
                result.set(chunk, offset);
                offset += chunk.length;
            }
            
            return result;
        } catch (error) {
            console.warn('Error con CompressionStream, usando fallback:', error);
            return data; // Fallback a datos sin comprimir
        }
    } else {
        // Fallback para navegadores que no soportan CompressionStream
        console.warn('CompressionStream no disponible, usando datos sin comprimir');
        return data;
    }
}

// Función para descomprimir datos Brotli
async function decompressBrotli(compressedData) {
    if (typeof DecompressionStream !== 'undefined') {
        try {
            const stream = new DecompressionStream('br');
            const writer = stream.writable.getWriter();
            const reader = stream.readable.getReader();
            
            // Escribir datos comprimidos
            await writer.write(compressedData);
            await writer.close();
            
            // Leer datos descomprimidos
            const chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
            
            // Combinar chunks
            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const result = new Uint8Array(totalLength);
            let offset = 0;
            
            for (const chunk of chunks) {
                result.set(chunk, offset);
                offset += chunk.length;
            }
            
            return result;
        } catch (error) {
            console.error('Error descomprimiendo con Brotli:', error);
            throw error;
        }
    } else {
        throw new Error('DecompressionStream no disponible');
    }
}

// Función para descargar y descomprimir imagen
async function downloadAndDecompressImage(fileName) {
    try {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(fileName);
        
        // Descargar archivo comprimido
        const compressedBlob = await imageRef.getBlob();
        
        // Verificar si es un archivo comprimido
        if (fileName.endsWith('.br') || compressedBlob.type === 'application/octet-stream') {
            console.log('Descomprimiendo imagen...');
            
            // Descomprimir datos
            const decompressedData = await decompressBrotli(compressedBlob);
            
            // Determinar el tipo MIME basado en la extensión del archivo
            const fileExtension = fileName.split('.').pop().toLowerCase();
            let mimeType = 'image/jpeg'; // Por defecto
            
            if (fileExtension === 'png') {
                mimeType = 'image/png';
            } else if (fileExtension === 'webp') {
                mimeType = 'image/webp';
            } else if (fileExtension === 'gif') {
                mimeType = 'image/gif';
            }
            
            // Crear Blob con datos descomprimidos
            const decompressedBlob = new Blob([decompressedData], {
                type: mimeType
            });
            
            return decompressedBlob;
        } else {
            // Si no está comprimido, devolver tal como está
            return compressedBlob;
        }
    } catch (error) {
        console.error('Error descargando/descomprimiendo imagen:', error);
        throw error;
    }
}

// Función para obtener URL de imagen con descompresión automática
async function getDecompressedImageURL(fileName) {
    try {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(fileName);
        
        // Obtener URL de descarga
        const downloadURL = await imageRef.getDownloadURL();
        
        // La descompresión se maneja automáticamente al descargar
        return downloadURL;
    } catch (error) {
        console.error('Error obteniendo URL de imagen:', error);
        throw error;
    }
}

// Función para obtener información de compresión
function getCompressionInfo(originalSize, compressedSize) {
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
    const sizeReduction = (originalSize - compressedSize) / 1024; // KB
    
    return {
        originalSize: originalSize,
        compressedSize: compressedSize,
        compressionRatio: compressionRatio,
        sizeReductionKB: sizeReduction.toFixed(2)
    };
}

// Función para subir imagen a Firebase Storage con compresión Brotli
async function uploadImageToFirebase(file) {
    try {
        const timestamp = Date.now();
        const originalFileName = file.name;
        const fileExtension = originalFileName.split('.').pop().toLowerCase();
        
        // Comprimir imagen antes de subir
        console.log('Comprimiendo imagen con Brotli...');
        
        // Obtener calidad de compresión basada en el tamaño del archivo
        const compressionQuality = typeof getCompressionQuality === 'function' ? 
            getCompressionQuality(file.size) : 0.85;
        
        const compressedFile = await compressImageWithBrotli(file, compressionQuality);
        
        // Información de compresión
        const originalSize = file.size;
        const compressedSize = compressedFile.size;
        const compressionInfo = getCompressionInfo(originalSize, compressedSize);
        
        console.log('Información de compresión:', compressionInfo);
        
        // Crear nombre de archivo manteniendo formato original
        const fileName = `ilustraciones/${timestamp}_${originalFileName.replace(/\.[^/.]+$/, '')}.${fileExtension}`;
        const storageRef = storage.ref();
        const imageRef = storageRef.child(fileName);
        
        // Subir archivo comprimido
        const snapshot = await imageRef.put(compressedFile, {
            contentType: 'application/octet-stream',
            customMetadata: {
                originalSize: originalSize.toString(),
                compressedSize: compressedSize.toString(),
                compressionRatio: compressionInfo.compressionRatio,
                originalFileName: originalFileName,
                compressionMethod: 'brotli'
            }
        });
        
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        return {
            url: downloadURL,
            fileName: fileName,
            timestamp: timestamp,
            originalSize: originalSize,
            compressedSize: compressedSize,
            compressionInfo: compressionInfo,
            originalFileName: originalFileName
        };
    } catch (error) {
        console.error('Error subiendo imagen:', error);
        throw error;
    }
}

// Función para guardar datos en Firestore
async function saveToFirestore(collection, data) {
    try {
        const docRef = await db.collection(collection).add({
            ...data,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error guardando en Firestore:', error);
        throw error;
    }
}

// Función para obtener datos de Firestore
async function getFromFirestore(collection, orderBy = 'createdAt', order = 'desc') {
    try {
        const snapshot = await db.collection(collection)
            .orderBy(orderBy, order)
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error obteniendo datos:', error);
        throw error;
    }
}

// Función para eliminar documento de Firestore
async function deleteFromFirestore(collection, docId) {
    try {
        await db.collection(collection).doc(docId).delete();
    } catch (error) {
        console.error('Error eliminando documento:', error);
        throw error;
    }
}

// Función para eliminar imagen de Storage
async function deleteImageFromStorage(fileName) {
    try {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(fileName);
        await imageRef.delete();
    } catch (error) {
        console.error('Error eliminando imagen:', error);
        throw error;
    }
}

// Función para actualizar documento en Firestore
async function updateInFirestore(collection, docId, data) {
    try {
        await db.collection(collection).doc(docId).update({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error actualizando documento:', error);
        throw error;
    }
}

// Función para verificar si Firebase está configurado
function isFirebaseConfigured() {
    return firebaseConfig.apiKey !== "tu-api-key-aqui" && 
           firebaseConfig.projectId !== "tu-proyecto-id";
}

// Función para mostrar error de configuración
function showFirebaseConfigError() {
    if (!isFirebaseConfigured()) {
        showNotification('Firebase no está configurado. Revisa firebase-config.js', 'error');
        return true;
    }
    return false;
} 
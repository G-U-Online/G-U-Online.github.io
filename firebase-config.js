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

// Función para subir imagen a Firebase Storage
async function uploadImageToFirebase(file, folder = 'images') {
    try {
        const timestamp = Date.now();
        const fileName = `${folder}/${timestamp}_${file.name}`;
        const storageRef = storage.ref();
        const imageRef = storageRef.child(fileName);
        
        const snapshot = await imageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        return {
            url: downloadURL,
            fileName: fileName,
            timestamp: timestamp
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
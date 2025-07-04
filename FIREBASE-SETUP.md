# 🔥 Configuración de Firebase para el Portafolio

Esta guía te ayudará a configurar Firebase para hacer tu portafolio dinámico y permitir subida de imágenes en tiempo real.

## 📋 Prerrequisitos

- Una cuenta de Google
- Acceso a internet
- 10-15 minutos de tiempo

## 🚀 Paso 1: Crear Proyecto Firebase

### 1.1 Ir a Firebase Console
1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Crear un proyecto"**

### 1.2 Configurar el Proyecto
1. **Nombre del proyecto**: `tu-portfolio` (o el nombre que prefieras)
2. **Habilitar Google Analytics**: Opcional (puedes desactivarlo)
3. Haz clic en **"Crear proyecto"**

## 🔧 Paso 2: Configurar Firestore Database

### 2.1 Crear Base de Datos
1. En el menú lateral, ve a **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"**
4. Elige la ubicación más cercana a ti
5. Haz clic en **"Habilitar"**

### 2.2 Configurar Reglas de Seguridad
1. Ve a la pestaña **"Reglas"**
2. Reemplaza las reglas existentes con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura pública
    match /{document=**} {
      allow read: if true;
      allow write: if true; // Temporalmente permitir escritura
    }
  }
}
```

3. Haz clic en **"Publicar"**

## 📁 Paso 3: Configurar Storage

### 3.1 Crear Storage
1. En el menú lateral, ve a **"Storage"**
2. Haz clic en **"Comenzar"**
3. Selecciona **"Comenzar en modo de prueba"**
4. Elige la ubicación más cercana a ti
5. Haz clic en **"Hecho"**

### 3.2 Configurar Reglas de Storage
1. Ve a la pestaña **"Reglas"**
2. Reemplaza las reglas existentes con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública
    match /{allPaths=**} {
      allow read: if true;
      allow write: if true; // Temporalmente permitir escritura
    }
  }
}
```

3. Haz clic en **"Publicar"**

## 🔑 Paso 4: Obtener Configuración

### 4.1 Configuración del Proyecto
1. En el menú lateral, ve a **"Configuración del proyecto"** (ícono de engranaje)
2. Haz clic en **"Configuración del proyecto"**
3. Desplázate hacia abajo hasta **"Tus apps"**
4. Haz clic en **"Agregar app"** y selecciona **"Web"**

### 4.2 Configurar App Web
1. **Apodo de la app**: `portfolio-web`
2. **Habilitar Firebase Hosting**: No (usaremos GitHub Pages)
3. Haz clic en **"Registrar app"**

### 4.3 Copiar Configuración
Se mostrará un código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 📝 Paso 5: Actualizar Archivo de Configuración

### 5.1 Editar firebase-config.js
1. Abre el archivo `firebase-config.js` en tu proyecto
2. Reemplaza la configuración de ejemplo con la tuya:

```javascript
const firebaseConfig = {
    apiKey: "TU-API-KEY-AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### 5.2 Verificar Configuración
1. Abre tu página web
2. Accede al admin: `tu-url?admin=true`
3. Deberías ver las notificaciones de Firebase funcionando

## 🧪 Paso 6: Probar Funcionalidad

### 6.1 Probar Subida de Imágenes
1. Accede al admin: `tu-url?admin=true`
2. Haz clic en **"Gestionar Carrusel"**
3. Sube una imagen de prueba
4. Verifica que aparezca en el carrusel

### 6.2 Probar Galería
1. Haz clic en **"Agregar Imagen a Galería"**
2. Sube una imagen y selecciona categoría
3. Verifica que aparezca en la galería

## 🔒 Paso 7: Seguridad (Opcional)

### 7.1 Configurar Autenticación
Si quieres más seguridad, puedes configurar autenticación:

1. Ve a **"Authentication"** en Firebase Console
2. Haz clic en **"Comenzar"**
3. Habilita **"Email/Password"**
4. Configura usuarios administradores

### 7.2 Reglas Más Seguras
Una vez que funcione, puedes hacer las reglas más seguras:

```javascript
// Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados
    }
  }
}

// Storage
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados
    }
  }
}
```

## 🚨 Solución de Problemas

### Error: "Firebase no está configurado"
- Verifica que `firebase-config.js` tenga la configuración correcta
- Asegúrate de que los valores no sean los de ejemplo

### Error: "Permission denied"
- Verifica las reglas de Firestore y Storage
- Asegúrate de que estén en modo de prueba

### Error: "Network error"
- Verifica tu conexión a internet
- Asegúrate de que Firebase esté disponible en tu región

### Las imágenes no se cargan
- Verifica que Storage esté configurado correctamente
- Revisa la consola del navegador (F12) para errores

## 📊 Límites del Plan Gratuito

### Firestore
- 1GB de almacenamiento
- 50,000 lecturas/día
- 20,000 escrituras/día

### Storage
- 5GB de almacenamiento
- 1GB de descarga/día

### Para un portafolio personal, esto es más que suficiente.

## 🎉 ¡Listo!

Tu portafolio ahora es completamente dinámico:
- ✅ Subida de imágenes en tiempo real
- ✅ Base de datos persistente
- ✅ Sin necesidad de commits/push
- ✅ Funciona desde cualquier dispositivo
- ✅ Gratuito para siempre (para uso personal)

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica la configuración de Firebase
3. Consulta la documentación de Firebase
4. Revisa los logs en Firebase Console

¡Disfruta de tu portafolio dinámico! 🚀 
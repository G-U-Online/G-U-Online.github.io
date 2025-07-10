# Compresión Brotli para Imágenes

## Descripción

Este proyecto implementa compresión Brotli para las imágenes antes de subirlas a Firebase Storage, reduciendo significativamente el tamaño de los archivos y mejorando los tiempos de carga.

## Características

- **Compresión automática**: Todas las imágenes se comprimen automáticamente antes de subirse
- **Redimensionamiento inteligente**: Las imágenes se redimensionan a un máximo de 1920x1080 manteniendo la proporción
- **Calidad configurable**: Factor de calidad ajustable (por defecto 0.85)
- **Fallback robusto**: Si la compresión falla, se usa la imagen original
- **Metadatos de compresión**: Se almacena información sobre la compresión en Firebase
- **Descompresión automática**: Las imágenes se descomprimen automáticamente al descargarse

## Funciones Principales

### 1. `compressImageWithBrotli(file, quality)`
Comprime una imagen usando Brotli con las siguientes características:
- Redimensiona la imagen si es muy grande
- Convierte a JPEG con calidad configurable
- Aplica compresión Brotli
- Retorna un Blob comprimido

### 2. `compressBlobWithBrotli(blob)`
Comprime un Blob usando Brotli:
- Lee el Blob como ArrayBuffer
- Aplica compresión Brotli
- Retorna un nuevo Blob comprimido

### 3. `uploadImageToFirebase(file)`
Función modificada que:
- Comprime la imagen antes de subirla
- Almacena metadatos de compresión
- Mantiene el formato original del archivo (PNG, JPEG, etc.)
- Retorna información de compresión

### 4. `downloadAndDecompressImage(fileName)`
Descarga y descomprime una imagen:
- Descarga el archivo comprimido de Firebase
- Detecta automáticamente si está comprimido
- Descomprime y mantiene el formato original
- Retorna un Blob descomprimido con el tipo MIME correcto

## Uso

### Subir imagen con compresión
```javascript
const file = document.getElementById('fileInput').files[0];
const result = await uploadImageToFirebase(file);

console.log('Información de compresión:', result.compressionInfo);
// {
//   originalSize: 2048576,
//   compressedSize: 512000,
//   compressionRatio: "75.00",
//   sizeReductionKB: "1500.00"
// }
```

### Descargar imagen descomprimida
```javascript
const decompressedBlob = await downloadAndDecompressImage(fileName);
const url = URL.createObjectURL(decompressedBlob);
```

## Compatibilidad

### Navegadores que soportan CompressionStream
- Chrome 80+
- Edge 80+
- Firefox 102+
- Safari 15.4+

### Fallback
Para navegadores que no soportan CompressionStream:
- Se usa la imagen original sin comprimir
- Se muestra una advertencia en consola
- La funcionalidad sigue funcionando normalmente

## Configuración

### Calidad de compresión
```javascript
// Alta calidad (archivos más grandes)
const compressedFile = await compressImageWithBrotli(file, 0.9);

// Calidad media (balanceado)
const compressedFile = await compressImageWithBrotli(file, 0.85);

// Baja calidad (archivos más pequeños)
const compressedFile = await compressImageWithBrotli(file, 0.7);
```

### Tamaños máximos
```javascript
const maxWidth = 1920;  // Ancho máximo
const maxHeight = 1080; // Alto máximo
```

## Metadatos almacenados

Cada archivo comprimido incluye metadatos en Firebase:
```javascript
{
  originalSize: "2048576",
  compressedSize: "512000", 
  compressionRatio: "75.00",
  originalFileName: "imagen.png",
  compressionMethod: "brotli"
}
```

## Formatos soportados

La compresión mantiene el formato original del archivo:
- **PNG**: Se mantiene como PNG con transparencia
- **JPEG**: Se mantiene como JPEG
- **WebP**: Se mantiene como WebP
- **GIF**: Se mantiene como GIF

## Ventajas

1. **Reducción de tamaño**: Hasta 75% de reducción en el tamaño de archivo
2. **Mejor rendimiento**: Cargas más rápidas y menos uso de ancho de banda
3. **Ahorro de costos**: Menos almacenamiento y transferencia en Firebase
4. **Experiencia de usuario**: Imágenes que cargan más rápido
5. **Compatibilidad**: Funciona en navegadores modernos con fallback

## Monitoreo

La compresión se registra en la consola:
```
Comprimiendo imagen con Brotli...
Información de compresión: {
  originalSize: 2048576,
  compressedSize: 512000,
  compressionRatio: "75.00",
  sizeReductionKB: "1500.00"
}
```

## Troubleshooting

### Error: "CompressionStream no disponible"
- El navegador no soporta la API de compresión
- Se usa la imagen original sin comprimir
- No afecta la funcionalidad

### Error: "Error en compresión Brotli"
- Problema temporal en la compresión
- Se usa la imagen original como fallback
- Verificar que el archivo sea una imagen válida

### Imagen no se muestra
- Verificar que la URL de descarga sea correcta
- Comprobar que el archivo existe en Firebase Storage
- Revisar la consola para errores de descompresión 

---

### 1. **Reglas de Firebase (Firestore y Storage)**
- En la guía de configuración (`FIREBASE-SETUP.md`), las reglas de seguridad por defecto permiten escritura a cualquiera:
  ```javascript
  allow write: if true; // Temporalmente permitir escritura
  ```
- Solo en la sección “Seguridad (Opcional)” se sugiere cambiar a:
  ```javascript
  allow write: if request.auth != null; // Solo usuarios autenticados
  ```
- **Si no cambiaste las reglas en Firebase Console**, cualquiera puede escribir (subir, editar, borrar) desde cualquier lugar.

---

### 2. **Código del Proyecto**
- El código de frontend (por ejemplo, en `script.js`) sí implementa un login de administrador y oculta la interfaz admin a usuarios no autenticados.
- Sin embargo, **la verdadera seguridad depende de las reglas de Firebase**, no solo de la interfaz. Si las reglas permiten escribir a cualquiera, un atacante podría hacer peticiones directas a Firebase.

---

### 3. **¿Qué debes hacer para asegurar tu proyecto?**
- **Verifica y actualiza las reglas de seguridad en Firebase Console**:
  - Para Firestore:
    ```javascript
    allow read: if true;
    allow write: if request.auth != null;
    ```
  - Para Storage:
    ```javascript
    allow read: if true;
    allow write: if request.auth != null;
    ```
- Así, solo usuarios autenticados podrán subir, editar o borrar datos/archivos.

---

### 4. **¿Cómo saber si ya lo tienes seguro?**
- Entra a la consola de Firebase → Firestore Database → Reglas y Storage → Reglas.
- Si ves `allow write: if true;`, **no está seguro**.
- Si ves `allow write: if request.auth != null;`, **sí está seguro**.

---

**Resumen:**  
Tu frontend está preparado para distinguir entre admin y visitante, pero la seguridad real depende de las reglas en Firebase.  
**Debes actualizar las reglas en Firebase Console** para que solo usuarios autenticados puedan modificar datos o subir archivos.

¿Te gustaría que te guíe paso a paso para cambiar las reglas en Firebase? 
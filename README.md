# 🎨 Portafolio de Ilustraciones Digitales

## Descripción
Página web de portafolio personal para mostrar ilustraciones digitales, con administración avanzada y almacenamiento en Firebase.

## Primeros pasos

1. **Clona el repositorio y abre la carpeta.**
2. **Configura Firebase:**
   - Crea un proyecto en [Firebase](https://console.firebase.google.com/).
   - Habilita Firestore y Storage (recomendado en región `us-central1`).
   - Copia tu objeto `firebaseConfig` en el archivo `firebase-config.js`.
3. **Sube imágenes y contenido:**
   - Accede al panel de administración usando el enlace secreto (`?admin=true`).
   - Sube imágenes y edita el contenido desde el panel. Todo se almacena en Firebase.
   - **No hay imágenes de ejemplo locales:** El sitio está vacío hasta que subas tu propio contenido.
4. **Fallback de imágenes:**
   - Si una imagen no existe o falla la carga, se mostrará automáticamente `imagenes/sin-foto.png`.
   - Puedes personalizar esta imagen de respaldo en la carpeta `imagenes/`.
5. **Publica en GitHub Pages:**
   - Sube todos los archivos y carpetas (excepto datos sensibles) a tu repositorio.
   - Activa GitHub Pages desde la configuración del repositorio.

## Acceso de administrador
- Accede al panel usando la URL secreta: `tusitio.com/?admin=true`
- Contraseña por defecto: `admin123` (puedes cambiarla en el código)

## Notas importantes
- **No subas imágenes manualmente a la carpeta `imagenes/`** (excepto `sin-foto.png`). Todo el contenido debe subirse desde el panel admin y se almacena en Firebase.
- Si ves errores 404 por imágenes, elimina los datos de ejemplo y sube nuevas imágenes desde el admin.

## Personalización
- Edita textos, secciones, imágenes y enlaces sociales desde el panel admin.
- Cambia la foto de perfil y la información personal desde la sección "Sobre mí".

## Créditos
- Bootstrap, Font Awesome, Google Fonts, Firebase.

## ✨ Características Principales

### 🎯 Para Visitantes
- **Galería organizada** por categorías (Comic Style, Semi-Realism, Commissions, Personal Drawings)
- **Carrusel automático** de ilustraciones destacadas estilo Netflix
- **Visualizador estilo Instagram** con modal para ver imágenes en alta resolución
- **Navegación fluida** entre categorías con animaciones
- **Diseño responsivo** que se adapta a móviles y escritorio
- **Efectos hover** en las imágenes (zoom + oscurecimiento)

### 🔐 Para Administradores
- **Acceso secreto** mediante parámetro en la URL (`?admin=true`)
- **Panel de administración** protegido por contraseña
- **Subir nuevas ilustraciones** con título y descripción (hasta 50MB)
- **Eliminar ilustraciones** existentes
- **Editar descripciones** en tiempo real
- **Categorización automática** de contenido
- **Notificaciones visuales** para confirmación de acciones

### 🎨 Diseño
- **Tipografía elegante** con Google Fonts (Poppins)
- **Gradientes modernos** y colores profesionales
- **Iconos Font Awesome** para mejor UX
- **Animaciones CSS** suaves y atractivas
- **Tema limpio** con fondo claro y espacios bien definidos

## 🚀 Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y animaciones
- **JavaScript (Vanilla)** - Funcionalidad interactiva
- **Bootstrap 5** - Framework CSS responsivo
- **Font Awesome** - Iconografía
- **Firebase** - Backend como servicio (Storage + Firestore)
- **LocalStorage** - Persistencia de datos local (fallback)

## 📁 Estructura del Proyecto

```
portafolio/
├── index.html              # Estructura HTML principal
├── styles.css              # Estilos y diseño
├── script.js               # Lógica JavaScript
├── firebase-config.js      # Configuración de Firebase
├── FIREBASE-SETUP.md       # Guía de configuración de Firebase
├── imagenes/               # Carpeta para las ilustraciones (fallback)
│   ├── mi_ilustracion_1.jpg
│   ├── mi_ilustracion_2.jpg
│   ├── mi_foto_perfil.jpg
│   ├── sin-foto.png        # Imagen de respaldo
│   └── ...
└── README.md               # Documentación
```

## 🛠️ Instalación y Configuración

### 1. Clonación del Proyecto
```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### 2. Estructura de Archivos
Asegúrate de tener esta estructura:
- `index.html` - Archivo principal
- `styles.css` - Estilos
- `script.js` - Funcionalidad
- `imagenes/` - Carpeta para tus ilustraciones

### 3. Subir Imágenes
Crea la carpeta `imagenes/` y sube tus ilustraciones:
```
imagenes/
├── mi_ilustracion_1.jpg
├── mi_ilustracion_2.jpg
├── mi_ilustracion_3.jpg
├── mi_foto_perfil.jpg
├── sin-foto.png    # Imagen de respaldo (opcional, pero recomendada)
└── ...
```

**Nota importante**: Si no tienes una imagen `sin-foto.png`, el sistema usará una imagen placeholder externa. Para mejor experiencia, crea una imagen `sin-foto.png` de 400x300 píxeles con un diseño simple que diga "Imagen no disponible" o similar.

### 4. Personalización

#### 4.1 Información Personal
En `index.html`, actualiza:
- **Nombre artístico**: Línea 24 `<h1 class="artist-name">`
- **Biografía**: Sección "Sobre Mí" líneas 155-170
- **Enlaces sociales**: Líneas 180-195
- **Email de contacto**: Línea 198

#### 4.2 Contraseña de Admin
En `script.js`, línea 252:
```javascript
if (password === 'tu_nueva_contraseña') {
```

#### 4.3 Datos de Ejemplo
Modifica el objeto `galleryData` en `script.js` (líneas 13-48) con tus ilustraciones iniciales.

## 🎮 Uso del Sistema

### Para Visitantes
1. **Navegación**: Usa las pestañas para cambiar entre categorías
2. **Visualización**: Haz hover sobre las imágenes para ver efectos
3. **Modal**: Clic en "Ver Imagen" para vista completa
4. **Responsivo**: Funciona en móvil y escritorio

### Para Administradores
1. **Acceso**: Agrega `?admin=true` al final de la URL de tu página
2. **Login**: Contraseña por defecto: `admin123`
3. **Subir imágenes**: 
   - **Carrusel**: Usa "Gestionar Carrusel" para imágenes destacadas
   - **Galería**: Usa "Agregar Imagen a Galería" para categorías
   - **Perfil**: Usa "Editar Perfil" para cambiar foto de perfil
4. **Subida automática**: Las imágenes se suben automáticamente a Firebase
5. **Tiempo real**: Los cambios son visibles inmediatamente
6. **Gestionar**: Edita o elimina imágenes desde la galería o modal

## 🔧 Funcionalidades Técnicas

### Almacenamiento de Datos
- **Firebase Firestore**: Base de datos en la nube para datos persistentes
- **Firebase Storage**: Almacenamiento de imágenes en la nube
- **LocalStorage**: Fallback local si Firebase no está configurado
- **JSON**: Estructura de datos organizada y exportable

### Manejo de Imágenes
- **Validación**: Solo acepta archivos de imagen
- **Tamaño**: Máximo 50MB por imagen
- **Firebase Storage**: Las imágenes se suben automáticamente a Firebase Storage
- **URLs directas**: Las imágenes se sirven desde Firebase con URLs directas
- **Fallback**: Imagen `sin-foto.png` se usa automáticamente si no se encuentra una imagen
- **LocalStorage**: Fallback a datos locales si Firebase no está configurado

### Efectos Visuales
- **Carrusel infinito**: Animación CSS automática
- **Hover effects**: Zoom y overlay con botones
- **Modal responsivo**: Adaptable a diferentes pantallas
- **Notificaciones**: Feedback visual para acciones

## 🌐 Despliegue en GitHub Pages

### 1. Preparar Repositorio
```bash
git add .
git commit -m "Portfolio completo"
git push origin main
```

### 2. Activar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main
5. Folder: / (root)
6. Save

### 3. Acceso
Tu sitio estará disponible en:
`https://tu-usuario.github.io/tu-repositorio`

## 🔥 Configuración de Firebase

### ¿Qué es Firebase?
Firebase es un backend como servicio de Google que permite:
- **Almacenamiento de imágenes** en la nube
- **Base de datos** para información de las imágenes
- **Funcionalidad dinámica** sin necesidad de servidor propio
- **Plan gratuito** generoso para proyectos personales

### Configuración Rápida
1. **Sigue la guía completa**: `FIREBASE-SETUP.md`
2. **Tiempo estimado**: 10-15 minutos
3. **Costo**: Completamente gratuito para uso personal

### Ventajas con Firebase
- ✅ **Subida en tiempo real**: Las imágenes aparecen inmediatamente
- ✅ **Sin commits/push**: No necesitas actualizar el repositorio
- ✅ **Acceso desde cualquier lugar**: Funciona desde móvil, tablet, etc.
- ✅ **Escalable**: Crece con tu proyecto
- ✅ **Gratuito**: Plan generoso para portafolios personales

## 🔄 Flujo de Trabajo con Firebase

### 1. Subir Nueva Imagen
1. Accede al admin: `tu-url?admin=true`
2. Sube la imagen desde el panel correspondiente
3. La imagen se sube automáticamente a Firebase Storage
4. Los datos se guardan en Firestore
5. **¡Listo!** La imagen es visible inmediatamente

### 2. Sin Necesidad de Git
- No necesitas hacer commit/push
- No necesitas descargar archivos
- Los cambios son instantáneos
- Funciona desde cualquier dispositivo

### 3. Estructura en Firebase
```
Firebase Storage/
├── carousel/
│   ├── 1701234567890_imagen1.jpg
│   └── 1701234567891_imagen2.png
├── gallery/
│   ├── 1701234567892_retrato.jpg
│   └── 1701234567893_arte.png
└── profile/
    └── 1701234567894_perfil.jpg

Firestore Database/
├── carousel/
│   ├── doc1: {title, description, imageUrl, ...}
│   └── doc2: {title, description, imageUrl, ...}
└── gallery/
    ├── doc1: {title, description, category, imageUrl, ...}
    └── doc2: {title, description, category, imageUrl, ...}
```

## 🎯 Categorías de Ilustraciones

### Comic Style
Ilustraciones con estilo de cómic, personajes animados, escenas dinámicas.

### Semi-Realism
Retratos y arte con un enfoque semi-realista, técnicas de pintura digital.

### Commissions
Trabajos por encargo, proyectos personalizados para clientes.

### Personal Drawings
Arte personal, experimentos creativos, estudios artísticos.

## 🔐 Seguridad y Acceso

### Acceso Secreto al Admin
- **URL secreta**: Agrega `?admin=true` al final de la URL de tu página
- **Ejemplos**:
  - `https://tu-usuario.github.io/tu-repositorio/index.html?admin=true`
  - `http://localhost:3000/index.html?admin=true`
  - `https://mi-portfolio.com?admin=true`
- **Sin elementos visibles**: No hay botones ni enlaces en la página
- **Contraseña**: `admin123` por defecto

### Recomendaciones para Producción
1. **Autenticación real**: Implementar sistema de login seguro
2. **Backend**: Usar servidor para almacenamiento de imágenes
3. **SSL**: Certificado de seguridad para HTTPS
4. **Backup**: Respaldo regular de contenido

### Limitaciones Actuales
- Almacenamiento local (se pierde al limpiar navegador)
- Contraseña en texto plano
- Sin cifrado de datos
- Límite de 50MB por imagen

## 🎨 Personalización Avanzada

### Colores
Modifica las variables CSS en `styles.css`:
```css
/* Gradiente principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Colores de éxito/error */
background: #4CAF50; /* Verde éxito */
background: #f44336; /* Rojo error */
```

### Animaciones
Ajusta velocidades en `styles.css`:
```css
/* Carrusel */
animation: autoSlide 20s infinite linear;

/* Transiciones */
transition: all 0.3s ease;
```

### Fuentes
Cambia la tipografía en el `<head>` del HTML:
```html
<link href="https://fonts.googleapis.com/css2?family=TuFuenteElegida&display=swap" rel="stylesheet">
```

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

### Dispositivos
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (576px - 767px)
- ✅ Small Mobile (<576px)

## 🆘 Solución de Problemas

### Imágenes No Cargan
1. Verifica que estén en la carpeta `imagenes/`
2. Comprueba los nombres de archivo
3. Asegúrate que sean formatos válidos (jpg, png, gif)

### Panel Admin No Funciona
1. Verifica la contraseña (por defecto: `admin123`)
2. Comprueba la consola del navegador (F12)
3. Asegúrate que JavaScript esté habilitado

### Diseño Roto en Móvil
1. Verifica el meta viewport en el HTML
2. Comprueba las media queries en CSS
3. Prueba en diferentes dispositivos/tamaños

## 🤝 Contribuciones

¿Quieres mejorar el proyecto? ¡Las contribuciones son bienvenidas!

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin nueva-funcionalidad`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación arriba
2. Busca en issues existentes
3. Crea un nuevo issue con detalles del problema

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

## 🎉 Agradecimientos

- **Bootstrap** - Framework CSS
- **Font Awesome** - Iconografía
- **Google Fonts** - Tipografía
- **GitHub Pages** - Hosting gratuito

---

💡 **Tip**: Recuerda respaldar tus imágenes y datos regularmente, especialmente antes de hacer cambios importantes al código.

¡Disfruta mostrando tu arte al mundo! 🚀
# 📂 Guía Técnica de Gestión de Archivos Digitales

## Sistema de Gestión Integral de Transporte - Coopetraes S.A.S

Esta guía detalla las especificaciones técnicas, límites y mejores prácticas para la carga y gestión de archivos en la plataforma.

---

### 1. Especificaciones de Carga

Para garantizar el rendimiento del sistema y la correcta visualización de los documentos, se han establecido los siguientes límites técnicos:

#### 📏 Límites de Tamaño

| Tipo de Límite | Valor Máximo | Recomendación |
| :--- | :--- | :--- |
| **Tamaño por Archivo** | **10 MB** (Megabytes) | Mantener archivos entre **2 MB - 5 MB** para cargas rápidas. |
| **Resolución de Escaneo** | N/A | **150 - 200 DPI** es suficiente para documentos legales legibles. |

> ⚠️ **Nota:** Archivos superiores a 10 MB serán rechazados automáticamente por el sistema con un mensaje de error. Si su archivo es muy pesado, considere comprimirlo o reducir su resolución.

#### 📄 Formatos Permitidos

El sistema acepta exclusivamente los siguientes formatos para garantizar compatibilidad y seguridad:

| Formato | Extensiones | Uso Recomendado |
| :--- | :--- | :--- |
| **Documento Portátil** | `.pdf` | **Obligatorio** para documentos multipágina (Contratos, Pólizas, Hojas de Vida). |
| **Imagen JPEG** | `.jpg`, `.jpeg` | Fotografías de vehículos, evidencias de siniestros. |
| **Imagen PNG** | `.png` | Fotos de perfil, logotipos, imágenes con transparencias. |

---

### 2. Buenas Prácticas de Digitalización

Para mantener la base de datos documental optimizada y profesional, siga estas recomendaciones:

#### 📸 Para Fotografías (Vehículos, Perfiles, Siniestros)

* **Iluminación:** Asegúrese de tomar fotos con buena luz natural.
* **Encuadre:** Evite recortar partes importantes del vehículo o documento.
* **Orientación:** Suba las imágenes en la orientación correcta (Vertical/Horizontal) para evitar que salgan rotadas.
* **Formato:** Prefiera usar **JPG** para fotografías de cámara, ya que ofrecen buena calidad con menor peso.

#### 📑 Para Documentos (Licencias, SOAT, Contratos)

* **Legibilidad:** Verifique que todo el texto sea legible antes de subir el archivo.
* **Color vs. B/N:** Escanee en **Escala de Grises** si el documento no requiere color (ahorra mucho espacio). Use color solo para documentos oficiales que lo requieran (Cédulas, Licencias).
* **Unificación:** Si un documento tiene varias páginas (ej. Póliza de Seguros), **escanéelas en un solo archivo PDF**, no suba una foto por cada página.

---

### 3. Nomenclatura y Privacidad

El sistema renombra automáticamente los archivos al subirlos para evitar duplicados, asignándoles un identificador único (UUID). Sin embargo:

* **Evite subir archivos con nombres excesivamente largos** o caracteres especiales (`ñ`, `*`, `?`, `#`) desde su computador, aunque el sistema los procese, es mejor práctica usar nombres simples.
* **Protección de Datos:** Asegúrese de no subir documentos que contengan información sensible no requerida por la operación de la empresa.

---

### 4. Solución de Problemas Comunes

| Problema | Causa Probable | Solución |
| :--- | :--- | :--- |
| **"El archivo excede el límite permitido"** | El archivo pesa más de 10 MB. | Comprima el PDF (use herramientas como *ILovePDF* o *SmallPDF*) o baje la calidad de la foto. |
| **"Formato de archivo no válido"** | Está subiendo un Word (.docx), Excel (.xlsx) o archivo comprimido (.zip). | Convierta el documento a **PDF** o descomprima las imágenes antes de subir. |
| **Error de carga (red)** | Conexión inestable. | Verifique su internet. Si persiste, intente subir el archivo desde otro dispositivo. |

---

*Departamento de Tecnología - Coopetraes S.A.S.*
*Última actualización: Febrero 2026*

# Componentes UI Estandarizados

Este directorio contiene componentes UI reutilizables y estandarizados para mantener consistencia en toda la aplicación.

## Componentes de Formulario

### FormDialog

Componente envoltorio para formularios en diálogos modales.

**Características:**

- Manejo automático de estados de carga
- Botones de acción estandarizados
- Diseño uniforme y consistente
- Soporte para diferentes tamaños

**Ejemplo de uso:**

```tsx
import { FormDialog } from '@/components/ui/form-dialog';
import { FormField } from '@/components/ui/form-field';

function CreateUserDialog({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    setIsLoading(true);
    try {
      await createUser({ nombre, email });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Usuario"
      description="Complete los datos del nuevo usuario"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitLabel="Crear"
      maxWidth="lg"
    >
      <FormField
        label="Nombre Completo"
        name="nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </FormDialog>
  );
}
```

### FormContainer

Componente envoltorio para formularios de página completa.

**Características:**

- Estructura con Card
- Título y descripción
- Manejo de errores visible
- Estados de carga
- Botones de acción consistentes

**Ejemplo de uso:**

```tsx
import { FormContainer } from '@/components/ui/form-container';
import { FormField } from '@/components/ui/form-field';
import { useRouter } from 'next/navigation';

function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nombre, setNombre] = useState('');

  const handleSubmit = async (e) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateProfile({ nombre });
      router.push('/dashboard/perfil');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer
      title="Editar Perfil"
      description="Actualiza tu información personal"
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      isLoading={isLoading}
      error={error}
      submitLabel="Actualizar"
    >
      <FormField
        label="Nombre Completo"
        name="nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
    </FormContainer>
  );
}
```

### FormField

Componente de campo de formulario que combina label, input/textarea y mensajes de error.

**Características:**

- Label con indicador de campo requerido
- Soporte para input y textarea
- Mensajes de error con iconos
- Texto de ayuda opcional
- Validación visual

**Ejemplo de uso:**

```tsx
import { FormField } from '@/components/ui/form-field';

<FormField
  label="Nombre Completo"
  name="nombre"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)}
  error={errors.nombre}
  required
  helperText="Ingrese su nombre completo"
/>

<FormField
  label="Descripción"
  name="descripcion"
  type="textarea"
  rows={4}
  value={descripcion}
  onChange={(e) => setDescripcion(e.target.value)}
/>

<FormField
  label="Fecha de Nacimiento"
  name="fechaNacimiento"
  type="date"
  value={fechaNacimiento}
  onChange={(e) => setFechaNacimiento(e.target.value)}
  required
/>
```

### FormSelect

Componente de campo de selección estandarizado.

**Características:**

- Label con indicador de campo requerido
- Opciones configurables
- Placeholder personalizable
- Mensajes de error con iconos
- Soporte para opciones deshabilitadas

**Ejemplo de uso:**

```tsx
import { FormSelect } from '@/components/ui/form-select';

<FormSelect
  label="Rol"
  name="rol"
  value={rol}
  onChange={(e) => setRol(e.target.value)}
  options={[
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'CONDUCTOR', label: 'Conductor' },
    { value: 'PROPIETARIO', label: 'Propietario' }
  ]}
  error={errors.rol}
  required
  placeholder="Seleccione un rol"
/>
```

## Componentes Básicos

### BaseModal

Modal base reutilizable con backdrop y animaciones.

**Tamaños disponibles:** `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`

### Button

Botón con variantes y estados.

**Variantes:** `default`, `outline`, `ghost`, `destructive`

### Card

Contenedor con bordes y sombra.

### Input, Textarea, Label

Componentes básicos de formulario.

## Importación Centralizada

Todos los componentes pueden importarse desde un solo lugar:

```tsx
import {
  FormDialog,
  FormContainer,
  FormField,
  FormSelect,
  Button,
  Card,
  Input
} from '@/components/ui';
```

## Mejores Prácticas

1. **Usa FormDialog para modales**: En lugar de crear modales personalizados, usa `FormDialog` para mantener consistencia.

2. **Usa FormContainer para páginas**: Para formularios de página completa, usa `FormContainer` en lugar de crear estructura custom.

3. **Usa FormField y FormSelect**: En lugar de combinar manualmente Label + Input, usa estos componentes para campos individuales.

4. **Manejo de errores**: Pasa los errores de validación directamente a los componentes mediante la prop `error`.

5. **Estados de carga**: Siempre pasa el estado `isLoading` a los componentes de formulario para deshabilitar botones durante el envío.

## Migración de Formularios Existentes

Para migrar formularios existentes a estos componentes:

### Antes

```tsx
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium">
      Nombre
    </label>
    <input
      type="text"
      value={nombre}
      onChange={(e) => setNombre(e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300"
    />
    {errors.nombre && (
      <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
    )}
  </div>
  <button type="submit" disabled={isLoading}>
    {isLoading ? 'Guardando...' : 'Guardar'}
  </button>
</div>
```

### Después

```tsx
<FormField
  label="Nombre"
  name="nombre"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)}
  error={errors.nombre}
  required
/>
```

## Ventajas

- ✅ **Consistencia**: Todos los formularios se ven y funcionan igual
- ✅ **Menos código**: Reduce código repetitivo
- ✅ **Mantenibilidad**: Cambios en un solo lugar afectan toda la app
- ✅ **Accesibilidad**: Componentes con mejores prácticas de a11y
- ✅ **UX mejorada**: Estados de carga y errores manejados automáticamente

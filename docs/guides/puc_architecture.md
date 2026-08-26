# Arquitectura Financiera Integral: PUC, UI e Integración Modular

## 1. Núcleo Contable: PUC Colombia Adaptado

El sistema se basará en el **Plan Único de Cuentas (PUC) para el sector Solidario y Transporte**.

### A. Estructura de Datos (Schema)

* **`CuentaContable`**: Entidad base (Clase, Grupo, Cuenta, Subcuenta).
  * *Ejemplo*: `514510` (Mantenimiento y Reparaciones).
* **`ConceptoFinanciero`**: Capa de abstracción para el usuario no-contador.
  * Permite al admin crear "Cajas de Gasto" (ej: "Cambio de Aceite", "Papelería") y asignarles comportamiento automático.
* **`ReglaContable`**: Nueva entidad para integraciones automáticas. Define cómo se contabilizan eventos de otros módulos.
  * *Ejemplo*: "Al aprobar una Orden de Servicio (Mantenimiento), Debitar concepto X y Acreditar Caja".

---

## 2. Interfaz de Usuario (UI) para Gestión Financiera

### A. Gestor del PUC (PUC Manager)

Una herramienta visual para el Contador o Auditor.

* **Árbol de Cuentas Interactivo**: Visualización jerárquica (Activo > Disponible > Caja).
* **Buscador Inteligente**: Búsqueda por código o nombre.
* **Estado de Cuenta**: Semáforo visual para cuentas activas/inactivas.

### B. Configurador de Conceptos (Para el Administrador)

Donde el negocio se traduce a contabilidad.

* **Formulario Simple**: "Nombre del Gasto", "Cuenta Asociada" (Buscador), "¿Requiere Tercero?", "¿Pide Placa?".
* **Valores Predeterminados**: Fijar precios para conceptos estandarizados (ej: Cuota Administración).

---

## 3. Integración Transversal de Módulos

El Módulo Financiero no es una isla; es el "libro mayor" de toda la operación.

### A. Integración con Mantenimiento (Automática)

Actualmente, el mantenimiento registra un costo pero no mueve contabilidad.
**Flujo Nuevo:**

1. Jefe de Taller cierra **Orden de Servicio** ($200,000).
2. Sistema dispara evento `OrdenServicioCompletada`.
3. **Motor Financiero**:
    * Busca `ReglaContable` para "Mantenimiento Preventivo".
    * Genera `Transaccion` (Egreso).
    * Asiento Débito: 514510 (Mantenimiento).
    * Asiento Crédito: 110505 (Caja General) o 2335 (Cuentas por Pagar).

### B. Integración con Flota/Personal (Nómina y Préstamos)

1. **Préstamos**: Al crear una novedad tipo "Préstamo" en el módulo de personal, se genera automáticamente el Egreso de Tesorería y la Cuenta por Cobrar al empleado.
2. **Liquidación**: Al liquidar un viaje, se cruzan los ingresos (fletes) contra los descuentos (préstamos, ahorros).

---

## 4. Seguridad Financiera (Kill Switch)

* **Nivel 1: Bloqueo de Operación (Mantenimiento)**: Switch global que pone el sistema en "Solo Lectura" o "Inaccesible".
* **Nivel 2: Bloqueo por Mora (Automático)**: Reglas configurables ("Si debe > $1M, bloquear asignación de vehículos").
* **Nivel 3: Desactivación de Emergencia**: Botón en perfil de usuario para invalidar credenciales y tokens `auth.js` inmediatamente.

---

## 5. Estrategia de Implementación UI

Usaremos componentes nativos **Microsoft Fluent UI Web Components v3** alineados al Clean Corporate Light para:

* Tablas de PUC con `<fluent-data-grid>` de alta legibilidad para expansión de filas (subniveles).
* Formularios usando `<fluent-select>` interactivos y `<fluent-text-field>` asíncronos para el catálogo de cuentas (miles de registros).
* Modales o notificaciones nativas (`<fluent-dialog>`) para confirmar asientos contables generados de manera sutil y sin distracciones animadas.

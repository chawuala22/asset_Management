# Gestión de Fondos BTG

Aplicación web para la gestión de fondos patrimoniales (FPV) y de inversión (FIC) para clientes de BTG Pactual.

## 🎯 Objetivo

Esta aplicación permite a los usuarios:
- Visualizar fondos disponibles para inversión
- Suscribirse a fondos cumpliendo montos mínimos
- Cancelar participaciones y ver saldos actualizados
- Consultar historial completo de transacciones
- Configurar métodos de notificación (email/SMS)

## 💻 Stack Tecnológico

- **Framework**: Angular 20
- **Lenguaje**: TypeScript
- **Estilos**: SCSS
- **State Management**: Signals de Angular
- **Formularios**: Reactive Forms
- **Arquitectura**: Componentes standalone

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ 
- npm 9+

### Pasos para ejecutar la aplicación:

1. **Clonar el repositorio** (si está en un repositorio remoto)
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd asset_Management
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm start
   ```
   O alternativamente:
   ```bash
   ng serve
   ```

4. **Abrir en navegador**
   La aplicación estará disponible en `http://localhost:4200/`

## 📱 Características Principales

### Fondos Disponibles
La aplicación incluye 5 fondos preconfigurados:

| ID | Nombre | Monto Mínimo | Categoría |
|---|---|---|---|
| 1 | FPV_BTG_PACTUAL_RECAUDADORA | $75,000 | FPV |
| 2 | FPV_BTG_PACTUAL_ECOPETROL | $125,000 | FPV |
| 3 | DEUDAPRIVADA | $50,000 | FIC |
| 4 | FDO-ACCIONES | $250,000 | FIC |
| 5 | FPV_BTG_PACTUAL_DINAMICA | $100,000 | FPV |

### Funcionalidades Implementadas

✅ **Visualización de Fondos**: Lista con cards mostrando información completa  
✅ **Suscripción a Fondos**: Formulario con validaciones en tiempo real  
✅ **Validaciones**: 
   - Monto mínimo por fondo
   - Saldo disponible
   - Formato de email/teléfono
✅ **Cancelación de Participaciones**: Devolución automática de saldo  
✅ **Historial de Transacciones**: Registro completo con fechas y métodos de notificación  
✅ **Métodos de Notificación**: Email o SMS para cada transacción  
✅ **Estado de Cuenta**: Saldo actual, inicial y total invertido  
✅ **Diseño Responsive**: Adaptado para móviles y desktop  
✅ **Manejo de Errores**: Mensajes claros y estados de carga  
✅ **UI/UX Moderna**: Diseño limpio con animaciones y transiciones  

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── fund-list/           # Lista de fondos disponibles
│   │   ├── fund-subscription/   # Modal de suscripción
│   │   └── balance-summary/     # Resumen y transacciones
│   ├── services/
│   │   └── fund.service.ts      # Lógica de negocio y API simulada
│   ├── models/
│   │   └── fund.model.ts        # Interfaces de TypeScript
│   ├── utils/
│   │   └── currency.utils.ts    # Utilidades de formato
│   ├── app.ts                   # Componente principal
│   ├── app.html                 # Template principal
│   └── app.scss                 # Estilos globales
└── ...
```

## 💡 Configuración Inicial

La aplicación asume:
- **Usuario único** con saldo inicial de **COP $500,000**
- **Sin autenticación** ni backend real
- **API simulada** con datos locales
- **Moneda**: Pesos Colombianos (COP)

## 🎨 Diseño y UX

- **Esquema de colores**: Gradiente púrpura para header, colores por categoría
- **Tipografía**: Segoe UI para máxima legibilidad
- **Animaciones**: Transiciones suaves y micro-interacciones
- **Cards**: Diseño moderno con sombras y hover effects
- **Formularios**: Validación en tiempo real con feedback visual
- **Responsive**: Grid layout adaptativo

## 🛠️ Comandos Útiles

```bash
# Iniciar desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Linting
ng lint

# Servir en puerto específico
ng serve --port 4300
```

## 📋 Requisitos Técnicos Cumplidos

- ✅ Angular 20 con TypeScript
- ✅ Componentes standalone
- ✅ Signals para state management
- ✅ Reactive Forms con validaciones
- ✅ Diseño responsive
- ✅ Manejo de errores y loading states
- ✅ Código estructurado y comentado
- ✅ API simulada con observables
- ✅ Componentes reutilizables

## 🚀 Mejoras Opcionales (No implementadas)

- Unit tests con Angular Testing Library
- Router para navegación entre páginas
- Persistencia local (localStorage)
- Gráficos de inversión
- Exportación de historial
- Tema oscuro/claro

## 📄 Licencia

Proyecto desarrollado como prueba técnica para BTG Pactual.

---

**Nota**: Esta es una aplicación demo sin backend real. Todos los datos son simulados y se pierden al recargar la página.

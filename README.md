# 👻 GhostWire MX

> **Marketplace de Hardware Seguro con Estética Cyberpunk & Detección de Fraude.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-MVP%20Complete-green.svg)
[![Live Demo](https://img.shields.io/badge/demo-vercel-black?logo=vercel)](https://pc-store-2-0.vercel.app/)
![Stack](https://img.shields.io/badge/stack-Next.js_15_|_Supabase_|_Tailwind_|_Vitest-000000.svg)

GhostWire MX moderniza la compra-venta de hardware usado en México. Combinamos seguridad bancaria (Escrow), contratos legales automáticos y una estética premium para gamers y entusiastas.

## ✨ Nuevas Características (v2.0 Final)

### 🎨 Landing Page Cyberpunk
- **Hero Section**: Malla de perspectiva neón (CSS puro) con tipografía agresiva.
- **Micro-interacciones**: Botones con skew y efectos hover fluidos.

### 📜 Contratos Digitales (`jspdf`)
- **Generación Automática**: Al completar una compra, se descarga un PDF legal.
- **Validez Legal**: Cláusulas de compraventa y firmas simuladas.
- **Seguridad**: Hash de transacción indeleble al pie de página.
- **Easter Egg**: Referencias ocultas a *Breach Protocol*.

### 💸 Servicio de Escrow (`EscrowService.ts`)
- **Bloqueo de Fondos**: El dinero no va al vendedor hasta confirmar entrega.
- **Protección**: Lógica blindada contra liberaciones prematuras.
- **Reembolso**: Flujo automático en caso de disputa ganada por el comprador.

### 🔔 Centro de Notificaciones
- **Realtime**: Alertas instantáneas en la barra de navegación (Supabase Channels).
- **Tipos**: Seguridad (Rojo), Dinero (Amarillo), Sistema (Azul).

### 🕵️‍♂️ Admin Dashboard ("The Watchtower")
- **Resolución de Disputas**: Interfaz para arbitrar conflictos con "Killcam" de evidencia.
- **Audit Logs**: Registro inmutable de acciones.

### 🔍 Búsqueda y Finanzas
- **Búsqueda**: Filtros dinámicos, debounce y estados vacíos pixel-art.
- **Dashboard Financiero**: KPIs, gráficos de ventas (Recharts) y simulador de retiro SPEI.

---

## 🛠️ Instalación y Testing

### Prerrequisitos
-   Node.js 18+
-   Cuenta en Supabase.

### Pasos
1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/tu-usuario/ghostwire-mx.git
    cd ghostwire-mx
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**:
    Crea `.env.local`:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://qyzzmsqglianlcsrltww.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    ```

4.  **Base de Datos**:
    Ejecuta los scripts de migración en `supabase/migrations/`.

5.  **Ejecutar servidor**:
    ```bash
    npm run dev
    ```

### 🧪 Ejecutar Pruebas
El proyecto incluye tests unitarios con **Vitest** para la lógica crítica de Escrow.
```bash
npm test
```
*Cobertura: Mocking de Supabase, Bloqueo de Fondos, Disputas.*

---

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── admin/              # Dashboard
│   ├── profile/            # Finanzas & Settings
│   ├── search/             # Búsqueda Avanzada
│   ├── test-contract/      # Demo de Contratos
│   └── page.tsx            # Landing Page
├── components/
│   ├── ui/                 # NotificationCenter, EmptyState
│   └── ...
├── lib/
│   ├── services/           # EscrowService, FraudDetection
│   └── utils/              # ContractGenerator, cn
└── middleware.ts           # Seguridad Edge (CSP, Auth)
```

## 🔒 Seguridad (OWASP)

1.  **Broken Access Control**: RLS, Middleware y RBAC.
2.  **XSS**: CSP Estricto y sanitización React.
3.  **Data Integrity**: Contratos HASheados y Logs de Auditoría.

---

Desarrollado con 💛, ☕ y código seguro.

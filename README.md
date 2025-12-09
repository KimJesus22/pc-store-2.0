# 👻 GhostWire MX

> **Marketplace de Hardware Seguro con Estética Cyberpunk & Detección de Fraude.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Beta-yellow.svg)
[![Live Demo](https://img.shields.io/badge/demo-vercel-black?logo=vercel)](https://pc-store-2-0.vercel.app/)
![Stack](https://img.shields.io/badge/stack-Next.js_15_|_Supabase_|_Tailwind_|_Recharts-000000.svg)

GhostWire MX moderniza la compra-venta de hardware usado en México. Combinamos seguridad bancaria (Escrow), contratos legales automáticos y una estética premium para gamers y entusiastas.

## ✨ Nuevas Características (v2.0)

### 🕵️‍♂️ Admin Dashboard ("The Watchtower")
Panel exclusivo para administradores (`/admin/dashboard`):
-   **Resolución de Disputas**: Interfaz para arbitrar conflictos entre usuarios.
-   **The Killcam**: Herramienta comparativa de evidencia (Foto del Listing vs Foto de la Disputa).
-   **Audit Logs**: Registro inmutable de todas las acciones administrativas.

### 📊 Dashboard Financiero
Centro de mando para usuarios (`/profile` -> Finanzas):
-   **KPIs en Tiempo Real**: Visualiza tus Ingresos Totales, Fondos en Escrow y Gastos.
-   **Gráfico de Rendimiento**: Línea de tendencia de ventas mensuales (impulsado por `recharts`).
-   **Historial de Movimientos**: Estado de cuenta unificado de compras y ventas.

### 🔍 Búsqueda Avanzada (`/search`)
Motor de exploración optimizado:
-   **Filtros en Tiempo Real**: Categoría (GPU, CPU...), Condición (Nuevo/Usado) y Precio.
-   **Búsqueda Inteligente**: Input con *Debounce* para no saturar la red.
-   **Empty States**: Animaciones Pixel-Art cuando no hay resultados.

### 🛡️ Seguridad Hardened
-   **Middleware de Protección**: Rutas críticas (`/admin`, `/profile`) protegidas en el Edge.
-   **CSP Estricto**: Prevención de XSS mediante Content Security Policy.
-   **Role-Based Access Control (RBAC)**: Distinción nativa entre USER y ADMIN en base de datos.

---

## 🚀 Instalación y Uso

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
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    ```

4.  **Configurar Base de Datos**:
    Ejecuta el script SQL para habilitar categorías en listings:
    ```sql
    ALTER TABLE public.listings ADD COLUMN category text DEFAULT 'OTHER';
    ```

5.  **Ejecutar servidor**:
    ```bash
    npm run dev
    ```

---

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── admin/              # Dashboard de Administración protegido
│   ├── profile/            # Perfil usuario + Financial Dashboard
│   ├── search/             # Página de búsqueda con filtros
│   ├── layout.tsx          # Root Layout & Security Headers
│   └── middleware.ts       # Edge Middleware (Auth & CSP)
├── components/
│   ├── admin/              # Componentes de Admin (Killcam, Tables)
│   ├── listing/            # Tarjetas de Producto
│   ├── profile/            # Gráficas Financieras
│   └── ui/                 # Componentes Base (Shadcn-like)
├── hooks/
│   └── useDebounce.ts      # Utilidad para búsqueda
└── lib/
    └── supabase/           # Clientes (Client & Server)
```

## 🔒 Detalles de Seguridad (OWASP Top 10)

1.  **Broken Access Control**: Mitigado mediante Middleware y RLS en Supabase.
2.  **Injection**: ORM de Supabase previene SQL Injection.
3.  **XSS**: Content Security Policy (CSP) estricto.
4.  **Sensitive Data Exposure**: Manejo de sesiones seguro vía Cookies HttpOnly.

---

Desarrollado con 💛 y ☕ para la comunidad de Hardware en México.

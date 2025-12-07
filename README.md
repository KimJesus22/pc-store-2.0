# 👻 GhostWire MX

> **Marketplace de Hardware Seguro con Estética Cyberpunk & Detección de Fraude.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-MVP-yellow.svg)
![Stack](https://img.shields.io/badge/stack-Next.js_14_|_Supabase_|_Tailwind-000000.svg)

GhostWire MX es una plataforma de comercio electrónico diseñada específicamente para el mercado de hardware de segunda mano en México. Se enfoca en resolver los problemas de confianza mediante **Contratos Digitales**, **Servicios de Escrow** y **Detección de Fraude con IA**.

## ✨ Características Principales

### 🛡️ Seguridad & Anti-Fraude
-   **Análisis EXIF en Cliente**: Detecta automáticamente si las fotos de los productos son antiguas (>1 año) o si carecen de metadatos originales, previniendo el uso de imágenes falsas.
-   **Prueba de Vida (Timestamp)**: Obliga a los vendedores a subir una foto con su nombre de usuario y fecha actual.
-   **Contratos Digitales**: Generación dinámica de contratos de compraventa basados en el **Código Civil Federal** (Artículo 2142) con cláusulas de vicios ocultos.

### 🎨 Experiencia de Usuario (UX)
-   **Estética Cyberpunk Minimalista**: Interfaz oscura de alto contraste (`#000000` background) con acentos en *"Trench Yellow"* (`#FCE300`).
-   **Tipografía Técnica**: Uso de `Inter` para legibilidad y `Space Mono` para datos numéricos y técnicos.
-   **Feedback Inmediato**: Validaciones en tiempo real y estados de carga animados.

### 🏗️ Arquitectura Técnica
-   **Framework**: Next.js 14 (App Router) con TypeScript estricto.
-   **Estilos**: Tailwind CSS v3 + `tailwindcss-animate`.
-   **Base de Datos**: Supabase (PostgreSQL) con Políticas RLS (Row Level Security) para aislamiento de datos.
-   **Seguridad**: Headers HTTP estrictos (CSP, HSTS) configurados en `next.config.ts`.

---

## 🚀 Instalación y Uso

### Prerrequisitos
-   Node.js 18+
-   Cuenta en Supabase (para configurar variables de entorno reales, aunque el MVP funciona con mocks en frontend).

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
    Crea un archivo `.env.local` basado en `.env.example`:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
    ```

4.  **Ejecutar servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    Abre `http://localhost:3000` en tu navegador.

---

## 📂 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── checkout/[id]/      # Página de Pago + Contrato
│   ├── new-listing/        # Formulario de Venta + Anti-Fraude
│   ├── layout.tsx          # Root Layout (Fuentes, CSS)
│   └── page.tsx            # Landing Page
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── legal/              # Componentes Legales (Contrato)
│   ├── product/            # Tarjetas de Producto, Grillas
│   └── ui/                 # Sistema de Diseño (Button, Input, Card...)
├── lib/
│   ├── services/           # Lógica de Negocio (FraudDetectionService)
│   ├── supabase/           # Cliente Supabase Singleton
│   └── utils/              # Helpers (cn, formatters)
└── types/                  # Definiciones TypeScript (Database)
```

## 🔒 Detalles de Seguridad (OWASP)

1.  **Broken Access Control**: Mitigado mediante **PostgreSQL RLS** (Row Level Security). Los usuarios solo pueden editar sus propios listados/perfiles.
2.  **Injection**: Uso del cliente ORM de Supabase previene inyecciones SQL directas.
3.  **Security Misconfiguration**: Strict Mode de TypeScript activado y Headers de seguridad (X-Frame-Options, X-Content-Type-Options) forzados.
4.  **Vulnerable Components**: Dependencias mínimas y auditadas regularmente.

---

## ⚖️ Aspectos Legales
Este proyecto incluye una simulación de **Contrato de Compraventa Mercantil**.
-   **Jurisdicción**: Ciudad de México.
-   **Garantía**: 30 días por vicios ocultos (falla del hardware no reportada).
-   **Validez**: El contrato se "firma" digitalmente mediante una interacción de usuario que genera un Hash único en el cliente.

---

Desarrollado con 💛 y ☕ para la comunidad de Hardware en México.

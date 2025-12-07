# 👻 GhostWire MX

> **Marketplace de Hardware Seguro con Estética Cyberpunk & Detección de Fraude.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-MVP%20Complete-green.svg)
[![Live Demo](https://img.shields.io/badge/demo-vercel-black?logo=vercel)](https://pc-store-2-0.vercel.app/)
![Stack](https://img.shields.io/badge/stack-Next.js_14_|_Supabase_|_Tailwind-000000.svg)

GhostWire MX es una plataforma de comercio electrónico diseñada específicamente para el mercado de hardware de segunda mano en México. Se enfoca en resolver los problemas de confianza mediante **Contratos Digitales**, **Servicios de Escrow** y **Detección de Fraude con IA**.

## ✨ Características Principales

### 🛡️ Seguridad & Anti-Fraude
-   **Análisis EXIF en Cliente**: Detecta automáticamente si las fotos de los productos son antiguas (>1 año) o si carecen de metadatos originales, previniendo el uso de imágenes falsas.
-   **Prueba de Vida (Timestamp)**: Obliga a los vendedores a subir una foto con su nombre de usuario y fecha actual.
-   **Marca de Agua Automática**: Aplica un sello "GHOSTWIRE PROTECTED" + Fecha a todas las imágenes subidas usando Canvas API.
-   **Chat Seguro con DLP**: Previene fugas de datos sensibles (teléfonos/emails) mediante Regex en tiempo real.

### 💰 Comercio Seguro (Escrow)
-   **Contratos Digitales**: Generación dinámica basada en el **Código Civil Federal** (Artículo 2142) con cláusulas de vicios ocultos y garantía de 30 días.
-   **Flujo de Dinero Transparente**: Diagrama visual que muestra el estado de los fondos (`Comprador` -> `Custodia` -> `Vendedor`).
-   **Bloqueo de Fondos**: Animación y lógica que simula la retención segura del dinero hasta la confirmación de entrega.

### 👤 Perfil y Reputación
-   **Sistema de Niveles**: Barra de progreso gamificada basada en transacciones exitosas.
-   **Verificación KYC**: Simulación de carga de documentos de identidad (INE/Pasaporte).
-   **Historial**: Tabs organizados para Compras y Ventas.

### 🎨 Experiencia de Usuario (UX)
-   **Estética Cyberpunk Minimalista**: Interfaz oscura de alto contraste (`#000000` background) con acentos en *"Trench Yellow"* (`#FCE300`).
-   **Formularios Inteligentes**: Validación estricta con **Zod** y campos dinámicos (ej. pide 'VRAM' si vendes GPU, 'Socket' si vendes CPU).
-   **Feedback Inmediato**: Validaciones en tiempo real y estados de carga animados.

---

## 🚀 Instalación y Uso

### Prerrequisitos
-   Node.js 18+
-   Cuenta en Supabase (Proyecto: `qyzzmsqglianlcsrltww`).

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
    Asegúrate de tener el archivo `.env.local` con tus credenciales de Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://qyzzmsqglianlcsrltww.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
    ```

4.  **Ejecutar servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    Abre `http://localhost:3000` (o 3001) en tu navegador.

---

## 📂 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── chat-demo/          # Demo del Chat Seguro (DLP)
│   ├── checkout/[id]/      # Página de Pago + Contrato Escrow
│   ├── new-listing/        # Formulario Avanzado (Zod + Fraud Detection)
│   ├── order-status/[id]/  # Diagrama de Flujo de Fondos
│   ├── profile/            # Perfil de Usuario + KYC
│   ├── layout.tsx          # Root Layout (Fuentes, CSS)
│   └── page.tsx            # Landing Page
├── components/
│   ├── chat/               # SecureChatBox (Realtime + DLP)
│   ├── layout/             # Navbar, Footer
│   ├── legal/              # Componentes Legales (DigitalContract)
│   ├── listing/            # CreateListingForm (Hook Form)
│   ├── product/            # Tarjetas de Producto, Grillas
│   ├── profile/            # UserProfile, ReputationBar
│   └── ui/                 # Sistema de Diseño (Radix UI + Tailwind)
├── lib/
│   ├── services/           # Lógica de Negocio (FraudDetectionService)
│   ├── supabase/           # Cliente Supabase Singleton
│   └── utils/              # Helpers (cn, formatters)
└── types/                  # Definiciones TypeScript (Database)
```

## 🔒 Detalles de Seguridad (OWASP)

1.  **Broken Access Control**: Mitigado mediante **PostgreSQL RLS** (Row Level Security).
2.  **Injection**: Uso del cliente ORM de Supabase previene inyecciones SQL directas.
3.  **Data Loss Prevention (DLP)**: Regex en cliente previene compartir información de contacto fuera del sistema Escrow.
4.  **Security Misconfiguration**: Strict Mode de TypeScript activado y Headers de seguridad.

---

## ⚖️ Aspectos Legales
Este proyecto incluye una simulación de **Contrato de Compraventa Mercantil**.
-   **Jurisdicción**: Ciudad de México.
-   **Garantía**: 30 días por vicios ocultos (falla del hardware no reportada).
-   **Validez**: El contrato se "firma" digitalmente mediante interacción y Hash criptográfico.

---

Desarrollado con 💛 y ☕ para la comunidad de Hardware en México.

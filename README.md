# 🎨 Atelier Design Manager

Aplicación web responsive para administrar clientes, proyectos, estados, entregas y pagos parciales de un estudio de diseño gráfico. Toda la información se conserva en el navegador con `localStorage`; no requiere backend.

## ✨ Funcionalidades

- Panel con ingresos cobrados, saldo por cobrar, proyectos activos y entregas vencidas.
- Gráfico de barras de ingresos mensuales y gráfico circular de ganancias por tipo de diseño.
- CRUD de clientes con búsqueda y protección de integridad referencial: un cliente con proyectos asociados no puede eliminarse.
- Alta, edición, eliminación, búsqueda y filtros de proyectos por estado, tipo y cliente.
- Tipos de diseño: publicidad, campaña política, invitación, oferta laboral, branding, redes sociales, editorial y otros.
- Estados editables: por iniciar, en progreso, finalizado y cancelado.
- Registro de pagos por etapas con concepto, fecha, monto y nota.
- Historial de pagos visible incluso si el proyecto se cancela; los cobros realizados se registran como no reembolsables.
- Tema claro/oscuro persistente, transiciones suaves y animaciones con Animate.css.
- Diseño adaptable para escritorio, tableta y móvil, incluida navegación lateral móvil.
- Formularios accesibles con tipografía ampliada, estados vacíos, confirmaciones y mensajes de validación en español.
- Textareas con tamaño fijo para conservar la composición de los formularios en todos los dispositivos.
- Apertura controlada del formulario de proyectos: el modal solo aparece al pulsar «Nuevo proyecto» y la señal de apertura se consume una única vez.
- Dropdown personalizado para cambiar el estado del proyecto, compatible con temas claro y oscuro y navegación por teclado.

## 🆕 Mejoras recientes

- Se aumentaron aproximadamente `2px` los textos pequeños y medianos de la interfaz para facilitar la lectura y el llenado de formularios.
- Se amplió adicionalmente la información de las tarjetas de proyectos y clientes: títulos, descripciones, contactos, fechas, pagos y estadísticas.
- Los labels, ayudas, inputs, selects, textareas, filtros, tarjetas y elementos de navegación ahora tienen una escala tipográfica más cómoda.
- Se aplicó `resize: none` a los textareas para evitar cambios manuales de tamaño.
- Los valores de los inputs están centrados y los selects reservan espacio para que sus flechas no queden pegadas al borde.
- Se corrigió la reapertura automática del modal de creación al regresar al menú Proyectos.
- El modal de detalle utiliza hasta `920px`, permanece centrado, evita el scroll horizontal y conserva una distribución responsive.
- El cambio de estado usa un menú propio con indicadores de color, foco visible y opciones completamente estilizadas.
- La confirmación para eliminar proyectos se muestra sobre el detalle sin parpadeos; cancelar conserva el modal original y confirmar cierra ambos después de eliminar.
- Se añadieron pruebas E2E de regresión para la apertura del formulario, el layout del modal y el flujo de confirmación de eliminación.

## 🧰 Stack y compatibilidad

El proyecto fue comprobado con Node.js `24.19.0` y npm `12.0.2`.

- Vue 3.5.44 + TypeScript 6.0.3
- Vite 8.3.5 y `@vitejs/plugin-vue`
- Nuxt UI 4.12.0
- Tailwind CSS 4.3.4
- Vue Router 4.6.4
- Zod 4.6.7
- Animate.css 4.1.1
- Vitest 5.1.0 + Vue Test Utils 2.5.1
- Playwright 1.64.1
- ESLint 10.14.0
- `vite-plugin-vue-devtools` 8.2.1
- `vite-plugin-webfont-dl` 3.13.1

TypeScript 7.0.2 era la versión más reciente consultada, pero no es compatible todavía con `vue-tsc` 3.3.14 ni con `typescript-eslint`; por ello se usa TypeScript 6.0.3, la versión compatible más reciente. Nuxt UI requiere Vue Router como peer y se utiliza la última versión estable compatible de la rama 4.

## 🚀 Instalación

Requisitos: Node.js 24 y npm 12.

```bash
npm install
npm run dev
```

La aplicación se abre por defecto en `http://localhost:3000`.

## ⚙️ Variables de entorno

El nombre visible de la aplicación y el título del navegador se leen desde:

```dotenv
VITE_APP_NAME=nombre-de-la-app
```

Existe un ejemplo en `.env.example`. El valor se valida al iniciar Vite mediante Zod y admite letras Unicode, caracteres acentuados, números, espacios, guiones y guiones bajos.

## 📜 Scripts

| Comando                 | Descripción                                     |
| ----------------------- | ----------------------------------------------- |
| `npm run dev`           | Servidor de desarrollo con Vue DevTools         |
| `npm run build`         | Build optimizado de producción                  |
| `npm run preview`       | Previsualización del build                      |
| `npm run typecheck`     | Verificación estricta de TypeScript             |
| `npm run lint`          | Reglas de ESLint para TypeScript, Vue y pruebas |
| `npm run lint:fix`      | Correcciones automáticas seguras de ESLint      |
| `npm run test:unit`     | Pruebas unitarias con Vitest                    |
| `npm run test:e2e`      | Pruebas E2E con Playwright/Chromium             |
| `npm run test:all`      | Unitarias y E2E                                 |
| `npm run test:coverage` | Reporte de cobertura V8                         |

Para preparar Chromium la primera vez:

```bash
npx playwright install chromium
```

## 🧪 Pruebas y calidad

La suite actual contiene:

- `24` pruebas unitarias con Vitest para configuración, schemas, persistencia, cálculos financieros, formatos y componentes.
- `10` pruebas E2E e integración con Playwright y Chromium para dashboard, tema oscuro, validaciones, clientes, proyectos, persistencia, pagos, filtros, layout y comportamiento de modales.
- Verificación estricta con TypeScript y ESLint.
- Build de producción validado con Vite.
- Auditoría de dependencias de producción sin vulnerabilidades conocidas mediante `npm audit --omit=dev`.

Las pruebas E2E utilizan la opción `webServer` de Playwright para iniciar Vite durante la ejecución.

## 🗂️ Arquitectura

```text
src/
├── components/    # Vistas y componentes visuales reutilizables
├── composables/   # Estado reactivo y persistencia local
├── config/        # Validación y acceso tipado al entorno
├── schemas/       # Schemas Zod de clientes, proyectos y base local
├── styles/        # Tema global, responsive y tokens visuales
├── types/         # Modelo de dominio TypeScript
└── utils/         # Formatos, cálculos financieros, IDs y constantes

tests/
├── unit/          # Refleja schemas, utils y components de src
└── e2e/           # Flujos completos de usuario
```

`useDesignStore` es la única puerta de escritura del dominio. Valida los datos con Zod, conserva relaciones cliente-proyecto, impide eliminar clientes con proyectos asociados, calcula saldos y sincroniza cada mutación en la clave `atelier-design-manager-v1` de `localStorage`.

## 💾 Modelo de datos

Cada proyecto incluye GUID, título, descripción, cliente, tipo, fechas de pedido y entrega, estado, costo total y una colección de pagos. Cada pago también tiene GUID, concepto, monto, fecha y nota. Los montos cobrados de proyectos cancelados permanecen en la base y se muestran en el detalle, pero se excluye su saldo pendiente del indicador «Por cobrar».

Si los datos almacenados no pasan la validación del schema, la aplicación recupera de forma segura los datos demostrativos iniciales. Para reiniciar manualmente el demo, elimina la clave `atelier-design-manager-v1` desde las herramientas del navegador y recarga la página.

## 🖌️ Identidad visual y accesibilidad

Los archivos `public/favicon.svg` y `public/favicon.ico` se usan en la pestaña del navegador; el SVG también aparece como logo en la navegación. Montserrat se descarga y empaqueta durante el build con `vite-plugin-webfont-dl`, evitando una dependencia externa de fuentes en producción.

La interfaz utiliza tokens visuales compartidos para los temas claro y oscuro, transiciones suaves y tamaños tipográficos optimizados para lectura. Los formularios conservan labels visibles, mensajes de error próximos al campo correspondiente y controles con estados de foco perceptibles. También se respeta `prefers-reduced-motion` para usuarios que prefieren reducir animaciones.

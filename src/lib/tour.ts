import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const TOUR_KEY = 'cot_tour_visto'

/** Pasos del tutorial guiado: resaltan cada parte del sistema y explican para qué sirve. */
function buildDriver() {
  return driver({
    showProgress: true,
    allowClose: true,
    overlayColor: 'rgba(15, 23, 42, 0.55)',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Atrás',
    doneBtnText: 'Entendido',
    progressText: '{{current}} de {{total}}',
    steps: [
      {
        element: '[data-tour="brand"]',
        popover: {
          title: '👋 ¡Bienvenido!',
          description: 'Te mostramos en 30 segundos para qué sirve cada parte del sistema. Puedes cerrar cuando quieras y volver a verlo desde “Ayuda”.',
        },
      },
      {
        element: '[data-tour="/"]',
        popover: {
          title: 'Dashboard',
          description: 'Tu pantalla de inicio: un resumen del mes con cuántas cotizaciones hiciste y por qué monto total.',
        },
      },
      {
        element: '[data-tour="/cotizaciones/nueva"]',
        popover: {
          title: 'Nueva Cotización',
          description: 'Aquí creas una cotización: eliges el cliente, cargas los productos con sus precios y el sistema calcula el IVA y el total solo. Después la guardas o descargas el PDF. En “Ayuda” se explica qué hace cada campo.',
        },
      },
      {
        element: '[data-tour="/historial"]',
        popover: {
          title: 'Historial',
          description: 'Todas tus cotizaciones guardadas. Puedes verlas, editarlas, duplicarlas (para hacer una parecida) o descargar su PDF.',
        },
      },
      {
        element: '[data-tour="/clientes"]',
        popover: {
          title: 'Clientes',
          description: 'Tu lista de clientes. Guardas sus datos una sola vez y los reutilizas en cada cotización, sin volver a escribirlos.',
        },
      },
      {
        element: '[data-tour="/configuracion"]',
        popover: {
          title: 'Configuración: ¡empieza por aquí!',
          description: 'Los datos de tu empresa, tu logo, tu firma y los datos bancarios. Todo esto aparece automáticamente en tus cotizaciones y en el PDF.',
        },
      },
      {
        element: '[data-tour="/ayuda"]',
        popover: {
          title: 'Ayuda',
          description: 'El manual completo, con el detalle de cada campo y qué aparece en el PDF. Desde aquí también puedes volver a ver este tutorial cuando quieras.',
        },
      },
      {
        element: '[data-tour="brand"]',
        popover: {
          title: '¡Listo! 🎉',
          description: 'Eso es todo lo básico. Un buen primer paso: entra a Configuración y carga los datos de tu empresa. ¡Éxitos!',
        },
      },
    ],
  })
}

/** Inicia el tutorial guiado manualmente (desde un botón). */
export function startTour() {
  buildDriver().drive()
}

/** Inicia el tutorial solo la primera vez que el usuario entra. */
export function startTourOnce() {
  let visto = false
  try { visto = localStorage.getItem(TOUR_KEY) === '1' } catch { /* sin storage */ }
  if (visto) return
  try { localStorage.setItem(TOUR_KEY, '1') } catch { /* sin storage */ }
  // Pequeña espera para asegurar que el menú ya está en pantalla.
  setTimeout(() => startTour(), 700)
}

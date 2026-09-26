import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const TOUR_KEY = 'cot_tour_visto'
type NavFn = (path: string) => void

/** Espera a que un elemento exista en el DOM (tras navegar de pantalla). */
function waitFor(selector: string, timeout = 5000): Promise<void> {
  return new Promise(resolve => {
    const start = Date.now()
    const tick = () => {
      if (document.querySelector(selector) || Date.now() - start > timeout) resolve()
      else setTimeout(tick, 80)
    }
    tick()
  })
}

/**
 * Tutorial guiado. Primero da un recorrido por el menú y luego ENTRA a
 * "Nueva Cotización" para explicar qué hace cada campo y qué aparece en el PDF.
 * Necesita `navigate` (de react-router) para cambiar de pantalla en el camino.
 */
export function startTour(navigate?: NavFn) {
  let d: ReturnType<typeof driver>

  // Paso puente: entra al formulario de cotización y sigue el tour ahí.
  const goToForm = () => {
    if (navigate) {
      navigate('/cotizaciones/nueva')
      waitFor('[data-tour="cot-numero"]').then(() => d.moveNext())
    } else {
      d.moveNext()
    }
  }

  d = driver({
    showProgress: true,
    allowClose: true,
    overlayColor: 'rgba(15, 23, 42, 0.55)',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Atrás',
    doneBtnText: 'Entendido',
    progressText: '{{current}} de {{total}}',
    onDestroyed: () => {
      // Si el tour terminó (o se cerró) dentro del formulario, volvemos al inicio.
      if (navigate && window.location.pathname.startsWith('/cotizaciones/nueva')) {
        navigate('/')
      }
    },
    steps: [
      {
        element: '[data-tour="brand"]',
        popover: {
          title: '👋 ¡Bienvenido!',
          description: 'Te mostramos para qué sirve cada parte del sistema y, al final, entramos a crear una cotización explicando campo por campo. Puedes cerrar cuando quieras.',
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
          description: 'Donde se arma cada cotización. En un momento entramos a verla por dentro, campo por campo.',
        },
      },
      {
        element: '[data-tour="/historial"]',
        popover: {
          title: 'Historial',
          description: 'Todas tus cotizaciones guardadas. Puedes verlas, editarlas, duplicarlas o descargar su PDF.',
        },
      },
      {
        element: '[data-tour="/clientes"]',
        popover: {
          title: 'Clientes',
          description: 'Tu lista de clientes. Guardas sus datos una sola vez y los reutilizas en cada cotización.',
        },
      },
      {
        element: '[data-tour="/configuracion"]',
        popover: {
          title: 'Configuración: empieza aquí',
          description: 'Tus datos, tu logo, tu firma y los datos bancarios. Todo esto aparece automáticamente en el PDF.',
        },
      },
      {
        element: '[data-tour="/ayuda"]',
        popover: {
          title: 'Ayuda',
          description: 'El manual completo con el detalle de cada campo, y el acceso para repetir este tutorial cuando quieras.',
        },
      },
      {
        popover: {
          title: 'Veamos una cotización por dentro',
          description: 'Ahora entramos a “Nueva Cotización” para ver qué hace cada campo y qué información llega al PDF del cliente.',
          onNextClick: goToForm,
        },
      },
      {
        element: '[data-tour="cot-numero"]',
        popover: {
          title: 'Número y fecha',
          description: 'El N° se genera solo (formato AAMMDD-N) y puedes editarlo. La fecha es la de emisión. Ambos aparecen en el PDF.',
        },
      },
      {
        element: '[data-tour="cot-cliente"]',
        popover: {
          title: 'Cliente',
          description: 'Eliges a quién va dirigida: buscas un cliente guardado o lo registras en el momento. Sus datos (RUT, dirección, contacto) aparecen en el PDF.',
        },
      },
      {
        element: '[data-tour="cot-condiciones"]',
        popover: {
          title: 'Condiciones',
          description: 'Condición de pago, validez y N° de proceso de compra aparecen en el PDF. El “Identificador” es solo para ubicar la cotización en tu historial: no se muestra al cliente.',
        },
      },
      {
        element: '[data-tour="cot-productos"]',
        popover: {
          title: 'Productos',
          description: 'Cada fila lleva imagen, producto, descripción, cantidad, unidad y valor unitario. El subtotal se calcula solo. Usa “Agregar producto” para sumar más filas.',
        },
      },
      {
        element: '[data-tour="cot-totales"]',
        popover: {
          title: 'Totales',
          description: 'El subtotal, el IVA (19%) y el total se calculan automáticamente. Tú solo cargas cantidades y precios.',
        },
      },
      {
        element: '[data-tour="cot-acciones"]',
        popover: {
          title: 'Guardar o descargar',
          description: '“Guardar cotización” la deja en el Historial. “Descargar PDF” genera el documento profesional para enviar al cliente.',
        },
      },
      {
        popover: {
          title: '¡Listo! 🎉',
          description: 'Eso es todo. Un buen primer paso: entra a Configuración y carga los datos de tu empresa. ¡Éxitos!',
        },
      },
    ],
  })
  d.drive()
}

/** Inicia el tutorial solo la primera vez que el usuario entra. */
export function startTourOnce(navigate?: NavFn) {
  let visto = false
  try { visto = localStorage.getItem(TOUR_KEY) === '1' } catch { /* sin storage */ }
  if (visto) return
  try { localStorage.setItem(TOUR_KEY, '1') } catch { /* sin storage */ }
  setTimeout(() => startTour(navigate), 700)
}

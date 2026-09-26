import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const TOUR_KEY = 'cot_tour_visto'

/** Espera a que un elemento exista en el DOM (tras cambiar de pantalla). */
function waitFor(selector: string, timeout = 6000): Promise<void> {
  return new Promise(resolve => {
    const start = Date.now()
    const tick = () => {
      if (document.querySelector(selector) || Date.now() - start > timeout) resolve()
      else setTimeout(tick, 80)
    }
    tick()
  })
}

/** Cambia de pantalla haciendo clic en el propio enlace del menú (robusto, sin depender de React Router). */
function irA(rutaTour: string) {
  const link = document.querySelector<HTMLElement>(`[data-tour="${rutaTour}"]`)
  link?.click()
}

/**
 * Tutorial guiado. Recorre el menú y ENTRA a "Nueva Cotización" para explicar
 * cada campo del formulario y qué aparece en el PDF. Navega haciendo clic en el
 * menú, así funciona siempre (no depende de estados que el recargado en caliente
 * pueda dejar desactualizados).
 */
export function startTour() {
  let d: ReturnType<typeof driver>

  // Entra al formulario de cotización y continúa el tour ahí.
  const entrarAlFormulario = () => {
    irA('/cotizaciones/nueva')
    waitFor('[data-tour="cot-numero"]').then(() => d.moveNext())
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
      // Al terminar (o cerrar) dentro del formulario, volvemos al inicio.
      if (window.location.pathname.startsWith('/cotizaciones/nueva')) irA('/')
    },
    steps: [
      {
        element: '[data-tour="brand"]',
        popover: {
          title: '👋 ¡Bienvenido!',
          description: 'Te mostramos para qué sirve cada parte del sistema y entramos a crear una cotización explicando campo por campo. Puedes cerrar cuando quieras.',
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
          description: 'Aquí se arma cada cotización. Al tocar “Siguiente” entramos al formulario para ver qué hace cada campo.',
          onNextClick: entrarAlFormulario,
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
          title: '¡Listo! 🎉',
          description: 'Eso es todo. Un buen primer paso: entra a Configuración y carga los datos de tu empresa. ¡Éxitos!',
        },
      },
    ],
  })
  d.drive()
}

/** Inicia el tutorial solo la primera vez que el usuario entra. */
export function startTourOnce() {
  let visto = false
  try { visto = localStorage.getItem(TOUR_KEY) === '1' } catch { /* sin storage */ }
  if (visto) return
  try { localStorage.setItem(TOUR_KEY, '1') } catch { /* sin storage */ }
  setTimeout(() => startTour(), 700)
}

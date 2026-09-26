import { driver, type DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'

/**
 * Tutoriales por pantalla. Cada pantalla muestra su propio mini-tutorial la
 * PRIMERA vez que el usuario entra (se recuerda en localStorage, uno por
 * pantalla). Sin numeración de pasos. Se pueden volver a ver desde Ayuda.
 */

const KEY_PREFIX = 'cot_tour_'
const SCREENS = ['dashboard', 'nuevacot', 'historial', 'clientes', 'configuracion'] as const
type Screen = typeof SCREENS[number]

let tourActive = false

function seen(key: Screen): boolean {
  try { return localStorage.getItem(KEY_PREFIX + key) === '1' } catch { return false }
}
function markSeen(key: Screen) {
  try { localStorage.setItem(KEY_PREFIX + key, '1') } catch { /* sin storage */ }
}

/** Espera a que un elemento exista en el DOM (tras entrar a una pantalla). */
function waitFor(selector: string, timeout = 4000): Promise<boolean> {
  return new Promise(resolve => {
    const start = Date.now()
    const tick = () => {
      if (document.querySelector(selector)) resolve(true)
      else if (Date.now() - start > timeout) resolve(false)
      else setTimeout(tick, 80)
    }
    tick()
  })
}

/** Cambia de pantalla haciendo clic en el enlace del menú (robusto). */
function irA(rutaTour: string) {
  document.querySelector<HTMLElement>(`[data-tour="${rutaTour}"]`)?.click()
}

function makeDriver(steps: DriveStep[]) {
  return driver({
    showProgress: false,
    allowClose: true,
    overlayColor: 'rgba(15, 23, 42, 0.55)',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Atrás',
    doneBtnText: 'Entendido',
    onDestroyed: () => { tourActive = false },
    steps,
  })
}

// ── Definición de cada tutorial (anclaje a esperar + pasos) ──
const TOURS: Record<Screen, { anchor: string; steps: DriveStep[] }> = {
  dashboard: {
    anchor: '[data-tour="dash-stats"]',
    steps: [
      { element: '[data-tour="brand"]', popover: { title: '👋 ¡Bienvenido!', description: 'Este es tu sistema de cotizaciones. Te mostramos un mini-tutorial la primera vez que entras a cada pantalla.' } },
      { element: '[data-tour="dash-nueva"]', popover: { title: 'Crear una cotización', description: 'Desde aquí empiezas una cotización nueva en cualquier momento.' } },
      { element: '[data-tour="dash-mes"]', popover: { title: 'Resumen por mes', description: 'Usa las flechas para moverte entre meses y ver el resumen de cada período.' } },
      { element: '[data-tour="dash-stats"]', popover: { title: 'Tus números del mes', description: 'Cuántas cotizaciones hiciste y el monto total cotizado en el mes.' } },
      { element: '[data-tour="dash-lista"]', popover: { title: 'Las cotizaciones del mes', description: 'El listado del período, con acceso directo al historial.' } },
      { element: '[data-tour="/configuracion"]', popover: { title: 'Consejo para empezar', description: 'Antes de tu primera cotización, entra a Configuración y carga los datos de tu empresa. ¡Cuando entres, te mostraremos cómo!' } },
    ],
  },
  nuevacot: {
    anchor: '[data-tour="cot-numero"]',
    steps: [
      { element: '[data-tour="cot-numero"]', popover: { title: 'Número y fecha', description: 'El N° se genera solo (formato AAMMDD-N) y puedes editarlo. La fecha es la de emisión. Ambos aparecen en el PDF.' } },
      { element: '[data-tour="cot-cliente"]', popover: { title: 'Cliente', description: 'Eliges a quién va dirigida: buscas un cliente guardado o lo registras en el momento. Sus datos aparecen en el PDF.' } },
      { element: '[data-tour="cot-condiciones"]', popover: { title: 'Condiciones', description: 'Condición de pago, validez y N° de proceso de compra aparecen en el PDF. El “Identificador” es solo para ubicar la cotización en tu historial.' } },
      { element: '[data-tour="cot-productos"]', popover: { title: 'Productos', description: 'Cada fila lleva imagen, producto, descripción, cantidad, unidad y valor unitario. El subtotal se calcula solo. Usa “Agregar producto” para sumar filas.' } },
      { element: '[data-tour="cot-totales"]', popover: { title: 'Totales', description: 'El subtotal, el IVA (19%) y el total se calculan automáticamente. Tú solo cargas cantidades y precios.' } },
      { element: '[data-tour="cot-acciones"]', popover: { title: 'Guardar o descargar', description: '“Guardar cotización” la deja en el Historial. “Descargar PDF” genera el documento para enviar al cliente.' } },
    ],
  },
  historial: {
    anchor: '[data-tour="hist-buscar"]',
    steps: [
      { element: '[data-tour="hist-buscar"]', popover: { title: 'Historial', description: 'Aquí están todas tus cotizaciones. Búscalas por número, cliente, identificador o fecha.' } },
      { element: '[data-tour="hist-buscar"]', popover: { title: 'Acciones de cada fila', description: 'En cada cotización puedes ver el detalle (ojo), duplicarla, editarla o descargar su PDF. Eliminar pide confirmación.' } },
      { element: '[data-tour="hist-nueva"]', popover: { title: 'Nueva cotización', description: 'Y creas una nueva cuando quieras.' } },
    ],
  },
  clientes: {
    anchor: '[data-tour="cli-nuevo"]',
    steps: [
      { element: '[data-tour="cli-nuevo"]', popover: { title: 'Registrar un cliente', description: 'Guarda los datos de un cliente una sola vez (razón social, RUT, dirección, contacto…) y reutilízalo en cada cotización.' } },
      { element: '[data-tour="cli-buscar"]', popover: { title: 'Buscar y administrar', description: 'Búscalo por nombre o RUT. Puedes ver su ficha, editarlo o eliminarlo desde cada fila.' } },
    ],
  },
  configuracion: {
    anchor: '[data-tour="cfg-logo"]',
    steps: [
      { element: '[data-tour="cfg-logo"]', popover: { title: 'Logo de la empresa', description: 'Sube tu logo (PNG o JPG, fondo blanco). Se muestra en el menú y en el encabezado del PDF.' } },
      { element: '[data-tour="cfg-datos"]', popover: { title: 'Datos de la empresa', description: 'Razón social, RUT, giro, ejecutivo, dirección, ciudad, región, teléfono y email. Forman el encabezado del PDF.' } },
      { element: '[data-tour="cfg-defaults"]', popover: { title: 'Valores por defecto', description: 'La condición de pago y la validez que se cargarán solas en cada cotización nueva.' } },
      { element: '[data-tour="cfg-banco"]', popover: { title: 'Datos bancarios', description: 'Dónde te transfiere el cliente. Aparecen al final del PDF, debajo de las observaciones.' } },
      { element: '[data-tour="cfg-firma"]', popover: { title: 'Firma digital', description: 'La dibujas con el mouse o el dedo. Aparece sobre la línea de firma en el PDF. Recuerda presionar “Guardar Configuración”.' } },
    ],
  },
}

/** Muestra el tutorial de una pantalla, solo la primera vez. Llamar al entrar a cada pantalla. */
export function runScreenTourOnce(key: Screen) {
  if (seen(key) || tourActive) return
  const tour = TOURS[key]
  if (!tour) return
  waitFor(tour.anchor).then(found => {
    if (!found || seen(key) || tourActive) return
    markSeen(key)
    tourActive = true
    makeDriver(tour.steps).drive()
  })
}

/** Vuelve a habilitar todos los tutoriales y arranca desde el Dashboard. */
export function replayTours() {
  SCREENS.forEach(k => { try { localStorage.removeItem(KEY_PREFIX + k) } catch { /* sin storage */ } })
  irA('/') // al cambiar de pantalla, el tutorial del Dashboard se dispara solo
}

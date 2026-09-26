import { ReactNode } from 'react'
import {
  LogIn, LayoutDashboard, Settings, Users, Receipt, FileDown, FileText,
  HelpCircle, Check, AlertTriangle, PlayCircle,
} from 'lucide-react'
import { replayTours } from '../lib/tour'

/* ── Helpers de presentación ── */

function Section({ n, icon: Icon, title, children }: {
  n: number; icon: React.ElementType; title: string; children: ReactNode
}) {
  return (
    <section className="card p-5 sm:p-7 scroll-mt-6" id={`ayuda-${n}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}>
          <Icon size={17} className="text-white" />
        </div>
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-xs font-mono font-bold text-blue-500 flex-shrink-0">{String(n).padStart(2, '0')}</span>
          <h2 className="text-[17px] sm:text-lg font-bold text-gray-900 leading-tight">{title}</h2>
        </div>
      </div>
      <div className="text-[14.5px] text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="text-blue-400 flex-shrink-0 mt-0.5">›</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

function Steps({ items }: { items: { t: ReactNode; d?: ReactNode }[] }) {
  return (
    <ol className="space-y-2.5 mt-1">
      {items.map((s, i) => (
        <li key={i} className="relative pl-11 py-3 pr-4 rounded-xl bg-gray-50 border border-gray-100">
          <span className="absolute left-3 top-3 w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs font-mono font-bold flex items-center justify-center">
            {i + 1}
          </span>
          <p className="font-semibold text-gray-800 text-[14px] m-0">{s.t}</p>
          {s.d && <p className="text-[13.5px] text-gray-500 m-0 mt-0.5">{s.d}</p>}
        </li>
      ))}
    </ol>
  )
}

/* Lista de campos: nombre + para qué sirve + si sale en el PDF */
type Field = { name: string; desc: ReactNode; pdf?: 'si' | 'no' }
function Fields({ title, items }: { title?: string; items: Field[] }) {
  return (
    <div className="mt-1">
      {title && <h3 className="text-[14px] font-bold text-gray-800 mb-2">{title}</h3>}
      <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
        {items.map((f, i) => (
          <div key={i} className="p-3.5 bg-white flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
            <div className="sm:w-40 flex-shrink-0">
              <span className="text-[13.5px] font-semibold text-gray-800">{f.name}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] text-gray-600 m-0">{f.desc}</p>
              {f.pdf === 'si' && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: '#E3F6EE', color: '#0E9F6E' }}>
                  <FileDown size={11} /> Aparece en el PDF
                </span>
              )}
              {f.pdf === 'no' && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: '#F1F5F9', color: '#64748B' }}>
                  Solo dentro de la app
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-xl px-4 py-3 text-[14px]"
      style={{ background: '#E3F6EE', border: '1px solid rgba(14,159,110,.3)' }}>
      <Check size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#0E9F6E' }} />
      <span className="text-gray-700">{children}</span>
    </div>
  )
}

function Warn({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-xl px-4 py-3 text-[14px]"
      style={{ background: '#FBF0DC', border: '1px solid rgba(180,83,9,.32)' }}>
      <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#B45309' }} />
      <span className="text-gray-700">{children}</span>
    </div>
  )
}

const Pill = ({ children }: { children: ReactNode }) => (
  <span className="font-mono text-[.86em] bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-gray-700 whitespace-nowrap">{children}</span>
)

const B = ({ children }: { children: ReactNode }) => <b className="font-semibold text-gray-800">{children}</b>

/* ── Página ── */

export default function Ayuda() {
  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Encabezado */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <HelpCircle size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Guía paso a paso</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Cómo usar el sistema</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-xl">
          Aquí se explica para qué sirve cada sección y qué hace cada campo, incluyendo
          qué información aparece en el PDF que se envía al cliente.
        </p>
        <button onClick={() => replayTours()} className="btn-primary mt-4">
          <PlayCircle size={16} /> Volver a ver los tutoriales
        </button>
        <p className="text-[12px] text-gray-400 mt-2">
          Cada pantalla muestra un mini-tutorial la primera vez que entras. Con este botón vuelven a activarse: se abre el del Dashboard y el resto aparece a medida que entras a cada sección.
        </p>
      </div>

      <div className="space-y-4">

        <Section n={1} icon={LogIn} title="Ingresar al sistema">
          <p>Abre la dirección web del sistema y verás la pantalla de inicio de sesión.</p>
          <Bullets items={[
            <>Escribe tu <B>correo</B> y tu <B>contraseña</B> y presiona <B>Ingresar</B>.</>,
            <>Si olvidaste la clave, usa <B>“¿Olvidaste tu contraseña?”</B> y sigue las instrucciones que llegan a tu correo.</>,
          ]} />
          <Tip><B>Tus datos son solo tuyos.</B> Cada cuenta ve únicamente sus propias cotizaciones y clientes. Nadie más accede a tu información.</Tip>
        </Section>

        <Section n={2} icon={LayoutDashboard} title="El menú principal">
          <p>A la izquierda están las cinco secciones del sistema. En el celular, el menú se abre con el botón de arriba a la izquierda.</p>
          <Bullets items={[
            <><B>Dashboard:</B> resumen del mes (cuántas cotizaciones y por qué monto).</>,
            <><B>Nueva Cotización:</B> el formulario para armar una cotización.</>,
            <><B>Historial:</B> todas tus cotizaciones guardadas.</>,
            <><B>Clientes:</B> tu lista de clientes con sus datos.</>,
            <><B>Configuración:</B> los datos de tu empresa, el logo y el PDF.</>,
          ]} />
        </Section>

        <Section n={3} icon={Settings} title="Configuración: los datos de tu empresa">
          <p>
            Empieza por aquí. Lo que cargas en Configuración se usa <B>automáticamente</B> en todas
            tus cotizaciones. Este es el rol de cada campo y dónde aparece:
          </p>
          <Fields title="Encabezado del PDF" items={[
            { name: 'Logo', desc: 'La imagen de tu empresa. Se muestra arriba en la app y en el encabezado del PDF.', pdf: 'si' },
            { name: 'Razón social', desc: 'El nombre legal de tu empresa.', pdf: 'si' },
            { name: 'RUT', desc: 'Tu RUT de empresa. Se valida y se formatea con puntos y guion automáticamente.', pdf: 'si' },
            { name: 'Giro', desc: 'La actividad de tu empresa.', pdf: 'si' },
            { name: 'Dirección, Ciudad, Región', desc: 'La ubicación de tu empresa.', pdf: 'si' },
            { name: 'Teléfono y Email', desc: 'Tus datos de contacto para el cliente.', pdf: 'si' },
            { name: 'Ejecutivo', desc: 'La persona responsable de la venta. Aparece junto a la fecha en la cotización.', pdf: 'si' },
          ]} />
          <Fields title="Valores por defecto" items={[
            { name: 'Condición de pago', desc: <>Se carga sola en cada cotización nueva (por ejemplo <Pill>Crédito (30 días)</Pill>). Igual la puedes cambiar en cada una.</> },
            { name: 'Validez de oferta', desc: <>Por cuánto tiempo vale el precio (por ejemplo <Pill>10 días</Pill>). También se carga sola.</> },
          ]} />
          <Fields title="Configuración del PDF" items={[
            { name: 'Datos bancarios', desc: 'Dónde te transfiere el cliente. Aparecen al final del PDF, debajo de las observaciones.', pdf: 'si' },
            { name: 'Firma digital', desc: 'La dibujas con el mouse o el dedo. Aparece sobre la línea de firma en el PDF.', pdf: 'si' },
          ]} />
          <Fields title="Apariencia (solo dentro de la app)" items={[
            { name: 'Nombre y subtítulo', desc: 'El texto que se muestra en el menú lateral. No aparece en el PDF.', pdf: 'no' },
          ]} />
          <Tip>Cuando termines de cargar todo, presiona <B>Guardar Configuración</B>. No hace falta repetirlo, salvo que quieras cambiar algo.</Tip>
        </Section>

        <Section n={4} icon={Users} title="Clientes: guarda una vez, reutiliza siempre">
          <p>En <B>Clientes</B> guardas los datos de cada empresa a la que le cotizas, para no volver a escribirlos. Al crear una cotización, eliges el cliente y sus datos se completan solos.</p>
          <Fields title="Datos de un cliente" items={[
            { name: 'Razón social', desc: 'El nombre del cliente. Es el único campo obligatorio.' },
            { name: 'Alias', desc: <>Un apodo corto para encontrarlo rápido (por ejemplo “Muni Chillán”). Puedes buscar por el alias.</> },
            { name: 'RUT', desc: 'El RUT del cliente. Se valida y formatea automáticamente.' },
            { name: 'Giro', desc: 'La actividad del cliente.' },
            { name: 'Dirección, Ciudad, Comuna, Región', desc: 'La ubicación del cliente.' },
            { name: 'Teléfono y Email', desc: 'Datos de contacto del cliente.' },
            { name: 'Persona de contacto', desc: 'A quién va dirigida la cotización dentro de la empresa cliente.' },
          ]} />
          <p>En la lista puedes <B>buscar</B> por nombre o RUT, <B>ver el detalle</B> (ícono del ojo), <B>editar</B> (lápiz) o <B>eliminar</B> (tacho).</p>
          <Warn><B>Eliminar un cliente no borra sus cotizaciones.</B> Las cotizaciones ya hechas se conservan en el historial.</Warn>
        </Section>

        <Section n={5} icon={Receipt} title="Nueva Cotización: qué hace cada campo">
          <p>
            Es la parte principal del sistema. Aquí armas la cotización que después se convierte en el PDF.
            Este es el detalle de <B>cada campo</B> y cómo se refleja en el documento final:
          </p>

          <Fields title="Datos generales" items={[
            { name: 'N° de cotización', desc: <>Identifica la cotización. Se genera solo con el formato <Pill>AAMMDD-N</Pill> (año, mes, día y un correlativo del día). Puedes cambiarlo si necesitas otra numeración.</>, pdf: 'si' },
            { name: 'Fecha', desc: 'La fecha de emisión. Viene con el día de hoy y puedes cambiarla.', pdf: 'si' },
            { name: 'Ejecutivo', desc: 'Se toma de Configuración (la persona responsable). Aparece junto a la fecha.', pdf: 'si' },
          ]} />

          <Fields title="Cliente" items={[
            { name: 'Razón social', desc: <>A quién va dirigida la cotización. Escribe para buscar un cliente guardado y elígelo, o usa <B>“Registrar nuevo cliente”</B> para crearlo sin salir de la pantalla. Sus datos (RUT, dirección, contacto) se incluyen en el documento.</>, pdf: 'si' },
          ]} />

          <Fields title="Condiciones" items={[
            { name: 'Condición de pago', desc: 'Cómo y cuándo paga el cliente (por ejemplo, crédito a 30 días).', pdf: 'si' },
            { name: 'Validez de oferta', desc: 'Por cuánto tiempo se mantiene el precio ofertado.', pdf: 'si' },
            { name: 'Proceso de compra', desc: <>El número de la compra o licitación del cliente (por ejemplo <Pill>1057508-133-COT26</Pill>). Sirve de referencia para el cliente.</>, pdf: 'si' },
            { name: 'Identificador', desc: 'Una nota tuya para reconocer la cotización dentro del historial (por ejemplo, “2 impresoras SS Ñuble”). Es de uso interno.', pdf: 'no' },
          ]} />

          <Fields title="Detalle de productos (cada columna de la tabla)" items={[
            { name: 'Imagen', desc: 'Una foto del producto (opcional). Se muestra junto al ítem en el documento.', pdf: 'si' },
            { name: 'Producto', desc: 'El nombre del producto o servicio.', pdf: 'si' },
            { name: 'Descripción', desc: 'El detalle o las especificaciones. Aparece debajo del nombre del producto.', pdf: 'si' },
            { name: 'Cantidad', desc: 'Cuántas unidades se cotizan.', pdf: 'si' },
            { name: 'Unidad', desc: <>La unidad de medida (por ejemplo <Pill>unid.</Pill>, caja, metros).</>, pdf: 'si' },
            { name: 'Valor unitario', desc: 'El precio neto (sin IVA) de una unidad.', pdf: 'si' },
            { name: 'Subtotal', desc: 'Cantidad × valor unitario. Se calcula solo, no lo escribes.', pdf: 'si' },
          ]} />
          <p>Usa <B>“Agregar producto”</B> para sumar más filas, y el ícono del tacho para quitar una.</p>

          <Fields title="Cierre" items={[
            { name: 'Observaciones', desc: 'Condiciones adicionales (despacho, flete, tiempos de entrega). Viene un texto por defecto que puedes editar. Aparece debajo de la tabla.', pdf: 'si' },
            { name: 'Subtotal neto', desc: 'La suma de todos los productos, sin IVA. Se calcula solo.', pdf: 'si' },
            { name: 'IVA (19%)', desc: 'Se aplica automáticamente sobre el subtotal. No haces ninguna cuenta.', pdf: 'si' },
            { name: 'Total', desc: 'Subtotal + IVA. El monto final que paga el cliente.', pdf: 'si' },
          ]} />

          <p className="pt-1">Cuando esté lista, tienes dos botones abajo:</p>
          <Steps items={[
            { t: 'Guardar cotización', d: 'La deja registrada en el Historial para volver a ella cuando quieras.' },
            { t: 'Descargar PDF', d: 'Genera el documento profesional, listo para enviar al cliente.' },
          ]} />
          <Tip><B>Todo lo que cargues aquí arma el PDF.</B> Los campos marcados con “Aparece en el PDF” son los que verá tu cliente en el documento.</Tip>
        </Section>

        <Section n={6} icon={FileDown} title="El PDF: qué incluye">
          <p>El botón <B>Descargar PDF</B> (en la cotización o desde el historial) genera un documento profesional. Reúne, en orden:</p>
          <Bullets items={[
            <>Tu <B>logo</B> y los datos de tu empresa (encabezado).</>,
            <>El <B>número, la fecha</B> y el ejecutivo.</>,
            <>Los datos del <B>cliente</B>.</>,
            <>La <B>tabla de productos</B> con imágenes, cantidades y precios.</>,
            <>El <B>subtotal, el IVA y el total</B>.</>,
            <>Las <B>observaciones</B>, tus <B>datos bancarios</B> y tu <B>firma</B>.</>,
          ]} />
          <Tip>Se descarga a tu dispositivo. Desde ahí lo adjuntas por correo o WhatsApp como cualquier archivo.</Tip>
        </Section>

        <Section n={7} icon={FileText} title="El historial">
          <p>En <B>Historial</B> están todas tus cotizaciones. Puedes buscar por número, cliente, identificador o fecha. En cada fila tienes cuatro acciones:</p>
          <Bullets items={[
            <><B>Ver detalle</B> (ojo): despliega los productos y totales sin abrir la cotización.</>,
            <><B>Duplicar:</B> crea una copia con un número nuevo. Ideal para cotizaciones parecidas.</>,
            <><B>Editar</B> (lápiz): abre la cotización para modificarla.</>,
            <><B>Eliminar</B> (tacho): la borra.</>,
          ]} />
          <Warn><B>Eliminar no se puede deshacer.</B> El sistema pide confirmación antes de borrar. Si tienes dudas, mejor duplica en vez de borrar.</Warn>
        </Section>

        <Section n={8} icon={LayoutDashboard} title="El panel (Dashboard)">
          <p>Es tu pantalla de inicio. Muestra, mes a mes:</p>
          <Bullets items={[
            <>La <B>cantidad de cotizaciones</B> del mes.</>,
            <>El <B>monto total</B> cotizado en el mes.</>,
            <>La <B>lista</B> de esas cotizaciones, con acceso directo al historial.</>,
          ]} />
          <p>Usa las flechas <Pill>‹</Pill> <Pill>›</Pill> junto al mes para moverte entre meses.</p>
        </Section>

        <Section n={9} icon={HelpCircle} title="Preguntas frecuentes">
          <div className="space-y-3">
            <FAQ q="¿Se pueden perder mis datos?"
              a="No. Todo se guarda automáticamente en la nube cuando presionas “Guardar”. Puedes entrar desde cualquier dispositivo con tu correo y contraseña, y tu información sigue ahí." />
            <FAQ q="¿Otras personas pueden ver mis cotizaciones?"
              a="No. Cada cuenta está aislada: solo tú ves tus cotizaciones y tus clientes." />
            <FAQ q="¿Qué campos aparecen en el PDF y cuáles no?"
              a="La mayoría de los campos aparecen en el PDF (van marcados con “Aparece en el PDF”). El único uso interno es el “Identificador”, que sirve para reconocer la cotización en el historial y no se muestra al cliente." />
            <FAQ q="¿Tengo que calcular el IVA?"
              a="No. El sistema aplica el 19% sobre el subtotal y calcula el total automáticamente. Tú solo cargas cantidades y valores unitarios." />
            <FAQ q="¿Puedo cambiar el número de cotización?"
              a="Sí. Se genera automáticamente, pero puedes editarlo antes de guardar si necesitas una numeración específica." />
            <FAQ q="¿Puedo usarlo desde el celular?"
              a="Sí. El sistema se adapta a la pantalla del teléfono; el menú se abre con el botón de arriba a la izquierda." />
          </div>
        </Section>

      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        ¿Tienes una duda que no está aquí? Escríbenos y te ayudamos.
      </p>
    </div>
  )
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-xl border border-gray-100 bg-gray-50 px-4 group">
      <summary className="py-3 cursor-pointer font-semibold text-[14px] text-gray-800 list-none flex justify-between items-center gap-3">
        {q}
        <span className="text-blue-500 font-mono text-lg leading-none group-open:hidden">+</span>
        <span className="text-blue-500 font-mono text-lg leading-none hidden group-open:inline">–</span>
      </summary>
      <p className="pb-3.5 text-[13.5px] text-gray-500 m-0">{a}</p>
    </details>
  )
}

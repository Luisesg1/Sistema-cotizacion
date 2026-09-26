import { ReactNode } from 'react'
import {
  LogIn, LayoutDashboard, Settings, Users, Receipt, FileDown, FileText,
  HelpCircle, Check, AlertTriangle,
} from 'lucide-react'

/* ── Helpers de presentación ── */

function Section({ n, icon: Icon, title, children }: {
  n: number; icon: React.ElementType; title: string; children: ReactNode
}) {
  return (
    <section className="card p-6 sm:p-7 scroll-mt-6" id={`ayuda-${n}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}>
          <Icon size={17} className="text-white" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-mono font-bold text-blue-500">{String(n).padStart(2, '0')}</span>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">{title}</h2>
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
          Todo lo que necesitás para crear cotizaciones profesionales, generar el PDF y llevar el
          registro de tus clientes. Si sabés usar el correo, sabés usar esto.
        </p>
      </div>

      <div className="space-y-4">

        <Section n={1} icon={LogIn} title="Ingresar al sistema">
          <p>Abrí la dirección web del sistema y vas a ver la pantalla de inicio de sesión.</p>
          <Bullets items={[
            <>Escribí tu <B>correo</B> y tu <B>contraseña</B> y presioná <B>Ingresar</B>.</>,
            <>Si olvidaste la clave, usá <B>“¿Olvidaste tu contraseña?”</B> y seguí las instrucciones que llegan a tu correo.</>,
          ]} />
          <Tip><B>Tus datos son solo tuyos.</B> Cada cuenta ve únicamente sus propias cotizaciones y clientes. Nadie más accede a tu información.</Tip>
        </Section>

        <Section n={2} icon={LayoutDashboard} title="El menú principal">
          <p>A la izquierda tenés las cinco secciones del sistema:</p>
          <Bullets items={[
            <><B>Dashboard:</B> resumen del mes (cuántas cotizaciones y por qué monto).</>,
            <><B>Nueva Cotización:</B> el formulario para armar una cotización.</>,
            <><B>Historial:</B> todas tus cotizaciones guardadas.</>,
            <><B>Clientes:</B> tu lista de clientes con sus datos.</>,
            <><B>Configuración:</B> los datos de tu empresa, el logo y el PDF.</>,
          ]} />
        </Section>

        <Section n={3} icon={Settings} title="Configurar tu empresa (hacé esto primero)">
          <p>Antes de tu primera cotización, entrá a <B>Configuración</B>. Todo esto aparece automáticamente en cada cotización y en el PDF.</p>
          <Steps items={[
            { t: 'Subí tu logo', d: 'Botón “Subir logo”. PNG o JPG con fondo blanco. Aparece en el menú y en el PDF.' },
            { t: 'Completá los datos', d: 'Razón social, RUT, giro, ejecutivo, dirección, ciudad, región, teléfono y email.' },
            { t: 'Elegí tus valores por defecto', d: 'Condición de pago y validez que se cargarán solas en cada cotización nueva.' },
            { t: 'Configuración del PDF', d: 'Cargá tus datos bancarios y tu firma digital (la dibujás con el mouse o el dedo).' },
            { t: 'Guardá', d: 'Presioná “Guardar Configuración”. No hace falta repetirlo salvo que quieras cambiar algo.' },
          ]} />
          <Tip><B>El RUT se valida solo.</B> Si escribís un RUT inválido, el sistema te avisa, y lo formatea con puntos y guion.</Tip>
        </Section>

        <Section n={4} icon={Users} title="Gestionar clientes">
          <p>En <B>Clientes</B> guardás los datos de cada empresa a la que le cotizás, para no reescribirlos cada vez.</p>
          <Bullets items={[
            <><B>Nuevo Cliente:</B> razón social (obligatoria), alias, RUT, giro, dirección, ciudad, comuna, región, teléfono, email y contacto.</>,
            <><B>Buscar:</B> por nombre o RUT, arriba de la lista.</>,
            <><B>Ver detalle</B> (ojo), <B>Editar</B> (lápiz) o <B>Eliminar</B> (tacho) desde cada fila.</>,
          ]} />
          <Tip>El <Pill>alias</Pill> te ahorra tiempo: por ejemplo “Muni Chillán”. Podés buscar por el alias.</Tip>
          <Warn><B>Eliminar un cliente no borra sus cotizaciones.</B> Las cotizaciones ya hechas se conservan en el historial.</Warn>
        </Section>

        <Section n={5} icon={Receipt} title="Crear una cotización">
          <p>Es la parte principal. Entrá a <B>Nueva Cotización</B> y seguí estos pasos:</p>
          <Steps items={[
            { t: 'Número y fecha', d: <>El N° se genera solo (<Pill>260926-1</Pill>) y podés cambiarlo. La fecha viene con hoy.</> },
            { t: 'Elegí el cliente', d: 'Escribí en “Razón Social” y elegí uno guardado, o tocá “Registrar nuevo cliente” para crearlo al vuelo.' },
            { t: 'Condiciones', d: 'Condición de pago, validez, proceso de compra e identificador de referencia.' },
            { t: 'Agregá los productos', d: 'Por fila: imagen opcional, nombre, descripción, cantidad, unidad y valor unitario. El subtotal se calcula solo.' },
            { t: 'Observaciones', d: 'Viene un texto por defecto (despacho, flete). Editalo o dejalo como está.' },
            { t: 'Revisá los totales', d: 'Subtotal, IVA (19%) y Total se calculan automáticamente.' },
            { t: 'Guardá o descargá', d: '“Guardar cotización” la deja en el historial. “Descargar PDF” genera el documento para el cliente.' },
          ]} />
          <Tip><B>El IVA es siempre 19%</B> y se calcula solo sobre el subtotal. No tenés que hacer ninguna cuenta.</Tip>
        </Section>

        <Section n={6} icon={FileDown} title="Descargar el PDF">
          <p>Con <B>Descargar PDF</B> (en la cotización o desde el historial) obtenés un documento profesional listo para enviar. Incluye:</p>
          <Bullets items={[
            <>Tu <B>logo</B> y los datos de tu empresa.</>,
            <>Los datos del <B>cliente</B> y el número de cotización.</>,
            <>La <B>tabla de productos</B> con imágenes, cantidades y precios.</>,
            <><B>Subtotal, IVA y total</B>, observaciones, datos bancarios y tu firma.</>,
          ]} />
          <Tip>Se descarga a tu dispositivo. Desde ahí lo adjuntás por correo o WhatsApp como cualquier archivo.</Tip>
        </Section>

        <Section n={7} icon={FileText} title="El historial">
          <p>En <B>Historial</B> están todas tus cotizaciones. Buscá por número, cliente, identificador o fecha. En cada fila:</p>
          <Bullets items={[
            <><B>Ver detalle</B> (ojo): despliega productos y totales sin abrir la cotización.</>,
            <><B>Duplicar:</B> crea una copia con número nuevo. Ideal para cotizaciones parecidas.</>,
            <><B>Editar</B> (lápiz): abre la cotización para modificarla.</>,
            <><B>Eliminar</B> (tacho): la borra.</>,
          ]} />
          <Warn><B>Eliminar no se puede deshacer.</B> El sistema te pide confirmación. Si dudás, mejor duplicá en vez de borrar.</Warn>
        </Section>

        <Section n={8} icon={LayoutDashboard} title="El panel (Dashboard)">
          <p>Es tu pantalla de inicio. Muestra, mes a mes:</p>
          <Bullets items={[
            <>La <B>cantidad de cotizaciones</B> del mes.</>,
            <>El <B>monto total</B> cotizado en el mes.</>,
            <>La <B>lista</B> de esas cotizaciones, con acceso al historial.</>,
          ]} />
          <p>Usá las flechas <Pill>‹</Pill> <Pill>›</Pill> junto al mes para moverte entre meses.</p>
        </Section>

        <Section n={9} icon={HelpCircle} title="Preguntas frecuentes">
          <div className="space-y-3">
            <FAQ q="¿Se pueden perder mis datos?"
              a="No. Todo se guarda en la nube apenas presionás “Guardar”. Podés entrar desde cualquier dispositivo con tu correo y contraseña." />
            <FAQ q="¿Otras personas pueden ver mis cotizaciones?"
              a="No. Cada cuenta está aislada: solo vos ves tus cotizaciones y tus clientes." />
            <FAQ q="¿Puedo cambiar el número de cotización?"
              a="Sí. Se genera automáticamente, pero podés editarlo antes de guardar." />
            <FAQ q="¿Tengo que calcular el IVA?"
              a="No. El sistema aplica el 19% sobre el subtotal y calcula el total solo." />
            <FAQ q="¿Puedo usarlo desde el celular?"
              a="Sí. Se adapta a la pantalla del teléfono; el menú se abre con el botón de arriba a la izquierda." />
          </div>
        </Section>

      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        ¿Tenés una duda que no está acá? Escribinos y te ayudamos.
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

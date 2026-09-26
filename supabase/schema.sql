-- Sistema de Cotizaciones - Schema Supabase (multi-tenant)
--
-- Cada fila pertenece a un usuario (user_id). RLS aísla los datos por usuario:
-- cada cliente ve y modifica SOLO lo suyo.
--
-- Para migrar una base EXISTENTE (con datos) usar supabase/migracion-multitenant.sql.
-- Este archivo describe el esquema final para un deploy desde cero.

create table if not exists empresa (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) default auth.uid(),
  logo text,
  razon_social text not null default '',
  rut text not null default '',
  giro text not null default '',
  direccion text not null default '',
  region text not null default '',
  ciudad text not null default '',
  telefono text not null default '',
  email text not null default '',
  ejecutivo text not null default '',
  condicion_pago text not null default 'Contado',
  validez_oferta text not null default '10 días',
  datos_bancarios text,
  nombre_sistema text,
  subtitulo_sistema text,
  firma text,
  created_at timestamptz default now()
);

create table if not exists clientes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) default auth.uid(),
  razon_social text not null,
  alias text,
  rut text not null default '',
  giro text not null default '',
  direccion text not null default '',
  region text not null default '',
  ciudad text not null default '',
  comuna text,
  telefono text not null default '',
  email text not null default '',
  contacto text not null default '',
  created_at timestamptz default now()
);

create table if not exists cotizaciones (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) default auth.uid(),
  numero text not null,
  cliente_id uuid references clientes(id) on delete set null,
  fecha date not null,
  compra_agil text not null default '',
  identificador text,
  condicion_pago text not null default '',
  validez text not null default '',
  observaciones text not null default '',
  subtotal numeric(14,2) not null default 0,
  iva numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  estado text not null default 'borrador' check (estado in ('borrador','enviada','aceptada','rechazada')),
  created_at timestamptz default now(),
  -- Numeración por tenant: el número es único dentro de cada usuario, no global.
  constraint cotizaciones_numero_user_key unique (user_id, numero)
);

create table if not exists detalle_cotizacion (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) default auth.uid(),
  cotizacion_id uuid not null references cotizaciones(id) on delete cascade,
  cantidad numeric(10,2) not null default 1,
  unidad text not null default 'unid.',
  producto text not null default '',
  descripcion text not null default '',
  valor_unitario numeric(14,2) not null default 0,
  subtotal numeric(14,2) not null default 0,
  imagen text
);

-- RLS: aislar datos por usuario
alter table empresa enable row level security;
alter table clientes enable row level security;
alter table cotizaciones enable row level security;
alter table detalle_cotizacion enable row level security;

-- Cada usuario solo accede a sus propias filas.
-- El default user_id = auth.uid() completa el dueño en cada INSERT.
create policy "own rows" on empresa            for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on clientes           for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on cotizaciones       for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on detalle_cotizacion for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================
-- Migración a multi-tenant (SaaS multi-empresa)
-- Sistema de Cotizaciones
--
-- OWNER (backfill): josediaz.soporte@gmail.com
--   id = 20caea08-f664-4feb-b729-2802034ceed6
--
-- ⚠️  NO EJECUTAR SIN BACKUP CONFIRMADO. Es producción.
-- Ejecutar TODO el bloque en una sola corrida (Supabase SQL Editor).
-- Es transaccional: si algo falla, no queda a medias.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1. Agregar columna user_id (default = usuario logueado)
--    En INSERTs futuros el default toma auth.uid() automáticamente.
--    Las filas existentes quedan con NULL aquí y se rellenan en el paso 2.
-- ------------------------------------------------------------
alter table empresa            add column if not exists user_id uuid references auth.users(id) default auth.uid();
alter table clientes           add column if not exists user_id uuid references auth.users(id) default auth.uid();
alter table cotizaciones       add column if not exists user_id uuid references auth.users(id) default auth.uid();
alter table detalle_cotizacion add column if not exists user_id uuid references auth.users(id) default auth.uid();

-- ------------------------------------------------------------
-- 2. Backfill: asignar TODOS los datos actuales al cliente real
-- ------------------------------------------------------------
update empresa            set user_id = '20caea08-f664-4feb-b729-2802034ceed6' where user_id is null;
update clientes           set user_id = '20caea08-f664-4feb-b729-2802034ceed6' where user_id is null;
update cotizaciones       set user_id = '20caea08-f664-4feb-b729-2802034ceed6' where user_id is null;
update detalle_cotizacion set user_id = '20caea08-f664-4feb-b729-2802034ceed6' where user_id is null;

-- ------------------------------------------------------------
-- 3. user_id NOT NULL (tras backfill). Evita filas sin dueño
--    que, con el RLS nuevo, serían invisibles ("perdidas").
-- ------------------------------------------------------------
alter table empresa            alter column user_id set not null;
alter table clientes           alter column user_id set not null;
alter table cotizaciones       alter column user_id set not null;
alter table detalle_cotizacion alter column user_id set not null;

-- ------------------------------------------------------------
-- 4. Numeración por tenant: el UNIQUE global de `numero` rompería
--    en cuanto dos empresas generen el mismo número el mismo día
--    (generateNumero() numera por usuario tras el RLS).
--    Reemplazar el UNIQUE global por uno compuesto (user_id, numero).
--
--    El bloque DO detecta y elimina el UNIQUE que exista SOLO sobre
--    `numero` (sea cual sea su nombre auto-generado) de forma segura.
-- ------------------------------------------------------------
do $$
declare
  cons_name text;
begin
  select con.conname
    into cons_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  where rel.relname = 'cotizaciones'
    and con.contype = 'u'
    and con.conkey = array[
      (select attnum from pg_attribute
        where attrelid = rel.oid and attname = 'numero' and not attisdropped)
    ];
  if cons_name is not null then
    execute format('alter table cotizaciones drop constraint %I', cons_name);
  end if;
end $$;

alter table cotizaciones
  add constraint cotizaciones_numero_user_key unique (user_id, numero);

-- ------------------------------------------------------------
-- 5. Reemplazar las políticas permisivas por políticas por usuario.
--    OJO: en producción la política vieja se llamaba "auth only"
--    (auth.role() = 'authenticated'), no "allow all". Si queda una
--    política permisiva conviviendo con "own rows", Postgres las combina
--    con OR y CUALQUIER usuario logueado ve TODO. Por eso se eliminan
--    ambos nombres posibles.
-- ------------------------------------------------------------
drop policy if exists "allow all" on empresa;
drop policy if exists "allow all" on clientes;
drop policy if exists "allow all" on cotizaciones;
drop policy if exists "allow all" on detalle_cotizacion;

drop policy if exists "auth only" on empresa;
drop policy if exists "auth only" on clientes;
drop policy if exists "auth only" on cotizaciones;
drop policy if exists "auth only" on detalle_cotizacion;

create policy "own rows" on empresa            for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on clientes           for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on cotizaciones       for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on detalle_cotizacion for all using (user_id = auth.uid()) with check (user_id = auth.uid());

commit;

-- ============================================================
-- VERIFICACIÓN (correr DESPUÉS del commit, opcional):
--   -- todas las filas deben tener dueño y ser del owner:
--   select 'empresa' t, count(*) filter (where user_id is null) sin_dueno from empresa
--   union all select 'clientes', count(*) filter (where user_id is null) from clientes
--   union all select 'cotizaciones', count(*) filter (where user_id is null) from cotizaciones
--   union all select 'detalle', count(*) filter (where user_id is null) from detalle_cotizacion;
--
--   -- constraints de cotizaciones (debe verse cotizaciones_numero_user_key):
--   select conname, contype from pg_constraint
--   where conrelid = 'cotizaciones'::regclass and contype = 'u';
-- ============================================================

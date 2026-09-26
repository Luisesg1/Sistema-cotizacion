# Tarea: Convertir a SaaS multi-empresa (multi-tenant)

## Contexto del proyecto
Sistema de cotizaciones web, **en producción con un cliente real** (cPanel: `cotizacion.siti.cl`).
Repo: `github.com/Luisesg1/sistema-cotizacion`. Demo pública: `sistema-cotizacion-livid.vercel.app`.

**Stack:** React 18 + TypeScript + Vite + TailwindCSS. Backend: Supabase (PostgreSQL + Auth).
PDF con jsPDF nativo. Fallback a `localStorage` cuando no hay Supabase (modo demo con `VITE_DEMO_MODE=true`).

Working dir: `C:\Users\luise\Desktop\Practica\sistema cotizacion`

## Objetivo
Convertir la app de **datos compartidos** a **multi-empresa**: varios clientes usan la misma app,
cada uno con su login y sus datos aislados. **Sin perder los datos del cliente actual en producción.**

## Estado actual (el problema)
- Tablas: `empresa`, `clientes`, `cotizaciones`, `detalle_cotizacion`. Esquema en `supabase/schema.sql`.
- **Ninguna tabla tiene columna de dueño** (`user_id`). Todos los datos son compartidos.
- RLS activado pero con políticas **"allow all"** (`using (true) with check (true)`) → cualquier usuario logueado ve TODO.
- `getEmpresa()` en `src/lib/storage.ts` hace `.from('empresa').select('*').limit(1).single()` — asume una sola empresa global.
- Auth existe (`src/contexts/AuthContext.tsx`, login + reset password), pero los datos NO están scopeados por usuario.
- No hay página de signup — usuarios se crean manualmente en Supabase.

**Usuarios existentes en Supabase Auth (2):**
- `luiseduardosotoguti@gmail.com` (id: `3fb02d6e-c3f7-44e9-83ed-e2b94c2690b4`)
- `josediaz.soporte@gmail.com` (id: `20caea08-f664-4feb-b729-2802034ceed6`)

**DECISIÓN PENDIENTE (preguntar al usuario antes de correr SQL):**
¿A qué usuario se asignan los datos actuales en el backfill? (cuál es el cliente real cuyos datos hay que preservar)

## Plan de ejecución (en orden estricto)

### Paso 0 — Backup (OBLIGATORIO, no seguir sin esto)
Es producción con datos reales. En Supabase → Database → Backups, o exportar las 4 tablas por SQL Editor
(`copy ... to` o descargar como CSV). Confirmar con el usuario que el backup está hecho ANTES de tocar la base.

### Paso 1 — Migración SQL (el usuario la corre en Supabase SQL Editor)
Reemplazar `<OWNER_USER_ID>` con el id del usuario dueño (paso de decisión pendiente).

```sql
-- 1. Agregar columna user_id con default automático al usuario logueado
alter table empresa            add column if not exists user_id uuid references auth.users(id) default auth.uid();
alter table clientes           add column if not exists user_id uuid references auth.users(id) default auth.uid();
alter table cotizaciones       add column if not exists user_id uuid references auth.users(id) default auth.uid();
alter table detalle_cotizacion add column if not exists user_id uuid references auth.users(id) default auth.uid();

-- 2. Backfill: asignar todos los datos existentes al cliente actual
update empresa            set user_id = '<OWNER_USER_ID>' where user_id is null;
update clientes           set user_id = '<OWNER_USER_ID>' where user_id is null;
update cotizaciones       set user_id = '<OWNER_USER_ID>' where user_id is null;
update detalle_cotizacion set user_id = '<OWNER_USER_ID>' where user_id is null;

-- 3. Reemplazar políticas "allow all" por políticas por usuario
drop policy if exists "allow all" on empresa;
drop policy if exists "allow all" on clientes;
drop policy if exists "allow all" on cotizaciones;
drop policy if exists "allow all" on detalle_cotizacion;

create policy "own rows" on empresa            for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on clientes           for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on cotizaciones       for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on detalle_cotizacion for all using (user_id = auth.uid()) with check (user_id = auth.uid());
```

Nota: el `default auth.uid()` hace que los INSERT nuevos tomen automáticamente el usuario logueado,
así el código casi no cambia (RLS filtra los SELECT solos).

### Paso 2 — Cambios de código (los hace la sesión)
Archivo: `src/lib/storage.ts`
- `getEmpresa()`: cambiar `.single()` por `.maybeSingle()` — un usuario nuevo aún no tiene empresa,
  `.single()` tiraría error. Con `.maybeSingle()` devuelve `null` y la app muestra Configuración vacía.
- Verificar que `saveEmpresa`, `saveCliente`, `saveCotizacion` NO seteen `user_id` a mano (lo pone el default de la DB).
  Si algún insert manda columnas explícitas, asegurarse de no romper. RLS + default se encargan.
- Los `select` no necesitan filtro manual: RLS ya filtra por `auth.uid()`. Dejar como están.

Verificar también:
- `getClientes`, `getCotizaciones`, `getCotizacion` — RLS filtra solo, sin cambios de código.
- Actualizar `supabase/schema.sql` para reflejar el nuevo esquema (columna user_id + políticas nuevas)
  así queda documentado para futuros deploys.

### Paso 3 — Alta de clientes nuevos (onboarding)
Por ahora manual: en Supabase → Authentication → Add user (con Auto Confirm) por cada cliente.
Cada usuario nuevo entra, va a Configuración, carga su empresa y empieza de cero. Datos aislados.
(Opcional a futuro: agregar página de signup en la app.)

## Puntos de seguridad
- **NO correr el SQL sin backup confirmado.** Es producción.
- **NO correr el SQL sin haber definido `<OWNER_USER_ID>`.** Si queda null el backfill, los datos quedan sin dueño y con RLS nuevo NADIE los vería (parecerían "perdidos").
- Probar primero en un proyecto Supabase de staging si es posible.
- El modo demo (`VITE_DEMO_MODE=true`, localStorage) no se ve afectado — no toca Supabase.
- Tras el cambio: verificar login con el usuario dueño → debe ver sus datos. Login con otro usuario → debe ver vacío.

## Verificación final
1. Login con el cliente actual → ve sus cotizaciones/clientes de siempre. ✅ nada perdido.
2. Crear usuario nuevo de prueba → login → ve todo vacío. ✅ aislamiento.
3. Usuario nuevo crea empresa + un cliente → login del cliente actual → NO ve esos datos. ✅ multi-tenant.

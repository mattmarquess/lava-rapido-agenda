# Banco de Dados Supabase

Este é o SQL inicial para usar o projeto com Supabase/PostgreSQL.

## Agendamentos

Execute este bloco no Supabase em `SQL Editor`.

```sql
create table appointments (
  id text primary key,
  business_id text not null,
  customer_name text not null,
  customer_phone text not null,
  vehicle_plate text not null,
  vehicle_name text not null,
  service_name text not null,
  service_id text not null,
  appointment_date date not null,
  start_time time not null,
  status text not null default 'Agendado',
  notes text,
  price numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

create index appointments_business_date_idx
  on appointments (business_id, appointment_date, start_time);
```

## Políticas para o protótipo

Para esta versão estática publicada no GitHub Pages, o frontend usa a chave pública `anon`.
Use estas políticas apenas para protótipo e demonstração.

```sql
alter table appointments enable row level security;

create policy "Public read appointments"
on appointments for select
using (true);

create policy "Public insert appointments"
on appointments for insert
with check (true);

create policy "Public update appointments"
on appointments for update
using (true)
with check (true);

create policy "Public delete appointments"
on appointments for delete
using (true);
```

## Configurar o site

Depois de criar o projeto no Supabase, copie:

- `Project URL`
- `Publishable key`

Cole em `js/settings.js`:

```js
const supabaseConfig = {
  url: "SUA_SUPABASE_URL",
  anonKey: "SUA_PUBLISHABLE_KEY",
  businessId: "brilhomax"
};
```

Quando `url` e `anonKey` estiverem preenchidos, o sistema passa a ler e salvar agendamentos no Supabase. Se ficarem vazios, continua usando `localStorage`.

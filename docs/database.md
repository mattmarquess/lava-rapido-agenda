# Rascunho do Banco de Dados

Este é o modelo inicial para quando o projeto migrar para Supabase/PostgreSQL.

```sql
create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id),
  name text not null,
  description text,
  base_price numeric(10, 2) not null,
  duration_minutes integer not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table vehicle_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_multiplier numeric(6, 2) not null default 1
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id),
  service_id uuid not null references services(id),
  vehicle_type_id uuid not null references vehicle_types(id),
  customer_id uuid not null references customers(id),
  vehicle_plate text not null,
  appointment_date date not null,
  start_time time not null,
  status text not null default 'Agendado',
  notes text,
  final_price numeric(10, 2) not null,
  created_at timestamptz not null default now()
);
```

No começo, podemos usar apenas uma barbearia/lava rápido por sistema. Depois, se virar SaaS, a tabela `businesses` permite ter vários estabelecimentos no mesmo produto.

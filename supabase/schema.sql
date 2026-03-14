create extension if not exists "pgcrypto";

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null check (role in ('shipper', 'carrier', 'forwarder', 'admin')),
  country_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key,
  company_id uuid references public.companies(id) on delete set null,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('admin', 'operator', 'finance', 'viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  origin_port text not null,
  destination_port text not null,
  mode text not null,
  container_type text not null,
  cargo_description text,
  carrier_name text not null,
  transit_time_days integer not null,
  total_price numeric(12, 2) not null,
  currency text not null default 'USD',
  reliability_score numeric(5, 2),
  valid_until timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  booking_reference text not null unique,
  status text not null check (
    status in ('draft', 'confirmed', 'in_transit', 'delayed', 'delivered', 'cancelled')
  ),
  incoterm text,
  created_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  container_number text,
  vessel_name text,
  etd timestamptz,
  eta timestamptz,
  current_status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  status text not null,
  location text,
  event_time timestamptz not null,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  document_type text not null,
  file_name text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  channel text not null check (channel in ('email', 'sms', 'whatsapp', 'in_app')),
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  billing_name text not null,
  billing_email text not null,
  provider text not null check (provider in ('stripe', 'razorpay')),
  service_level text not null check (
    service_level in ('Normal delivery', 'Express delivery', 'Superfast delivery')
  ),
  amount_estimate numeric(12, 2) not null,
  currency text not null default 'USD',
  status text not null default 'initiated' check (status in ('initiated', 'paid', 'failed')),
  quote_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.payment_requests enable row level security;

drop policy if exists "Allow payment request inserts" on public.payment_requests;

create policy "Allow payment request inserts"
on public.payment_requests
for insert
to anon, authenticated
with check (true);

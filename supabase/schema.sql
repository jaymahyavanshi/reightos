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
  user_id uuid,
  booking_reference text not null unique,
  status text not null check (
    status in ('draft', 'confirmed', 'in_transit', 'delayed', 'delivered', 'cancelled')
  ),
  incoterm text,
  created_at timestamptz not null default now()
);

alter table public.bookings add column if not exists user_id uuid;

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

alter table public.bookings enable row level security;
alter table public.shipments enable row level security;
alter table public.tracking_events enable row level security;

drop policy if exists "Users can view own bookings" on public.bookings;
drop policy if exists "Users can view own shipments" on public.shipments;
drop policy if exists "Users can view own tracking events" on public.tracking_events;

create policy "Users can view own bookings"
on public.bookings
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can view own shipments"
on public.shipments
for select
to authenticated
using (
  exists (
    select 1
    from public.bookings
    where public.bookings.id = public.shipments.booking_id
      and public.bookings.user_id = auth.uid()
  )
);

create policy "Users can view own tracking events"
on public.tracking_events
for select
to authenticated
using (
  exists (
    select 1
    from public.shipments
    join public.bookings on public.bookings.id = public.shipments.booking_id
    where public.shipments.id = public.tracking_events.shipment_id
      and public.bookings.user_id = auth.uid()
  )
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
  receipt_number text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payment_requests add column if not exists receipt_number text;
alter table public.payment_requests add column if not exists paid_at timestamptz;
alter table public.payment_requests add column if not exists updated_at timestamptz not null default now();

alter table public.payment_requests enable row level security;

drop policy if exists "Allow payment request inserts" on public.payment_requests;
drop policy if exists "Users can view own payment requests" on public.payment_requests;
drop policy if exists "Users can update own payment requests" on public.payment_requests;

create policy "Allow payment request inserts"
on public.payment_requests
for insert
to anon, authenticated
with check (user_id is null or auth.uid() = user_id);

create policy "Users can view own payment requests"
on public.payment_requests
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can update own payment requests"
on public.payment_requests
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone_number text,
  company text not null,
  team_size text,
  details text,
  admin_email text,
  status text not null default 'submitted' check (
    status in ('submitted', 'notified', 'notification_failed')
  ),
  email_delivery text not null default 'pending' check (
    email_delivery in ('pending', 'sent', 'not_configured', 'failed')
  ),
  confirmation_sent_at timestamptz,
  admin_notified_at timestamptz,
  email_error text,
  created_at timestamptz not null default now()
);

alter table public.demo_requests add column if not exists phone_number text;

alter table public.demo_requests enable row level security;

drop policy if exists "Allow demo request inserts" on public.demo_requests;

create policy "Allow demo request inserts"
on public.demo_requests
for insert
to anon, authenticated
with check (true);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique,
  user_id uuid,
  full_name text not null,
  email text not null,
  contact_number text not null,
  issue_summary text not null,
  issue_details text not null,
  screenshot_name text,
  screenshot_type text,
  screenshot_data_url text,
  status text not null default 'open' check (status in ('open', 'pending', 'closed')),
  closed_by_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_tickets enable row level security;

drop policy if exists "Allow support ticket inserts" on public.support_tickets;
drop policy if exists "Allow support ticket selects" on public.support_tickets;
drop policy if exists "Allow support ticket updates" on public.support_tickets;

create policy "Allow support ticket inserts"
on public.support_tickets
for insert
to anon, authenticated
with check (true);

create policy "Allow support ticket selects"
on public.support_tickets
for select
to anon, authenticated
using (true);

create policy "Allow support ticket updates"
on public.support_tickets
for update
to anon, authenticated
using (true)
with check (true);

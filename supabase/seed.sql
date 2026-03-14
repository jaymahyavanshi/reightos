insert into public.companies (name, role, country_code)
values
  ('Oceanic Imports', 'shipper', 'IN'),
  ('Atlas Forwarding', 'forwarder', 'US'),
  ('BlueWave Carrier', 'carrier', 'SG')
on conflict do nothing;

with shipper as (
  select id from public.companies where name = 'Oceanic Imports' limit 1
)
insert into public.quotes (
  company_id,
  origin_port,
  destination_port,
  mode,
  container_type,
  cargo_description,
  carrier_name,
  transit_time_days,
  total_price,
  currency,
  reliability_score
)
select
  shipper.id,
  quote.origin_port,
  quote.destination_port,
  quote.mode,
  quote.container_type,
  quote.cargo_description,
  quote.carrier_name,
  quote.transit_time_days,
  quote.total_price,
  quote.currency,
  quote.reliability_score
from shipper,
(
  values
    ('Nhava Sheva, INNSA', 'Los Angeles, USLAX', 'FCL', '40HC', 'Consumer electronics', 'Maersk Digital', 24, 2940, 'USD', 94),
    ('Shanghai, CNSHA', 'New York, USNYC', 'FCL', '40HC', 'Home goods', 'MSC Marketplace', 26, 3180, 'USD', 91),
    ('Rotterdam, NLRTM', 'Savannah, USSAV', 'LCL', '8 CBM', 'Industrial parts', 'Hapag FastLane', 29, 1420, 'USD', 96)
) as quote(origin_port, destination_port, mode, container_type, cargo_description, carrier_name, transit_time_days, total_price, currency, reliability_score)
on conflict do nothing;

insert into public.companies (name, role, country_code)
select 'Seed Test Shipper', 'shipper', 'US'
where not exists (
  select 1 from public.companies where name = 'Seed Test Shipper'
);

insert into public.profiles (id, full_name, email, role)
select
  u.id,
  coalesce(nullif(u.raw_user_meta_data->>'full_name', ''), split_part(u.email, '@', 1)),
  u.email,
  case
    when coalesce(u.raw_user_meta_data->>'role', '') = 'admin' then 'admin'
    else 'viewer'
  end
from auth.users u
where u.email is not null
on conflict (id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role;

delete from public.tracking_events
where metadata->>'seeded_by' = 'supabase/seed.sql';

delete from public.shipments
where booking_id in (
  select id
  from public.bookings
  where booking_reference like 'SEED-%'
);

delete from public.bookings
where booking_reference like 'SEED-%';

delete from public.payment_requests
where quote_snapshot->>'seeded_by' = 'supabase/seed.sql';

with auth_members as (
  select
    u.id,
    coalesce(nullif(u.raw_user_meta_data->>'full_name', ''), split_part(u.email, '@', 1)) as full_name,
    u.email
  from auth.users u
  where u.email is not null
),
history_rows as (
  select
    auth_members.id as user_id,
    auth_members.full_name,
    auth_members.email,
    series.entry_no
  from auth_members
  cross join (
    values (1), (2), (3), (4)
  ) as series(entry_no)
)
insert into public.payment_requests (
  user_id,
  billing_name,
  billing_email,
  provider,
  service_level,
  amount_estimate,
  currency,
  status,
  quote_snapshot,
  receipt_number,
  paid_at,
  created_at,
  updated_at
)
select
  history_rows.user_id,
  history_rows.full_name,
  history_rows.email,
  case
    when history_rows.entry_no in (1, 3) then 'stripe'
    else 'razorpay'
  end,
  case history_rows.entry_no
    when 1 then 'Normal delivery'
    when 2 then 'Express delivery'
    when 3 then 'Superfast delivery'
    else 'Normal delivery'
  end,
  case history_rows.entry_no
    when 1 then 1280.00
    when 2 then 1845.00
    when 3 then 2390.00
    else 1560.00
  end,
  'USD',
  case history_rows.entry_no
    when 1 then 'paid'
    when 2 then 'paid'
    when 3 then 'initiated'
    else 'failed'
  end,
  jsonb_build_object(
    'originCountry', case history_rows.entry_no when 1 then 'India' when 2 then 'China' when 3 then 'Germany' else 'United States' end,
    'originState', case history_rows.entry_no when 1 then 'Maharashtra' when 2 then 'Guangdong' when 3 then 'Hamburg' else 'California' end,
    'destinationCountry', case history_rows.entry_no when 1 then 'United States' when 2 then 'Singapore' when 3 then 'United Arab Emirates' else 'India' end,
    'destinationState', case history_rows.entry_no when 1 then 'Texas' when 2 then 'Singapore' when 3 then 'Dubai' else 'Delhi' end,
    'mode', case history_rows.entry_no when 3 then 'Air freight' else 'Ocean freight' end,
    'container', case history_rows.entry_no when 2 then '1 x 20GP' when 3 then 'LCL 8 CBM' else '1 x 40HC' end,
    'paymentMethod', case when history_rows.entry_no in (1, 3) then 'credit_card' else 'upi' end,
    'paymentInstrumentLabel', case
      when history_rows.entry_no in (1, 3) then 'Credit card ending ' || lpad(((history_rows.entry_no * 1111)::text), 4, '0')
      else 'UPI te******@okaxis'
    end,
    'weightKg', 5200 + (history_rows.entry_no * 600),
    'volumeCbm', 18 + (history_rows.entry_no * 2),
    'distanceKm', 4200 + (history_rows.entry_no * 350),
    'seeded_by', 'supabase/seed.sql'
  ),
  case
    when history_rows.entry_no in (1, 2) then
      'RCT-SEED-' || upper(substr(replace(history_rows.user_id::text, '-', ''), 1, 6)) || '-' || history_rows.entry_no::text
    else null
  end,
  case
    when history_rows.entry_no in (1, 2) then now() - make_interval(days => (history_rows.entry_no * 3))
    else null
  end,
  now() - make_interval(days => (history_rows.entry_no * 4)),
  now() - make_interval(days => (history_rows.entry_no * 4))
from history_rows;

with auth_members as (
  select
    u.id,
    coalesce(nullif(u.raw_user_meta_data->>'full_name', ''), split_part(u.email, '@', 1)) as full_name
  from auth.users u
  where u.email is not null
),
seed_company as (
  select id
  from public.companies
  where name = 'Seed Test Shipper'
  limit 1
),
seed_quote as (
  select id
  from public.quotes
  order by created_at asc
  limit 1
)
insert into public.bookings (
  quote_id,
  company_id,
  user_id,
  booking_reference,
  status,
  incoterm,
  created_at
)
select
  seed_quote.id,
  seed_company.id,
  auth_members.id,
  'SEED-' || upper(substr(replace(auth_members.id::text, '-', ''), 1, 8)),
  'in_transit',
  'FOB',
  now() - interval '3 days'
from auth_members
cross join seed_company
cross join seed_quote;

with seeded_bookings as (
  select
    id,
    user_id,
    booking_reference
  from public.bookings
  where booking_reference like 'SEED-%'
)
insert into public.shipments (
  booking_id,
  container_number,
  vessel_name,
  etd,
  eta,
  current_status,
  created_at
)
select
  seeded_bookings.id,
  'MSKU' || upper(substr(replace(seeded_bookings.user_id::text, '-', ''), 1, 7)),
  case
    when ascii(substr(replace(seeded_bookings.user_id::text, '-', ''), 1, 1)) % 3 = 0 then 'MV Pacific Horizon'
    when ascii(substr(replace(seeded_bookings.user_id::text, '-', ''), 1, 1)) % 3 = 1 then 'MV Atlas Voyager'
    else 'MV Blue Crest'
  end,
  now() - interval '5 days',
  now() + interval '8 days',
  'At transshipment hub',
  now() - interval '2 days'
from seeded_bookings;

with seeded_shipments as (
  select
    public.shipments.id as shipment_id
  from public.shipments
  join public.bookings on public.bookings.id = public.shipments.booking_id
  where public.bookings.booking_reference like 'SEED-%'
)
insert into public.tracking_events (
  shipment_id,
  status,
  location,
  event_time,
  metadata
)
select
  seeded_shipments.shipment_id,
  seeded_events.status,
  seeded_events.location,
  seeded_events.event_time,
  jsonb_build_object('seeded_by', 'supabase/seed.sql')
from seeded_shipments
cross join lateral (
  values
    ('Booking confirmed', 'Origin warehouse', now() - interval '4 days'),
    ('Loaded on vessel', 'Origin port terminal', now() - interval '2 days'),
    ('At transshipment hub', 'Jebel Ali Port', now() - interval '6 hours')
) as seeded_events(status, location, event_time);

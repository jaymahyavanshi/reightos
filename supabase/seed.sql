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

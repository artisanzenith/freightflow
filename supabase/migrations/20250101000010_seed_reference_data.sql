-- =============================================================================
-- FreightFlow — 0010: Seed reference data (global document categories)
-- =============================================================================
-- Global (company_id = null) system document categories available to every
-- tenant. These are reference data, not business records, so they ship with
-- the schema. Tenants may add their own categories on top of these.
-- =============================================================================

insert into public.document_categories (company_id, name, slug, description, is_system, sort_order)
values
  (null, 'Rate Confirmation', 'rate-confirmation', 'Broker rate confirmation sheets.', true, 10),
  (null, 'Bill of Lading',    'bill-of-lading',    'BOL documents for shipments.',       true, 20),
  (null, 'Proof of Delivery', 'proof-of-delivery', 'Signed POD documents.',              true, 30),
  (null, 'Invoice',           'invoice',           'Invoices issued to brokers/shippers.', true, 40),
  (null, 'Insurance',         'insurance',         'Certificates and insurance policies.', true, 50),
  (null, 'Permit',            'permit',            'Operating and oversize permits.',    true, 60),
  (null, 'Registration',      'registration',      'Vehicle registration documents.',    true, 70),
  (null, 'Fuel Receipt',      'fuel-receipt',      'Fuel purchase receipts.',            true, 80),
  (null, 'Maintenance',       'maintenance',       'Maintenance and repair records.',    true, 90),
  (null, 'Other',             'other',             'Uncategorized documents.',           true, 100)
on conflict (slug) where company_id is null do nothing;

INSERT INTO "specializations" ("name", "slug", "category", "is_active")
VALUES
  ('Criminal Law',         'criminal-law',          'Litigation',  true),
  ('Family Law',           'family-law',             'Family',      true),
  ('Corporate Law',        'corporate-law',          'Corporate',   true),
  ('Immigration',          'immigration',            'Immigration', true),
  ('Real Estate',          'real-estate',            'Property',    true),
  ('Employment',           'employment',             'Employment',  true),
  ('Intellectual Property','intellectual-property',  'Corporate',   true),
  ('Tax Law',              'tax-law',                'Corporate',   true),
  ('Personal Injury',      'personal-injury',        'Litigation',  true),
  ('Civil Litigation',     'civil-litigation',       'Litigation',  true)
ON CONFLICT ("slug") DO NOTHING;

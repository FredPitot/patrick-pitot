-- Schema de gestion pour le site eCommerce Patrick Pitot.
-- Les tables sont isolees dans le schema patrick_pitot pour ne pas melanger
-- ces donnees avec le schema gears existant.

CREATE SCHEMA IF NOT EXISTS patrick_pitot;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION patrick_pitot.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS patrick_pitot.material (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patrick_pitot.product (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid REFERENCES patrick_pitot.material(id) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_description text,
  description text,
  price_cents integer CHECK (price_cents IS NULL OR price_cents >= 0),
  currency char(3) NOT NULL DEFAULT 'EUR',
  status text NOT NULL DEFAULT 'draft',
  stock_quantity integer NOT NULL DEFAULT 1 CHECK (stock_quantity >= 0),
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_product_status CHECK (
    status IN ('draft', 'available', 'reserved', 'sold', 'made_to_order', 'archived')
  )
);

CREATE TABLE IF NOT EXISTS patrick_pitot.product_image (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES patrick_pitot.product(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patrick_pitot.contact_request (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  source text NOT NULL DEFAULT 'website',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_contact_request_status CHECK (
    status IN ('new', 'in_progress', 'closed', 'spam')
  )
);

CREATE TABLE IF NOT EXISTS patrick_pitot.custom_order_request (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  preferred_material_id uuid REFERENCES patrick_pitot.material(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  intended_use text,
  engraving_text text,
  budget_cents integer CHECK (budget_cents IS NULL OR budget_cents >= 0),
  deadline_date date,
  message text,
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_custom_order_request_status CHECK (
    status IN ('new', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled')
  )
);

CREATE TABLE IF NOT EXISTS patrick_pitot.order_request (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  billing_address jsonb,
  shipping_address jsonb,
  shipping_method text,
  status text NOT NULL DEFAULT 'submitted',
  currency char(3) NOT NULL DEFAULT 'EUR',
  subtotal_cents integer NOT NULL DEFAULT 0 CHECK (subtotal_cents >= 0),
  shipping_cents integer NOT NULL DEFAULT 0 CHECK (shipping_cents >= 0),
  total_cents integer NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
  customer_message text,
  admin_notes text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_order_request_status CHECK (
    status IN (
      'submitted',
      'quoted',
      'confirmed',
      'in_progress',
      'ready',
      'shipped',
      'completed',
      'cancelled'
    )
  )
);

CREATE TABLE IF NOT EXISTS patrick_pitot.order_request_item (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_request_id uuid NOT NULL REFERENCES patrick_pitot.order_request(id) ON DELETE CASCADE,
  product_id uuid REFERENCES patrick_pitot.product(id) ON DELETE SET NULL,
  custom_order_request_id uuid REFERENCES patrick_pitot.custom_order_request(id) ON DELETE SET NULL,
  label text NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_cents integer CHECK (unit_price_cents IS NULL OR unit_price_cents >= 0),
  line_total_cents integer CHECK (line_total_cents IS NULL OR line_total_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patrick_pitot.admin_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  login_email text UNIQUE,
  password_hash text,
  role text NOT NULL DEFAULT 'admin',
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_admin_user_role CHECK (role IN ('admin', 'owner'))
);

CREATE TABLE IF NOT EXISTS patrick_pitot.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES patrick_pitot.admin_user(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_pp_product_material_id
  ON patrick_pitot.product(material_id);
CREATE INDEX IF NOT EXISTS ix_pp_product_status
  ON patrick_pitot.product(status);
CREATE INDEX IF NOT EXISTS ix_pp_product_image_product_id
  ON patrick_pitot.product_image(product_id);
CREATE INDEX IF NOT EXISTS ix_pp_contact_request_status_created
  ON patrick_pitot.contact_request(status, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_pp_custom_order_status_created
  ON patrick_pitot.custom_order_request(status, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_pp_order_request_status_created
  ON patrick_pitot.order_request(status, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_pp_order_item_order_request_id
  ON patrick_pitot.order_request_item(order_request_id);
CREATE INDEX IF NOT EXISTS ix_pp_admin_audit_created
  ON patrick_pitot.admin_audit_log(created_at DESC);

DROP TRIGGER IF EXISTS trg_material_updated_at ON patrick_pitot.material;
CREATE TRIGGER trg_material_updated_at
BEFORE UPDATE ON patrick_pitot.material
FOR EACH ROW EXECUTE FUNCTION patrick_pitot.set_updated_at();

DROP TRIGGER IF EXISTS trg_product_updated_at ON patrick_pitot.product;
CREATE TRIGGER trg_product_updated_at
BEFORE UPDATE ON patrick_pitot.product
FOR EACH ROW EXECUTE FUNCTION patrick_pitot.set_updated_at();

DROP TRIGGER IF EXISTS trg_contact_request_updated_at ON patrick_pitot.contact_request;
CREATE TRIGGER trg_contact_request_updated_at
BEFORE UPDATE ON patrick_pitot.contact_request
FOR EACH ROW EXECUTE FUNCTION patrick_pitot.set_updated_at();

DROP TRIGGER IF EXISTS trg_custom_order_request_updated_at ON patrick_pitot.custom_order_request;
CREATE TRIGGER trg_custom_order_request_updated_at
BEFORE UPDATE ON patrick_pitot.custom_order_request
FOR EACH ROW EXECUTE FUNCTION patrick_pitot.set_updated_at();

DROP TRIGGER IF EXISTS trg_order_request_updated_at ON patrick_pitot.order_request;
CREATE TRIGGER trg_order_request_updated_at
BEFORE UPDATE ON patrick_pitot.order_request
FOR EACH ROW EXECUTE FUNCTION patrick_pitot.set_updated_at();

DROP TRIGGER IF EXISTS trg_admin_user_updated_at ON patrick_pitot.admin_user;
CREATE TRIGGER trg_admin_user_updated_at
BEFORE UPDATE ON patrick_pitot.admin_user
FOR EACH ROW EXECUTE FUNCTION patrick_pitot.set_updated_at();

INSERT INTO patrick_pitot.material (slug, name, description, sort_order)
VALUES
  ('bois-naturel', 'Bois naturel', 'Manches en bois naturel, veinage visible et rendu chaleureux.', 10),
  ('bois-stabilise', 'Bois stabilise', 'Bois travaille pour gagner en tenue, profondeur et durabilite.', 20),
  ('micarta', 'Micarta', 'Matiere composite robuste, coloree et adaptee aux usages reguliers.', 30)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

WITH material_ids AS (
  SELECT slug, id FROM patrick_pitot.material
),
seed_products(slug, name, material_slug, short_description, image_url, sort_order) AS (
  VALUES
    (
      'couteau-bois-naturel-clair',
      'Couteau bois naturel clair',
      'bois-naturel',
      'Un manche lumineux et sobre, ideal pour une presentation cuisine elegante.',
      '/photos/bois-naturel/bois-naturel-clair.jpeg',
      10
    ),
    (
      'couteau-bois-naturel-fonce',
      'Couteau bois naturel fonce',
      'bois-naturel',
      'Une finition plus contrastee, avec un caractere visuel marque.',
      '/photos/bois-naturel/bois-naturel-fonce.jpeg',
      20
    ),
    (
      'couteau-micarta-jeans',
      'Couteau micarta jeans',
      'micarta',
      'Un manche bleu texture, moderne et robuste, photographie sur ecorce.',
      '/photos/micarta/micarta-jeans.jpeg',
      30
    ),
    (
      'couteau-micarta-vert',
      'Couteau micarta vert',
      'micarta',
      'Une piece au manche vert profond, pensee pour une identite plus contemporaine.',
      '/photos/micarta/micarta-vert.jpeg',
      40
    ),
    (
      'couteau-bois-naturel-rouge',
      'Couteau bois naturel rouge',
      'bois-naturel',
      'Un manche rouge chaleureux qui met en avant le travail de finition.',
      '/photos/bois-naturel/bois-naturel-rouge.jpeg',
      50
    ),
    (
      'peuplier-stabilise',
      'Peuplier stabilise',
      'bois-stabilise',
      'Une option matiere a valoriser pour les commandes personnalisees.',
      '/photos/bois-stabilise/loupe-de-peuplier.jpeg',
      60
    )
),
upserted AS (
  INSERT INTO patrick_pitot.product (
    slug,
    name,
    material_id,
    short_description,
    status,
    is_featured,
    sort_order
  )
  SELECT
    seed_products.slug,
    seed_products.name,
    material_ids.id,
    seed_products.short_description,
    'available',
    true,
    seed_products.sort_order
  FROM seed_products
  JOIN material_ids ON material_ids.slug = seed_products.material_slug
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    material_id = EXCLUDED.material_id,
    short_description = EXCLUDED.short_description,
    status = EXCLUDED.status,
    is_featured = EXCLUDED.is_featured,
    sort_order = EXCLUDED.sort_order
  RETURNING id, slug
)
INSERT INTO patrick_pitot.product_image (product_id, image_url, alt_text, sort_order, is_primary)
SELECT
  upserted.id,
  seed_products.image_url,
  seed_products.name,
  10,
  true
FROM upserted
JOIN seed_products ON seed_products.slug = upserted.slug
WHERE NOT EXISTS (
  SELECT 1
  FROM patrick_pitot.product_image existing
  WHERE existing.product_id = upserted.id
    AND existing.image_url = seed_products.image_url
);

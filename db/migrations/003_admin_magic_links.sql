CREATE TABLE IF NOT EXISTS patrick_pitot.admin_magic_link (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES patrick_pitot.admin_user(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  requested_email text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patrick_pitot.admin_session (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES patrick_pitot.admin_user(id) ON DELETE CASCADE,
  session_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz
);

CREATE INDEX IF NOT EXISTS ix_pp_admin_magic_link_token_hash
  ON patrick_pitot.admin_magic_link(token_hash);

CREATE INDEX IF NOT EXISTS ix_pp_admin_magic_link_expires
  ON patrick_pitot.admin_magic_link(expires_at);

CREATE INDEX IF NOT EXISTS ix_pp_admin_session_session_hash
  ON patrick_pitot.admin_session(session_hash);

CREATE INDEX IF NOT EXISTS ix_pp_admin_session_expires
  ON patrick_pitot.admin_session(expires_at);

INSERT INTO patrick_pitot.admin_user (display_name, login_email, role, is_active)
VALUES ('Patrick Pitot', 'compta@laboratoire-pitot.com', 'owner', true)
ON CONFLICT (login_email) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role,
  is_active = true;

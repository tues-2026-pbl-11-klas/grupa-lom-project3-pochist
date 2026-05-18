# ── KV Secrets Engine ────────────────────────────────────────
resource "vault_mount" "kv" {
  path = "secret"
  type = "kv-v2"
}

# ── Secrets ──────────────────────────────────────────────────
resource "vault_kv_secret_v2" "acr" {
  mount = vault_mount.kv.path
  name  = "acr"
  data_json = jsonencode({
    registry = var.acr_registry
    username = var.acr_username
    password = var.acr_password
  })
}

resource "vault_kv_secret_v2" "database" {
  mount = vault_mount.kv.path
  name  = "database"
  data_json = jsonencode({
    url      = var.db_url
    username = var.db_username
    password = var.db_password
  })
}

resource "vault_kv_secret_v2" "db_admin" {
  mount = vault_mount.kv.path
  name  = "db-admin"
  data_json = jsonencode({
    host     = "cnpg-cluster-rw.db.svc.cluster.local"
    port     = "5432"
    database = var.db_name
    username = var.db_username
    password = var.db_password
    jdbc_url = "jdbc:postgresql://cnpg-cluster-rw.db.svc.cluster.local:5432/${var.db_name}"
  })
}

resource "vault_kv_secret_v2" "computer_vision" {
  mount = vault_mount.kv.path
  name  = "computer-vision"
  data_json = jsonencode({
    endpoint = var.computer_vision_endpoint
    key      = var.computer_vision_key
  })
}

# ── Auth Backend ─────────────────────────────────────────────
resource "vault_auth_backend" "approle" {
  type = "approle"
}

# ── Policies ─────────────────────────────────────────────────
resource "vault_policy" "github_actions" {
  name   = "github-actions"
  policy = <<EOT
path "secret/data/acr" {
  capabilities = ["read"]
}
EOT
}

resource "vault_policy" "backend" {
  name   = "backend"
  policy = <<EOT
path "secret/data/database" {
  capabilities = ["read"]
}
EOT
}

resource "vault_policy" "developer" {
  name   = "developer"
  policy = <<EOT
path "secret/data/computer-vision" {
  capabilities = ["read"]
}
path "secret/data/db-admin" {
  capabilities = ["read"]
}
EOT
}

# ── AppRoles ─────────────────────────────────────────────────
resource "vault_approle_auth_backend_role" "github_actions" {
  backend        = vault_auth_backend.approle.path
  role_name      = "github-actions"
  token_policies = [vault_policy.github_actions.name]
  token_ttl      = 3600
  token_max_ttl  = 7200
}

resource "vault_approle_auth_backend_role" "backend" {
  backend        = vault_auth_backend.approle.path
  role_name      = "backend"
  token_policies = [vault_policy.backend.name]
  token_ttl      = 3600
  token_max_ttl  = 86400
}

resource "vault_approle_auth_backend_role" "developer" {
  backend        = vault_auth_backend.approle.path
  role_name      = "developer"
  token_policies = [vault_policy.developer.name]
  token_ttl      = 28800
  token_max_ttl  = 86400
}

# ── Role IDs (data sources) ───────────────────────────────────
data "vault_approle_auth_backend_role_id" "github_actions" {
  backend   = vault_auth_backend.approle.path
  role_name = vault_approle_auth_backend_role.github_actions.role_name
}

data "vault_approle_auth_backend_role_id" "backend" {
  backend   = vault_auth_backend.approle.path
  role_name = vault_approle_auth_backend_role.backend.role_name
}

data "vault_approle_auth_backend_role_id" "developer" {
  backend   = vault_auth_backend.approle.path
  role_name = vault_approle_auth_backend_role.developer.role_name
}

# ── Secret IDs ───────────────────────────────────────────────
resource "vault_approle_auth_backend_role_secret_id" "github_actions" {
  backend   = vault_auth_backend.approle.path
  role_name = vault_approle_auth_backend_role.github_actions.role_name
}

resource "vault_approle_auth_backend_role_secret_id" "backend" {
  backend   = vault_auth_backend.approle.path
  role_name = vault_approle_auth_backend_role.backend.role_name
}

resource "vault_approle_auth_backend_role_secret_id" "developer" {
  backend   = vault_auth_backend.approle.path
  role_name = vault_approle_auth_backend_role.developer.role_name
}

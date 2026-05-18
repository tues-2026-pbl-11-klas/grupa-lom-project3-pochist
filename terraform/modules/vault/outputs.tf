output "github_actions_role_id" {
  value     = data.vault_approle_auth_backend_role_id.github_actions.role_id
  sensitive = true
}
output "github_actions_secret_id" {
  value     = vault_approle_auth_backend_role_secret_id.github_actions.secret_id
  sensitive = true
}
output "backend_role_id" {
  value     = data.vault_approle_auth_backend_role_id.backend.role_id
  sensitive = true
}
output "backend_secret_id" {
  value     = vault_approle_auth_backend_role_secret_id.backend.secret_id
  sensitive = true
}
output "developer_role_id" {
  value     = data.vault_approle_auth_backend_role_id.developer.role_id
  sensitive = true
}
output "developer_secret_id" {
  value     = vault_approle_auth_backend_role_secret_id.developer.secret_id
  sensitive = true
}

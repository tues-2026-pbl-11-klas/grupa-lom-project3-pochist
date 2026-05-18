output "vault_public_url" {
  value = hcp_vault_cluster.main.vault_public_endpoint_url
}

output "vault_cluster_id" {
  value = hcp_vault_cluster.main.cluster_id
}

output "vault_admin_token" {
  value     = hcp_vault_cluster_admin_token.main.token
  sensitive = true
}

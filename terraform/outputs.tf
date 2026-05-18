output "resource_group_name" {
  value = module.network.resource_group_name
}

output "vnet_id" {
  value = module.network.vnet_id
}

output "acr_login_server" {
  value = module.acr.acr_login_server
}

output "acr_name" {
  value = module.acr.acr_name
}

output "aks_cluster_name" {
  value = module.aks.aks_cluster_name
}

output "aks_kube_config" {
  value     = module.aks.kube_config_raw
  sensitive = true
}

output "cnpg_connection_host" {
  value = "cnpg-cluster-rw.db.svc.cluster.local"
}

output "vault_public_url" {
  value = module.hcp.vault_public_url
}

output "vault_cluster_id" {
  value = module.hcp.vault_cluster_id
}

output "github_actions_role_id" {
  value     = module.vault.github_actions_role_id
  sensitive = true
}

output "github_actions_secret_id" {
  value     = module.vault.github_actions_secret_id
  sensitive = true
}

output "backend_role_id" {
  value     = module.vault.backend_role_id
  sensitive = true
}

output "backend_secret_id" {
  value     = module.vault.backend_secret_id
  sensitive = true
}

output "developer_role_id" {
  value     = module.vault.developer_role_id
  sensitive = true
}

output "developer_secret_id" {
  value     = module.vault.developer_secret_id
  sensitive = true
}

resource "hcp_hvn" "main" {
  hvn_id         = "${var.project_name}-hvn"
  cloud_provider = "azure"
  region         = "westeurope"
}

resource "hcp_vault_cluster" "main" {
  cluster_id      = "${var.project_name}-vault"
  hvn_id          = hcp_hvn.main.hvn_id
  tier            = "dev"
  public_endpoint = true
}

resource "hcp_vault_cluster_admin_token" "main" {
  cluster_id = hcp_vault_cluster.main.cluster_id
}

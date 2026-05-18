
# ── 1. HCP Vault Cluster ────────────────────────────────────
module "hcp" {
  source       = "./modules/hcp"
  project_name = var.project_name
}

# ── 2. Network (VNet, Subnets, NSG) ─────────────────────────
module "network" {
  source             = "./modules/network"
  project_name       = var.project_name
  environment        = var.environment
  location           = var.location
  vnet_cidr          = var.vnet_cidr
  public_subnet_cidr = var.public_subnet_cidr
  aks_subnet_cidr    = var.aks_subnet_cidr
  db_subnet_cidr     = var.db_subnet_cidr
}

# ── 3. Azure Container Registry ─────────────────────────────
module "acr" {
  source       = "./modules/acr"
  project_name = var.project_name
  environment  = var.environment
  location     = module.network.resource_group_location
  rg_name      = module.network.resource_group_name
}

# ── 4. AKS Cluster ──────────────────────────────────────────
module "aks" {
  source           = "./modules/aks"
  project_name     = var.project_name
  environment      = var.environment
  location         = module.network.resource_group_location
  rg_name          = module.network.resource_group_name
  aks_subnet_id    = module.network.aks_subnet_id
  aks_node_vm_size = var.aks_node_vm_size
  acr_id           = module.acr.acr_id
}

# ── 5. Kubernetes workloads (CNPG, ArgoCD, secrets) ─────────
module "kubernetes" {
  source                   = "./modules/kubernetes"
  project_name             = var.project_name
  environment              = var.environment
  argocd_hostname          = var.argocd_hostname
  db_name                  = var.db_name
  db_username              = var.db_username
  db_password              = var.db_password
  jwt_secret               = var.jwt_secret
  computer_vision_endpoint = module.cognitive.endpoint
  computer_vision_key      = module.cognitive.primary_key
  kube_host                = module.aks.kube_host
  kube_client_certificate  = module.aks.kube_client_certificate
  kube_client_key          = module.aks.kube_client_key
  kube_ca_certificate      = module.aks.kube_ca_certificate
  mail_host     = var.mail_host
  mail_port     = var.mail_port
  mail_username = var.mail_username
  mail_password = var.mail_password

  depends_on = [module.aks, module.cognitive]
}

# ── 6. Cognitive Services (Computer Vision) ──────────────────
# location = germanywestcentral (поддържа Computer Vision)
module "cognitive" {
  source       = "./modules/cognitive"
  project_name = var.project_name
  environment  = var.environment
  location     = "germanywestcentral"
  rg_name      = module.network.resource_group_name
}

# ── 7. Vault secrets & policies ──────────────────────────────
module "vault" {
  source                   = "./modules/vault"
  acr_registry             = module.acr.acr_login_server
  acr_username             = module.acr.acr_admin_username
  acr_password             = module.acr.acr_admin_password
  db_url                   = "jdbc:postgresql://cnpg-cluster-rw.db.svc.cluster.local:5432/${var.db_name}"
  db_username              = var.db_username
  db_password              = var.db_password
  computer_vision_endpoint = module.cognitive.endpoint
  computer_vision_key      = module.cognitive.primary_key
  db_name                  = var.db_name

  depends_on = [module.hcp]
}

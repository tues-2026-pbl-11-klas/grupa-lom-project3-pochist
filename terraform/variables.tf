variable "location" {
  description = "Azure region"
  type        = string
  default     = "germanywestcentral"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "chist"
}

variable "vnet_cidr" {
  description = "CIDR block for the VNet"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR for public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "aks_subnet_cidr" {
  description = "CIDR for AKS subnet"
  type        = string
  default     = "10.0.10.0/24"
}

variable "db_subnet_cidr" {
  description = "CIDR for database subnet"
  type        = string
  default     = "10.0.20.0/24"
}

variable "acr_repositories" {
  description = "List of image repository names"
  type        = list(string)
  default     = ["frontend", "backend"]
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "appdb"
}

variable "db_username" {
  description = "PostgreSQL admin username"
  type        = string
  default     = "dbadmin"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "aks_node_vm_size" {
  description = "VM size for AKS nodes"
  type        = string
  default     = "Standard_B2s"
}

variable "argocd_hostname" {
  description = "Hostname for ArgoCD ingress"
  type        = string
  default     = "argocd.chist.dev"
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
}

variable "computer_vision_endpoint" {
  description = "Azure Computer Vision endpoint URL"
  type        = string
  default     = ""
}

variable "computer_vision_key" {
  description = "Azure Computer Vision API key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "acr_registry" {
  description = "ACR login server"
  type        = string
}

variable "acr_username" {
  description = "ACR admin username"
  type        = string
}

variable "acr_password" {
  description = "ACR admin password"
  type        = string
  sensitive   = true
}

variable "mail_host" {
  description = "SMTP mail host"
  type        = string
  default     = "smtp.gmail.com"
}

variable "mail_port" {
  description = "SMTP mail port"
  type        = string
  default     = "587"
}

variable "mail_username" {
  description = "SMTP mail username"
  type        = string
}

variable "mail_password" {
  description = "SMTP mail password"
  type        = string
  sensitive   = true
}

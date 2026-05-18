variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "argocd_hostname" {
  type = string
}

variable "db_name" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "computer_vision_endpoint" {
  type    = string
  default = ""
}

variable "computer_vision_key" {
  type      = string
  sensitive = true
  default   = ""
}

variable "kube_host" {
  type      = string
  sensitive = true
}

variable "kube_client_certificate" {
  type      = string
  sensitive = true
}

variable "kube_client_key" {
  type      = string
  sensitive = true
}

variable "kube_ca_certificate" {
  type      = string
  sensitive = true
}

variable "mail_host" { type = string }
variable "mail_port" { type = string }
variable "mail_username" { type = string }
variable "mail_password" {
  type      = string
  sensitive = true
}

variable "acr_registry" {
  type = string
}

variable "acr_username" {
  type = string
}

variable "acr_password" {
  type      = string
  sensitive = true
}

variable "db_url" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "db_name" {
  type = string
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

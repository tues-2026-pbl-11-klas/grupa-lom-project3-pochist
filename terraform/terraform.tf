terraform {
  required_version = ">= 1.6"

  cloud {
    organization = "chist"
    workspaces {
      name = "azure-infra-dev"
    }
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    hcp = {
      source  = "hashicorp/hcp"
      version = "~> 0.78"
    }
    vault = {
      source  = "hashicorp/vault"
      version = "~> 3.0"
    }
  }
}

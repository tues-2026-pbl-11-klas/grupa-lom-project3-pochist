resource "azurerm_cognitive_account" "vision" {
  name                = "cv-${var.project_name}-${var.environment}"
  location            = var.location
  resource_group_name = var.rg_name
  kind                = "ComputerVision"
  sku_name            = "F0"

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

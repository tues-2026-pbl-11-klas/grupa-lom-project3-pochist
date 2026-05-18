cd C:\Users\alexr\Projects\Grupa-Lom-Project2-Chist\terraform
terraform apply -target="module.hcp" -var-file="dev.tfvars" -auto-approve
terraform apply -var-file="dev.tfvars" -auto-approve

#-------------------------------------------
# Required variables (do not add defaults here!)
#-------------------------------------------

#-------------------------------------------
# Configurable variables
#-------------------------------------------
variable "region" {
  default = "us-west-2"
}

variable "domain_name" {
  default = "untrack.kye.dev"
}

variable "zone_name" {
  default = "kye.dev"
}

variable "deno_deploy_acme" {
  default = "0dbd78da34f77ea0a29b4a23._acme.deno.dev."
}

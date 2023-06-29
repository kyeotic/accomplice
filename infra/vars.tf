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
  default = "accomplice.kye.dev"
}

variable "zone_name" {
  default = "kye.dev"
}

variable "deno_deploy_acme" {
  default = "a9f6f5ec3c052587eba8bf70._acme.deno.dev."
}

#-------------------------------------------
# Required variables (do not add defaults here!)
#-------------------------------------------

#-------------------------------------------
# Configurable variables
#-------------------------------------------
variable "cloudflare_account_name" {
  default = "tim@kye.dev"
}

variable "region" {
  default = "us-west-2"
}

variable "domain_name" {
  default = "accomplice.kye.dev"
}

variable "zone_name" {
  default = "kye.dev"
}

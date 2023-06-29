module "domain" {
  source      = "github.com/kyeotic/tf-deno-domain-aws"
  zone_name   = var.zone_name
  domain_name = var.domain_name
  deno_acme   = var.deno_deploy_acme
}

module "domain_old" {
  source      = "github.com/kyeotic/tf-deno-domain-aws"
  zone_name   = var.zone_name
  domain_name = "untrack.kye.dev"
  deno_acme   = "0dbd78da34f77ea0a29b4a23._acme.deno.dev."
}
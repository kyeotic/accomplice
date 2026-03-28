data "cloudflare_zone" "kye_dev" {
  name = var.zone_name
}

data "external" "pages_subdomain" {
  program = ["${path.module}/scripts/get_pages_subdomain.sh"]
  query = {
    account_id   = local.cloudflare_account_id
    project_name = "accomplice"
  }
}

resource "cloudflare_pages_domain" "accomplice" {
  account_id   = local.cloudflare_account_id
  project_name = "accomplice"
  domain       = var.domain_name
}

resource "cloudflare_record" "accomplice" {
  zone_id = data.cloudflare_zone.kye_dev.id
  name    = "accomplice"
  type    = "CNAME"
  content = data.external.pages_subdomain.result.subdomain
  proxied = true
}

resource "cloudflare_pages_domain" "untrack" {
  account_id   = local.cloudflare_account_id
  project_name = "accomplice"
  domain       = "untrack.kye.dev"
}

resource "cloudflare_record" "untrack" {
  zone_id = data.cloudflare_zone.kye_dev.id
  name    = "untrack"
  type    = "CNAME"
  content = data.external.pages_subdomain.result.subdomain
  proxied = true
}

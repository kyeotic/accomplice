data "cloudflare_zone" "kye_dev" {
  name = var.zone_name
}

data "external" "pages_subdomain" {
  program = ["bash", "-c", "bash <(curl -sf 'https://gist.githubusercontent.com/kyeotic/a9a3ed42bb7be6b66d58cf70053da977/raw/get_pages_subdomain.sh')"]
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

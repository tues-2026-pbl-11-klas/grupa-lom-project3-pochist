# ── NGINX Ingress ────────────────────────────────────────
resource "helm_release" "nginx_ingress" {
  name             = "ingress-nginx"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  version          = "4.10.0"
  namespace        = "ingress-nginx"
  create_namespace = true

  values = [yamlencode({
    controller = {
      service = {
        type                  = "LoadBalancer"
        externalTrafficPolicy = "Local"
      }
      config = {
        use-forwarded-headers = "true"
      }
    }
  })]
}

# ── CNPG Operator ────────────────────────────────────────
resource "helm_release" "cnpg_operator" {
  name             = "cnpg"
  repository       = "https://cloudnative-pg.github.io/charts"
  chart            = "cloudnative-pg"
  version          = "0.21.6"
  namespace        = "cnpg-system"
  create_namespace = true

  wait    = true
  timeout = 300
}

# ── ArgoCD ───────────────────────────────────────────────
resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  version          = "7.8.13"
  namespace        = "argocd"
  create_namespace = true

  values = [yamlencode({
    server = {
      extraArgs = ["--insecure"]
      ingress = {
        enabled          = true
        ingressClassName = "nginx"
        hostname         = var.argocd_hostname
        servicePort      = 80
        annotations = {
          "nginx.ingress.kubernetes.io/ssl-redirect"     = "false"
          "nginx.ingress.kubernetes.io/backend-protocol" = "HTTP"
          "nginx.ingress.kubernetes.io/force-ssl-redirect" = "false"
        }
        tls = false
      }
    }
  })]

  depends_on = [helm_release.nginx_ingress]
}

# ── ArgoCD Apps ──────────────────────────────────────────
resource "helm_release" "argocd_apps" {
  name             = "argocd-apps"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argocd-apps"
  version          = "2.0.2"
  namespace        = "argocd"
  create_namespace = false

  values = [file("${path.module}/templates/argocd-apps-values.yaml")]

  depends_on = [helm_release.argocd]
}

# ── Namespaces ───────────────────────────────────────────
resource "kubernetes_namespace" "db" {
  metadata { name = "db" }
}

resource "kubernetes_namespace" "chist" {
  metadata { name = "chist" }
}

# ── CNPG App credentials secret ──────────────────────────
resource "kubernetes_secret" "cnpg_app_credentials" {
  metadata {
    name      = "cnpg-app-credentials"
    namespace = kubernetes_namespace.db.metadata[0].name
  }
  data = {
    username = var.db_username
    password = var.db_password
  }
  type = "kubernetes.io/basic-auth"
}

# ── Backend secret ───────────────────────────────────────
resource "kubernetes_secret" "backend_secret" {
  metadata {
    name      = "backend-secret"
    namespace = kubernetes_namespace.chist.metadata[0].name
  }

  data = {
    DB_URL      = "jdbc:postgresql://cnpg-cluster-rw.db.svc.cluster.local:5432/${var.db_name}"
    DB_USERNAME = var.db_username
    DB_PASSWORD = var.db_password

    JWT_SECRET     = var.jwt_secret
    JWT_EXPIRATION = "86400000"

    MAIL_HOST     = var.mail_host
    MAIL_PORT     = var.mail_port
    MAIL_USERNAME = var.mail_username
    MAIL_PASSWORD = var.mail_password

    SERVER_PORT_USER         = "8080"
    SERVER_PORT_REPORT       = "8081"
    SERVER_PORT_NOTIFICATION = "8082"

    USER_SERVICE_URL         = "http://user-module:8080"
    COMPUTER_VISION_ENDPOINT = var.computer_vision_endpoint
    COMPUTER_VISION_KEY      = var.computer_vision_key
  }
}

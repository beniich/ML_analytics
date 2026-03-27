# 🏰 Directives de Sécurité Avancées (SaaS ML Analytics)

Ce document définit les protocoles de sécurité stricts pour la plateforme AI Analytics, garantissant l'intégrité des données, la confidentialité des modèles et la protection contre les activités malveillantes.

## 1. 🔐 Authentification & Autorisation (AAA)

### Protocole JWT (JSON Web Token)
- **Rotation des Clés** : Les clés secrètes doivent être régénérées tous les 30 jours via `secrets.token_urlsafe(32)`.
- **Mécanisme Dual Token** :
  *   **Access Token** : Durée de vie courte (15-60 min) stockée en mémoire applicative.
  *   **Refresh Token** : Durée de vie longue (30 jours) stockée dans un cookie `HttpOnly`, `Secure`, `SameSite=Strict`.
- **Validation RBAC** : Chaque endpoint doit vérifier le rôle de l'utilisateur (`Admin`, `Editor`, `Viewer`) via le décorateur `Depends(check_role)`.

## 2. 🛡️ Protection des Données (Data-at-Rest & In-Flight)

### Chiffrement TLS
- **Transport** : Forcer `HTTPS` avec `HSTS` (Strict-Transport-Security). Aucun trafic `HTTP` n'est autorisé en production.
- **Payloads** : Les fichiers uploadés (CSV/Excel) sont cryptés au repos en utilisant l'algorithme `AES-256-GCM`.

### Prévention des Injections
- **SQL Injection** : Utilisation systématique de `SQLAlchemy ORM` pour l'échappement automatique des requêtes. 
- **NoSQL Injection** : Validation stricte des schémas JSON pour les métriques MLflow.
- **XSS (Cross-Site Scripting)** : Nettoyage systématique des fichiers HTML générés pour les rapports via `Bleach` ou `DOMPurify`.

## 3. 🌐 Sécurité Réseau & API

### CORS & Origines
- **Whitelist Strict** : Seules les origines explicitement définies dans `CORS_ORIGINS` sont autorisées. L'utilisation de `*` est strictement interdite en production.
- **Headers de Sécurité** :
  *   `X-Frame-Options: DENY` (Anti-Clickjacking)
  *   `Content-Security-Policy` : Politique stricte restreignant l'exécution de scripts tiers.

### Rate Limiting (Limitation de Débit)
- **Protection par IP** : Maximum 5 tentatives de connexion par 15 minutes.
- **Protection API** : Limitation adaptative basée sur le niveau d'abonnement pour prévenir les attaques DDoS et le scraping de modèles.

## 4. 🕵️ Audit & Monitoring

### Journalisation d'Analyse
- Chaque opération d'analyse ML doit enregistrer :
  *   L'ID de l'utilisateur.
  *   L'empreinte (Hash SHA-256) du fichier traité.
  *   Le temps d'exécution et les ressources CPU/RAM consommées.
- **Alertes Anormales** : Détection automatique des comportements suspects (ex: 100 uploads en 1 minute) avec blocage immédiat du compte.

## 5. 🐳 Sécurité des Conteneurs (Docker)

- **Non-Root User** : Les processus FastAPI et Node.js doivent s'exécuter en tant qu'utilisateurs non-privilégiés.
- **Scan de Vulnérabilités** : Utilisation de `Trivy` ou `Snyk` pour scanner les images de base avant chaque déploiement.

---
> [!IMPORTANT]
> **En cas de faille détectée** : Utilisez le script de "Kill Switch" pour suspendre immédiatement tous les services et réinitialiser les sessions actives via Redis.

# frontend/Dockerfile

# ── Etape 1 : Build (Node.js) ──
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --silent

COPY . .
# La variable d'environnement sert à paramétrer l'URL vers l'API, 
# bien que le proxy Nginx rende l'URL relative `/api/` suffisante.
ENV REACT_APP_API_URL=/api/
RUN npm run build


# ── Etape 2 : Production Serve (Nginx) ──
FROM nginx:alpine

# Copie des artefacts buildés
COPY --from=builder /app/build /usr/share/nginx/html

# Copie de la configuration Nginx (SPA + API Proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Utilisateur non-root Nginx (optionnel selon permissions)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

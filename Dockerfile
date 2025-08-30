# ----- Use it for production build -----

## building stage
#FROM node:lts-alpine as build-stage
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#RUN npm run build
#
## building production
#FROM nginx:stable-alpine as production-stage
#COPY --from=build-stage /app/dist /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

# ------------------------------------------------

# Step 1 : Use official node.js image for building
FROM node:22-alpine

# Define the working directory for the container
WORKDIR /app

## Copy the package.json file (package.json et package-lock.json)
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig*.json ./

## Install dependencies
RUN npm install

## Copie du reste des fichiers du projet
COPY . .

# Exposition du port 5173 par défaut pour Vite
EXPOSE 5173

# Commande pour démarrer le serveur de développement Vite
CMD ["npm", "run", "dev"]

#Bulid stage
FROM node:24-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#Serving stage
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# Prevent nginx from running in the background (daemon mode), so Docker container stays alive.
CMD ["nginx", "-g", "daemon off;"]

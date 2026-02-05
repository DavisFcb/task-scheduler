FROM node:20-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the app with a NGINX server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]

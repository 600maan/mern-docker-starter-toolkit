# STAGE 1 - BUILD ARTEFACTS
FROM node:14-alpine as build-deps

# Change working directory
WORKDIR /app

RUN apk update && apk upgrade

# Copy source code
COPY . /app

# Install dependencies
RUN npm install 

RUN npm run build

# STAGE 2 - PRODUCTION ENVIRONMENT
FROM nginx:1.19-alpine

COPY --from=build-deps /app/build /usr/share/nginx/html
# REMOVE default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf
# REPLACE with custom one
COPY nginx/nginx.conf /etc/nginx/conf.d
# expose port 80 to the outer world
EXPOSE 80
# start nginx 
CMD ["nginx", "-g", "daemon off;"]
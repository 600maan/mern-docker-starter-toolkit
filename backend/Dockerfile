FROM node:14-alpine

# Change working directory
WORKDIR /app

RUN apk update && apk upgrade 

# Copy source code
COPY . /app


# Install dependencies
RUN npm install 

RUN chown -R node:node /app

USER node

# Expose API port to the outside
EXPOSE 5000

# Use CMD or ENTRYPOINT
# ENTRYPOINT ["sh", "./docker-start.sh"]

# Launch application
CMD ["npm","start"]
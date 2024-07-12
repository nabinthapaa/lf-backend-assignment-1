FROM node:20-alpine 


WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache python3 make g++ build-base \
  && npm install

EXPOSE 8000

COPY . .


CMD ["npm", "run", "dev"]

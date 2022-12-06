#
# Step 0: Compile
#
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Compile TypeScript
COPY tsconfig.json ./
COPY src ./src

RUN npm run build

#
# Step 1: Run
#
FROM node:16-alpine

LABEL org.opencontainers.image.source=https://github.com/PrivTap/PrivTap

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --omit=dev

# Copy compiled Javascript and run
COPY --from=0 /usr/src/app/dist .
COPY openapi.yaml .

CMD ["node","app.js"]
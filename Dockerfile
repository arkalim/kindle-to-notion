# Build stage
FROM node as build

WORKDIR /code/

COPY tsconfig.json .
COPY package.json .

RUN npm install

COPY src src

RUN npm run build

# Run stage
FROM node:18-alpine

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

RUN apk add git

COPY data /code/data
COPY cache /code/cache

COPY package.json /code/package.json
RUN npm install --omit=dev

COPY --from=build /code/dist /code/dist

ENTRYPOINT node /code/dist/main.js
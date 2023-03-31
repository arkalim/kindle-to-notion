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

WORKDIR /code/

COPY data data
COPY cache cache

COPY package.json .
RUN npm install --omit=dev

COPY --from=build /code/dist dist

CMD node dist/main.js
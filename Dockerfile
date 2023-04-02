# Build stage
FROM node

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

WORKDIR /code/

COPY tsconfig.json .
COPY package.json .

RUN npm install

COPY src src

RUN npm run build

COPY data data
COPY cache cache

ENTRYPOINT ["sh", "./dist/entrypoint.sh"]
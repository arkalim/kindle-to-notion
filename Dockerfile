FROM node

RUN apt-get update

COPY . ./code

WORKDIR /code/

RUN npm install && npm run build

CMD npm start
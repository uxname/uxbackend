FROM debian:stable AS dependencies

RUN apt-get update -y && \
apt-get install -y build-essential curl git && \
curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
apt-get install -y nodejs

FROM dependencies AS modules

WORKDIR /app

COPY ./package*.json ./
RUN npm install --production

FROM modules AS app

WORKDIR /app

COPY . .

EXPOSE 4000

CMD ["npm", "run", "prod:start-app"]

FROM ubuntu:latest
MAINTAINER Vasyl Zakharchenko <vaszakharchenko@gmail.com>
LABEL author="Vasyl Zakharchenko"
LABEL email="vaszakharchenko@gmail.com"
LABEL name="smartthings-phone-presence-sensor"
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -y curl gnupg2 ca-certificates
RUN update-ca-certificates --fresh
RUN curl -sSL https://deb.nodesource.com/setup_14.x | bash
RUN apt-get update && apt-get install -y nodejs
RUN npm i pm2 -g
# Bundle APP files
RUN mkdir /opt/smartthings-phone-presence-sensor/
COPY lib /opt/smartthings-phone-presence-sensor/lib/
COPY package.json /opt/smartthings-phone-presence-sensor/package.json
COPY RouterSmartAppServer.js /opt/smartthings-phone-presence-sensor/RouterSmartAppServer.js
RUN mkdir /opt/smartthings-phone-presence-sensor/router-ui
COPY router-ui/package.json /opt/smartthings-phone-presence-sensor/router-ui/package.json
COPY router-ui/src /opt/smartthings-phone-presence-sensor/router-ui/src
COPY router-ui/webpack.config.js /opt/smartthings-phone-presence-sensor/router-ui/webpack.config.js
RUN cd /opt/smartthings-phone-presence-sensor/ && npm install
RUN cd /opt/smartthings-phone-presence-sensor/router-ui/ && npm install
RUN cd /opt/smartthings-phone-presence-sensor/router-ui/ && npm run build:prod

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn

COPY entrypoint.sh /opt/entrypoint.sh
RUN  chmod +x /opt/entrypoint.sh
EXPOSE 5000
ENTRYPOINT ["/opt/entrypoint.sh"]
#CMD [ "pm2-runtime", "start", "pm2.json" ]

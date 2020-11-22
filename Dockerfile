FROM node:12
EXPOSE 80 443 3030 35729 8080
ENV NODE_ENV development

RUN npm install -g gulp bower pm2 cpx

RUN mkdir -p /opt/pean.js/public/lib
WORKDIR /opt/pean.js

COPY package.json /opt/pean.js/package.json
COPY bower.json /opt/pean.js/bower.json
COPY .bowerrc /opt/pean.js/.bowerrc

COPY . /opt/pean.js

RUN mkdir -p /opt/logs/peanjs

#ENV DB_FORCE true
#ENV DB_SEED true

RUN npm install --unsafe-perm
RUN npm audit fix

CMD pm2 start pm2-dev.json

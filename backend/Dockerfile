FROM node:12.18.1 as base
 
WORKDIR /app
 
COPY package.json package.json
COPY package-lock.json package-lock.json
 
RUN npm install
 
COPY . .

EXPOSE 8080

RUN npm install pm2 -g

ENV PM2_PUBLIC_KEY w3rzmwc3vuc248i
ENV PM2_SECRET_KEY a46yedtlakqlgms

CMD ["pm2-runtime", "server.js"]
 
# CMD ["node", "server.js"]
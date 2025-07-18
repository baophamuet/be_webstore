from node:22-alpine

WORKDIR /webstore/backend

COPY package*.json ./

RUN npm install

#RUN  npm install -g @b

COPY . .

RUN npm run build-src

CMD [ "npm","run","build"]
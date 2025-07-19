from node:22-alpine

WORKDIR /webstore/backend

COPY package*.json ./

RUN npm install

RUN  npm install -g @babel/cli @babel/core @babel/preset-env

COPY . .

RUN npm run build-src

CMD [ "npm","run","build"]
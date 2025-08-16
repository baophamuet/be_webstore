from node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN  npm install -g @babel/cli @babel/core @babel/preset-env

COPY . .

# Tạo sẵn các thư mục upload ảnh avatar và products
RUN mkdir -p ./uploads/images/avatar \
    && mkdir -p ./uploads/products \
    && mkdir -p ./uploads/masks


RUN npm run build-src

CMD [ "npm","run","build"]
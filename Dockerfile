from node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN  npm install -g @babel/cli @babel/core @babel/preset-env

COPY . .

# Tạo sẵn các thư mục upload ảnh avatar và products và đường dẫn liên quan
RUN mkdir -p ./src/uploads/images/avatar \
    && mkdir -p ./src/uploads/images/products \
    && mkdir -p ./src/uploads/masks \
    && mkdir -p ./src/uploads/user \
    && mkdir -p ./src/uploads/try-on-photo


RUN npm run build-src

CMD [ "npm","run","build"]
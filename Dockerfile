from node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN  npm install -g @babel/cli @babel/core @babel/preset-env

COPY . .

# Tạo sẵn các thư mục upload ảnh avatar và products và đường dẫn liên quan
RUN mkdir -p ./src/uploads/images/avatar \
    && mkdir -p ./src/uploads/products

RUN mkdir -p ./src/uploads/masks
RUN mkdir -p ./src/uploads/images/try-on-photo
RUN mkdir -p ./src/uploads/images/user


RUN npm run build-src

CMD [ "npm","run","build"]
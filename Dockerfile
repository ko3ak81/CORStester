# Channel V3 API
FROM node:18

WORKDIR /app

COPY package*.json ./
COPY . .

#RUN npm install


EXPOSE 3000

CMD ["node", "corstest.js"]
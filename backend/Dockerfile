FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g ts-node
EXPOSE 4000
CMD ["npm", "run", "dev"]

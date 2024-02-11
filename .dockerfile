
FROM node:20

WORKDIR /src

COPY package*.json ./

RUN npm install

# Bundle the app source inside the Docker image 
# (assuming your app is in the "src" directory of your project)
COPY . .

EXPOSE 5000

CMD ["node", "start"]
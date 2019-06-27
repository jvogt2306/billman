FROM node:10

# create app directory
WORKDIR /usr/src/app

# install app dependencies
# a wildcard is used to ensure both package.json and package-lock.json are copied
COPY package*.json ./

RUN npm install
# if you are buildung code for production
# RUN npm cli --only=production

#bunlde app source
COPY . .

EXPOSE 5015

CMD [ "npm", "start" ]

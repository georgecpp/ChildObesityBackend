FROM node:latest

WORKDIR /app

RUN apt-get update

RUN apt-get install -y python3
RUN apt install -y python3-pip
RUN pip3 install scikit-learn==0.24.2

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

EXPOSE 80

CMD ["npm","start"]
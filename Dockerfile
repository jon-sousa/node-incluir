FROM node:latest
COPY . /app
WORKDIR /app
RUN ["npm", "i"]
ENTRYPOINT [ "npm", "start" ]
EXPOSE 3000

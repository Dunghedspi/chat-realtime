# Pull node image from docker hub
FROM node:latest

# Set working directory
RUN mkdir -p /var/www/nest-chat-realtime
WORKDIR /var/www/nest-chat-realtime

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /var/www/nest-chat-realtime/node_modules/.bin:$PATH
# create user with no password

# Copy existing application directory contents
COPY . /var/www/nest-chat-realtime
# install and cache app dependencies
# grant a permission to the application
#RUN chown -R chat:chat /var/www/nest-chat-realtime

#USER chat

# clear application caching
# install all dependencies
RUN npm install -g npm
RUN npm install -f

CMD [ "npm", "run", "start" ]

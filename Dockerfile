FROM node:latest

# Create the directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# Copy and Install our bot
COPY package*.json /usr/src/bot
RUN npm install

# Our precious bot
COPY . /usr/src/bot

# Build
RUN cd /usr/src/bot
RUN npm run build
CMD ["node", "dist/bot.js"]
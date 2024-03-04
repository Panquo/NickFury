FROM node:latest

# Create the directory
WORKDIR /usr/src/bot



# Copy and Install our bot
COPY package*.json .
RUN npm install

# Our precious bot
COPY . .

# Build
RUN npm run build

USER 1001

CMD ["node", "dist/bot.js"]
FROM node:18-alpine
WORKDIR /app
COPY . /app
RUN npm install
RUN npx prisma generate
RUN npx nest build
CMD ["node", "dist/src/main.js"]
EXPOSE 3000
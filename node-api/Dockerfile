FROM node:14.21.2-alpine
WORKDIR /app
ENV PORT 3000
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "start"]
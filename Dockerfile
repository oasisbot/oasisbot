FROM node:14 AS FRONTEND_BUILD
WORKDIR /frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./

RUN npm install
COPY ./frontend ./

RUN npm run build

FROM golang:1.16 as APPLICATION_BUILD
WORKDIR /go/delivery
COPY --from=FRONTEND_BUILD ./frontend/build ./frontend/build
COPY . .

RUN go get -d -v ./...
RUN go install -v ./...

EXPOSE 5000
CMD ["oasisbot", "--prod"]
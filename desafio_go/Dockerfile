FROM golang:1.18

WORKDIR /usr/src/app

RUN apt-get update &&\
    apt-get install golang -y

COPY fullcycle.go .
RUN go build fullcycle.go

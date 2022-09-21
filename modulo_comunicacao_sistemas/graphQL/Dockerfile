FROM golang:1.15-alpine

RUN apk update && \
    adduser -u 1000 -h /go/src/alexandrefrg -D alexandrefrg

USER alexandrefrg

WORKDIR /go/src/alexandrefrg/graphql

CMD ["tail","-f","/dev/null"]

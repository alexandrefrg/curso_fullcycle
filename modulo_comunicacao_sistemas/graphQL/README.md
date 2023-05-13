# Exemplo de implementação de graphQL

1. Suba o container rodando:

```
docker-compose up -d
```

2. Acesse o container:

```
docker-compose exec app sh
```

1. Caso queira gerar novamente o schema.graphqls:

```go
go run github.com/99designs/gqlgen generate
```

#Golang image version
FROM golang:1.24.5
#Working dir
WORKDIR /app


# Copiar go.mod e go.sum primeiro (se mudar o resto do código não tem que copiar esses arquivos (não devem mudar))
COPY go.mod go.sum ./

# Baixar dependências fixadas 
RUN go mod download && go mod verify

# Copiar código fonte
COPY main.go ./
COPY handlers ./handlers
COPY db ./db
COPY migrations ./migrations

# Copia o binário do goose (ferramenta de migração, compilada manualmente por motivos de leveza)
COPY ./tools/goose /usr/local/bin/goose
RUN chmod +x /usr/local/bin/goose


# Builda o binário
RUN go build -o api .
EXPOSE 8080

CMD ["./api"]


package main

import (
	"api/db"
	"api/handlers"
	"context"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"go.uber.org/zap"
)

func main() {
	//Inicializa o logger
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}
	defer logger.Sync()

	//Carrega a string de conexão da bd a partir das variáveis de ambiente
	connStr := "postgres://recipe:mypassword@go_db:5432/recipe_db?sslmode=disable"
	// connStr := os.Getenv("DB_URL")

	if connStr == "" {
		logger.Fatal("Erro ao carregar a variável DB_URL")
	}

	//Cria a pool de conexão da db (melhor do que criar conexões individuais em apps
	//com acessos simultâneos. Não faz muita diferença em um aplicativo desta escala, mas boas práticas)
	ctx := context.Background()
	dbPool, err := db.CreatePool(ctx, logger, connStr)
	//Esse será o receiver da pool e do logger
	server := &handlers.Server{DB: dbPool, Logger: logger}
	if err != nil {
		logger.Fatal("Erro ao tentar criar a pool", zap.Error(err))
	}

	//Cria o roteador e designa as rotas
	router := mux.NewRouter()
	router.HandleFunc("/recipes", server.GetRecipes).Methods("GET")
	router.HandleFunc("/recipes", server.InsertRecipe).Methods("POST")
	router.HandleFunc("/recipes/{id}", server.DeleteRecipe).Methods("DELETE")
	router.HandleFunc("/recipes", server.UpdateRecipe).Methods("UPDATE")

	// Inicia o servidor HTTP
	logger.Info("Escutando em :8080")
	log.Fatal(http.ListenAndServe(":8080", router))

}

package handlers

import (
	"api/db"
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

// Struct (quase classe) que passa a pool e o logger para as rotas
type Server struct {
	DB     *pgxpool.Pool
	Logger *zap.Logger
}

// Funcao chamada na rota /recipes (retorna todas as receitas)
func (s *Server) GetRecipes(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	recipes, err := db.GetRecipes(ctx, s.Logger, s.DB)
	if err != nil {
		s.Logger.Error("Falha na obtenção das receitas", zap.Error(err))
		http.Error(w, "Falha na obtenção das receitas: "+err.Error(), http.StatusInternalServerError)
		return
	}
	//Configura a resposta HTTP
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(recipes)
	if err != nil {
		s.Logger.Error("Falha na serialização da resposta", zap.Error(err))
		http.Error(w, "Falha na serialização da resposta: "+err.Error(), http.StatusInternalServerError)
		return
	}
	s.Logger.Info("Resultado retornado!")

}

func (s *Server) InsertRecipe(w http.ResponseWriter, r *http.Request) {
	//Armazena o corpo do request em um struct Recipe
	var recipe db.Recipe
	err := json.NewDecoder(r.Body).Decode(&recipe)
	if err != nil {
		s.Logger.Error("Input inválido!", zap.Error(err))
		http.Error(w, "Input inválido: "+err.Error(), http.StatusBadRequest)
	}

	//Tenta inserir na base
	ctx := r.Context()
	err = db.InsertRecipe(ctx, s.Logger, s.DB, recipe)
	if err != nil {
		s.Logger.Error("Erro ao inserir receita", zap.Error(err))
		http.Error(w, "Falha no cadastro da receita: "+err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode("Receita inserida com sucesso ")
	w.WriteHeader(http.StatusOK)
	s.Logger.Info("Receita inserida com sucesso!")
}

func (s *Server) DeleteRecipe(w http.ResponseWriter, r *http.Request) {
	// Ler o parâmetro ID
	vars := mux.Vars(r)
	var id string
	id, ok := vars["id"]
	if !ok {
		http.Error(w, "Parâmetro ID não encontrado", http.StatusBadRequest)
		return
	}

	// Validar o formato da string
	_, err := uuid.Parse(id)
	if err != nil {
		http.Error(w, "Invalid UUID format", http.StatusBadRequest)
		return
	}

	//Rodar o comando
	ctx := r.Context()
	err = db.DeleteRecipe(ctx, s.Logger, s.DB, id)
	if err != nil {
		s.Logger.Error("Erro ao apagar receita", zap.Error(err))
		http.Error(w, "Erro na remoção:"+err.Error(), http.StatusInternalServerError)
		return
	}
	//Se tudo ok, retorna OK
	w.WriteHeader(http.StatusOK)
	s.Logger.Info("Receita apagada com sucesso!")
}

func (s *Server) UpdateRecipe(w http.ResponseWriter, r *http.Request) {
	//Armazena o corpo do request em um struct Recipe
	var recipe db.Recipe
	err := json.NewDecoder(r.Body).Decode(&recipe)
	if err != nil {
		s.Logger.Error("Input inválido!", zap.Error(err))
		http.Error(w, "Input inválido: "+err.Error(), http.StatusBadRequest)
		return
	}

	//Rodar o comando
	ctx := r.Context()
	err = db.InsertRecipe(ctx, s.Logger, s.DB, recipe)
	if err != nil {
		s.Logger.Error("Erro na atualização", zap.Error(err))
		http.Error(w, "Erro na atualização", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	s.Logger.Info("Receita atualizada com sucesso!")

}

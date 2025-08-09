package handlers

import (
	"api/db"
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

// Struct that holds the database pool and logger for route handlers
type Server struct {
	DB     *pgxpool.Pool
	Logger *zap.Logger
}

// Handler for GET /recipes (returns all recipes)
func (s *Server) GetRecipes(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	recipes, err := db.GetRecipes(ctx, s.Logger, s.DB)
	if err != nil {
		s.Logger.Error("Failed to retrieve recipes from the database", zap.Error(err))
		http.Error(w, "Failed to retrieve recipes: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(recipes)
	if err != nil {
		s.Logger.Error("Failed to encode recipes as JSON", zap.Error(err))
		http.Error(w, "Failed to serialize recipes to JSON: "+err.Error(), http.StatusInternalServerError)
		return
	}

	s.Logger.Info("Recipes retrieved and returned successfully")
}

func (s *Server) InsertRecipe(w http.ResponseWriter, r *http.Request) {
	// Parse request body into a Recipe struct
	var recipe db.Recipe
	err := json.NewDecoder(r.Body).Decode(&recipe)
	if err != nil {
		s.Logger.Error("Invalid request body (malformed JSON)", zap.Error(err))
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Insert into the database
	ctx := r.Context()
	err = db.InsertRecipe(ctx, s.Logger, s.DB, recipe)
	if err != nil {
		s.Logger.Error("Failed to insert recipe into the database", zap.Error(err))
		http.Error(w, "Failed to insert recipe: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode("Recipe inserted successfully")
	s.Logger.Info("Recipe inserted successfully")
}

func (s *Server) DeleteRecipe(w http.ResponseWriter, r *http.Request) {
	// Read the "id" parameter
	vars := mux.Vars(r)
	id, ok := vars["id"]
	if !ok {
		http.Error(w, "Missing 'id' parameter", http.StatusBadRequest)
		return
	}

	// Validate UUID format
	_, err := uuid.Parse(id)
	if err != nil {
		http.Error(w, "Invalid UUID format", http.StatusBadRequest)
		return
	}

	// Delete from the database
	ctx := r.Context()
	err = db.DeleteRecipe(ctx, s.Logger, s.DB, id)
	if err != nil {
		s.Logger.Error("Failed to delete recipe", zap.Error(err))
		http.Error(w, "Failed to delete recipe: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	s.Logger.Info("Recipe deleted successfully")
}

func (s *Server) UpdateRecipe(w http.ResponseWriter, r *http.Request) {
	// Parse request body into a Recipe struct
	var recipe db.Recipe
	err := json.NewDecoder(r.Body).Decode(&recipe)
	if err != nil {
		s.Logger.Error("Invalid request body (malformed JSON)", zap.Error(err))
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Update in the database
	ctx := r.Context()
	err = db.InsertRecipe(ctx, s.Logger, s.DB, recipe) // This might need to be db.UpdateRecipe
	if err != nil {
		s.Logger.Error("Failed to update recipe", zap.Error(err))
		http.Error(w, "Failed to update recipe: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	s.Logger.Info("Recipe updated successfully")
}

func (s *Server) GetRecipeByID(w http.ResponseWriter, r *http.Request) {
	// Read the "id" parameter
	vars := mux.Vars(r)
	id, ok := vars["id"]
	if !ok {
		http.Error(w, "Missing 'id' parameter", http.StatusBadRequest)
		return
	}

	// Validate UUID format
	_, err := uuid.Parse(id)
	if err != nil {
		http.Error(w, "Invalid UUID format", http.StatusBadRequest)
		return
	}

	// Retrieve from the database
	ctx := r.Context()
	recipe, err := db.GetRecipeByID(ctx, s.Logger, s.DB, id)
	if err == pgx.ErrNoRows {
		s.Logger.Info("No recipe found with the given ID", zap.Error(err))
		http.Error(w, "Recipe not found", http.StatusBadRequest)
		return
	} else if err != nil {
		s.Logger.Error("Failed to retrieve recipe by ID", zap.Error(err))
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(recipe)
	if err != nil {
		s.Logger.Error("Failed to encode recipe as JSON", zap.Error(err))
		http.Error(w, "Failed to serialize recipe to JSON: "+err.Error(), http.StatusInternalServerError)
		return
	}

	s.Logger.Info("Recipe retrieved successfully")
}

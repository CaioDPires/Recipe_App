package db

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

func CreatePool(ctx context.Context, logger *zap.Logger, connStr string) (pool *pgxpool.Pool, err error) {
	var maxAttempts uint8 = 5
	var baseDelay time.Duration = 50 * time.Millisecond

	for attempt := range maxAttempts {
		pool, err = pgxpool.New(ctx, connStr)
		if err == nil {
			if pingErr := pool.Ping(ctx); pingErr != nil {
				err = pingErr
			} else {
				logger.Info("Database connection established successfully")
				return pool, nil
			}
		}

		// If connection failed, wait and retry unless context is canceled
		delay := baseDelay * (1 << attempt)
		jitter := time.Duration(rand.Intn(1000)) * time.Millisecond // up to 1s random jitter
		wait := delay + jitter
		fmt.Printf("Attempt %d failed: %v. Retrying in %v...\n", attempt+1, err, wait)

		select {
		case <-ctx.Done():
			return nil, ctx.Err() // caller canceled, return early
		case <-time.After(wait):
			continue
		}
	}

	return nil, fmt.Errorf("all %d attempts to connect failed: %w", maxAttempts, err)
}

func GetRecipes(ctx context.Context, logger *zap.Logger, pool *pgxpool.Pool) (recipes []RecipeIDandTitle, err error) {
	query := `SELECT id, title FROM recipes`
	rows, err := pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query execution failed: %w", err)
	}
	logger.Info("Recipe list query executed successfully")
	defer rows.Close()

	recipes, err = pgx.CollectRows(rows, pgx.RowToStructByName[RecipeIDandTitle])
	if err != nil {
		return nil, fmt.Errorf("failed to collect query results: %w", err)
	}
	logger.Info("Recipe list retrieved successfully")
	return recipes, nil
}

func InsertRecipe(ctx context.Context, logger *zap.Logger, pool *pgxpool.Pool, recipe Recipe) (err error) {
	query := `INSERT INTO 
	recipes(title, description, steps, prep_time, servings, image_url, ingredients)
	VALUES ($1, $2, $3, $4, $5, $6, $7)
	ON CONFLICT (id) DO UPDATE
	SET title = EXCLUDED.title,
		description = EXCLUDED.description,
		steps = EXCLUDED.steps,
		prep_time = EXCLUDED.prep_time,
		servings = EXCLUDED.servings,
		image_url = EXCLUDED.image_url,
		ingredients = EXCLUDED.ingredients;`

	commandTag, err := pool.Exec(context.Background(), query,
		recipe.Title,
		recipe.Description,
		recipe.Steps,
		recipe.PrepTime,
		recipe.Servings,
		recipe.ImageURL,
		recipe.Ingredients)
	if err != nil {
		return fmt.Errorf("failed to insert recipe: %w", err)
	}
	if commandTag.RowsAffected() != 1 {
		return fmt.Errorf("failed to insert recipe: no rows affected")
	}
	return nil
}

func DeleteRecipe(ctx context.Context, logger *zap.Logger, pool *pgxpool.Pool, id string) (err error) {
	query := `DELETE FROM recipes WHERE id = $1`
	commandTag, err := pool.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete recipe: %w", err)
	}
	if commandTag.RowsAffected() != 1 {
		return fmt.Errorf("failed to delete recipe: no rows affected")
	}
	return nil
}

func GetRecipeByID(ctx context.Context, logger *zap.Logger, pool *pgxpool.Pool, id string) (recipe Recipe, err error) {
	query := `SELECT * FROM recipes WHERE id = $1`
	rows, err := pool.Query(ctx, query, id)
	if err != nil {
		return Recipe{}, fmt.Errorf("query execution failed: %w", err)
	}
	logger.Info("Recipe lookup query executed successfully")
	defer rows.Close()

	recipe, err = pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Recipe])
	if err != nil {
		return Recipe{}, pgx.ErrNoRows
	}
	logger.Info("Recipe retrieved successfully")
	return recipe, nil
}

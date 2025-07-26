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
		pool, err = pgxpool.New(ctx, connStr) // Chama a funçao para tentar novamente
		if err == nil {
			if pingErr := pool.Ping(ctx); pingErr != nil {
				err = pingErr
			} else {
				logger.Info("Conexão iniciada com sucesso!")
				return pool, nil
			}
		}

		//Senao, vamos esperar ou sair (caso contexto da funcao externa esteja terminado)
		delay := baseDelay * (1 << attempt)
		jitter := time.Duration(rand.Intn(1000)) * time.Millisecond // up to 1s random jitter
		wait := delay + jitter
		fmt.Printf("Tentativa %d falhou: %v. Tentando novamente em %v...\n", attempt+1, err, wait)

		select {
		case <-ctx.Done():
			return nil, ctx.Err() // caller canceled, return early
		case <-time.After(wait):
			continue
		}
	}
	return nil, fmt.Errorf("all %d attempts failed: %w", maxAttempts, err)
}

func GetRecipes(ctx context.Context, logger *zap.Logger, pool *pgxpool.Pool) (recipes []Recipe, err error) {

	//Executar a query
	query := `SELECT * FROM recipes`
	rows, err := pool.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query: %w", err)
	}
	logger.Info("Query executada com sucesso!")
	defer rows.Close()

	//Transforma o resultado da query em struct e retorna para o handler
	rowsData, err := pgx.CollectRows(rows, pgx.RowToStructByName[Recipe])
	if err != nil {
		return nil, fmt.Errorf("collect rows: %w", err)
	}
	logger.Info("Resultado da query reestruturado!")
	return rowsData, nil

}

func InsertRecipe(ctx context.Context, logger *zap.Logger, pool *pgxpool.Pool, recipe Recipe) (err error) {
	//Roda o comando
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
		return fmt.Errorf("erro na inserção: %w", err)
	}
	if commandTag.RowsAffected() != 1 {
		return fmt.Errorf("erro na inserção: nenhuma linha afetada")
	}
	return
}

func DeleteRecipe(ctx context.Context, logger *zap.Logger, pool *pgxpool.Pool, id string) (err error) {
	//Roda a query
	query := `DELETE FROM recipes WHERE id = $1`
	commandTag, err := pool.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("erro na remoção: %w", err)
	}
	if commandTag.RowsAffected() != 1 {
		return fmt.Errorf("erro na remoção: nenhuma linha afetada")
	}
	return nil
}

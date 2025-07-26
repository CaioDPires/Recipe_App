package db

import "time"

type Recipe struct {
	ID          string    `db:"id" json:"id"`
	Title       string    `db:"title" json:"title"`
	Description *string   `db:"description" json:"description,omitempty"`
	Steps       string    `db:"steps" json:"steps"`
	PrepTime    int       `db:"prep_time" json:"prep_time"`
	Servings    int       `db:"servings" json:"servings"`
	ImageURL    *string   `db:"image_url" json:"image_url,omitempty"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
	Ingredients []string  `db:"ingredients" json:"ingredients"`
}

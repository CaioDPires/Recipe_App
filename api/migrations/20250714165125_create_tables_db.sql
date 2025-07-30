-- +goose Up
-- +goose StatementBegin


CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  steps TEXT NOT NULL,
  prep_time INTEGER NOT NULL,
  servings INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  ingredients TEXT[] NOT NULL,
  UNIQUE (title, steps)
);


-- Insert Pancakes
-- Insert Pancakes
INSERT INTO recipes (
  id, title, description, steps, prep_time, servings, image_url, ingredients
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Pancakes',
  'Fluffy pancakes.',
  'Mix ingredients. Cook on skillet.',
  15,
  4,
  'http://example.com/pancakes.jpg',
  ARRAY[
    '2 cups of Flour',
    '1 cup of Milk',
    '2 Eggs',
    '1 tbsp of Sugar'
  ]
);

-- Insert Spaghetti
INSERT INTO recipes (
  id, title, description, steps, prep_time, servings, image_url, ingredients
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Spaghetti',
  'Simple tomato spaghetti.',
  'Boil pasta. Heat sauce. Combine.',
  20,
  2,
  'http://example.com/spaghetti.jpg',
  ARRAY[
    '200g of Spaghetti',
    '1 cup of Tomato Sauce'
  ]
);

-- Insert Salad
INSERT INTO recipes (
  id, title, description, steps, prep_time, servings, image_url, ingredients
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  'Salad',
  'Fresh mixed salad.',
  'Chop vegetables. Mix and serve.',
  10,
  1,
  NULL,
  ARRAY[
    '1 head of Lettuce',
    '1 Tomato'
  ]
);



-- +goose StatementEnd


-- +goose Down
-- +goose StatementBegin
DROP TABLE recipes;
-- +goose StatementEnd

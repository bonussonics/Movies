package dbrepo

import (
	"backend/internal/models"
	"context"
	"database/sql"
	"strings"
	"time"
)

type PostgresDBRepo struct {
	DB *sql.DB
}

const dbTimeout = time.Second * 3

func (m *PostgresDBRepo) Connection() *sql.DB {
	return m.DB
}

func (m *PostgresDBRepo) AllMovies() ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `
		select
			id, title, release_date, runtime,
			mpaa_rating, description, coalesce(image, ''),
			created_at, updated_at
		from
			movies
		order by
			title
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie

	for rows.Next() {
		var movie models.Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.RunTime,
			&movie.MPAARating,
			&movie.Description,
			&movie.Image,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		movies = append(movies, &movie)
	}

	return movies, nil
}

func (m *PostgresDBRepo) GetUserByEmail(email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, email, first_name, last_name, password, created_at, updated_at from users where email = $1`

	var user models.User
	row := m.DB.QueryRowContext(ctx, query, email)

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *PostgresDBRepo) OneMovie(id int) (*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, title, release_date, runtime, mpaa_rating, description, coalesce(image, ''), created_at, updated_at from movies where id = $1`

	row := m.DB.QueryRowContext(ctx, query, id)

	var movie models.Movie

	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.MPAARating,
		&movie.Description,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	// get genres, if any
	query = `select g.id, g.genre from movies_genres mg
		left join genres g on (mg.genre_id = g.id)
		where mg.movie_id = $1
		order by g.genre`

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre
	for rows.Next() {
		var g models.Genre
		err := rows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, err
		}

		genres = append(genres, &g)
	}

	movie.Genres = genres

	return &movie, err
}

func (m *PostgresDBRepo) OneMovieForEdit(id int) (*models.Movie, []*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, title, release_date, runtime, mpaa_rating, description, coalesce(image, ''), created_at, updated_at from movies where id = $1`

	row := m.DB.QueryRowContext(ctx, query, id)

	var movie models.Movie

	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.MPAARating,
		&movie.Description,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)

	if err != nil {
		return nil, nil, err
	}

	// get genres, if any
	query = `select g.id, g.genre from movies_genres mg
		left join genres g on (mg.genre_id = g.id)
		where mg.movie_id = $1
		order by g.genre`

	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, nil, err
	}
	defer rows.Close()

	var genres []*models.Genre
	var genresArray []int
	for rows.Next() {
		var g models.Genre
		err := rows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, nil, err
		}

		genres = append(genres, &g)
		genresArray = append(genresArray, g.ID)
	}

	movie.Genres = genres
	movie.GenresArray = genresArray

	var allGenres []*models.Genre

	query = "select id, genre from genres order by genre"
	gRows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, nil, err
	}
	defer gRows.Close()

	for gRows.Next() {
		var g models.Genre
		err := gRows.Scan(
			&g.ID,
			&g.Genre,
		)
		if err != nil {
			return nil, nil, err
		}

		allGenres = append(allGenres, &g)
	}

	return &movie, allGenres, err
}

func (m *PostgresDBRepo) GetUserByID(id int) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, email, first_name, last_name, password, created_at, updated_at from users where id = $1`

	var user models.User
	row := m.DB.QueryRowContext(ctx, query, id)

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (m *PostgresDBRepo) AllGenres() ([]*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, genre, created_at, updated_at from genres order by genre`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre

	for rows.Next() {
		var g models.Genre
		err := rows.Scan(
			&g.ID,
			&g.Genre,
			&g.CreatedAt,
			&g.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		genres = append(genres, &g)
	}

	return genres, nil
}

func (db *PostgresDBRepo) InsertMovie(movie models.Movie) (int, error) {
	var newID int
	query := `INSERT INTO movies (title, release_date, runtime, mpaa_rating, description, image, created_at, updated_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
	err := db.DB.QueryRow(query, movie.Title, movie.ReleaseDate, movie.RunTime, movie.MPAARating, movie.Description, movie.Image, movie.CreatedAt, movie.UpdatedAt).Scan(&newID)
	if err != nil {
		return 0, err
	}
	return newID, nil
}

func (m *PostgresDBRepo) UpdateMovieGenres(movieID int, genreIDs []int) error {
	// ลบหมวดหมู่ที่มีอยู่ก่อน
	_, err := m.DB.Exec("DELETE FROM movies_genres WHERE movie_id = $1", movieID)
	if err != nil {
		return err
	}

	// แทรกหมวดหมู่ใหม่
	for _, genreID := range genreIDs {
		_, err = m.DB.Exec("INSERT INTO movies_genres (movie_id, genre_id) VALUES ($1, $2)", movieID, genreID)
		if err != nil {
			return err
		}
	}

	return nil
}

func (db *PostgresDBRepo) GetMovieByTitle(title string) (models.Movie, error) {
	var movie models.Movie
	row := db.DB.QueryRow("SELECT id, title, release_date, runtime, mpaa_rating, description, image FROM movies WHERE title = $1", title)
	err := row.Scan(&movie.ID, &movie.Title, &movie.ReleaseDate, &movie.RunTime, &movie.MPAARating, &movie.Description, &movie.Image)
	if err != nil {
		if err == sql.ErrNoRows {
			return models.Movie{}, sql.ErrNoRows
		}
		return models.Movie{}, err
	}
	return movie, nil
}

func (db *PostgresDBRepo) UpdateMovie(id int, movie models.Movie) error {
	query := `UPDATE movies SET title = $1, release_date = $2, runtime = $3, mpaa_rating = $4, description = $5, image = $6, updated_at = $7
	WHERE id = $8`
	_, err := db.DB.Exec(query, movie.Title, movie.ReleaseDate, movie.RunTime, movie.MPAARating, movie.Description, movie.Image, movie.UpdatedAt, id)
	if err != nil {
		return err
	}
	return nil
}

func (m *PostgresDBRepo) DeleteMovieByTitle(title string) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	stmt := `DELETE FROM movies WHERE title = $1`
	_, err := m.DB.ExecContext(ctx, stmt, title)
	return err
}

// GetMoviesByGenre ดึงข้อมูลหนังตามหมวดหมู่
func (m *PostgresDBRepo) GetMoviesByGenre(genreID int) ([]*models.Movie, error) {
	query := `
	SELECT
		movies.id, movies.title, movies.release_date, movies.runtime, movies.mpaa_rating, movies.description, movies.image, movies.created_at, movies.updated_at
	FROM
		movies
		JOIN movies_genres ON movies.id = movies_genres.movie_id
	WHERE
		movies_genres.genre_id = $1`

	rows, err := m.DB.Query(query, genreID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie

	for rows.Next() {
		var movie models.Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.RunTime,
			&movie.MPAARating,
			&movie.Description,
			&movie.Image,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		movies = append(movies, &movie)
	}

	return movies, nil
}

func (m *PostgresDBRepo) GetMoviesBySearchTerm(searchTerm string) ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `SELECT id, title, release_date, runtime, mpaa_rating, description, image, created_at, updated_at
			  FROM movies
			  WHERE LOWER(title) LIKE '%' || $1 || '%'`

	rows, err := m.DB.QueryContext(ctx, query, strings.ToLower(searchTerm))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie

	for rows.Next() {
		var movie models.Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.RunTime,
			&movie.MPAARating,
			&movie.Description,
			&movie.Image,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		movies = append(movies, &movie)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return movies, nil
}

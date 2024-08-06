package repository

import (
	"backend/internal/models"
	"database/sql"
)

type DatabaseRepo interface {
	Connection() *sql.DB
	AllMovies() ([]*models.Movie, error)
	GetUserByEmail(email string) (*models.User, error)
	GetUserByID(id int) (*models.User, error)

	OneMovieForEdit(id int) (*models.Movie, []*models.Genre, error)
	OneMovie(id int) (*models.Movie, error)
	AllGenres() ([]*models.Genre, error)
	InsertMovie(movie models.Movie) (int, error)
	UpdateMovieGenres(id int, genreIDs []int) error
	UpdateMovie(id int, movie models.Movie) error
	GetMovieByTitle(title string) (models.Movie, error)
	DeleteMovieByTitle(title string) error
	GetMoviesByGenre(genreID int) ([]*models.Movie, error)
	GetMoviesBySearchTerm(searchTerm string) ([]*models.Movie, error)
}

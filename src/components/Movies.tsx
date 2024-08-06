import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Movies.css';

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

interface Movie {
  id: number;
  title: string;
  release_date: string;
  runtime: number;
  mpaa_rating: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

interface Genre {
  id: number;
  genre: string;
}

function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('/api/genres');
        if (!response.ok) {
          throw new Error('Failed to fetch genres');
        }
        const data = await response.json();
        setGenres(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let url = '';
        if (searchTerm) {
          url = `http://localhost:8080/movies/search?query=${encodeURIComponent(searchTerm.trim())}`;
        } else if (selectedGenre) {
          url = `/api/movies/genres/${selectedGenre}`;
        } else {
          url = '/api/movies';
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre, searchTerm]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="movies">
      <h1>All Movies</h1>
      
      <div className="filter">
        <label htmlFor="genre-select">Select Genre:</label>
        <select
          id="genre-select"
          onChange={(e) => setSelectedGenre(parseInt(e.target.value))}
          value={selectedGenre || ''}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.genre}
            </option>
          ))}
        </select>
      </div>

      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a movie..."
        />
        <button onClick={() => setSearchTerm(searchTerm.trim())}>Search</button>
      </div>

      <div className="movie-list">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <Link to={`/movies/${movie.id}`}>
                <img 
                  src={movie.image && movie.image !== '-' ? `/assets/${movie.image}` : '/assets/default-image.jpg'} 
                  alt={movie.title} 
                  className="movie-poster"
                />
                <h2>{movie.title}</h2>
                <p>Release Date: {formatDate(movie.release_date)}</p>
                <p>Rating: {movie.mpaa_rating}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>
    </div>
  );
}

export default Movies;

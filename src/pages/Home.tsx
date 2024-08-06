import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import axios from 'axios';
import '../styles/Home.css';

const apiKey = 'c77311fd6c25a18db3c1d9838d584533';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
}

interface Genre {
  id: number;
  name: string;
}

interface ApiResponse {
  results: Movie[];
}

interface GenreResponse {
  genres: Genre[];
}

const Home: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!themeContext) {
    throw new Error('ThemeContext must be used within a ThemeProvider');
  }

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get<GenreResponse>(`https://api.themoviedb.org/3/genre/movie/list`, {
          params: {
            api_key: apiKey
          }
        });
        setGenres(response.data.genres);
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        if (searchTerm) {
          // ค้นหา
          const response = await axios.get<ApiResponse>(`https://api.themoviedb.org/3/search/movie`, {
            params: {
              api_key: apiKey,
              query: searchTerm.trim()
            }
          });
          setMovies(response.data.results);
        } else if (selectedGenre !== null) {
          // เลือกหมวดหมู่
          const response = await axios.get<ApiResponse>(`https://api.themoviedb.org/3/discover/movie`, {
            params: {
              api_key: apiKey,
              with_genres: selectedGenre,
              page: 1
            }
          });
          setMovies(response.data.results);
        } else {
          // หน้าเว็บครั้งแรก
          const response = await axios.get<ApiResponse>(`https://api.themoviedb.org/3/discover/movie`, {
            params: {
              api_key: apiKey,
              with_genres: 28,
              page: 1
            }
          });
          setMovies(response.data.results.slice(0, 10));
        }
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลหนังได้');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm, selectedGenre]);

  return (
    <div className="home">
      <h1>Movie List</h1>

      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movie..."
        />
        <button onClick={() => setSearchTerm(searchTerm)}>search</button>
      </div>

      <div className="filter">
        <label htmlFor="genre-select">Select genre:</label>
        <select
          id="genre-select"
          onChange={(e) => setSelectedGenre(parseInt(e.target.value))}
          value={selectedGenre || ''}
        >
          <option value="">Select genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="movie-list">
        {movies.length === 0 && !loading && !error && <p>ไม่มีผลลัพธ์</p>}
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Link to={`/movies/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
              <h2>{movie.title}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

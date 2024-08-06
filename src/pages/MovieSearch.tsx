import React, { useState } from 'react';
import axios from 'axios';

const apiKey = 'c77311fd6c25a18db3c1d9838d584533';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
}

const MovieSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: apiKey,
          query: searchTerm.trim()
        }
      });
      setMovies(response.data.results);
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลหนังได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ค้นหาหนัง..."
        />
        <button onClick={handleSearch}>search</button>
      </div>

      {loading && <p>loading...</p>}
      {error && <p>{error}</p>}

      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
              className="movie-poster"
            />
            <h2>{movie.title}</h2>
            <p>Release date: {movie.release_date}</p>
            <p>{movie.overview}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSearch;

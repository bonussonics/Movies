import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/MovieDetails.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

interface Movie {
  id: string;
  title: string;
  release_date: string;
  runtime: number;
  mpaa_rating: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const themeContext = useContext(ThemeContext);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:8080/movies/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        setMovie(data);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/delete-movie/${movie?.title}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }

      const data = await response.json();

      if (data.error) {
        toast.error(`Error: ${data.message}`);
      } else {
        toast.success('Movie deleted successfully!');
        setTimeout(() => navigate('/movies'), 2000);
      }
    } catch (error) {
      console.error('There was an error deleting the movie:', error);
      toast.error('Failed to delete the movie');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  const movieImage = movie.image && movie.image !== '-' ? `/assets/${movie.image}` : '/assets/default-image.jpg';

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="movie-details">
      <h1>{movie.title}</h1>
      <img src={movieImage} alt={movie.title} className="movie-poster" />
      <p><strong>Release Date:</strong> {formatDate(movie.release_date)}</p>
      <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
      <p><strong>MPAA Rating:</strong> {movie.mpaa_rating}</p>
      <p><strong>Description:</strong> {movie.description}</p>
      <p><strong>Created at:</strong> {formatDate(movie.created_at)}</p>
      <p><strong>Updated at:</strong> {formatDate(movie.updated_at)}</p>
      {themeContext?.isLoggedIn && (
        <button onClick={handleDelete} className="delete-button">
          Delete Movie
        </button>
      )}
      <ToastContainer />
    </div>
  );
}

export default MovieDetails;

import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from 'react-router-dom';
import '../styles/AddMovie.css';

const AddMovie = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [release_date, setReleaseDate] = useState('');
  const [runtime, setRuntime] = useState('');
  const [mpaa_rating, setMpaaRating] = useState('');
  const [image, setImage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const movie = {
      title,
      release_date,
      runtime: Number(runtime),
      mpaa_rating,
      description,
      image,
    };

    try {
      await axios.put('http://localhost:8080/movies', movie, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success('Movie added or updated successfully!');
      // Reset form fields
      setTitle('');
      setDescription('');
      setReleaseDate('');
      setRuntime('');
      setMpaaRating('');
      setImage('');

      // Delay before navigating to the Movies page
      setTimeout(() => {
        navigate('/movies');
      }, 2000); 
    } catch (error) {
      console.error('There was an error adding or updating the movie:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error message:', error.message);
        toast.error('There was an error adding or updating the movie.');
      }
    }
  };

  return (
    <div className="add-movie-form">
      <h2>Add or Update Movie</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Release Date:</label>
          <input
            type="date"
            value={release_date}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Runtime (in minutes):</label>
          <input
            type="number"
            value={runtime}
            onChange={(e) => setRuntime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>MPAA Rating:</label>
          <select
            value={mpaa_rating}
            onChange={(e) => setMpaaRating(e.target.value)}
            required
          >
            <option value="">Select Rating</option>
            <option value="G">G</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
            <option value="NC-17">NC-17</option>
            <option value="18A">18A</option>
          </select>
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          {image && (
            <img
              src={image}
              alt="Movie Preview"
              style={{ width: '200px', marginTop: '10px' }}
            />
          )}
        </div>
        <button type="submit">Add or Update Movie</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddMovie;

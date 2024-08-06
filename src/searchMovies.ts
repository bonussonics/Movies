
import axios from 'axios';

const apiKey = 'c77311fd6c25a18db3c1d9838d584533';

export async function searchMovies(searchTerm: string) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`;

  try {
    const response = await axios.get(url);
    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}


import { useContext, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';

import MovieDetails from './pages/MovieDetails';
import Movies from './components/Movies';
import AddMovie from './pages/AddMovie'; 
import './styles/cyberpunk.css';

function App() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('ThemeContext must be used within a ThemeProvider');
  }

  const { darkMode, toggleDarkMode, isLoggedIn, setIsLoggedIn } = themeContext;

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
  };

  return (
    <div>
      <header>
        <button onClick={toggleDarkMode}>
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
        <nav>
          <Link to="/">Home</Link>
          {isLoggedIn ? (
            <>
              <button onClick={handleLogout}>Logout</button>
            
           
              <Link to="/add-movie">Add Movie</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
           
            </>
          )}
          <Link to="/movies">Movies</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/add-movie" element={<AddMovie />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

# Movie Recommendation Website

This is a movie recommendation website built using React and TypeScript for the frontend, and Go with PostgreSQL for the backend. The website allows users to search for movies, view movie details, add movies, and delete movies from the database. It also includes a dark mode and light mode feature for a better user experience.

## Features

- **Search Movies:** Search for movies using the TMDB API.
- **View Movie Details:** View detailed information about a movie.
- **Add Movies:** Add new movies to the database.
- **Delete Movies:** Delete movies from the database.
- **Dark Mode/Light Mode:** Toggle between dark mode and light mode.
- **User Authentication:** Login and logout functionality using JWT tokens.

## Technologies Used

- **Frontend:** React, TypeScript, Vite
- **Backend:** Go, PostgreSQL
- **Styling:** CSS, Styled Components
- **APIs:** TMDB API
- **Notifications:** React-Toastify

## Project Structure

├── public
│ ├── assets
│ │ ├── .jpg
│ │ ├── .jpg
│ │ └── .jpg
├── src
│ ├── components
│ │ ├── SearchBar.tsx
│ │ ├── MovieCard.tsx
│ │ └── Movies.tsx
│ ├── pages
│ │ ├── Home.tsx
│ │ ├── AddMovie.tsx
│ │ ├── Login.tsx
│ │ ├── MovieSearch.tsx
│ │ └── MovieDetails.tsx
│ ├── styles
│ │ ├── AddMovie.css
│ │ ├── App.css
│ │ ├── cyberpunk.css
│ │ ├── Home.css
│ │ ├── MovieDetails.css
│ │ └── Movies.css
│ ├── main.tsx
│ ├── searchMovies.ts
│ ├── ThemeContext.tsx
│ ├── vite-env.d.ts
│ └── App.tsx
└── README.md



├── cmd
│ ├── api
│ │ ├── auth.go
│ │ ├── db.go
│ │ ├── handlers.go
│ │ ├── main.go
│ │ ├── middleware.go
│ │ ├── routes.go
│ │ └── utils.go
├── internal
│ ├── models
│ │ ├── Movies.go
│ │ └── User.go
│ ├── repository
│ │ ├── dbrepo
│ │ │ └── postgres_dbrepo.go
│ │ └── repository.go
└── sql
  └── create_tables.sql





## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/movie-recommendation-website.git
   cd movie-recommendation-website

Install dependencies:
npm install


Set up environment variables:
REACT_APP_TMDB_API_KEY=your_tmdb_api_key

Run the development server:
npm run dev

Start the Go backend server:
go run main.go






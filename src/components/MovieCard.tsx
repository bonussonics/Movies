import React from 'react';

interface MovieCardProps {
  title: string;
  poster: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, poster }) => {
  return (
    <div className="movie-card">
      <img src={poster} alt={title} />
      <h3>{title}</h3>
    </div>
  );
};

export default MovieCard;

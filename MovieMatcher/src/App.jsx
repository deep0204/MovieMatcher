import React from 'react'
import Search from './components/search';
import { useState, useEffect } from 'react';
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use';
import { upgradeSearchCount } from './appwrite';
import { getTrendingMovies } from './appwrite';
import {BarLoader} from 'react-spinners';
const App = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  useDebounce(() => setDebouncedTerm(searchTerm), 500, [searchTerm])
  const [loading, setLoading] = useState(false);
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': `${API_KEY}`,
      'x-rapidapi-host': 'imdb8.p.rapidapi.com',
    }
  };
  const loadTrendingMovies = async () => {
    try {
      const tm = await getTrendingMovies();
      setTrendingMovies(tm);
    } catch (error) {
      console.log(error)
    }
  }
  const [trendingMovies, setTrendingMovies] = useState([])
  useEffect(() => {
    loadTrendingMovies();
    console.log(trendingMovies)
  }, [])

  const fetchMovies = async (query) => {
    try {
      if (!query.trim()) {
        setMovies([]);
        return;
      }
      setLoading(true);
      let url = `https://imdb8.p.rapidapi.com/auto-complete?q=${query}`;

      const response = await fetch(url, options);
      if (response.ok) {
        const result = await response.json();
        console.log('Search results:', result);
        if (result.d && result.d.length > 0) {
          setMovies(result.d);
          upgradeSearchCount(query, result.d[0]);
        }
      } else {
        console.log("Error fetching movies");
      }
    } catch (e) {
      console.log(e);
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedTerm);
  }, [debouncedTerm]);
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="/hero.png" alt="hero" />
            <h1>Find <span className='text-gradient'>Movies</span> You'll love without Hassle ! </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} movies={movies} />

            {trendingMovies.length > 0 && (
              <section className='trending'>
                <h2>Trending Movies</h2>
                <ul>
                  {trendingMovies.map((movie, index) => {
                    return (
                      <li key={movie.$id}>
                        <p>{index + 1}</p>
                        <img src={movie.poster} alt="" />
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}
            {loading && <div className="all-movies">
            <h2>Searching for {debouncedTerm}...</h2>
            <BarLoader color="#4100ab" />
            </div>}
            {
              !loading && 
              (<div className="all-movies mt-10">
                <h2>{debouncedTerm?"Search Results for "+debouncedTerm:"Start Searching for your favourite movie"}</h2>
                <ul>
                  {movies.length > 0 && movies.map((movie) => {
                    try {
                      return (
                        <li className='text-white' key={movie.id}>
                          <MovieCard 
                            image={movie.i ? movie.i.imageUrl : '/no-movie.png'} 
                            title={movie.l} 
                            rating={movie.rank || 'N/A'} 
                            lang={movie.q || 'N/A'} 
                            year={movie.y || 'N/A'} 
                          />
                        </li>)
                    } catch (error) {
                      console.log(error);
                    }
                  })}
                </ul>
              </div>)
            }
            
          </header>
        </div>
      </div>
    </main>
  )
}

export default App;

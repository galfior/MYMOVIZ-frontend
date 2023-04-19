import { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);
  const [moviesData, setmoviesData] = useState([]);

useEffect(() => {
   fetch('https://mymoviz-backend-flax-nine.vercel.app/movies')
     .then(response => response.json())
     .then(data => {
      setmoviesData(data.movies)
      //console.log(data)
     });
 }, []);



  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>
      {likedMoviesPopover}
    </div>
  );

  // Movies list


  const movies = moviesData.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    let newOverview = ''
    if (data.overview.length > 250) {
      newOverview = `${data.overview.substring(0,250 )}...`
      //console.log(newOverview)
    } else {
      newOverview = data.overview
      //console.log(newOverview)
    }
    return <Movie 
    key={i} 
    updateLikedMovies={updateLikedMovies} 
    isLiked={isLiked} 
    title={data.title} 
    overview={newOverview}
    poster={`https://image.tmdb.org/t/p/w500/${data.poster_path}`} 
    voteAverage={data.vote_average
    } 
    voteCount={data.vote_count} />;
  });



  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src={"logo.png"} alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>
        {movies}
      </div>
    </div>
  );
}

export default Home;
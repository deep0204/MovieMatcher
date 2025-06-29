import React from 'react'

const MovieCard = (props) => {
  return (
    <div className='movie-card'>
        <img src={props.image} alt="" />
        <h3 className='mt-4 font-dm-sans'>{props.title}</h3>
        <div className="content">
            <div className="rating">
                <img src="/star.svg" alt="star" />
                <p className='font-dm-sans'>{props.rating} • {props.lang} • {props.year}</p>
            </div>
        </div>
      
    </div>
  )
}

export default MovieCard

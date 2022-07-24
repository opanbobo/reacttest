import React from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";

function FilmDetail() {
  const [film, setFilm] = React.useState({});
  const [characters, setCharacters] = React.useState([]);
  const [bookmark, setBookmark] = React.useState(false);
  const { id } = useParams();

  // Set bookmark
  const toggleBookmark = async () => {
    let bookMarked = await localStorage.getItem("filmId");
    let splitBookmark = bookMarked ? bookMarked.split(",") : [];
    let findBookmark = splitBookmark.find((item) => item === id);
    if (findBookmark === undefined && bookmark === false) {
      splitBookmark.push(id);
      localStorage.setItem("filmId", splitBookmark.join(","));
      setBookmark(true);
    } else {
      splitBookmark.splice(splitBookmark.indexOf(id), 1);
      localStorage.setItem("filmId", splitBookmark.join(","));
      setBookmark(false);
    }
  };

  // Get bookmarked
  const getBookmark = async () => {
    let bookMarked = await localStorage.getItem("filmId");
    let splitBookmark = bookMarked ? bookMarked.split(",") : [];
    let findBookmark = splitBookmark.find((item) => item === id);
    if (findBookmark !== undefined) {
      setBookmark(true);
    }
  };

  // Get film detail
  const getFilmDetail = async () => {
    try {
      const response = await fetch(`${API.films}/${id}`);
      if (!response.ok) {
        throw new Error(response.text);
      }
      const filmDetail = await response.json();
      const characters = await filmDetail.characters.map((item) =>
        fetch(item).then((response) => response.json())
      );
      const allCharacters = await Promise.all(characters);
      setFilm(filmDetail);
      setCharacters(allCharacters);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    getFilmDetail();
    getBookmark();
  }, []);

  if (characters.length === 0 && Object.keys(film).length === 0) {
    return <div className="loader"></div>
  }

  return (
    <div className="card">
      <div className="page-head mb-3">
        <Link to="/" className="btn btn-primary">&laquo; Back</Link>
        <div onClick={toggleBookmark} className="star">
          {bookmark ? <span>&#9733;</span> : <span>&#9734;</span>}
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-subtitle mb-3 font-weight-bold">{film.title}</h3>
        <hr />
        <p className="mb-4">{film.opening_crawl}</p>
        <div className="row">
          <div className="col-md-6">
            <p className="mb-4">
              <strong>Episode:</strong><br/>
              {film.episode_id}
            </p>
            <p>
              <strong>Director:</strong><br/>
              {film.director}
            </p>
          </div>
          <div className="col-md-6">
            <p className="mb-4">
              <strong>Producer:</strong><br/>
              {film.producer}
            </p>
            <p>
            <strong>Release Date:</strong><br/>
              {film.release_date}
            </p>
          </div>
        </div>
        <hr />
        <br/>
        <p>
          <strong>Characters</strong>
        </p>
        <ul>
          {characters.map((item, index) => (
            <li key={index}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FilmDetail;

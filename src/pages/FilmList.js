import React from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

function FilmList() {
  const [films, setFilms] = React.useState([]);
  const [recentBookmark, setRecentBookmark] = React.useState([]);

  async function getfilms() {
    try {
      const response = await fetch(`${API.abilities}`);
      if (!response.ok) {
        throw new Error(response.text);
      }
      const json = await response.json();
      setFilms(json.results);
    } catch (err) {
      console.error(err);
    }
  }

  const getRecentBookmark = async () => {
    let bookMarked = await localStorage.getItem("filmId");
    let splitBookmark = bookMarked ? bookMarked.split(",") : [];
    try {
      const promises = splitBookmark
        .slice(-3)
        .map((id) =>
          fetch(`${API.films}/${id}`).then((response) => response.json())
        );
      const recentBookmark = await Promise.all(promises);
      setRecentBookmark(recentBookmark.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    getfilms();
    getRecentBookmark();
  }, []);

  if (films.length === 0 && recentBookmark.length === 0 ) {
    return <div className="loader"></div>
  }

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title mb-2 font-weight-bold">FILM LIST</h3>
        <hr />
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title mb-2">
              <span>&#9733;</span> Recent bookmark
            </h5>
            {recentBookmark.length === 0 ? (
              <p>Bookmark is empty</p>
            ) : (
              recentBookmark.map((item, index) => (
                <div className="ml-4 mb-1" key={index}>
                  &bull;&nbsp; <Link className="mb-1" to={`/detail/${item.url.split('/').slice(-2)[0]}`}>{`${item.title}`}</Link>
                </div>
              ))
            )}
          </div>
        </div>
        <ul className="list-group">
          {films.map((item, index) => (
            <li className="list-group-item" key={index}>
              <Link to={`/detail/${item.url.split('/').slice(-2)[0]}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FilmList;

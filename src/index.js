import React from "react";
import ReactDOM from "react-dom";
import ProgressBar from "react-topbar-progress-indicator";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import lazyLoading from "./components/LazyLoading";

import "./assets/css/bootstrap.min.css";
import "./assets/css/styles.css";
const loader = document.querySelector('.loader');
const showLoader = () => loader.classList.remove('loader--hide');
const hideLoader = () => loader.classList.add('loader--hide');

const FilmList = lazyLoading(() => import("./pages/FilmList"), {
  fallback: <ProgressBar />
});

const FilmDetail = lazyLoading(() => import("./pages/FilmDetail"), {
  fallback: <ProgressBar />
});

function App() {
  return (
      <div className="container my-2 mx-auto">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={FilmList} />
            <Route exact path="/detail/:id" component={FilmDetail} />
          </Switch>
        </BrowserRouter>
      </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App 
  hideLoader={hideLoader}
  showLoader={showLoader} 
  />, rootElement);

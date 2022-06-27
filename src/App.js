import { useState } from "react";
import axios from 'axios';
import './App.css';
import { AiFillStar } from 'react-icons/ai';
import { AiOutlineFork } from 'react-icons/ai';
import { AiOutlineIssuesClose } from 'react-icons/ai';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiFillCalendar } from 'react-icons/ai';
import { FaLanguage } from 'react-icons/fa';

function App() {
  const [name, setName] = useState("");
  const [loading, setloading] = useState(false);
  const [repos, setRepos] = useState([])
  const [detailes, setDetailes] = useState([])
  const baseUrl = `https://api.github.com/search/repositories?q=${name}`

  //When Submit Search Form
  function handleSubmit(e) {
    console.log("handleSubmit");
    e.preventDefault();
    searchRepo();
  };

  //to get search  repos data  from api 
  function searchRepo() {
    setloading(true);
    axios.get(`${baseUrl}`)
      .then(res => {
        setRepos(res.data.items);
        setloading(false);
      })
  }

  // Serch Result View 
  function renderRepo(repo) {
    return (
      <div className="row" >
        <h2 className="repo-name">{repo.name} </h2>
        <h2 className="repo-name" onClick={() => getDetails(repo.id)} key={repo.id}><button className='select-button'>Select</button></h2>
      </div>
    );
  }

  //Detais for each repo by id
  const getDetails = (repoID) => {
    repos.forEach((res) => {
      if (res.id === repoID) {
        setDetailes(detailes => [...detailes, res]);
      }
    });
  };

  //Delete Selected Repo
  const onDelete = (id) => {
    setDetailes(detailes.filter((repo) => repo.id !== id));
  }

  //to get repo age from creation Data and get last update also 
  function getAge(date) {
    let age = new Date() - new Date(date);
    let yearAge = Math.floor(age / 1000 / 60 / 60 / 24 / 365);
    let monthAge = Math.floor(age / 1000 / 60 / 60 / 24 / 30)
    let dayAge = Math.floor(age / 1000 / 60 / 60 / 24)
    let hourAge = Math.floor(age / 1000 / 60 / 60)
    let minAge = Math.floor(age / 1000 / 60)
    if (yearAge >= 1) { return (`${yearAge} Year Ago`) }
    else if (yearAge < 1 && monthAge >= 1) { return (`${monthAge} Month Ago`) }
    else if (monthAge < 1 && dayAge >= 1) { return (`${dayAge} Day Ago`) }
    else if (dayAge < 1 && hourAge >= 1) { return (`${hourAge} Hour Ago `) }
    else { return (`${minAge} Min Ago`) }
  }


  //Selected cardList View
  function cardList(repo) {
    return (
      <>
        <div class="card">
          <div class="card-inner">
            <div class="card-header">
              <a href={repo.clone_url} className="label">{repo.full_name}</a>
              <img className="avatar_url-img" src={repo.owner.avatar_url} alt="avatar" />
            </div>
            <div class="card-body">
              <div className="details-row">
                <span className="label"><AiFillStar className="icone" /> stars</span>
                <span className="value">{repo.stargazers_count}</span>
              </div>
              <div className="details-row">
                <label className="label"><AiOutlineFork /> forks</label>
                <span className="value">{repo.forks}</span>

              </div>
              <div className="details-row">
                <label className="label"><AiOutlineIssuesClose /> open issues</label>
                <span className="value">{repo.open_issues_count}</span>

              </div>
              <div className="details-row">
                <label className="label"><AiFillCalendar /> Age</label>
                <span className="value">{getAge(repo.created_at)}</span>

              </div>
              <div className="details-row">
                <label className="label"><AiOutlinePlus /> Last Commite </label>
                <span className="value">{getAge(repo.pushed_at)}</span>
              </div>
              <div className="details-row">
                <label className="label"> <FaLanguage /> language</label>
                <span className="value">{repo.language}</span>
              </div>
            </div>
            <div class="card-footer">
              <button className='button-search' onClick={(e) => onDelete(repo.id)}>Remove Repo</button>
            </div>
          </div>
        </div>

      </>
    );
  }

  return (
    <div className="page">
      <div className="landing-page-container">
        <div className="left-side">
          <form className='form'>
            <input
              className='input'
              value={name}
              placeholder="Enter Repository Name"
              onChange={e => setName(e.target.value)}
            />
            <button className='button' onClick={handleSubmit}>{loading ? "Searching....." : "Search"}</button>
          </form>
          <div className="results-container">
            {repos.map(renderRepo)}
          </div>
        </div>
        <section class="main-section">
          {detailes.map(cardList)}
        </section>
      </div>
    </div>
  );
}

export default App;

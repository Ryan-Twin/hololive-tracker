import React, {useState, useEffect} from 'react';
import './App.css';
import $ from 'jquery';

const recommendationsList = [
    "among us",
    "shitpost status",
    "fortnite",
    "beastars",
    "undertale"
]

let userToken;

// TODO: ADD LOG OUT FUNCTIONALITY IF POSSIBLE
function App() {
    const [token, setToken] = useState(null);

    const loggedIn = function() {
        return token | $.get("http://localhost:40101/auth", res => {
            console.log(res);
            setToken(res.body);
            userToken = res.body;
            return token;
        });
    }

    return (
        <div className="App">
            <div className="home">
                <h1 className="title"><b className={"red"}>youtube</b> shitplayer</h1>
                {loggedIn() ? <Player/> : <Landing setToken={setToken}/>}
            </div>
        </div>
    );
}

function Landing(props) {
    const authenticate = function() {
        props.setToken("123");
        //$.get("http://localhost:40101/", () => {
        //    console.log("cool");
        //})
    }

    return <button type={"button"} onClick={authenticate} className={"button"}>Authenticate</button>
}

function Player(props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [lastQuery, setLastQuery] = useState("");
    const [videoID, setVideoID] = useState("");
    const [videoIDs, setVideoIDs] = useState(["kzVVVNT4ic4", "V0mnsk2jrQw"]);
    const [loading, setLoading] = useState(false);

    const changeSearchQuery = function(e) {
        setSearchQuery(e.target.value);
    }

    const search = function(query) {
        if (!query) {
            alert("enter a shitty search query please");
        }
        else if (query === lastQuery) {
            alert("please enter a new shitty search query please");
        }
        else {
            setLastQuery(query);
            setLoading(true);
            setTimeout(() => {setLoading(false); setSearchQuery("");}, 2000);
            //$.get("http://localhost:40101/search/:query", {query: query}, res => {
            //    console.log(res);
            //    setVideoIDs(res.body);
            //    setVideoID(videoIDs[0]);
            //    setLoading(false);
            //})

        }
    }

    const recommendations = function() {
        let recs = [<p>other shit video categories</p>];
        recommendationsList.forEach(rec => {
            recs.push(<a onClick={() => search(rec)}>{rec}</a>);
        })
        return recs;
    }

    const lastVideo = function() {
        if (videoIDs) {
            const nextVideoID = videoIDs[videoIDs.indexOf(videoID) - 1];
            setVideoID(nextVideoID ? nextVideoID : videoIDs[0]);
        }
    }

    const nextVideo = function() {
        if (videoIDs) {
            const nextVideoID = videoIDs[videoIDs.indexOf(videoID) + 1];
            setVideoID(nextVideoID ? nextVideoID : videoIDs[0]);
        }
    }

    const player =
            <div className="iframe-container">
                <div className="iframe-placeholder"/>
                {videoID && <iframe width="560" height="315" src={"https://www.youtube.com/embed/" + videoID} frameBorder="0"
                        allowFullScreen/>}
            </div>
    const options =
        <div className={"options-flow"}>
            {loading && <h1>searching for {lastQuery}...</h1>}
            {(videoIDs && videoID) && <p>shitty video {videoIDs.indexOf(videoID) + 1} of {videoIDs.length}</p>}
            <input type={"text"} value={searchQuery} id={"search-text"} onChange={changeSearchQuery} placeholder={"enter your shitty search"}/>
            <button type="button" onClick={lastVideo} className="success button">last video</button>
            <button type="button" id={"search-query"} onClick={() => {search(searchQuery)}} className="button" disabled={loading}>search</button>
            <button type="button" onClick={nextVideo} className="success button">next video</button>
        </div>

    return [player, options, recommendations()];
}

export default App;

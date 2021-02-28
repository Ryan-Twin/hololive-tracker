import React, {useState, useEffect} from 'react';
import './App.css';
import $ from 'jquery';

const recommendationsList = [
    "amogus",
    "shitpost status",
    "fortnite",
    "beastars",
    "undertale"
]

function App() {
    const [token, setToken] = useState(null);
    if(!token){
        $.get("http://localhost:40101/token", (res) => {
            setToken(res.access_token)
        })
    }
    return (
        <div className="App">
            <div className="home">
                <h1 className="title"><b className={"red"}>youtube</b> shitplayer</h1>
                {token ? <Player/> : <Landing setToken={setToken}/>}
            </div>
        </div>
    );
}

function Landing(props) {
    const authenticate = function() {
        props.setToken("123");
        $.get("http://localhost:40101/", () => {

        });
        window.open(`https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value&redirect_uri=http%3A%2F%2Flocalhost:40101%2Fauth&response_type=code&client_id=226859199881-8aa8ifuqcmsc2do676i6k57gutmue9c8.apps.googleusercontent.com`, "_self")

    }

    return <div className={"flex-column"}>
        <button type={"button"} onClick={authenticate} className={"success button"}>Authenticate</button>
    </div>
}

function Player(props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [lastQuery, setLastQuery] = useState("");
    const [videoID, setVideoID] = useState("");
    const [videoIDs, setVideoIDs] = useState(null);
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
            $.get(`http://localhost:40101/search/${query}`, res => {
                setVideoIDs(res.filter(ID => {
                    return ID != null;
                }), () => {
                    setVideoID(videoIDs[0]);
                });
                setSearchQuery("");
                setLoading(false);
            })

        }
    }

    const recommendations = function() {
        let recs = [<p>other shit video categories</p>];
        recommendationsList.forEach(rec => {
            recs.push(<a onClick={() => search(rec)}>{rec}</a>);
        })
        return <div className={"recommendations flex-column"}>{recs}</div>;
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

    console.log(videoIDs);
    console.log(videoID);

    const player =
        <div className="iframe-container">
            <div className="iframe-placeholder"/>
            {videoID && <iframe width="560" height="315" title={"youtube-player"} src={"https://www.youtube.com/embed/" + videoID} frameBorder="0"
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

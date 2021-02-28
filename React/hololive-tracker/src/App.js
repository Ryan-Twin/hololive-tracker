import logo from './logo.svg';
import './App.css';
import Modal from "./components/modal";

// TODO: ADD AUTOPLAY TO PLAYER
let autoplay = true;


const recommendationsList = [
    "among us",
    "shitpost status",
    "fortnite",
    "   "
]

function App() {
  return (
    <div className="App">
        <div className="home">

            <h1 className="title"><b className={"red"}>youtube</b> shitplayer</h1>
            {loggedIn() ? Player() : Landing()}
        </div>
        <div className="reveal" id="search-modal" data-reveal>
            <h1>Awesome. I Have It.</h1>
            <p className="lead">Your couch. It is mine.</p>
            <p>I'm a cool paragraph that lives inside of an even cooler modal. Wins!</p>
            <button className="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    </div>
  );
}

function Landing() {
    return <p>landing</p>
}

function Player() {
    const player =
            <div className="iframe-container">
                <div className="iframe-placeholder"/>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/kzVVVNT4ic4" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen/>
            </div>
    const buttons =
        <div>
            <button type="button" data-open="search-modal" className="button">Search</button>
            <button type="button" className="success button">Next Video</button>
        </div>
    return [player, buttons, recommendations()];
}

function recommendations() {
    let recs = [<p>other shit videos</p>];
    recommendationsList.forEach(rec => {
        recs.push(<a>{rec}</a>);
    })
    return recs;
}

function loggedIn() {
    return true;
}

export default App;

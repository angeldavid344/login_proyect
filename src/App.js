import logo from './logo.svg';
import './App.css';

function App() {
  return (
    // create a login component that connects to the database through async
    // function and returns the data to the component to be displayed on the page
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
        />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        > Learn React </a>  
      </header>
    </div>

  );
}

export default App;

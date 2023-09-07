import './App.css';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';
import Help from './components/Help';

function App() {
  return (
    <div className="app">
        <>
          <nav>
            <Link to="/"><button id="nav">Startseite</button></Link>
            <Link to="/Help"><button id="nav">Help</button></Link>
            <Link to="/Game/1"><button id="nav">Spiel 1</button></Link>
            <Link to="/Game/2"><button id="nav">Spiel 2</button></Link>
          </nav>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/Game/:id' element={<Game/>}/>
            <Route path='/Help' element={<Help/>}/>
          </Routes>
  </>
    </div>
  );
}

export default App;
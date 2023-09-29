import './App.css';
import { Route, Routes} from 'react-router-dom';
import { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import Help from './components/Help';
import { Tile, Player } from './components/Game';

export interface Games {
  maxTurnTime: number;
  players: number[];
  board: {
    gameSizeRows: number;
    gameSizeColumns: number;
    squares: number[][];
  }
}

export interface User {
  id:  number;
  name: string;
  controllable: boolean;
}

export interface GamesData {
  id: number;
  winningPlayer: number;
  players: User[];
}


//App dient als MutterKomponente, von wo aus wir sämtliche Props an die einzelnen UnterKomponenten übergeben.
function App() {
  const [playerAmount, setPlayerAmount] = useState<number>(2);
  const [boardSize, setBoardSize] = useState<number>(6);
  const [maxTurnTime, setMaxTurnTime] = useState<number>(60000);
  const [tile, setTile] = useState<Tile[][]>([[]]);
  const [player, setPlayer] = useState<Player[]>([]);
  const [gamesData, setGamesData] = useState<GamesData[]>([]);
  const [users, setUsers] = useState<User[]>([]);



  return (
    <div className="app">
        <Routes>
          <Route path='/' element={<Home playerAmount={playerAmount} setPlayerAmount={setPlayerAmount} boardSize={boardSize} setBoardSize={setBoardSize}
          maxTurnTime={maxTurnTime} setMaxTurnTime={setMaxTurnTime} gamesData={gamesData} setGamesData={setGamesData} 
          users={users} setUsers={setUsers}/>} />

          <Route path='/Game/:id' element={<Game boardSize={boardSize} tile={tile} setTile={setTile} player={player} setPlayer={setPlayer} 
          setBoardSize={setBoardSize} />} />
          
          <Route path='/Help' element={<Help />} />
        </Routes>
      <footer>Dieses Projekt ist an der HS Anhalt und unter der Aufsicht von Toni Barth entstanden.</footer>
    </div>
  );
}

export default App;
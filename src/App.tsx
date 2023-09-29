import './App.css';
import { Route, Routes, Link } from 'react-router-dom';
import { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import Help from './components/Help';
import { Tile, Fire, Player } from './components/Game';

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

function App() {
  const [playerAmount, setPlayerAmount] = useState<number>(2);
  const [boardSize, setBoardSize] = useState<number>(6);
  const [maxTurnTime, setMaxTurnTime] = useState<number>(60000);
  const [games, setGames] = useState<Games[]>([]);
  const [boardSquares, setBoardSquares] = useState<number[][]>([[]]);
  const [tile, setTile] = useState<Tile[][]>([[]]);
  const [player, setPlayer] = useState<Player[]>([]);
  const [currentGameId, setCurrentGameId] = useState<number | undefined>();
  const [gamesData, setGamesData] = useState<GamesData[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  return (
    <div className="app">
        <Routes>
          <Route path='/' element={<Home playerAmount={playerAmount} setPlayerAmount={setPlayerAmount} boardSize={boardSize} setBoardSize={setBoardSize}
          maxTurnTime={maxTurnTime} setMaxTurnTime={setMaxTurnTime} games={games} setGames={setGames} boardSquares={boardSquares} setBoardSquares={setBoardSquares} 
          player={player} setPlayer={setPlayer} currentGameId={currentGameId} setCurrentGameId={setCurrentGameId} gamesData={gamesData} setGamesData={setGamesData} 
          users={users} setUsers={setUsers}/>} />

          <Route path='/Game/:id' element={<Game boardSize={boardSize} tile={tile} setTile={setTile} games={games} setGames={setGames} player={player} setPlayer={setPlayer}
          currentGameId={currentGameId} setCurrentGameId={setCurrentGameId} gamesData={gamesData} setBoardSize={setBoardSize} />} />
          
          <Route path='/Help' element={<Help />} />
        </Routes>
      <footer>Dieses Projekt ist an der HS Anhalt und unter der Aufsicht von Toni Barth entstanden.</footer>
    </div>
  );
}

export default App;
import React, { useEffect, useState } from "react";
import './Home.css';
import { playerColor, Player } from "./Game";
import { Games, GamesData, User } from "../App";
import { Route, Routes, Link } from 'react-router-dom';


export default function Home({ playerAmount, setPlayerAmount, boardSize, setBoardSize, maxTurnTime, setMaxTurnTime, games, setGames, boardSquares, setBoardSquares, player, setPlayer, currentGameId, setCurrentGameId, gamesData, setGamesData, users, setUsers }: {
    playerAmount: number,
    setPlayerAmount: React.Dispatch<React.SetStateAction<number>>,
    boardSize: number,
    setBoardSize: React.Dispatch<React.SetStateAction<number>>,
    maxTurnTime: number,
    setMaxTurnTime: React.Dispatch<React.SetStateAction<number>>,
    games: Games[],
    setGames: React.Dispatch<React.SetStateAction<Games[]>>,
    boardSquares: number[][],
    setBoardSquares: React.Dispatch<React.SetStateAction<number[][]>>,
    player: Player[],
    setPlayer: React.Dispatch<React.SetStateAction<Player[]>>,
    currentGameId: number | undefined,
    setCurrentGameId: React.Dispatch<React.SetStateAction<number | undefined>>,
    gamesData: GamesData[],
    setGamesData: React.Dispatch<React.SetStateAction<GamesData[]>>,
    users: User[],
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
}) {
    const [inputName, setInputName] = useState<string>('');
    const [isGameDivOpen, setIsGameDivOpen] = useState(false);
    const [isUserDivOpen, setIsUserDivOpen] = useState(true);
    const [currentUser, setCurrentUser] = useState<User>();
    const [selectedUser, setSelectedUser] = useState<User>(users[0]);

    const fetchData = async () => {
        const response = await fetch(`https://gruppe12.toni-barth.com/games/`);
        const newData = await response.json();
        setGamesData(newData.games);
    };

    const fetchPlayerDataSignIn = async () => {
        fetch('https://gruppe12.toni-barth.com/players/', {
            method: 'POST',
            body: JSON.stringify({
                name: inputName,
                controllable: true
            }),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((data) => data.json())
            .then((json) => console.log(json))
            .catch(console.error);

        const response = await fetch(`https://gruppe12.toni-barth.com/players/`);
        const newData = await response.json();
        setUsers(newData.players);

        setIsUserDivOpen(false);
        setCurrentUser({ id: users.length, name: inputName, controllable: true });
        localStorage.setItem('user', JSON.stringify({ id: newData.players[newData.players.length - 1].id, name: inputName, controllable: true }))
    };

    const fetchPlayerData = async () => {
        const response = await fetch(`https://gruppe12.toni-barth.com/players/`);
        const newData = await response.json();
        setUsers(newData.players);
    };

    useEffect(() => {
        fetchData();
        fetchPlayerData();
        const user = localStorage.getItem('user');
        console.log(user);
        if (user) {
            setCurrentUser(JSON.parse(user));
            setIsUserDivOpen(false);
        }
    }, []);


    function createGame() {
        //create Squares:
        let squares: number[][] = [[]];
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (i >= squares.length) {
                    const newArray = [...squares, []];
                    squares = newArray;
                }
                squares[i].push(-1);
            }
        }

        //create Players:
        let tmpRow: number = 0;
        let index: number = 0;//selectedUser!.id;
        let x: number = 0;
        let y: number = 0;
        let tmpOffset: number = 0;
        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < playerAmount; i++) {

                if (i * 2 - boardSize * tmpRow > boardSize - 1) {
                    tmpRow++;
                }

                if (tmpRow % 2 === 0) {
                    tmpOffset = 0;
                }
                else {
                    tmpOffset = 1;
                }
                x = i * 2 + tmpOffset - boardSize * tmpRow;
                if (index === 0) {
                    y = tmpRow;
                }
                else {
                    y = boardSize - 1 - tmpRow;
                }

                squares[x][y] = index;
            }
            tmpRow = 0;
            index = 1;//currentUser!.id;
        }

        const newGame: Games = { maxTurnTime: maxTurnTime, players: [currentUser!.id, selectedUser!.id], board: { gameSizeRows: boardSize, gameSizeColumns: boardSize, squares: squares } }
        console.log(newGame);
        return newGame;
    }


    function postGame(newGame: Games) {
        fetch('https://gruppe12.toni-barth.com/games/', {
            method: 'POST',
            body: JSON.stringify(newGame),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((data) => data.json())
            .then((json) => console.log(json))
            .catch(console.error);
    }

    function postPlayer() {
        fetch('https://gruppe12.toni-barth.com/players/', {
            method: 'POST',
            body: JSON.stringify({
                name: inputName,
                controllable: true
            }),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((data) => data.json())
            .then((json) => console.log(json))
            .catch(console.error);
    }

    function devButton() {
        fetch(`https://gruppe12.toni-barth.com/players/18`, {
            method: 'DELETE'
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log('Spieler erfolgreich gelöscht');
                } else {
                    console.error('Fehler beim Löschen des Spielers. Statuscode:', response.status);
                }
            })
            .catch((error) => {
                console.error('Fehler beim Löschen des Spielers:', error);
            });

        localStorage.clear();
    }


    const handleInputName = (event: any) => {
        setInputName(event.target.value);
    };

    const handleOptionChange = (event: any) => {
        console.log(selectedUser);
        setSelectedUser(users[users.findIndex(item => item.name === event.target.value)]);
        console.log(users[users.findIndex(item => item.name === event.target.value)].id);
    };

    return <div>
        <h1>Game of the Amazons</h1>
        {isUserDivOpen && (
        <div className="popup">
            <div className="popup-content">
            <div className="terminalContainerInner">
                <div className="terminalContainer">
                    <div className="terminalContainerInner">
                        <div className="terminalBox">Name:</div>
                    </div>
                    <div className="terminalContainerInner">
                        <div className="terminalBox"><input className="input" aria-label="Namens Eingabe"
                            type="text"
                            value={inputName}
                            onChange={handleInputName}
                            placeholder="Hier Namen eingeben"
                        /></div>
                    </div>
                </div>
                <button className="actionButton" onClick={() => { if (inputName !== '') { fetchPlayerDataSignIn() } }}>Anmelden</button>
            </div>
            </div>
            </div>

        )}
        <div>
            {gamesData && (
                <ul>
                    {gamesData.map((value, index) => (
                        <li key={index} className="boards">Spielnummer: {gamesData[index].id}
                            <Link to={'/Game/' + gamesData[index].id}><button className="actionButton" onClick={() => setCurrentGameId(gamesData[index].id)}>Spiel beitreten</button></Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        <button className="actionButton" onClick={() => setIsGameDivOpen(!isGameDivOpen)}>neues Spiel</button>
        <button className="actionButton" onClick={() => devButton()}>DevButton</button>

        {isGameDivOpen && (
            <div className="terminalContainerInner">
                <div className="terminalContainer">
                    <div className="terminalContainerInner">
                        <div className="terminalBox">Brettgröße:</div>
                        <div className="terminalBox">SpielerAnzahl:</div>
                        <div className="terminalBox">Zeit pro Zug:</div>
                        <div className="terminalBox">Gegner:</div>
                    </div>
                    <div className="terminalContainerInner">
                        <div className="terminalBox">
                            <button className="valueButton" onClick={() => { if (boardSize < 26) { setBoardSize(boardSize + 1) } }}>˄</button><p>{boardSize}</p>
                            <button className="valueButton" onClick={() => { if (boardSize > 2) { setBoardSize(boardSize - 1) } }}>˅</button>
                        </div>
                        <div className="terminalBox">
                            <button className="valueButton" onClick={() => { if (playerAmount < (boardSize * boardSize) / 4) { setPlayerAmount(playerAmount + 1) } }}>˄</button><p>{playerAmount}</p>
                            <button className="valueButton" onClick={() => { if (playerAmount > 1) { setPlayerAmount(playerAmount - 1) } }}>˅</button>
                        </div>
                        <div className="terminalBox">
                            <button className="valueButton" onClick={() => { if (true) { setMaxTurnTime(maxTurnTime + 5000) } }}>˄</button><p>{maxTurnTime / 1000}</p>
                            <button className="valueButton" onClick={() => { if (maxTurnTime > 5000) { setMaxTurnTime(maxTurnTime - 5000) } }}>˅</button>
                        </div>
                        <div className="terminalBox">
                            <select value={selectedUser?.name} onChange={handleOptionChange}>
                                {users.map((user, index) => (
                                    <option key={user.id} value={user.name}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                </div>
                <button className="actionButton" onClick={() => { if (playerAmount < (boardSize * boardSize) / 4) { postGame(createGame()); setIsGameDivOpen(false); } }}>Fertig</button>

            </div>)}
    </div>
}
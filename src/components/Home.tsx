import React, { useEffect, useState } from "react";
import './Home.css';
import { Games, GamesData, User } from "../App";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Home({ playerAmount, setPlayerAmount, boardSize, setBoardSize, maxTurnTime, setMaxTurnTime, gamesData, setGamesData, users, setUsers }: {
    playerAmount: number,
    setPlayerAmount: React.Dispatch<React.SetStateAction<number>>,
    boardSize: number,
    setBoardSize: React.Dispatch<React.SetStateAction<number>>,
    maxTurnTime: number,
    setMaxTurnTime: React.Dispatch<React.SetStateAction<number>>,
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
    const navigate = useNavigate();

    //GET für die Games
    const fetchData = async () => {
        const response = await fetch(`https://gruppe12.toni-barth.com/games/`);
        const newData = await response.json();
        setGamesData(newData.games);
    };

    //POST für den Player, den man beim Einloggen erstellt, GET für die Players
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
        //User wird im LocalStorage gespeichert
        localStorage.setItem('user', JSON.stringify({ id: newData.players[newData.players.length - 1].id + 1, name: inputName, controllable: true }))
    };

    const fetchPlayerData = async () => {
        const response = await fetch(`https://gruppe12.toni-barth.com/players/`);
        const newData = await response.json();
        setUsers(newData.players);
    };

    //Das UseEffect wird nur beim Laden der Seite ausgeführt. Hier wird die Logik dafür definiert.
    useEffect(() => {
        fetchData();
        fetchPlayerData();
        const user = localStorage.getItem('user');
        //wenn der User noch angemeldet ist, wird er erkannt und muss sich nicht erneut anmelden
        if (user) {
            setCurrentUser(JSON.parse(user));
            setIsUserDivOpen(false);
        }
    }, []);

    //Erstellt ein Spiel mit den angegebenen Formaten
    function createGame() {
        //Erstellen von Squares (alles erstmal auf "-1" setzen)
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

        //Erstellen der Spieler/Amazonen in einen versetzten Muster
        let tmpRow: number = 0;
        let index: number = 0;
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
                    if (boardSize % 2 === 0) {
                        tmpOffset = 1;
                    }
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
            index = 1;
        }

        //Die User sind immer der User, als der man angemeldet ist, und der User, welchen man bei der Erstellung des Spieles ausgewählt hat
        if(selectedUser){
            const newGame: Games = { maxTurnTime: maxTurnTime, players: [currentUser!.id, selectedUser!.id], board: { gameSizeRows: boardSize, gameSizeColumns: boardSize, squares: squares } }
            return newGame;
        }
        else{
            const newGame: Games = { maxTurnTime: maxTurnTime, players: [currentUser!.id, users[0].id], board: { gameSizeRows: boardSize, gameSizeColumns: boardSize, squares: squares } }
            return newGame;
        }
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

    //Regelt das Abmelden
    function lockOut() {

        //geht durch alle Spiele durch, die noch für den betroffenen Spieler offen sind, und löscht diese
        for (let i = 0; i < gamesData.length; i++) {
            for (let j = 0; j < 2; j++) {
                if (gamesData[i].players[j].id === currentUser?.id) {
                    const url = `https://gruppe12.toni-barth.com/games/${i}`;
                    fetch(url, {
                        method: 'DELETE'
                    })
                        .then((response) => {
                            if (response.ok) {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Spiel erfolgreich gelöscht',
                                    text: 'Status-Code 200'
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Fehler beim Löschen des Spieles',
                                    text: 'Fehler-Code 400'
                                });
                            }
                        })
                        .catch((error) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Fehler beim Löschen des Spieles',
                                text: 'Fehler-Code 400'
                            });
                        });
                }
            }
        }

        //löscht den Spieler
        fetch(`https://gruppe12.toni-barth.com/players/${currentUser?.id}`, {
            method: 'DELETE'
        })
            .then((response) => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Spieler erfolgreich gelöscht',
                        text: 'Status-Code 200'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Fehler beim Löschen des Spielers',
                        text: 'Fehler-Code 400'
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Fehler beim Löschen des Spielers',
                    text: 'Fehler-Code 400'
                });
            });
        
        //löscht den Spieler aus dem LocalStorage
        localStorage.clear();
    }


    const handleInputName = (event: any) => {
        setInputName(event.target.value);
    };

    const handleOptionChange = (event: any) => {
        setSelectedUser(users[users.findIndex(item => item.name === event.target.value)]);
    };

    return <div>
        <h1>Game of the Amazons</h1>
        <h2>{currentUser ? 'Welcome back, ' + currentUser?.name + '!' : ''}</h2>
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
                        <li key={index} className="boards">{gamesData[index].players[0].name} gegen {gamesData[index].players[1].name}
                            <Link to={'/Game/' + gamesData[index].id}><button className="actionButton">Spiel beitreten</button></Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        <button className="actionButton" onClick={() => setIsGameDivOpen(!isGameDivOpen)}>neues Spiel</button>
        <button className="actionButton" onClick={() => lockOut()}>Abmelden</button>
        <button className="actionButton" onClick={() => navigate('/help')}>Hilfe</button>
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
                            <button className="valueButton" onClick={() => { let tmp = 1; if (boardSize % 2 === 0) { tmp = 0; }; if (playerAmount < (boardSize * boardSize - (boardSize * tmp)) / 4) { { setPlayerAmount(playerAmount + 1) } } }}>˄</button><p>{playerAmount}</p>
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
                <button className="actionButton" onClick={() => { let tmp = 1; if (boardSize % 2 === 0) { tmp = 0; }; if (playerAmount < (boardSize * boardSize - (boardSize * tmp)) / 4) { postGame(createGame()); setIsGameDivOpen(false); } }}>Fertig</button>

            </div>)}
    </div>
}
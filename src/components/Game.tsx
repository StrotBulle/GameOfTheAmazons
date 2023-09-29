import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Board from './Board';
import Terminal from './Terminal';
import './Game.css';
import { Games, User, GamesData } from "../App";
import Swal from 'sweetalert2';

export const letters: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];


type tileStatus = "fire" | "free" | "player" | "legal";
export type playerColor = "white" | "black";
export type status = "move" | "preshoot" | "shoot";

export interface Fire {
    x: number;
    y: number;
}

export interface Player {
    id: number;
    color: playerColor;
    x: number;
    y: number;
}

export interface Tile {
    status: tileStatus;
    playerIndex?: number;
    color: string;
    x: number;
    y: number;
    index: string;
}

interface GamesReturn {
    id: number;
    maxTurnTime: number;
    players: User[];
    board: {
        rows: number;
        columns: number;
        squares: number[][];
    }
    winningPlayer: number;
    turnplayer: number;
    turns: Turn[];
}

interface Field {
    row: number;
    column: number;
}

interface Turn {
    move: {
        start: Field;
        end: Field;
    };
    shot?: Field;
}

export default function Game({ boardSize, setBoardSize, tile, setTile, player, setPlayer }: {
    boardSize: number,
    tile: Tile[][],
    setTile: React.Dispatch<React.SetStateAction<Tile[][]>>,
    player: Player[],
    setPlayer: React.Dispatch<React.SetStateAction<Player[]>>,
    setBoardSize: React.Dispatch<React.SetStateAction<number>>
}) {
    const [values, setValues] = useState<string[]>([]);
    const [gameStatus, setGameStatus] = useState<status>("move");
    const [turnState, setTurnState] = useState<playerColor>("white");
    const [activePlayerIndex, setActivePlayerIndex] = useState<number | undefined>(0);
    const [gameData, setGameData] = useState<GamesReturn>();
    const [turn, setTurn] = useState<Turn>();
    const [fire, setFire] = useState<Fire[]>([]);
    const [gameUsers, setGameUsers] = useState<User[]>([{ name: "Spieler 1", id: 0, controllable: true }, { name: "Spieler 2", id: 1, controllable: true }]);
    const [timer, setTimer] = useState(5);
    const [isGameOver, setIsGameOver] = useState(false);
    const [turnTime, setTurnTime] = useState<number>();
    const navigate = useNavigate();

    useEffect(() => {

        //Der UseEffect wird nur einmal beim Laden der Seite durchgegangen.
        //Dabei soll das jeweilige Spiel von der API angefordert werden
        const fetchData = async () => {

            //URL bekommen über die window.location.pathname und simplen Regex
            const gameNumber = /Game\/(\d+)/; 
            const match = window.location.pathname.match(gameNumber); 
            const gameId = match![1]; 
            const url = `https://gruppe12.toni-barth.com/games/${gameId}`;

            try {
                const response = await fetch(url);
                const newData = await response.json();
                setGameData(newData);
                setBoardSize(newData.board.squares.length)
                setGameUsers([newData.players[0], newData.players[1]]);

                //Befüllen der Arrays "player" und "fire"
                const newPlayer: Player[] = [];
                const newFire: Fire[] = []
                for (let i = 0; i < newData.board.squares.length; i++) {
                    for (let j = 0; j < newData.board.squares.length; j++) {
                        switch (newData.board.squares[i][j]) {
                            case -1:
                                //free
                                break;
                            case -2:
                                //fire
                                newFire.push({ x: i, y: j });
                                break;
                            case 0:
                                //black
                                newPlayer.push({ id: newPlayer.length, color: "black", x: i, y: j });
                                break;
                            case 1:
                                //white
                                newPlayer.push({ id: newPlayer.length, color: "white", x: i, y: j });
                                break;
                        }
                    }
                }


                //hier werden nach dem ersten Befüllen von "player", die einzelnen Einträge verändert, wenn sie in einen der "turns" verändert wurden.
                //Das Spiel wird dabei quasi "nachgespielt"
                for (let i = 0; i < newData.turns.length; i++) {
                    const index = newPlayer.findIndex(item => item.x === newData.turns[i].move.start.row && item.y === newData.turns[i].move.start.column);
                    newPlayer[index] = { id: newPlayer[index].id, x: newData.turns[i].move.end.row as number, y: newData.turns[i].move.end.column as number, color: newPlayer[index].color };
                    newFire.push({ x: newData.turns[i].shot?.row as number, y: newData?.turns[i].shot?.column as number });
                }

                setPlayer([...newPlayer]);
                setFire([...newFire]);

                //setzen des Timers
                setTurnTime(newData?.maxTurnTime / 1000);
                setTimer(newData?.maxTurnTime / 1000);

            } catch (error) {
                console.error('Error fetching data:', error);
            }


        };

        fetchData();
    }, []);

    useEffect(() => {
        //hier wird die Logik des Timers definiert
        let timerId: NodeJS.Timeout | undefined = undefined;

        if (timer > 0 && !isGameOver && timerId === undefined) {
            timerId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsGameOver(true);
        }

        if (isGameOver && timerId !== undefined) {
            clearInterval(timerId);
        }

        return () => {
            if (timerId !== undefined) {
                clearInterval(timerId);
            }
        };
    }, [timer, isGameOver]);

    useEffect(() => {
        setTimer(turnTime!);
    }, [turnState])

    useEffect(() => {
        if (gameData) {
            renderBoard();
        }
    }, [gameData]);


    //die Funktion "postTurnData" posted den jeweiligen "turn" an die API
    //Leider ist die Funktion noch nicht einsatzbereit, da wir ständig einen ErrorCode von 400 bekommen
    function postTurnData(turn: Turn, userId: number) {
        const gameNumber = /Game\/(\d+)/;
        const match = window.location.pathname.match(gameNumber);
        const gameId = match![1];
        const url = `https://gruppe12.toni-barth.com/move/${gameUsers[userId].id}/${gameId}`;
        console.log(JSON.stringify(turn));

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(turn),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((data) => data.json())
            .then((json) => console.log(json))
            .catch((error) => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Fehler beim Löschen des Spieles',
                    text: 'Fehler-Code 400'
                });
            });
    }

    //Die Funktion "renderBoard" rendert das Spielbrett, wobei es die vorher befüllten Arrays "player" und "fire" benutzt
    function renderBoard() {

        let nextTile: Tile[][] = [[]];

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                //Befüllen mit "Free"-Feldern
                if (i >= nextTile.length) {
                    const newArray = [...nextTile, []];
                    nextTile = newArray;
                }
                nextTile[i].push({ status: "free", x: j, y: i, color: "", index: letters[i] + (j + 1) });


                //Befüllen mit "Fire"-Feldern
                for (let k = 0; k < fire.length; k++) {
                    if (fire[k].y === i && fire[k].x === j) {
                        nextTile[i][j].status = "fire";
                    }
                }
                //Befüllen mit "Player"-Feldern
                for (let k = 0; k < player.length; k++) {
                    if (player[k].y === i && player[k].x === j) {
                        nextTile[i][j].status = "player";
                        nextTile[i][j].playerIndex = k;
                    }
                }

                //Prüfen, welche Felder schwarz und welche weiß sein sollen
                if ((i + j) % 2 === 0) {
                    nextTile[i][j].color = "tile-white";
                }
                else {
                    nextTile[i][j].color = "tile-black";
                }
            }
        }

        setTile([...nextTile]);
    }

    //Die Funktion "showPath" setzt alle Felder, die ein Spieler anspielen darf auf "Legal"
    function showPath(currentTile: Tile) {

        //Alle potentiellen vorher gesetzten "Legal"-Felder wieder auf "Free" setzen
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (tile[i][j].status === "legal") {
                    tile[i][j].status = "free";
                }
            }
        }

        setActivePlayerIndex(currentTile.playerIndex);

        let i = 1;
        //down
        while (currentTile.y + i < boardSize && tile[currentTile.y + i][currentTile.x].status === "free") {
            tile[currentTile.y + i][currentTile.x].status = "legal";
            i++;
        }
        i = 1;
        //up
        while (currentTile.y - i >= 0 && tile[currentTile.y - i][currentTile.x].status === "free") {
            tile[currentTile.y - i][currentTile.x].status = "legal";
            i++;
        }
        i = 1;
        //right
        while (currentTile.x + i < boardSize && tile[currentTile.y][currentTile.x + i].status === "free") {
            tile[currentTile.y][currentTile.x + i].status = "legal";
            i++;
        }
        i = 1;
        //left
        while (currentTile.x - i >= 0 && tile[currentTile.y][currentTile.x - i].status === "free") {
            tile[currentTile.y][currentTile.x - i].status = "legal";
            i++;
        }
        i = 1;
        //diagonal left down
        while (currentTile.x - i >= 0 && currentTile.y - i >= 0 && tile[currentTile.y - i][currentTile.x - i].status === "free") {
            tile[currentTile.y - i][currentTile.x - i].status = "legal";
            i++;
        }
        i = 1;
        //diagonal right down
        while (currentTile.x + i < boardSize && currentTile.y - i >= 0 && tile[currentTile.y - i][currentTile.x + i].status === "free") {
            tile[currentTile.y - i][currentTile.x + i].status = "legal";
            i++;
        }
        i = 1;
        //diagonal left up
        while (currentTile.x - i >= 0 && currentTile.y + i < boardSize && tile[currentTile.y + i][currentTile.x - i].status === "free") {
            tile[currentTile.y + i][currentTile.x - i].status = "legal";
            i++;
        }
        i = 1;
        //diagonal right up
        while (currentTile.x + i < boardSize && currentTile.y + i < boardSize && tile[currentTile.y + i][currentTile.x + i].status === "free") {
            tile[currentTile.y + i][currentTile.x + i].status = "legal";
            i++;
        }

        // Wechsel des Gamestatus'
        if (gameStatus === "preshoot") {
            setGameStatus("shoot");

            console.log(gameStatus);

            displayGameStatus("shoot", turnState);
        }

        setTile([...tile]);
    }

    //Due Funktion "action" regelt den Ablauf der "turns"
    function action(currentPlayer: Player, currentTile: Tile) {

        //Wechsel gamesate auf preshoot und Ausführung move
        if (gameStatus === "move") {
            move(currentPlayer, currentTile);
            setGameStatus("preshoot");
        }

        //Ausführung shoot und Wechsel auf move
        if (gameStatus === "shoot") {
            shoot(currentTile);
            if (turnState === "white") {
                setTurnState("black");
                displayGameStatus("move", "black")
                postTurnData(turn!, 1);
            }
            else {
                setTurnState("white");
                displayGameStatus("move", "white")
                postTurnData(turn!, 0);
            }

            setGameStatus("move");
        }
    }

    //Bewegt den Spieler von seiner Start- zu seiner Zielposition
    function move(playerToMove: Player, currentTile: Tile) {

        //ursprügliches tile wird free gesetzt
        tile[playerToMove.x][playerToMove.y].status = "free";
        player[playerToMove.id] = { id: playerToMove.id, color: playerToMove.color, x: currentTile.x, y: currentTile.y };
        //neues tile wird auf player gesetzt
        tile[playerToMove.x][playerToMove.y].status = "player";

        let index = 1;
        const fieldMoveOld: Field = { row: playerToMove.x, column: playerToMove.y };
        const fieldMoveNew: Field = { row: currentTile.x, column: currentTile.y };
        if (playerToMove.color === "black") {
            index = 0;
        }

        setTurn({ move: { start: fieldMoveOld, end: fieldMoveNew } });

        //Ausgabe des Zuges in der Konsole nochmal sichtbar
        setValues([...values, "p" + (activePlayerIndex as number + 1) + letters[currentTile.x] + (currentTile.y + 1)]);
        //neues Rendern des Boards
        renderBoard();
    }

    //Regelt die Logik des Verschießens des Pfeiles
    function shoot(currentTile: Tile) {
        //neues Feuer hinzufügen
        fire.push({ x: currentTile.x, y: currentTile.y });
        const fieldShot: Field = { row: currentTile.x, column: currentTile.y };
        turn!.shot = fieldShot;

        //Ausgabe des Zuges in der Konsole nochmal sichtbar
        setValues([...values, "p" + (activePlayerIndex as number + 1) + letters[currentTile.x] + (currentTile.y + 1)]);

        renderBoard();
    }


    //"checkWinCondition" prüft, ob ein Spieler noch ziehen kann. Wenn ein Spieler nicht mehr ziehen kann, verliert dieser.
    function checkWinCondition() {
        let tmp = 0;
        for (let k = 0; k < player.length; k++) {
            if (player[k].color === turnState) {
                let j = player[k].x;
                let i = player[k].y;
                if ((
                    (j + 1 <= boardSize - 1 && tile[i][j + 1].status === "free") ||
                    (j - 1 >= 0 && tile[i][j - 1].status === "free") ||
                    (i + 1 <= boardSize - 1 && tile[i + 1][j].status === "free") ||
                    (i - 1 >= 0 && tile[i - 1][j].status === "free") ||
                    (j + 1 <= boardSize - 1 && i + 1 <= boardSize - 1 && tile[i + 1][j + 1].status === "free") ||
                    (j + 1 <= boardSize - 1 && i - 1 >= 0 && tile[i - 1][j + 1].status === "free") ||
                    (j - 1 >= 0 && i - 1 >= 0 && tile[i - 1][j - 1].status === "free") ||
                    (j - 1 >= 0 && i + 1 <= boardSize - 1 && tile[i + 1][j - 1].status === "free")) ||
                    (j + 1 <= boardSize - 1 && tile[i][j + 1].status === "legal") ||
                    (j - 1 >= 0 && tile[i][j - 1].status === "legal") ||
                    (i + 1 <= boardSize - 1 && tile[i + 1][j].status === "legal") ||
                    (i - 1 >= 0 && tile[i - 1][j].status === "legal") ||
                    (j + 1 <= boardSize - 1 && i + 1 <= boardSize - 1 && tile[i + 1][j + 1].status === "legal") ||
                    (j + 1 <= boardSize - 1 && i - 1 >= 0 && tile[i - 1][j + 1].status === "legal") ||
                    (j - 1 >= 0 && i - 1 >= 0 && tile[i - 1][j - 1].status === "legal") ||
                    (j - 1 >= 0 && i + 1 <= boardSize - 1 && tile[i + 1][j - 1].status === "legal")) {
                }
                else {
                    tmp++;
                }
            }
        }
        if (tmp === player.length / 2) {
            setIsGameOver(true);
        }
    }

    function displayGameStatus(currentGameState: status, currentTurnState: playerColor) {
        setValues([...values, `${currentGameState} ${currentTurnState}-player!`])
    }


    //Erstellung des EndScreens
    function endScreen() {
        const currentUser: User = JSON.parse(localStorage.getItem("user")!);

        if (turnState === "white" && currentUser.id === gameUsers[0].id) {
            return (
                <div>
                    Du verlierst!
                </div>
            )
        }
        else {
            return (
                <div>
                    Du gewinnst!
                </div>
            )
        }
    }

    //löscht das Spiel
    function deleteGame() {
        const gameNumber = /Game\/(\d+)/;
        const match = window.location.pathname.match(gameNumber);
        const gameId = match![1];
        navigate('../');
        const url = `https://gruppe12.toni-barth.com/games/${gameId}`;
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

    return (
        <div>
            {isGameOver && (
                <div className="popup">
                    <div className="popup-content">
                        {endScreen()}
                        <button className="actionButton" onClick={() => { deleteGame() }}>Ok</button>
                    </div>
                </div>

            )}
            <div className={isGameOver ? "blurred" : "container"}>
                <div className="boxRow" aria-label="Liste von Befehlen">
                    <div>
                        <p>/help </p>
                        <p>/home </p>
                        <p>/surrender </p>
                        <p>/time </p>
                        <p>/giveTime </p>
                        <p>/p </p>
                    </div>
                </div>

                <div className="boxColumn" aria-label="Spielbrett">
                    <div className="playerDisplay">
                        {gameUsers![1].name}
                    </div>
                    <div>
                        {<Board gameStatus={gameStatus} turnState={turnState} setTurnState={setTurnState}
                            player={player} tile={tile} activePlayerIndex={activePlayerIndex} showPath={showPath} checkWinCondition={checkWinCondition}
                            action={action} displayGameStatus={displayGameStatus} boardSize={boardSize} />}
                    </div>
                    <div className="playerDisplay">
                        {gameUsers![0].name}
                    </div>
                    <div>Verbleibende Zeit: {timer}</div>

                </div>

                <div className="boxRow" aria-label="Konsole">{<Terminal values={values} setValues={setValues} turnState={turnState} setTurnState={setTurnState}
                    showPath={showPath} action={action} tile={tile} player={player} activePlayerIndex={activePlayerIndex} gameStatus={gameStatus} boardSize={boardSize}
                    timer={timer} setTimer={setTimer} setIsGameOver={setIsGameOver} />}</div>
            </div>

        </div>
    )
}
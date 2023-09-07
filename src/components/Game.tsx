import React, { useEffect, useState } from "react";
import Board from './Board';
import Terminal from './Terminal';
import './Game.css';

export const letters: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
export const boardWidth = 6;
export const boardHeight = 6;

type tileStatus = "fire" | "free" | "player" | "legal";
export type playerColor = "white" | "black";
export type status = "move" | "preshoot" | "shoot";

interface Fire {
    x: number;
    y: number;
}

export interface Player {
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

const fire: Fire[] = [];

export default function Game(){
    const [values, setValues] = useState<string[]>([]);
    const [gameStatus, setGameStatus] = useState<status>("move");
    const [turnState, setTurnState] = useState<playerColor>("white");
    const [player, setPlayer] = useState<Player[]>([{ color: "white", y: 5, x: 1 }, { color: "white", y: 5, x: 4 }, { color: "black", y: 0, x: 1 }, { color: "black", y: 0, x: 4 }]);
    const [tile, setTile] = useState<Tile[][]>([[], [], [], [], [], []]);
    const [activePlayerIndex, setActivePlayerIndex] = useState<number | undefined>(0);


    function renderBoard() {

        const nextTile: Tile[][] = [[], [], [], [], [], []]

        for (let i = 0; i < boardWidth; i++) {
            for (let j = 0; j < boardHeight; j++) {
                nextTile[i].push({ status: "free", x: j, y: i, color: "", index: letters[i] + (j + 1) })

                //FireCreation
                for (let k = 0; k < fire.length; k++) {
                    if (fire[k].y === i && fire[k].x === j) {
                        nextTile[i][j].status = "fire";
                    }
                }
                //PlayerCreation
                for (let k = 0; k < player.length; k++) {
                    if (player[k].y === i && player[k].x === j) {
                        nextTile[i][j].status = "player";
                        nextTile[i][j].playerIndex = k;
                    }
                }

                //BoardCreation
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


    function showPath(currentTile: Tile) {


        //clear
        for (let i = 0; i < boardWidth; i++) {
            for (let j = 0; j < boardHeight; j++) {
                if (tile[i][j].status === "legal") {
                    tile[i][j].status = "free";
                }
            }
        }

        //possibleMovesAmount = 0;

        setActivePlayerIndex(currentTile.playerIndex);

        let i = 1;
        //down
        while (currentTile.y + i < 6 && tile[currentTile.y + i][currentTile.x].status === "free") {
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
        while (currentTile.x + i < 6 && tile[currentTile.y][currentTile.x + i].status === "free") {
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
        while (currentTile.x + i < 6 && currentTile.y - i >= 0 && tile[currentTile.y - i][currentTile.x + i].status === "free") {
            tile[currentTile.y - i][currentTile.x + i].status = "legal";
            i++;
        }
        i = 1;
        //diagonal left up
        while (currentTile.x - i >= 0 && currentTile.y + i < 6 && tile[currentTile.y + i][currentTile.x - i].status === "free") {
            tile[currentTile.y + i][currentTile.x - i].status = "legal";
            i++;
        }
        i = 1;
        //diagonal right up
        while (currentTile.x + i < 6 && currentTile.y + i < 6 && tile[currentTile.y + i][currentTile.x + i].status === "free") {
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
            }
            else {
                setTurnState("white");
                displayGameStatus("move", "white")
            }

            setGameStatus("move");
        }
    }

    function move(playerToMove: Player, currentTile: Tile) {

        //ursprügliches tile wird free gesetzt
        tile[playerToMove.x][playerToMove.y].status = "free";
        player[activePlayerIndex as number] = { color: playerToMove.color, x: currentTile.x, y: currentTile.y };
        //neues tile wird auf player gesetzt
        tile[playerToMove.x][playerToMove.y].status = "player";

        setValues([...values, "p" + (activePlayerIndex as number + 1) + letters[currentTile.x] + (currentTile.y + 1)]);
        //neues Rendern des Boards
        renderBoard();
    }

    function shoot(currentTile: Tile) {
        //neues Feuer hinzufügen
        fire.push({ x: currentTile.x, y: currentTile.y });

        renderBoard();
    }

    function checkWinCondition() {
        let tmp = 0;
        for (let k = 0; k < player.length; k++) {
            if (player[k].color === turnState) {
                let j = player[k].x;
                let i = player[k].y;
                if ((
                    (j + 1 <= 5 && tile[i][j + 1].status === "free") ||
                    (j - 1 >= 0 && tile[i][j - 1].status === "free") ||
                    (i + 1 <= 5 && tile[i + 1][j].status === "free") ||
                    (i - 1 >= 0 && tile[i - 1][j].status === "free") ||
                    (j + 1 <= 5 && i + 1 <= 5 && tile[i + 1][j + 1].status === "free") ||
                    (j + 1 <= 5 && i - 1 >= 0 && tile[i - 1][j + 1].status === "free") ||
                    (j - 1 >= 0 && i - 1 >= 0 && tile[i - 1][j - 1].status === "free") ||
                    (j - 1 >= 0 && i + 1 <= 5 && tile[i + 1][j - 1].status === "free")) ||
                    (j + 1 <= 5 && tile[i][j + 1].status === "legal") ||
                    (j - 1 >= 0 && tile[i][j - 1].status === "legal") ||
                    (i + 1 <= 5 && tile[i + 1][j].status === "legal") ||
                    (i - 1 >= 0 && tile[i - 1][j].status === "legal") ||
                    (j + 1 <= 5 && i + 1 <= 5 && tile[i + 1][j + 1].status === "legal") ||
                    (j + 1 <= 5 && i - 1 >= 0 && tile[i - 1][j + 1].status === "legal") ||
                    (j - 1 >= 0 && i - 1 >= 0 && tile[i - 1][j - 1].status === "legal") ||
                    (j - 1 >= 0 && i + 1 <= 5 && tile[i + 1][j - 1].status === "legal")) {


                }
                else {
                    tmp++;
                }
            }
        }
        if (tmp === player.length / 2) {
            console.log("Player " + turnState + " verliert")
        }
    }

    function displayGameStatus(currentGameState: status, currentTurnState: playerColor){
        setValues([...values, `${currentGameState} ${currentTurnState}-player!`])
    }



    return(
        <div className="container">

            <div className="box" aria-label="Liste von Befehlen">Liste von Befehlen</div>

            <div className="box" aria-label="Spielbrett">{<Board gameStatus={gameStatus} turnState={turnState} setTurnState={setTurnState}
            player={player} tile={tile} activePlayerIndex={activePlayerIndex} showPath={showPath} renderBoard={renderBoard} checkWinCondition={checkWinCondition} 
            action={action} displayGameStatus={displayGameStatus}
            />}</div>

            <div className="box" aria-label="Konsole">{<Terminal values={values} setValues={setValues} turnState={turnState} setTurnState={setTurnState}
            showPath={showPath} action={action} move={move} shoot={shoot} tile={tile} player={player} activePlayerIndex={activePlayerIndex} gameStatus={gameStatus}/>}</div>
        </div>
    )
}
import React, { useEffect, useState } from "react";
import './Board.css';

const boardWidth = 6;
const boardHeight = 6;

type tileStatus = "fire" | "free" | "player" | "legal";
type playerColor = "white" | "black";
type status = "move" | "preshoot" | "shoot";


interface Fire {
    x: number;
    y: number;
}

const fire:Fire[] = [];

export default function Board() {
    var possibleMovesAmount:number;

    const [gameStatus, setGameStatus] = useState<status>("move");
    const [turnState, setTurnState] = useState<playerColor>("white");


    interface Player {
        color: playerColor;
        x: number;
        y: number;
    }
    
    const [player, setPlayer] = useState<Player[]>([{ color: "white", y: 5, x: 1 }, { color: "white", y: 5, x: 4 }, { color: "black", y: 0, x: 1 }, { color: "black", y: 0, x: 4 }]);


    interface Tile {
        status: tileStatus;
        playerIndex?: number;
        color: string;
        x: number;
        y: number;
    }

    const [tile, setTile] = useState<Tile[][]>([[], [], [], [], [], []]);

    const [activePlayerIndex, setActivePlayerIndex] = useState<number|undefined>(0);

    useEffect(() => {renderBoard();},[]);

    var tmp:number = activePlayerIndex as number;
    if(gameStatus === "preshoot"){
        showPath(tile[player[tmp].y][player[tmp].x]);
    }

     function renderBoard(){

            const nextTile:Tile[][] = [[], [], [], [], [], []]

            for(let i = 0; i < boardWidth; i++){
                for(let j = 0; j < boardHeight; j++){
                    nextTile[i].push({status: "free", x: j, y:i, color: ""})
                    //FireCreation
                    for(let k = 0; k < fire.length; k++){
                        if(fire[k].y === i && fire[k].x === j){
                            nextTile[i][j].status = "fire";
                        }
                    }
                    //PlayerCreation
                    for(let k = 0; k < player.length; k++){
                        if(player[k].y === i && player[k].x === j){
                            nextTile[i][j].status = "player";
                            nextTile[i][j].playerIndex = k;
                        }
                    }
        
                    //BoardCreation
                    if((i + j) % 2 === 0){
                        nextTile[i][j].color = "tile-white";
                    }
                    else{
                        nextTile[i][j].color = "tile-black";
                    }
                }
            }

            setTile([...nextTile]);

            // Belegung des Feldes
    }

    function showPath(currentTile: Tile){


        //clear
        for(let i = 0; i < boardWidth; i++){
            for(let j = 0; j < boardHeight; j++){
                if(tile[i][j].status === "legal"){
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
            //possibleMovesAmount++;
        }
        i = 1;
        //up
        while (currentTile.y - i >=0 && tile[currentTile.y - i][currentTile.x].status === "free") {
            tile[currentTile.y - i][currentTile.x].status = "legal";
            i++;
            //possibleMovesAmount++;
        }
        i = 1;
        //right
        while (currentTile.x + i < 6 && tile[currentTile.y][currentTile.x + i].status === "free") {
            tile[currentTile.y][currentTile.x + i].status = "legal";
            i++;
            //possibleMovesAmount++;
        }
        i = 1;
        //left
        while (currentTile.x - i >= 0 && tile[currentTile.y][currentTile.x - i].status === "free") {
            tile[currentTile.y][currentTile.x - i].status = "legal";
            i++;
            //possibleMovesAmount++;
        }
        i = 1;
        //diagonal left down
        while (currentTile.x - i >= 0 && currentTile.y - i >= 0 && tile[currentTile.y - i][currentTile.x - i].status === "free") {
            tile[currentTile.y - i][currentTile.x - i].status = "legal";
            i++;
            //possibleMovesAmount++;
        }
        i = 1;
        //diagonal right down
        while (currentTile.x + i < 6 && currentTile.y - i >= 0 && tile[currentTile.y - i][currentTile.x + i].status === "free") {
            tile[currentTile.y - i][currentTile.x + i].status = "legal";
            i++;
            //possibleMovesAmount++;
        }
        i = 1;
        //diagonal left up
        while (currentTile.x - i >= 0 && currentTile.y + i < 6 && tile[currentTile.y + i][currentTile.x - i].status === "free") {
            tile[currentTile.y + i][currentTile.x - i].status = "legal";
            i++;
            //possibleMovesAmount++;
        }
        i = 1;
        //diagonal right up
        while (currentTile.x + i < 6 && currentTile.y + i < 6 && tile[currentTile.y + i][currentTile.x + i].status === "free") {
            tile[currentTile.y + i][currentTile.x + i].status = "legal";
            i++;
            //possibleMovesAmount++;
        }

        // Wechsel des gamestaes
        if(gameStatus === "preshoot"){
            setGameStatus("shoot");
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
            if(turnState === "white"){
                setTurnState("black");
            }
            else{
                setTurnState("white");
            }

            /*
            for(let i = 0; i < player.length; i++){
                if(player[i].color == turnStateTmp){
                    showPath(tile[player[i].y][player[i].x]);
                    console.log(possibleMovesAmount);
                }
            }
            */

         setGameStatus("move");
        }
    }

    function move(playerToMove: Player, currentTile: Tile) {
        
        //ursprügliches tile wird free gesetzt
        tile[playerToMove.x][playerToMove.y].status = "free";
        player[activePlayerIndex as number] = {color: playerToMove.color, x: currentTile.x, y: currentTile.y};
        //neues tile wird auf player gesetzt
        tile[playerToMove.x][playerToMove.y].status = "player";

        //neues Rendern des Boards
        renderBoard();
    }

    function shoot( currentTile: Tile) {
        //neues Feuer hinzufügen
        fire.push({x: currentTile.x, y: currentTile.y});

        renderBoard();
    }

    return <div id="board">{tile.map((row, i) => row.map((field,j) => {
        var colorPlayerIndex:number = tile[i][j].playerIndex as number;
        var tmp:number = activePlayerIndex as number;

        switch(tile[i][j].status){
            case "player":{

                if((
                    (j+1 <= 5 && tile[i][j+1].status === "free") || 
                    (j-1 >= 0 && tile[i][j-1].status === "free") ||
                    (i+1 <= 5 && tile[i+1][j].status === "free") ||
                    (i-1 >= 0 && tile[i-1][j].status === "free") ||
                    (j+1 <= 5 && i+1 <= 5 && tile[i+1][j+1].status === "free") ||
                    (j+1 <= 5 && i-1 >= 0 && tile[i-1][j+1].status === "free") ||
                    (j-1 >= 0 && i-1 >= 0 && tile[i-1][j-1].status === "free") ||
                    (j-1 >= 0 && i+1 <= 5 && tile[i+1][j-1].status === "free"))||
                    (j+1 <= 5 && tile[i][j+1].status === "legal") || 
                    (j-1 >= 0 && tile[i][j-1].status === "legal") ||
                    (i+1 <= 5 && tile[i+1][j].status === "legal") ||
                    (i-1 >= 0 && tile[i-1][j].status === "legal") ||
                    (j+1 <= 5 && i+1 <= 5 && tile[i+1][j+1].status === "legal") ||
                    (j+1 <= 5 && i-1 >= 0 && tile[i-1][j+1].status === "legal") ||
                    (j-1 >= 0 && i-1 >= 0 && tile[i-1][j-1].status === "legal") ||
                    (j-1 >= 0 && i+1 <= 5 && tile[i+1][j-1].status === "legal")){

                        console.log("frei")
                    }
                    else{
                        if(turnState === "black"){
                            console.log("white" + " verliert");
                        }
                        if(turnState === "white"){
                            console.log("black" + " verliert");
                        }
                    }

                if((player[colorPlayerIndex].color === turnState && gameStatus === "move") ||
                (player[colorPlayerIndex].color === turnState && gameStatus === "shoot" && colorPlayerIndex === activePlayerIndex)){
                    return <div key={`${i}-${j}`} className={tile[i][j].color}>{tile[i][j].status}
                    <button className={"player-" + player[colorPlayerIndex].color} 
                    onClick={() => showPath(tile[i][j])}></button></div>
                }
                else{
                    return <div key={`${i}-${j}`} className={tile[i][j].color}>{tile[i][j].status}
                    <button className={"player-" + player[colorPlayerIndex].color}></button></div>
                }
                
            }
            case "free":{
                return <div key={`${i}-${j}`} className={tile[i][j].color}>{tile[i][j].status}</div>
            }
            case "fire":{
                return <div key={`${i}-${j}`} className={tile[i][j].color}>{tile[i][j].status}<img className="fire" src="assets/Fire.png.png"></img></div>
            }
            case "legal":{
                return <div key={`${i}-${j}`} className={tile[i][j].color}>{tile[i][j].status}
                    <button className="pathButtons" onClick={() => action(player[tmp], tile[i][j])}></button></div>
            }
            return <></>
            }
    }))}<br/><span>{gameStatus} {turnState}-player!</span></div>
}


// Cursor Parkplatz -------><-------







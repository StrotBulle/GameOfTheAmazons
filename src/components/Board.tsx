import React, { useEffect } from "react";
import './Board.css';
import { letters, playerColor, status, Player, Tile } from "./Game";

export default function Board({ gameStatus, turnState, player, tile, activePlayerIndex, showPath, checkWinCondition, action, displayGameStatus, boardSize }: {
    gameStatus: status,
    turnState: playerColor, setTurnState: React.Dispatch<React.SetStateAction<playerColor>>,
    tile: Tile[][],
    player: Player[],
    activePlayerIndex: number | undefined,
    showPath: (tile: Tile) => void,
    checkWinCondition: () => void,
    action: (currentPlayer: Player, currentTile: Tile) => void,
    displayGameStatus: (currentGameState: status, currentTurnState: playerColor) => void,
    boardSize: number;
}) {

    //Start
    useEffect(() => { displayGameStatus("move", "white"); }, []);

    //Zeigen des erlaubten Paths, wenn Figur bewegt wurde
    useEffect(() => {
        if (gameStatus === "preshoot") {
            showPath(tile[player[activePlayerIndex as number].y][player[activePlayerIndex as number].x]);
        }
    }, [gameStatus])

    //Spielgröße in CSS formatieren
    const columCount = boardSize;
    document.documentElement.style.setProperty('--column-count', columCount.toString());

    return <div id="board">{tile.map((row, i) => row.map((field, j) => {
        var colorPlayerIndex: number = tile[i][j].playerIndex as number;
        var tmp: number = activePlayerIndex as number;

        switch (tile[i][j].status) {
            case "player": {

                checkWinCondition();
                if ((player[colorPlayerIndex].color === turnState && gameStatus === "move") ||
                    (player[colorPlayerIndex].color === turnState && gameStatus === "shoot" && colorPlayerIndex === activePlayerIndex)) {
                    return <div key={`${i}-${j}`} className={tile[i][j].color} aria-label={`${tile[i][j].status} ${tile[i][j].index}`}>
                        <button className={"player-" + player[colorPlayerIndex].color}
                            onClick={() => showPath(tile[i][j])}>{(tile[i][j].playerIndex as number + 1)}</button></div>
                }
                else {
                    return <div key={`${i}-${j}`} className={tile[i][j].color} aria-label={`${tile[i][j].status} ${tile[i][j].index}`}>
                        <button className={"player-" + player[colorPlayerIndex].color}>{(tile[i][j].playerIndex as number + 1)}</button></div>
                }

            }
            case "free": {
                return <div key={`${i}-${j}`} className={tile[i][j].color} aria-label={`${tile[i][j].status} ${tile[i][j].index}`}>{letters[j] + (i + 1)}</div>
            }
            case "fire": {
                return <div key={`${i}-${j}`} className={tile[i][j].color} aria-label={`${tile[i][j].status} ${tile[i][j].index}`}><img className="fire" src='./assets/fire.png' /></div>
            }
            case "legal": {
                return <div key={`${i}-${j}`} className={tile[i][j].color} aria-label={`${tile[i][j].status} ${tile[i][j].index}`}>
                    <button className="pathButtons" onClick={() => { console.log(player[tmp]); action(player[tmp], tile[i][j]) }}></button></div>
            }
        }

    }))}</div>
}


// Cursor Parkplatz -------><-------








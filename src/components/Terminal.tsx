import React, { useEffect, useState } from "react";
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import './Terminal.css';
import { playerColor, Tile, Player, letters, status} from "./Game";


export default function Terminal({values, setValues, turnState, setTurnState, showPath, action, move, shoot, tile, player, activePlayerIndex, gameStatus, setActivePlayerIndex, boardSize}:{
  values: string[], setValues: React.Dispatch<React.SetStateAction<string[]>>,
  turnState: playerColor, setTurnState: React.Dispatch<React.SetStateAction<playerColor>>,
  showPath: (currentTile: Tile) => void,
  action: (currentPlayer: Player, currentTile: Tile) => void,
  move: (playerToMove: Player, currentTile: Tile) => void,
  shoot: (currentTile: Tile) => void,
  tile: Tile[][],
  player: Player[],
  activePlayerIndex: number| undefined,
  gameStatus: status,
  setActivePlayerIndex: React.Dispatch<React.SetStateAction<number | undefined>>,
  boardSize: number;
}){

    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState<string>(''); 
    const [listClassName, setListClassName] = useState<string>("success");

    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    };

    const handleInputSubmit = (event: any) => {
      setListClassName("success");
        if (event.key === 'Enter') {

          const regexMove = new RegExp("p" + "[1-" + (player.length + 1) + "]" + "[a-" + letters[boardSize] + "][1-" + boardSize + "]"); 
          let terminalMessage: string = "";

          if(inputValue === "/help"){
            navigate('../help');
          }
          else if(inputValue === "/planb"){
            window.location.href = 'https://www.hs-anhalt.de/studieren/im-studium/formalitaeten/exmatrikulation.html';
          }
          else if(inputValue === "/surrender"){
            //gameEnd(turnstate);
          }
          else if(inputValue === "/time"){
            terminalMessage = "Geh ins Bett!"
          }
          else if(inputValue === "/giveTime"){
            //time += 10;
          } 
          else if(inputValue.match(regexMove)){
            const playerTmp: Player = player[parseInt(inputValue.charAt(1)) - 1];
          
            if(playerTmp.color === turnState && (gameStatus !== "shoot" || parseInt(inputValue.charAt(1)) - 1 === activePlayerIndex)){
              showPath(tile[playerTmp.y][playerTmp.x]);
              if(tile[parseInt(inputValue.charAt(3)) - 1][letters.indexOf(inputValue.charAt(2))].status === "legal"){

                action(playerTmp, tile[parseInt(inputValue.charAt(3)) - 1][letters.indexOf(inputValue.charAt(2))]);
              }
              else{
                setListClassName("error");
                terminalMessage = "Feld ist nicht anspielbar!";
              }
            }
            else{
              setListClassName("error");
              terminalMessage = "Spieler ist nicht am Zug!";
            }
          }
          else{
            setListClassName("error");
            terminalMessage = "Fehler";
          }

          setValues([...values, inputValue, terminalMessage]);
         
          setInputValue('');
        }  
    };

    return(
        <div>
            <div className="terminalScreen" aria-label="Konsole"> 
                <ul>
                    {values.map((value, index) => (
                        <li key={index} className={listClassName}>{value}</li>
                 ))}
                </ul>
            </div>
            
            <input className="inputField" aria-label="Konsoleneingabe"
                type="text"
                value={inputValue.toLowerCase().trim()}
                onChange={handleInputChange}
                onKeyDown={handleInputSubmit}
                placeholder="Gib hier etwas ein"
            />
        </div>
    )
}
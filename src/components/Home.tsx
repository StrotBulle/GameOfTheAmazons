import React, { useEffect, useState } from "react";
import './Home.css';

export default function Home(){
    const [inputName, setInputName] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [playerAmount, setPlayerAmount] = useState(2);
    const [boardLength, setBoardLength] = useState(6);
    const [maxTurnTime, setMaxTurnTime] = useState(60000);  

    const handleInputName = (event: any) => {
        setInputName(event.target.value);
    };

    const handleInputPassword = (event: any) => {
        setInputPassword(event.target.value);
    };

    return <div>
        <h1>Game of the Amazons</h1>
        <button className="createButton">Neues Spiel</button>
        <div className="terminalContainer">
            <div className="terminalContainerInner">
                <div className="terminalBox">Spielname:</div>
                <div className="terminalBox">Passwort:</div>
                <div className="terminalBox">Brettgröße:</div>
                <div className="terminalBox">SpielerAnzahl:</div>
                <div className="terminalBox">Zeit pro Zug:</div>
            </div>
            <div className="terminalContainerInner">
                <div className="terminalBox">
                    <input className="input" aria-label="Spielname"
                    type="text"
                    value={inputName.trim()}
                    onChange={handleInputName}
                    placeholder="Spielname"
                /></div> 
                <div className="terminalBox">
                <input className="input" aria-label="Passwort"
                    type="text"
                    value={inputPassword.toLowerCase().trim()}
                    onChange={handleInputPassword}
                    placeholder="Passwort"
                /></div> 
                <div className="terminalBox">
                    <button className="valueButton" onClick={() => {if(boardLength < 26){setBoardLength(boardLength + 1)}}}>˄</button><p>{boardLength}</p>
                    <button className="valueButton" onClick={() => {if(boardLength > 2){setBoardLength(boardLength - 1)}}}>˅</button></div> 
                <div className="terminalBox">
                    <button className="valueButton" onClick={() => {if(playerAmount < (boardLength * boardLength)/2){setPlayerAmount(playerAmount + 1)}}}>˄</button><p>{playerAmount}</p>
                    <button className="valueButton" onClick={() => {if(playerAmount > 0){setPlayerAmount(playerAmount - 1)}}}>˅</button></div>
                <div className="terminalBox">
                    <button className="valueButton" onClick={() => {if(true){setMaxTurnTime(maxTurnTime + 5000)}}}>˄</button><p>{maxTurnTime/1000}</p>
                    <button className="valueButton" onClick={() => {if(maxTurnTime > 0){setMaxTurnTime(maxTurnTime - 5000)}}}>˅</button></div> </div> 
        </div>
    </div>
}
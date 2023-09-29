import React, { useEffect, useState } from "react";
import './Help.css';

export default function Help(){
    return( 
        <div id="help">
            <h1>Game of the Amazons</h1>
            <h2>Hilfe</h2>
            <div className="helpContainer">
                <div>
                    <h3>Spielprinzip</h3>
                    <p>Die Spieler ziehen abwechselnd, Weiß beginnt. Jeder Zug besteht aus zwei Teilen: Zuerst wird eine eigene Amazone auf ein leeres benachbartes Feld oder über mehrere leere Felder in orthogonaler oder diagonaler Richtung gezogen, genau wie eine Dame beim Schach. Sie darf dabei kein Feld überqueren oder betreten, das bereits von einer eigenen oder gegnerischen Amazone oder einem Pfeil (Feuer) besetzt ist. Anschließend verschießt die gezogene Amazone vom Endpunkt ihres Zuges aus einen „flammenden“ Pfeil (Feuer) auf ein anderes Feld. Dieser Pfeil kann in jede orthogonale oder diagonale Richtung beliebig weit fliegen, also wiederum wie eine Dame beim Schach. Er darf auch rückwärts in Richtung des Feldes geschossen werden, von dem aus die Amazone gerade gezogen hat. Ein Pfeil darf jedoch kein Feld überqueren oder auf einem Feld landen, wo sich bereits ein anderer Pfeil oder eine Amazone befindet. Es besteht Zugpflicht: der Spieler am Zug muss stets eine Amazone ziehen und einen Pfeil verschießen. Verloren hat der Spieler, der als Erster nicht mehr ziehen kann.</p>
                </div>
                <div>
                    <h3>Koordination</h3>
                    <p>Auf der Startseite (/) kann nach erfolgreicher Anmeldung einem Spiel beigetreten werden. Wenn man bei der Erstellung des Spieles, diesem zugewiesen wurde, kann man die Figuren, der einem zugewiesenen Farbe, steuern. Ein Klick auf einen der Spielsteine zeigt sämtliche anspielbaren Felder der Spielsteines durch kleine graue Punkte an. Ein weiterer Klick auf einen der grauen Punkte, bewegt den ausgewählten Spielstein oder, je nach Zugstatus, erzeugt ein Feuer auf dem angeklickten Feld. Die Züge und der jeweilige Zugstatus sind im Terminal rechts neben dem Spielfeld dokumentiert. Sämtliche Interaktionen mit den Spielsteinen sind auch per Tastatureingabe im Terminal möglich. Tippen Sie dafür den gewünschten Befehl in das Terminal und drücken Sie die "Enter-Taste". Sämtliche Befehle sind unter "Befehle" gelistet.</p>
                </div>
                <div>
                    <h3>Befehle</h3>
                    <div className="commandContainerInner">
                        <div>
                            <p className="command">/help: </p>
                            <p className="command">/home: </p>
                            <p className="command">/surrender: </p>
                            <p className="command">/time: </p>
                            <p className="command">/giveTime: </p>
                            <p className="command">/p: </p>
                        </div>
                        <div>
                            <p>Sprung zur "Hilfe"-Seite</p>
                            <p>Sprung zur Start-Seite</p>
                            <p>Aufgeben des Spiels (führt zum automatischen Sieg des gegnerischen Spielers)</p>
                            <p>Gibt die Ihnen noch verfügbare Zeit für Ihren Zug aus</p>
                            <p>Gibt dem gegnerischen Spieler 10 Sekunden mehr Bedenkzeit für seinen Zug</p>
                            <p>Steuert den Spielstein (bspw: "/p1a1": Spielstein 1 wird auf das Feld A1 gesetzt)</p>
                        </div>
                    </div>
                </div>   
            </div>
        </div>
    
    
    );
}
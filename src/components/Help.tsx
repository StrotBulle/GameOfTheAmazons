import React, { useEffect, useState } from "react";
import './Help.css';

export default function Help(){
    return( 
        <div id="help">
            <h1>Ob du dumm bist...</h1>
            <p>Die Spieler ziehen abwechselnd, Weiß beginnt. Jeder Zug besteht aus zwei Teilen: Zuerst wird eine eigene Amazone auf ein leeres benachbartes Feld oder über mehrere leere Felder in orthogonaler oder diagonaler Richtung gezogen, genau wie eine Dame beim Schach. Sie darf dabei kein Feld überqueren oder betreten, das bereits von einer eigenen oder gegnerischen Amazone oder einem Pfeil (Blockadestein) besetzt ist. Anschließend verschießt die gezogene Amazone vom Endpunkt ihres Zuges aus einen „giftigen“ Pfeil (Blockadestein) auf ein anderes Feld. Dieser Pfeil kann in jede orthogonale oder diagonale Richtung beliebig weit fliegen, also wiederum wie eine Dame beim Schach. Er darf auch rückwärts in Richtung des Feldes geschossen werden, von dem aus die Amazone gerade gezogen hat. Ein Pfeil darf jedoch kein Feld überqueren oder auf einem Feld landen, wo sich bereits ein anderer Pfeil oder eine Amazone befindet. Es besteht Zugpflicht: der Spieler am Zug muss stets eine Amazone ziehen und einen Pfeil verschießen. Verloren hat der Spieler, der als Erster nicht mehr ziehen kann.</p>
        </div>
    
    
    );
}
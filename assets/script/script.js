/*
x. powerups: gained with every win, winstreaks, combos, losingstreaks, 2 with winning within 3/4 moves
- random reward or allow user to pick? can they be stacked? or can you only have 1?
- with 1 player, have the AI be theoretically lossless, but only the player gets the powerups
- destroy opponent's marker, does it use up your turn, i guess it can't or that'd be worthless, unless you could stack powerups and use more than one
- extra move
x. explosions on move
x. little musical refrains when clicking things and moving mouse
x. fanfare on player win
x. sad otter on comp win
*/
initGame();

function Ask(ask, result1, result2) {
    this.ask = ask;
    this.result1 = result1;
    this.result2 = result2;
}

function initGame() {
    let askOpponent = `Versus: <span id="option1" class="option">Human</span> | <span id="option2" class="option">Computer</span>`;
    getInput(askOpponent);
}

function getInput(ask) {
    //maybe I can just display the ask, not have an interval, and successively change the click events
    let info = document.getElementById("info");
    info.innerHTML = ask;
    //start wait interval
    //both option clicks will
    //- include a clearInterval
    //- set a global variable
    //- 
}
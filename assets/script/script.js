/*
x. powerups: gained with every win, winstreaks, combos, losingstreaks, 2 with winning within 3/4 moves
- random reward or allow user to pick? can they be stacked? or can you only have 1?
- with 1 player, have the AI be theoretically lossless, but only the player gets the powerups
- destroy opponent's marker, does it use up your turn, i guess it can't or that'd be worthless, unless you could stack powerups and use more than one
- extra move
- steal a win, a circular button appears between the two scores, animated spin while removing 1 from opp and adding to player
x. explosions on move
x. little musical refrains when clicking things and moving mouse
x. fanfare on player win
x. sad otter on comp win
x. first to win 10 gets the Ultra win, or perhaps lower and there can be higher levels of wins that give you an extra win or power up (user choice)
x. player name
x. user experience component? maybe instead of wins..probably not
*/
let infoElem = document.getElementById("info"),
    questionElem = document.getElementById("question"),
    option1Elem = document.getElementById("option1"),
    option2Elem = document.getElementById("option2"),
    player1 = new Player("human"),
    ask,
    askComponents = [
        ["Versus", "Human", "Computer", () => player2 = new Player("human"), () => player2 = new Player("computer")],
        ["Player 1", "Xs", "Os", () => player1.marker = (player2.marker = "o", "x"), () => player1.marker = (player2.marker = "x", "o")]
    ];

initGame();

function Player(type) {
    this.type = type;
    this.marker;
}

function Ask(question, option1, option2, result1, result2) {
    this.question = question;
    this.option1 = option1;
    this.option2 = option2;
    this.result1 = result1;
    this.result2 = result2;
}

function initGame() {
    getInputs();
}

function getInputs() {
    if (!askComponents.length) {
        console.dir(player1);
        console.dir(player2);
        infoElem.innerHTML = "";
        return;
    }
    ask = new Ask(...askComponents.shift());
    showAsk(ask);
}

function showAsk() {
    questionElem.innerHTML = ask.question;
    option1Elem.innerHTML = ask.option1;
    option2Elem.innerHTML = ask.option2;
    option1Elem.addEventListener("click", optionClick1 = function() { optionClick(ask.result1) });
    option2Elem.addEventListener("click", optionClick2 = function() { optionClick(ask.result2) });
}

function optionClick(callback) {
    callback();
    option1Elem.removeEventListener("click", optionClick1);
    option2Elem.removeEventListener("click", optionClick2);
    infoElem.classList.add("bounceOut");
    infoElem.addEventListener("webkitAnimationEnd", reBounce);
}

function reBounce() {
    infoElem.classList.remove("bounceOut");
    infoElem.removeEventListener("webkitAnimationEnd", reBounce);
    getInputs();
}
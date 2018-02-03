/*
x. powerups: gained with every win, winstreaks, combos, losingstreaks, 2 with winning within 3/4 moves, completing a special shape
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

x. Tic Tac Toe Version: Original, Plus (powerups), Ex(9 boards, winning a board gives you an overall marker to gain extra wins), Ultra Plus and Ex?
x. implement key controls for player 1
pass callback to player1 move that handles player2 being a computer or human. there will be two different callbacks
    //possible future feature: have the coin toss interactive with random player pick heads or tails/X or O
    //maybe even allow the nonpicking player be the toss stopper
*/
let infoElem = document.getElementById("info"),
    questionElem = document.getElementById("question"),
    option1Elem = document.getElementById("option1"),
    option2Elem = document.getElementById("option2"),
    spaces = [...document.getElementsByClassName("space")],
    playerInfo = [...document.getElementsByClassName("player-info")],
    availableSpaces = ["space1", "space2", "space3", "space4", "space5", "space6", "space7", "space8", "space9"],
    player1 = new Player(1, "human", playerMove),
    ask,
    askComponents = [
        ["Versus", "Human", "Computer", () => player2 = new Player(2, "human", playerMove), () => player2 = new Player(2, "computer", computerMove)],
        ["Player 1", "Xs", "Os", () => player1.marker = (player2.marker = "o", "x"), () => player1.marker = (player2.marker = "x", "o")]
    ],
    curPlayer,
    move = 1;

spaces.forEach(el => {
    console.log("adding listener for: " + el.id);
    el.addEventListener("mousedown", spaceClick);
});

gameLoop();

function gameLoop() { //does it make more sense for init to be the loop, getInputs/init...
    console.log("running init");
    init(); //questions and choose first, maybe add in boardInit to handle 1 time intializtions related to the game board itself, such as adding listeners to spaces
    // console.log("choosing first move");
    // chooseFirst();
    // console.log("starting turns");
    //setTimeout here or in chooseFirst. slow should go, show who dirst msg, pause for a few seconds, fade out msg, while fading in player sections while highlighting who has current move
    // turnLoop();
}

function Player(id, type, move) {
    this.id = id;
    this.type = type;
    this.move = move;
    this.marker;
}

function playerMove() {
    console.dir(spaces);
    if (availableSpaces.includes(this.id)) {

    }


    //check if space is open
    //place players marker if so
}

function computerMove() {
    //check available spaces
    if (availableSpaces.includes(this.id)) {

    }
    //check if any complete a win condition
    //check if opponent can win on next move and block
    //if not, pick random available
}

function spaceClick() {
    this.removeEventListener("mousedown", spaceClick);
    let idx = availableSpaces.indexOf(this.id);
    if (idx != -1) {
        availableSpaces.splice(idx, 1);
    } else {
        return;
    }

    //add curPlayer.marker to space's classes
    let mark = document.getElementById(this.id);
    mark.classList.add(curPlayer.marker);

    move++;

    //check win conditions if move > 4


    //switch curPlayer
    curPlayer = curPlayer == player1 ? player2 : player1;
    console.log("space clicked");
    console.dir(curPlayer);
}

function winCheck() {

}

function markSpace(e) {
    console.log("marking space");
    console.dir(e);
}

function Ask(question, option1, option2, result1, result2) {
    this.question = question;
    this.option1 = option1;
    this.option2 = option2;
    this.result1 = result1;
    this.result2 = result2;
}


function init() { //should this be combined with showAsk?
    if (!askComponents.length) {
        console.log("exiting init");
        chooseFirst();
        // turnLoop();
        return;
    }
    console.log("asking");
    ask = new Ask(...askComponents.shift());
    showAsk(ask);
}

function turnLoop() {
    let move = 1,
        win = false;
    //player moves are callbacks attached to player object that prompts a human player or chooses for a computer player
    //player moves with loops to not start until 5th moce and run checking until a win condition is met

    while (!win) {
        curPlayer.move(); //if this ends up being just to display whose move it is, delete player.move and just put the msg here
        move++;
        curPlayer = curPlayer == player1 ? player2 : player1;
        if (move > 4) {
            //check win conditions
        }
    }
    //final moves if any
    //winner declared
    //replay function, play again (same settings) or restart (start from start)
}

function showAsk() {
    console.log("showing ask");
    questionElem.innerHTML = ask.question;
    option1Elem.innerHTML = ask.option1;
    option2Elem.innerHTML = ask.option2;
    option1Elem.addEventListener("click", optionClick1 = function() { optionClick(ask.result1) });
    option2Elem.addEventListener("click", optionClick2 = function() { optionClick(ask.result2) });

}

function optionClick(callback) {
    console.log("option clicked");
    callback();
    option1Elem.removeEventListener("click", optionClick1);
    option2Elem.removeEventListener("click", optionClick2);
    infoElem.classList.add("bounceOut");
    infoElem.addEventListener("webkitAnimationEnd", reBounceIn);
}

function reBounceIn() {
    infoElem.classList.remove("bounceOut");
    infoElem.removeEventListener("webkitAnimationEnd", reBounceIn);
    console.log("re-calling init");
    init();
}

function chooseFirst() {
    let outcome = Math.floor(Math.random() * 2) + 1;
    infoElem.innerHTML = "Player " + outcome + " goes first.";
    curPlayer = outcome == 1 ? player1 : player2;
    spaces.forEach(el => {
        console.log("adding listener for: " + el.id);
        el.addEventListener("mousedown", spaceClick);
        el.addEventListener("mousedown", clearMessage);
    });
}

function clearMessage() {
    spaces.forEach(el => el.removeEventListener("mousedown", clearMessage));
    infoElem.classList.add("fadeOut");
    //slow fade in player elements
    playerInfo.forEach(el => {
        el.removeAttribute("hidden");
        el.classList.add("fadeIn");
    }); //el.prop("hidden", false)
    // playerInfo.prop("hidden", false);
    // .classList.add("fadeIn")
}
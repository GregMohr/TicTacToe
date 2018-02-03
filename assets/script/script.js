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
x. user experience component? maybe instead of wins or along with wins. 

x. Tic Tac Toe Version: Original, Plus (powerups), Ex(9 boards, winning a board gives you an overall marker to gain extra wins), Ultra Plus and Ex?
x. implement key controls for assignable player. control options: 1 kbd/1 mouse or both players switch mouse, both players kbd
x. user interactive coin toss: random player picks X or O;  opposing player stops the toss. Decides who goes first and maybe who gets what marker. Winner of coind toss gets to choose marker first and go first?
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
        ["Versus", "Human", "Computer", () => player2 = new Player(2, "human"), () => player2 = new Player(2, "computer")],
        ["Player 1", "Xs", "Os", () => player1.marker = (player2.marker = "o", "x"), () => player1.marker = (player2.marker = "x", "o")]
    ],
    curPlayer,
    move = 1;

showAsk();

function Player(id, type, move) {
    this.id = id;
    this.type = type;
    this.marker;
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

    let mark = document.getElementById(this.id);
    mark.classList.add(curPlayer.marker);
    move++;

    //check win conditions if move > 4

    curPlayer = curPlayer == player1 ? player2 : player1;
    console.log("space clicked");
    console.dir(curPlayer);
    if (curPlayer.type == "computer") {
        computerMove();
    }
}

function winCheck() {

}

function Ask(question, option1, option2, result1, result2) {
    this.question = question;
    this.option1 = option1;
    this.option2 = option2;
    this.result1 = result1;
    this.result2 = result2;
}

function showAsk() {
    if (!askComponents.length) {
        console.log("no more questions, choosing first player");
        chooseFirst(); //this will need to be modified to allow for new questions later. should work for replay (rechoosing first), but maybe not all future end game scenarios, such as in Ex
        return;
    }
    ask = new Ask(...askComponents.shift());
    console.log("showing ask");
    questionElem.innerHTML = ask.question;
    option1Elem.innerHTML = ask.option1;
    option2Elem.innerHTML = ask.option2;
    option1Elem.addEventListener("click", optionClick1 = function() { optionClick(ask.result1) });
    option2Elem.addEventListener("click", optionClick2 = function() { optionClick(ask.result2) });
    console.log("exiting show ask");
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
    console.log("re-calling showAsk");
    showAsk();
}

function chooseFirst() {
    let outcome = Math.floor(Math.random() * 2) + 1;
    infoElem.innerHTML = "Player " + outcome + " goes first.";
    curPlayer = outcome == 1 ? player1 : player2;
    spaces.forEach(el => {
        console.log("adding listener for: " + el.id);
        el.addEventListener("mousedown", spaceClick);
        el.addEventListener("mousedown", gameStart);
    });
}

function gameStart() {
    spaces.forEach(el => el.removeEventListener("mousedown", gameStart));
    infoElem.classList.add("fadeOut");
    playerInfo.forEach(el => {
        el.removeAttribute("hidden");
        el.classList.add("fadeIn");
    });
}
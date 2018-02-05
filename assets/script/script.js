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
x. wargames mode where both players are computer
x. more computer techniques: starting from corner;

x. may need to have multiple askComp sets for varied situations in the future. then just create a copy of the needed one for showAsk to splice up
*/
let infoElem = document.getElementById("info"),
    questionElem = document.getElementById("question"),
    option1Elem = document.getElementById("option1"),
    option2Elem = document.getElementById("option2"),
    player1Score = document.getElementById("player1-score"),
    player2Score = document.getElementById("player2-score"),
    spaces = [...document.getElementsByClassName("space")],
    playerInfo = [...document.getElementsByClassName("player-info")],
    availableSpaces = ["space1", "space2", "space3", "space4", "space5", "space6", "space7", "space8", "space9"],
    player1 = new Player(1, "human"),
    player2 = new Player(2),
    ask,
    askComponents = [
        ["Versus", "Human", "Computer", () => player2.type = "human", () => player2.type = "computer"],
        ["Player 1", "Xs", "Os", () => player1.marker = (player2.marker = "o", "x"), () => player1.marker = (player2.marker = "x", "o")]
    ],
    winCombos = [
        ["space1", "space2", "space3"],
        ["space4", "space5", "space6"],
        ["space7", "space8", "space9"],
        ["space1", "space4", "space7"],
        ["space2", "space5", "space8"],
        ["space3", "space6", "space9"],
        ["space1", "space5", "space9"],
        ["space3", "space5", "space7"]
    ],
    curPlayer,
    move = () => { return player1.moves.length + player2.moves.length };

showAsk();

function Player(id, type) {
    this.id = id;
    this.type = type;
    this.marker;
    this.moves = [];
}

function computerMove() {
    console.log("computerMove");
    if (move() === 1) {
        //choose center
        //choose corner
    }

    //if center, opponent will be on edge or corner
    //-if edge, place on one of two corners opposite edge piece, they block, you block and be set for two win combos
    //-if corner, 
    this.removeEventListener("mousedown", spaceClick);
    //how to handle working towards a win from the first move for computer
    //check if any available spaces complete a win condition
    //check if opponent can win on next move and block
    //if not, pick random available
}

function spaceClick() {
    console.log("spaceClick on: " + this.id);
    this.removeEventListener("mousedown", spaceClick);
    availableSpaces.splice(availableSpaces.indexOf(this.id), 1);
    let mark = document.getElementById(this.id);
    mark.classList.add(curPlayer.marker);

    curPlayer.moves.push(this.id);
    console.log("move#: " + move());
    if (move() > 4 && winCheck()) return;

    curPlayer = curPlayer === player1 ? player2 : player1;

    if (curPlayer.type === "computer") {
        computerMove();
    }
}

function winCheck() { //rename to endCheck and include draw conditions
    winCombos.forEach(el => {
        if (el.every(sp => { return curPlayer.moves.includes(sp) })) {
            console.log("winner");
            spaces.forEach(el => el.removeEventListener("mousedown", spaceClick));
            infoElem.innerHTML = "Player " + curPlayer.id + " wins!";

            //reset needed elem states
            infoElem.classList.remove("fadeOut");
            //start new game, varied replay options will be added later
            setTimeout(gameEnd, 3000);
            curPlayer === player1 ? player1Score.innerHTML = +player1Score.innerHTML + 1 : player2Score.innerHTML = +player2Score.innerHTML + 1;
            return true;
        } else {
            return false;
        }
    });
}

function gameEnd() {
    infoElem.classList.add("fadeOut");
    console.log("removing markers");
    spaces.forEach(el => el.classList.remove("x", "o"));
    curPlayer = null;
    player1.moves.length = 0;
    player2.moves.length = 0;
    chooseFirst();
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
    if (curPlayer.type == "computer") {
        //do we need to add a delay here somehow? Otherwise the computer will immediately go and the first player msg will be lost
        computerMove();
    }
    spaces.forEach(el => {
        console.log("adding listener for: " + el.id);
        el.addEventListener("mousedown", spaceClick);
        el.addEventListener("mousedown", gameStart);
    });
    if (curPlayer.type == "computer") {
        gameStart();
    }
}

function gameStart() {
    spaces.forEach(el => el.removeEventListener("mousedown", gameStart));
    infoElem.classList.add("fadeOut");
    playerInfo.forEach(el => {
        el.removeAttribute("hidden");
        el.classList.add("fadeIn");
    });
}
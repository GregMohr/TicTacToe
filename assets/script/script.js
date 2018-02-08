/*
x. powerups: gained with every win, winstreaks, combos, losingstreaks, 2 with winning within 3/4 moves, completing a special shape
- random reward or allow user to pick? can they be stacked? or can you only have 1?
- with 1 player, have the AI be theoretically lossless, but only the player gets the powerups
- destroy opponent's marker, does it use up your turn, i guess it can't or that'd be worthless, unless you could stack powerups and use more than one
- extra move
- steal a win, a circular button appears between the two scores, animated spin while removing 1 from opp and adding to player
- change game mode during game...could this work? how could it be advantageous?
x. random events: flip markers; flip board, but leave markers; 
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
C 1st:
-center

O 2nd:
A-edge
B-corner

C 3rd:
A-opposite corner
B-opposite corner

O 4th:
A1-block
A2-not block
B1-edge
B2-corner

C 5th:
A1-block
A2-WIN
B1-counter
B2-counter to tie

O 6th:
A--
B1--
B2-block or ?

C 7th:
A-WIN
B1-WIN
B2-block or WIN
*/
let infoElem = document.getElementById("info"),
    questionElem = document.getElementById("question"),
    option1Elem = document.getElementById("option1"),
    option2Elem = document.getElementById("option2"),
    player1Score = document.getElementById("player1-score"),
    player2Score = document.getElementById("player2-score"),
    spaces = [...document.getElementsByClassName("space")],
    playerInfo = [...document.getElementsByClassName("player-info")],
    allSpaces = ["space1", "space2", "space3", "space4", "space5", "space6", "space7", "space8", "space9"],
    availableSpaces,
    player1 = new Player(1, "human"),
    player2 = new Player(2),
    ask,
    askComponents = [ //when questions expand I could either segregate them into units like this, or have them all here and slice them out
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
    edges = ["space2", "space4", "space6", "space8"],
    curPlayer,
    move = () => { return player1.moves.length + player2.moves.length },
    compFirst = [compCenter, compWinBlockCorner, compWinBlockCorner, compWinBlockCorner, compWinBlockCorner],
    compSecond = [CSA],
    pattern = [];

//refactor: initOnce as part of space object refactor
init();
showAsk();

function Player(id, type) {
    this.id = id;
    this.type = type;
    this.marker;
    this.moves = [];
}

function Ask(question, option1, option2, result1, result2) {
    this.question = question;
    this.option1 = option1;
    this.option2 = option2;
    this.result1 = result1;
    this.result2 = result2;
}

function space() {
    this.id;
    this.type;
    this.oppCorners = [];
    this.oppEdges = [];
    this.elem;
}

function initOnce() {
    //refactor: init spaces here
    //refactor: if I decide to split the top variables into objects, they'll init here
}

function init() {
    availableSpaces = Array.from(allSpaces);
}

function showAsk() {
    if (!askComponents.length) {
        console.log("no more questions, choosing first player");
        chooseFirst();
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
    // curPlayer = player1;
    // infoElem.innerHTML = "Player 1 goes first.";

    setTimeout(gameStart, 2000);
    spaces.forEach(el => {
        el.addEventListener("mousedown", spaceClick);
    });
    console.log("curPlayer type: " + curPlayer.type);
    if (curPlayer.type == "computer") {
        computerMove();
    }
}

function gameStart() {
    infoElem.classList.add("fadeOut");
    playerInfo.forEach(el => {
        el.removeAttribute("hidden");
        el.classList.add("fadeIn");
    });
}

function computerMove() {
    console.log("computerMove");
    let lastMove = player1.moves[player1.moves.length - 1]; //make this a global function like move?
    if (!pattern.length) pattern = move() === 0 ? Array.from(compFirst) : !edges.includes(lastMove) ? Array.from(compSecond) : Array.from(compFirst);
    let turn = pattern.shift();
    turn();
}


function compCenter() {
    spaces[4].dispatchEvent(new MouseEvent('mousedown'));
}

function blockFork() {

}



function CSA() {
    //first move was center
    //first move was corner
}

function compOppCorner() {
    let lastMove = player1.moves[player1.moves.length - 1];
    let compMove;
    console.log("last move: " + lastMove);
    console.dir(player1.moves);
    switch (lastMove) {
        case "space1":
            if (availableSpaces.includes("space9")) compMove = spaces[8];
            break;
        case "space2":
            if (["space7", "space9"].some(sp => availableSpaces.includes(sp))) compMove = availableSpaces.includes("space7") ? spaces[6] : spaces[8];
            break;
        case "space3":
            if (availableSpaces.includes("space7")) compMove = spaces[6];
            break;
        case "space4":
            if (["space3", "space9"].some(sp => availableSpaces.includes(sp))) compMove = availableSpaces.includes("space3") ? spaces[2] : spaces[8];
            break;
        case "space6":
            if (["space1", "space7"].some(sp => availableSpaces.includes(sp))) compMove = availableSpaces.includes("space1") ? spaces[0] : spaces[6];
            break;
        case "space7":
            if (availableSpaces.includes("space3")) compMove = spaces[2];
            break;
        case "space8":
            if (["space1", "space3"].some(sp => availableSpaces.includes(sp))) compMove = availableSpaces.includes("space1") ? spaces[0] : spaces[2];
            break;
        case "space9":
            if (availableSpaces.includes("space1")) compMove = spaces[0];
            break;
        default:
            console.log("could not find open opposite corner for: " + lastMove);
            console.log("choosing first available");
    }
    console.log("compMove: " + compMove);
    compMove = compMove || document.getElementById(availableSpaces[0]);
    console.log("compMove: " + compMove.id);

    compMove.dispatchEvent(new MouseEvent('mousedown'));
}

function compWinBlockCorner() {
    //this may not fully consider both decision paths to this point
    console.log("check for winning move and take it");
    let winMove = canWin(player2);
    console.log("winMove: " + winMove);
    if (winMove != false) { //if win exists, take it
        console.log("winning move found. clicking");
        winMove.dispatchEvent(new MouseEvent('mousedown'));
        return;
    }
    console.log("check for opponent winning move and block it");
    winMove = canWin(player1);
    if (winMove != false) { //if player1 can win on next turn, block
        console.log("blocking opponent win");
        winMove.dispatchEvent(new MouseEvent('mousedown'));
        return;
    }
    console.log("could not win or block, trying opposite corner");
    compOppCorner();
}

function canWin(checkPlayer) {
    let found = [],
        missing = [];

    for (let i = 0; i < winCombos.length; i++) {
        console.log("win combo: " + winCombos[i]);

        winCombos[i].forEach(sp => {
            if (checkPlayer.moves.includes(sp)) {
                console.log("found: " + sp);
                found.push(sp);
            } else {
                console.log("missing: " + sp);
                missing.push(sp);
            }
        });

        if (found.length === 2 && availableSpaces.includes("" + missing)) {
            console.log("found: " + found);
            console.log("missing: " + missing);
            console.log("is missing available? " + availableSpaces.includes(missing));
            console.dir(availableSpaces);
            winningSpace = spaces.find(sp => sp.id == missing);
            return winningSpace;
        }
        found.length = 0;
        missing.length = 0;
    }
    return false;
}

function canFork(checkPlayer) {
    //for every availableSpace, add to copy of player moves, run canWin(player1) modification
    availableSpaces.forEach(sp => { //this may work better as a standard for loop so I can break it at 2 trues
        let moves = Array.from(checkPlayer.moves);
        moves.push(sp);
    });
    //that finds all matches and returns number or false, not just first and true/false
    // let found = [],
    //     missing = [];

    // for (let i = 0; i < winCombos.length; i++) {
    //     console.log("win combo: " + winCombos[i]);

    //     winCombos[i].forEach(sp => {
    //         if (checkPlayer.moves.includes(sp)) {
    //             console.log("found: " + sp);
    //             found.push(sp);
    //         } else {
    //             console.log("missing: " + sp);
    //             missing.push(sp);
    //         }
    //     });

    //     if (found.length === 2 && availableSpaces.includes("" + missing)) {
    //         console.log("found: " + found);
    //         console.log("missing: " + missing);
    //         console.log("is missing available? " + availableSpaces.includes(missing));
    //         console.dir(availableSpaces);
    //         winningSpace = spaces.find(sp => sp.id == missing);
    //         return winningSpace;
    //     }
    //     found.length = 0;
    //     missing.length = 0;
    // }
    // return false;
}

function spaceClick() {
    console.log("+++++++++spaceClick on: " + this.id);
    this.removeEventListener("mousedown", spaceClick);
    availableSpaces.splice(availableSpaces.indexOf(this.id), 1);
    let mark = document.getElementById(this.id);
    mark.classList.add(curPlayer.marker);

    curPlayer.moves.push(this.id);
    console.log("move#: " + move());
    if (move() > 4) {
        if (endCheck()) {
            return;
        }
    }

    curPlayer = curPlayer === player1 ? player2 : player1;

    if (curPlayer.type === "computer") {
        computerMove();
    }
}

function endCheck() {
    console.log("endcheck");
    let win = winCombos.some(el => {
        // console.log("win combo");
        // console.dir(el);
        return el.every(sp => { return curPlayer.moves.includes(sp) });
    })
    console.log("win check: " + win);
    if (win || move() === 9) {
        console.log("ending game");
        spaces.forEach(el => el.removeEventListener("mousedown", spaceClick));

        if (win) {
            infoElem.innerHTML = "Player " + curPlayer.id + " wins!";
            curPlayer === player1 ? player1Score.innerHTML = +player1Score.innerHTML + 1 : player2Score.innerHTML = +player2Score.innerHTML + 1;
        } else {
            infoElem.innerHTML = "Draw";
        }
        infoElem.classList.remove("fadeOut");
        setTimeout(gameEnd, 3000);
        return true;
    } else {
        return false;
    }
}

function gameEnd() {
    infoElem.classList.add("fadeOut");
    console.log("removing markers");
    spaces.forEach(el => el.classList.remove("x", "o"));
    curPlayer = null;
    player1.moves.length = 0;
    player2.moves.length = 0;
    // while (pattern.length > 0) pattern.shift();
    pattern = [];
    init();
    chooseFirst();
}
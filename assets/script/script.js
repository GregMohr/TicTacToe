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

// C 1st:
// -center

// O 2nd:
// A-edge
// B-corner

// C 3rd:
// A-O played edge, play opposite corner(only two options, match edges for opposites)
// B-opposite corner to last O play

// O 4th:
// A1-block or A2 not
// B1-edge or B2-corner

// C 5th:
// A1-block
// A2-check if opposite corner to last C played open, if so win
// B1-play opposite open corner
// B2-counter to tie

// O 6th:
// A--
// B1--

// C 7th:
// A-check third corner(?) and X surrounded edge for win
// B1-look for win
let compFirst = [compCenter, compOppCorner, compFirstThird, canWin];

function compCenter() {
    spaces[4].dispatchEvent(new MouseEvent('mousedown'));
}

function compOppCorner() {
    let lastMove = player1.moves[player.moves.length - 1];
    switch (lastMove) {
        case "space1":
            if (spaces[8].classList.contains("x") || spaces[8].classList.contains("o")) {
                console.log("compOppCorner failed");
                return;
            }
            spaces[8].dispatchEvent(new MouseEvent('mousedown'));
            break;
        case "space2":
            //7 or 9
            break;
        case "space3":
            spaces[6].dispatchEvent(new MouseEvent('mousedown'));
            break;
        case "space4":
            //3 or 9
            break;
        case "space6":
            //1 or 7
            break;
        case "space7":
            spaces[2].dispatchEvent(new MouseEvent('mousedown'));
            break;
        case "space8":
            //1 or 3
            break;
        case "space9":
            spaces[0].dispatchEvent(new MouseEvent('mousedown'));
            break;
    }
}

function compFirstThird() {
    //compBlock
    //canWin
    //compOppCorner
}

function compBlock() {

}

function computerMove() {
    console.log("computerMove");

    if (move() === 0) {
        console.log("computer moves first");
        //computer goes first
        //choose center
        //-
        //choose corner
        return;
    }

    if (move() === 1) {
        console.log("computer going second");
        if (player1.moves[0] === "space5") {
            console.log("player chose center");
            console.dir(spaces[0]);
            let spaceMark = document.getElementById("space1");
            console.dir(spaceMark);

            spaceMark.dispatchEvent(new MouseEvent('mousedown')); //spaces[0]
        }
    }

    //-if edge, place on one of two corners opposite edge piece, they block, you block and be set for two win combos
    //-if corner, 
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
        console.log("win combo");
        console.dir(el);
        let all = el.every(sp => { return curPlayer.moves.includes(sp) });
        console.log("all? " + all);
        return el.every(sp => { return curPlayer.moves.includes(sp) });
    })
    console.log("win check: " + win);
    console.log("move check: " + move());
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
    setTimeout(gameStart, 2000);
    spaces.forEach(el => {
        //should I worry about the small amount of time the user will be able to click the spaces before the computer can move on first move?
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
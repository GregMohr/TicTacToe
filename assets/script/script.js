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

*/
let infoElem = document.getElementById("info"),
    questionElem = document.getElementById("question"),
    option1Elem = document.getElementById("option1"),
    msgElem = document.getElementById("msg"),
    option2Elem = document.getElementById("option2"),
    player1Score = document.getElementById("player1-score"),
    player2Score = document.getElementById("player2-score"),
    playerInfo = [...document.getElementsByClassName("player-info")],
    spaces = [...document.getElementsByClassName("space")],
    availableSpaces = [],
    player1 = new Player(1, "human"),
    player2 = new Player(2),
    ask,
    askComponents = [
        ["Versus:", "Human", "Computer", () => player2.type = "human", () => player2.type = "computer"],
        ["Player 1:", "Xs", "Os", () => player1.marker = (player2.marker = "o", "x"), () => player1.marker = (player2.marker = "x", "o")]
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
    corners = ["space1", "space3", "space7", "space9"],
    edges = ["space2", "space4", "space6", "space8"],
    curPlayer,
    move = () => { return player1.moves.length + player2.moves.length };

// initOnce();
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

function initOnce() {
    //refactor: if I decide to split the top variables into objects, they'll init here
}

function init() {
    console.log("init");
    availableSpaces = ["space1", "space2", "space3", "space4", "space5", "space6", "space7", "space8", "space9"];
}

function animateOut(elem, effect) {
    //elements have '*In' effect applied on html
    elem.classList.add(effect + "Out");
    // cback = "re" + effect.substr(0, 1).toUpperCase() + effect.substr(1) + "In";
    infoElem.addEventListener("webkitAnimationEnd", cback);
}

function animateIn(elem, effect) {
    console.log("removing fadeOut to infoElem | reFadeIn");
    infoElem.classList.remove("fadeOut");
    infoElem.removeEventListener("webkitAnimationEnd", reFadeIn);
    checkQuestions();
}

function showAsk() {
    ask = new Ask(...askComponents.shift());
    console.log("showAsk");
    questionElem.innerHTML = ask.question;
    option1Elem.innerHTML = ask.option1;
    option2Elem.innerHTML = ask.option2;
    option1Elem.addEventListener("click", optionClick1 = function() { optionClick(ask.result1) }); //*** Intentional assignment ***//
    option2Elem.addEventListener("click", optionClick2 = function() { optionClick(ask.result2) }); //*** Intentional assignment ***//
    console.log("waiting for response");
}

function optionClick(callback) {
    console.log("optionClick");
    callback();
    option1Elem.removeEventListener("click", optionClick1);
    option2Elem.removeEventListener("click", optionClick2);
    console.log("adding bounceOut to infoElem | optionClick");
    infoElem.classList.add("bounceOut");
    infoElem.addEventListener("webkitAnimationEnd", reBounceIn);
}

function reBounceIn() {
    console.log("reBounceIn");
    console.log("removing bounceOut to infoElem | reBounceIn");
    infoElem.classList.remove("bounceOut");
    infoElem.removeEventListener("webkitAnimationEnd", reBounceIn);
    checkQuestions();
}

function checkQuestions() {
    console.log("checkQuestions");
    if (askComponents.length > 0) {
        console.log("re-calling showAsk");
        showAsk();
    } else {
        console.log("no more questions, choosing first player");
        questionElem.innerHTML = "";
        option1Elem.innerHTML = "";
        msgElem.innerHTML = "";
        option2Elem.innerHTML = "";
        chooseFirst();
    }
}

function chooseFirst() {
    console.log("chooseFirst");
    let outcome = Math.floor(Math.random() * 2) + 1;
    msgElem.innerHTML = "Player " + outcome + " goes first.";
    curPlayer = outcome == 1 ? player1 : player2;
    setTimeout(gameStart, 1000);
}

function gameStart() {
    console.log("gameStart");
    console.log("adding fadeOut to infoElem | gameStart");
    infoElem.classList.add("fadeOut");
    infoElem.addEventListener("webkitAnimationEnd", clearMsg);

    playerInfo.forEach(el => { //this is happening on each replay too, but is unnoticable
        console.log("adding fadeIn to playerInfo elements | gamestart");
        el.removeAttribute("hidden");
        el.classList.add("fadeIn");
    });
    spaces.forEach(el => {
        el.addEventListener("mousedown", spaceClick);
    });
    if (curPlayer.type == "computer") {
        computerMove();
    }
}

function clearMsg() {
    console.log("clearMsg");
    infoElem.setAttribute("hidden", "");
    // msgElem.setAttribute("hidden", "");

    // infoElem.classList.remove("fadeOut");
    infoElem.removeEventListener("webkitAnimationEnd", clearMsg);
    // setTimeout(() => infoElem.removeAttribute("hidden"), 10000);
}

function computerMove() {
    console.log("computerMove");
    let compMove;
    findMove: {
        //*** All below compMove assignments intentional ***//
        if (move() >= 3) {
            if ((compMove = canWin(player2.moves))) break findMove; //move 5+
            if ((compMove = canWin(player1.moves))) break findMove; //move 3+
            if ((compMove = canFork(player1.moves))) break findMove; //move 4+
        }
        compMove = bestOpen();
    }
    console.log("computer clicks: " + compMove);
    compMove = spaces.find(el => { return el.id == compMove });
    compMove.dispatchEvent(new MouseEvent('mousedown'));
}

function canWin(moves) {
    console.log("canWin");
    let found = [],
        missing = [];
    for (let i = 0; i < winCombos.length; i++) {
        winCombos[i].forEach(sp => {
            if (moves.includes(sp)) {
                found.push(sp);
            } else {
                missing.push(sp);
            }
        });

        if (found.length === 2 && availableSpaces.includes("" + missing)) return missing;

        found.length = 0;
        missing.length = 0;
    }
}

function canFork(moves) {
    console.log("canFork");
    if (move() == 3 && (moves.includes("space1") && moves.includes("space9") || (moves.includes("space3") && moves.includes("space7")))) {
        if (availableSpaces.some(el => { return edges.includes(el) })) {
            return availableSpaces.find(el => { return edges.includes(el); });
        }
    }
    for (let i = 0; i < availableSpaces.length; i++) {
        let count = 0;
        let checkMoves = moves.concat();
        checkMoves.push(availableSpaces[i]);

        let found = [],
            missing;

        winCombos.forEach(combo => {
            combo.forEach(sp => {
                if (checkMoves.includes(sp)) {
                    found.push(sp);
                } else {
                    missing = sp;
                }
            });
            if (found.length === 2 && availableSpaces.includes(missing)) count++;
            found.length = 0;
            missing.length = 0;
        });
        if (count > 1) return availableSpaces[i];
    }
}

function bestOpen() {
    console.log("bestOpen");
    let compMove;
    findOpen: {
        //break into smaller functions?
        //center open?
        if (availableSpaces.includes("space5")) {
            compMove = "space5";
            break findOpen;
        }
        //farcorner open?
        if (move() > 0) {
            let lastMove = player1.moves[player1.moves.length - 1];
            let elem = spaces.find(el => { return el.id == lastMove });
            let spaceCorners = JSON.parse(elem.dataset.farcorners);

            spaceCorners.some(el => {
                if (availableSpaces.includes(el)) {
                    compMove = el;
                    return el;
                }
            })
            if (compMove) break findOpen;
        }
        //any corner open?
        if (availableSpaces.some(el => { return corners.includes(el) })) {
            compMove = availableSpaces.find(el => { return corners.includes(el); })
            break findOpen;
        }
        //only edges open
        compMove = availableSpaces[0];
    }
    return compMove;
}

function spaceClick() {
    console.log("spaceClick");
    this.removeEventListener("mousedown", spaceClick);

    let removed = availableSpaces.splice(availableSpaces.indexOf(this.id), 1);
    curPlayer.moves.push(this.id);
    this.classList.add(curPlayer.marker);

    console.log("move#: " + move() + " on " + this.id);

    if (move() > 4 && endCheck()) return;

    //should I split this into a seperate nextPlayer function?
    curPlayer = curPlayer === player1 ? player2 : player1;
    if (curPlayer.type === "computer") {
        computerMove();
    }
}

function endCheck() {
    console.log("endCheck");
    let win = winCombos.some(el => {
        return el.every(sp => { return curPlayer.moves.includes(sp) });
    });
    //some of this logic makes more sense in the gameEnd function. Maybe this should just check for win/draw and pass the result forward
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
        console.log("removing fadeOut from infoElem | endcheck");
        infoElem.classList.remove("fadeOut");
        setTimeout(gameEnd, 1000);
        return true;
    }
}

function gameEnd() {
    console.log("gameEnd");
    //most of this stuff should probably move to a cleanup function and gameEnd should handle messaging regarding game outcome
    console.log("adding fadeOut to infoElem | gameEnd");

    infoElem.classList.add("fadeOut");
    console.log("removing markers");
    spaces.forEach(el => el.classList.remove("x", "o"));
    curPlayer = null;
    player1.moves.length = 0;
    player2.moves.length = 0;
    init();
    infoElem.addEventListener("webkitAnimationEnd", chooseFirst);
}
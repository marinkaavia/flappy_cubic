//board
let board;
let boardWidth = 896;
let boardHeight = 512;
let context; //for drawing on the board

//start screen
let startScreen;
let startScreenWidth = 896;
let startScreenHeight = 512;

//flapping dog and its position
let dogWidth = 55; //size: 498/501 = 166/167 = 55/56
let dogHeight = 57;
let dogX = boardWidth / 3;
let dogY = boardHeight / 2.5; //to dog be placed in the left side of the middle of the board
let dogImage;

let dog = {
    x: dogX,
    y: dogY,
    width: dogWidth,
    height: dogHeight
};

//pipes
let pipeArray = [];
let pipeWidth = 64; //size: 384/3072 = 1/8
let pipeHeight = 512; 
let pipeX = boardWidth; //start from the right corner of the board 
let pipeY = -60;
let topPipeImage;
let bottomPipeImage;

let gameOver = false; //status
let score = 0;
let pipeInterval;


//movement physics
let speedX = -2; //this is the speed of pipes that have to move from the right to the left, hence the negative
let speedY = 0; //jump speed 
let gravity = 0.5; //default

window.onload = function() {
    //create startscreen
    startScreen = document.getElementById('startScreen');
    startScreen.height = startScreenHeight;
    startScreen.width = startScreenWidth;
    //create board
    board = document.getElementById("board"); //that board that we created in html file
    board.height = boardHeight;
    board.width = boardWidth;
   //context = board.getContext("2d"); //for drawing on the board
    //load image of dog 
    dogImage = new Image();
    dogImage.src = "./flappydog23.png";
    dogImage.onload = function() {
        context.drawImage(dogImage, dog.x, dog.y, dog.width, dog.height); // Draw the image at the dog's position
    }
    //load image of pipes 
    topPipeImage = new Image();
    topPipeImage.src = "./toppipe.png";
    bottomPipeImage = new Image();
    bottomPipeImage.src = "./bottompipe.png";
    createStartScreen(); //start screen
        //all for left side rotation
        var dogImage1 = document.getElementById('dogImage1');
        var displayText = document.getElementById('displayText');
    
        dogImage1.onclick = function() {
            this.classList.add('rotated');  // This should trigger CSS rotation
            displayText.style.display = 'block';  // Display the hidden text
    
            // Optional: Reset the image rotation for subsequent clicks
            setTimeout(() => {
                this.classList.remove('rotated');
            }, 2100);  // Allow a little more time than the animation to reset
        };
    }
    

function startGame(mode) {
    startScreen.innerHTML = `
        <h1 style = "color: white; margin-top: 100px; margin-right: 140px; margin-left: 140px">You chose ${mode} mode. To start the game click the button below</h1>
        <h2 style="color:rgb(191, 240, 255);">Rules:</h2>
        <h3 style="color:rgb(0, 221, 255);; margin-right: 50px; margin-left: 50px">Guide the flapping dog through a series of pipes without touching them. The longer you keep the dog flying, the higher your score!</h3>
        <h3 style="color:rgb(0, 221, 255);; margin-right: 50px; margin-left: 50px">Tap space, button up or X to make the dog rise. If you stop clicking, the dog will fall due to gravity</h3>
        <button onclick="initGame()" style = "font-size: 20px;">Start</button>
    `;
    setupGameMode(mode);
}

function setupGameMode(mode) {
    switch (mode) {
        case 'Easy':
            speedX = -2; // Slower pipes
            gravity = 0.5; // Lower gravity
            pipeInterval = 3000; // New pipe every 3000 ms
            break;
        case 'Medium':
            speedX = -4; // Default speed
            gravity = 0.8; // Default gravity
            pipeInterval = 1500; // New pipe every 2000 ms
            break;
        case 'Hard':
            speedX = -6; // Faster pipes
            gravity = 1; // Higher gravity
            pipeInterval = 900; // New pipe every 1000 ms
            break;
    }
}


function initGame() {
    document.getElementById('startScreen').style.display = 'none'; // Hide the start screen
    context = board.getContext("2d"); //for drawing on screen
    requestAnimationFrame(update);
    setInterval(placePipes, pipeInterval);
    document.addEventListener("keydown", moveCubic);
}


function update() {
    requestAnimationFrame(update);
    if (gameOver == true) {
        showGameOverScreen();
        return; //stop updating
    }
    context.clearRect(0, 0, board.width, board.height); // Clear the entire canvas
    speedY += gravity;
    dog.y = Math.max(dog.y + speedY, 0); //apply gravity and ensure the dog doesn't go above the canvas
    context.drawImage(dogImage, dog.x, dog.y, dog.width, dog.height); // Redraw the dog
    if (dog.y > board.height) { //dog lower than the bottom of the frame
        gameOver = true;
    }
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += speedX; // Move the pipe
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); // Redraw the pipe
        //updating score
        if (!pipe.passed && dog.x > pipe.x + pipe.width) { //left+right corner. if we pass right corner = add score
            score += 0.5; //because 2 pipes, for each pipe 0.5
            pipe.passed = true;
        }

        if (detectCollision(pipe, dog)) {
            gameOver = true;
        }
    }

    //draw a score
    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.fillText("your score: " + score, 10, 45);

    if (gameOver == true) {
        //draw a window that tells about it and suggest to start a game from scratch
    }
}

function placePipes() {
    if (gameOver == true) {
        return; //don't create new pipes
    }
    let randomPipeY = pipeY - pipeHeight / 5 - Math.random() * (pipeHeight / 2);
    let openingSpace = pipeHeight / 4;
    let topPipe = {
        img: topPipeImage,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImage,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveCubic(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        speedY = -6; // Jump up
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function showGameOverScreen() {
    document.getElementById('gameOverScreen').style.display = 'block'; // Show the GAME OVER screen
    document.getElementById('finalScore').textContent = 'Your final score: ' + score; // Display final score
    document.getElementById('board').style.display = 'none'; // Optionally hide the game canvas
}



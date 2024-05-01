//board
let board;
let boardWidth = 896;
let boardHeight = 512;
let context; //for drawing on the board


//flapping dog and its position
let dogWidth = 55; //size: 498/501 = 166/167 = 55/56
let dogHeight = 57;
let dogX = boardWidth/3;
let dogY = boardHeight/2.5; //to dog be places in the left side of the middle of the board
let dogImage;

let dog = {
    x: dogX,
    y: dogY,
    width: dogWidth,
    height: dogHeight
}

//pipes 
let pipeArray = [];
let pipeWidth = 64; //size: 384/3072 = 1/8
let pipeHight = 512; 
let pipeX = boardWidth; //start from the right corner of board 
let pipeY = -60;
let topPipeImage;
let bottomPipeImage;

let gameOver = false; //status
let score = 0;

//movment physics
let speedX = -2; //this is speed of pipes that have to move from the right ot the left, so thats why minus
let speedY = 0; //jump speed 
let gravity = 0.5;
//if it is 0 - nothing changes, bur if we cleck on the 'space' button - speed become negative
//to let us dog jump up - we heed negative velocity
//and going down - positive velocity. gravity would change speed with time

window.onload = function() {
    board = document.getElementById("board"); //that board that we created in html file
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //for drawing on the board
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
    requestAnimationFrame(update);
    setInterval(placePipes, 3000); //placing pipes every 3 seconds
    document.addEventListener("keydown", moveCubic); //every time user touches "space"
}

function update() {
    requestAnimationFrame(update); // Call update for the next frame
    if (gameOver==true) {
        return; //stop updating
    }
    context.clearRect(0, 0, board.width, board.height); // Clear the entire canvas
    speedY += gravity;
    dog.y = Math.max(dog.y+speedY, 0); //apply gravity or dont go upper than end of canvas
    context.drawImage(dogImage, dog.x, dog.y, dog.width, dog.height); // Redraw the dog
    if (dog.y > board.height) { //dog lower than buttom of frame
        gameOver = true;
    }
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += speedX; // Move the pipe
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); // Redraw the pipe
        //updating score
        if (!pipe.passed  && dog.x > pipe.x+pipe.width) { //left+right corne. if we pass right corner = add score
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
    context.fillText("your score: "+ score, 10, 45);
    
    if (gameOver == true) {
        //draw a window that tell about it and suggest to start a game from the scratch
    }
}


//function that generate a pipes for us 
function placePipes() {
    if (gameOver==true) {
        return; //dont create new pipes
    }
    let randomPipeY = pipeY - pipeHight/5 - Math.random()*(pipeHight/2); //shift the top pipe up by pipeHight/5 px
    //math.random gives us a value from 0 to 1 and we also substract up to halph of the height from the pipe height
    let openingSpace = pipeHight/4; //constant distance between top and bottom pipes
    let topPipe = {
        img: topPipeImage,
        x: pipeX,
        y: randomPipeY, //every time the position of the end of the pipe would change bacuayse of game logic 
        width: pipeWidth,
        height: pipeHight,
        passed: false //if the flappy dog has passed this pipe yet ot no
    }
    pipeArray.push(topPipe); 
    //now on every 3 second we are going to call this function and it would place a pipe 

    let bottomPipe = {
        img: bottomPipeImage,
        x: pipeX,
        y: randomPipeY + pipeHight + openingSpace, 
        width: pipeWidth,
        height: pipeHight,
        passed: false //if the flappy dog has passed this pipe yet ot no
    }
    pipeArray.push(bottomPipe); 
}

function moveCubic(e) {
    if (e.code =="Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        speedY = -6; //bird jump up

        //reset game also using e.code space, so 
        if (gameOver) {
            dog.y = dogY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
    
}


function detectCollision(a, b) {
    return a.x < b.x + b.width &&
    a.x +a.width > b.x &&
    a.y < b.y + b.height &&
    a.y +a.height >b.y;
}
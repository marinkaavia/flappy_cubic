//board
let board;
let boardWidth = 896;
let boardHeight = 512;
let context; //for drawing on the board


//flapping dog and its position
let dogWidth = 77; //size: 498/501 = 166/167 = 55/56
let dogHeight = 79;
let dogX = boardWidth/7;
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
let pipeX = boardWidth; //start from the right vorner of board 
let pipeY = 0;
let topPipeImage;
let bottomPipeImage;

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
    
    requestAnimationFrame(update);
    setInterval(placePipes, 3000); //placing pipes every 3 seconds

}

function update() { //loop that would update frame and dog every time 
    requestAnimationFrame(update); //updating on frames overvse they will stack on each other 
    context.clearRect(0,0,board.boardWidth, board.boardHeight);
    //updating flying dog
    context.clearRect(dog.x, dog.y, dog.width, dog.height); // Clear the specific image area
    context.drawImage(dogImage, dog.x, dog.y, dog.width, dog.height);
    //updating canvas to show the pipes
    for (let i = 0; i <pipeArray.length; i++) {
        let pipe = pipeArray[i];
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    }
}

//function that generate a pipes for us 
function placePipes() {
    let topPipe = {
        img: topPipeImage,
        x: pipeX,
        y: pipeY,
        width: pipeWidth,
        height: pipeHight,
        passed: false //if the flappy dog has passed this pipe yet ot no
    }
    pipeArray.push(topPipe); 
    //now on every 3 second we are going to call this function and it would place a pipe 
}
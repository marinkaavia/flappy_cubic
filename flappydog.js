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


window.onload = function() {
    board = document.getElementById("board"); //that board that we created in html file
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //for drawing on the board

    //load image
    dogImage = new Image();
    dogImage.src = "./flappydog23.png";
    dogImage.onload = function() {
        context.drawImage(dogImage, dog.x, dog.y, dog.width, dog.height); // Draw the image at the dog's position
    }
}

//board
let board;
let boardwidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodleHeight = 46;
let doodlerX = boardwidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodleHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
  img : null,
  x : doodlerX,
  y : doodlerY,
  width : doodlerWidth,
  height : doodleHeight
}


//physics
let velocityX = 0;
let velocityY = 0; //doodler jump speed
let initialVelocityY = -8; // starting velocity Y
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;



let score = 0;
let maxScore = 0;
let gameOver = false;






window.onload = function(){
  board = document.getElementById("board");
  board.height = boardHeight;
  boardwidth = boardwidth;
  context = board.getContext("2d"); // use for drawing 



  //draw doodler
  // context.fillStyle = "green";
  // context.fillRect(doodler.x,doodler.y,doodler.width,doodler.height);

  //load images
  doodlerRightImg = new Image();
  doodlerRightImg.src = "./img/doodler-right.png"
  doodler.img = doodlerRightImg;
  doodlerRightImg.onload = function(){
    context.drawImage(doodler.img,doodler.x,doodler.y,doodler.width,doodler.height);
  }

  doodlerLeftImg = new Image();
  doodlerLeftImg.src = "./img/doodler-left.png";

  platformImg = new Image();
  platformImg.src = "./img/platform.png";



  velocityY = initialVelocityY;
  placePlatforms();
 

  requestAnimationFrame(update);
  document.addEventListener("keydown", moveDoodler);
  document.addEventListener('touchstart', moveDoodler);

 

}




function update(){
  requestAnimationFrame(update);

  if(gameOver){
    return;
  }

  context.clearRect(0,0 , boardwidth , boardHeight);

  

  //doodler
  doodler.x += velocityX;
  if( doodler.x > boardwidth){
    doodler.x = 0;
  }
  else if (doodler.x + doodler.width <0 ){
   doodler.x = boardwidth;
  }


  velocityY += gravity;

  doodler.y += velocityY;
  if(doodler.y > board.height){
    gameOver = true
  }
  context.drawImage(doodler.img,doodler.x,doodler.y,doodler.width,doodler.height);


  //platforms
  for (let i = 0 ; i < platformArray.length; i++){
    let plaform = platformArray[i];

    if(velocityY < 0 && doodler.y < boardHeight*3/4 )
    {
      plaform.y -= initialVelocityY ; //slide platform down
    }
    if(detectCollision(doodler,plaform) && velocityY >=0){
      velocityY = initialVelocityY; //jump
    }

    context.drawImage(plaform.img,plaform.x,plaform.y,plaform.width,plaform.height);
  }

  //clear platforms and add new platform
  while (platformArray.length > 0 && platformArray[0].y >= boardHeight){
    platformArray.shift(); //removes first element from the array
    newPlatform(); // replace with new platform on top
  }

  //score
  updateScore();
  context.fillStyle = "white";
  context.font = "16px sans-serif";
  context.fillText(score, 5,20);

  if(gameOver){
    context.fillStyle = "white";
    context.fillText("Game over: press 'Space' or 'click'",boardwidth/15,boardHeight*7/8)
    context.fillText("to Restart", boardwidth / 3, boardHeight * 7 / 8 + 20);
  }

}


function moveDoodler(e) {
  if (((e.code == "ArrowRight" || e.code == "KeyD") && !gameOver) || (e.type === 'touchstart' && e.touches[0].clientX > window.innerWidth / 2)) {
    // Move right
    velocityX = 4;
    doodler.img = doodlerRightImg;
  } else if (((e.code == "ArrowLeft" || e.code == "KeyA") && !gameOver) || (e.type === 'touchstart' && e.touches[0].clientX < window.innerWidth / 2)){
    // Move left
    velocityX = -4;
    doodler.img = doodlerLeftImg;
  } else if (e.code == "Space" && gameOver) {
    // Reset the game
    resetGame();
  }
}

// Function to reset the game
function resetGame() {
  doodler = {
    img: doodlerRightImg,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodleHeight
  };
  velocityX = 0;
  velocityY = initialVelocityY;
  score = 0;
  maxScore = 0;
  gameOver = false;
  placePlatforms();
}

// Add an event listener for touchstart
document.addEventListener('touchstart', function(event) {
  // Check if the game is over
  if (gameOver) {
    // Reset the game
    resetGame();
  }
});




// By me
// function moveDoodler(e){
//   if (e.code == "ArrowRight" || e.code == "KeyD" ){

//     //move right
//     velocityX = 4;
//     doodler.img = doodlerRightImg;

//   }
//   else if (e.code == "ArrowLeft" || e.code == "KeyA" ){
//  //move left
//  velocityX = -4;
//  doodler.img = doodlerLeftImg;
//   }

//   else if(e.code == "Space"  && gameOver){
//     //reset
//      doodler = {
//       img : doodlerRightImg,
//       x : doodlerX,
//       y : doodlerY,
//       width : doodlerWidth,
//       height : doodleHeight
//     }
//     velocityX = 0;
//     velocityY = initialVelocityY;
//     score = 0;
//     maxScore =  0;
//     gameOver = false;
//     placePlatforms();
    
    
//   }
// }



function placePlatforms(){
  platformArray = [];

  //starting plaforms
  let platform = {
    img : platformImg,
    x : boardwidth/2,
    y : boardHeight -50,
    width : platformWidth,
    height : platformHeight

  }

  platformArray.push(platform);

  //  platform = {
  //   img : platformImg,
  //   x : boardwidth/2,
  //   y : boardHeight -150,
  //   width : platformWidth,
  //   height : platformHeight

  // }

  // platformArray.push(platform);

 for (let i=0; i<6 ; i++){
  let randomX = Math.floor(Math.random() * boardwidth*3/4);//(0-1 )* boardwidth*3/4
  let platform = {
    img : platformImg,
    x : randomX,
    y : boardHeight - 75 *i-150,
    width : platformWidth,
    height : platformHeight

  }

  platformArray.push(platform);
 }

}

function newPlatform(){
  let randomX = Math.floor(Math.random() * boardwidth*3/4);//(0-1 )* boardwidth*3/4
  let platform = {
    img : platformImg,
    x : randomX,
    y : -platformHeight,
    width : platformWidth,
    height : platformHeight

  }

  platformArray.push(platform);
 

}



function detectCollision(a,b){

  return a.x <b.x +b.width &&    //a's top left corner doesn't reach b's top right cirner
  
  a.x + a.width > b.x && //a's top right corner passws b's top left corner
  a.y <b.y +b.height &&  //a's top left corner doesn't reach b's bottom left corner
  a.y + a.height > b.y ; //a's bottom left corner passes b's top left corner

}

function updateScore(){
  let points = Math.floor(50*Math.random()); //(0-1)*50 -> (0-50)
  if(velocityY < 0){  //negative going up
maxScore += points;
if(score < maxScore)
{
  score = maxScore;
}
  }
  else if(velocityY >=0 ){
    maxScore -= points;
  }
}










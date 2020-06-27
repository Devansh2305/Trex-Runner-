// game state varibalbes
var PLAY=1;
var END=0;
var gameState=PLAY;

//game over and restart sprite and image variables
var gameOver,gameOverImg,restart,restartImg;

//trex sprite and images variables
var trex, trex_running, trex_collided;

//ground sprite and image varibales
var ground, invisibleGround, groundImage;

//cloud sprite,grp and image variables
var cloud,cloudsGroup, cloudImage;

//obstacle sprite, images and group variables
var obstacle,obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var checkPointSound,jumpSound,dieSound;

localStorage["HighestScore"]=0;
function preload(){
  
  //LOADING ALL IMAGES,SOUNDS AND ANIMATION
  
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImg=loadImage("restart.png");
  gameOverImg=loadImage("gameOver.png");
  
  checkPointSound=loadSound("checkPoint.mp3");
  dieSound=loadSound("die.mp3");
  jumpSound=loadSound("jump.mp3");
}

function setup() {
  createCanvas(600,200);
  
  //creating Trex
  trex = createSprite(50,180,20,50)
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);

  trex.scale = 0.5;
  
  //creating ground
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -6;
  
  //creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //creating restart icon
  restart=createSprite(300,90,10,10);
  restart.addImage("restart",restartImg);
  restart.scale=0.5;
  
  //creating game over message
  gameOver=createSprite(300,120,10,10);
  gameOver.addImage("game over",gameOverImg);
  gameOver.scale=0.5
  
  //invisible by default
  gameOver.visible=false;
  restart.visible=false;
  
  //creating groups for similar objects
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(180);
  if(localStorage["HighestScore"]>0)
  text("High Score : "+ localStorage["HighestScore"],400,50);
  if(gameState===PLAY)
  {
    //calculating score
    score = score + Math.round(getFrameRate()/60);
   // score=score+0.2;
   // score=Math.round(score);
  //check point sound after each 100 score
    if(score>0 && score%100===0)
    {
      console.log("chkpoint");
      checkPointSound.play();
    }
  
    
    //trex jump with space
    if(keyDown("space") && trex.y>=161)
    {
      trex.velocityY = -12;
      jumpSound.play();
    }
 
    //adding gravity to trex
    trex.velocityY = trex.velocityY + 0.8
    
    //reseting ground to give illusion of infinite ground
    if (ground.x < 0)
    {
      ground.x = ground.width/2;
    }
    
    // creating clouds and obstacles
    spawnClouds();
    spawnObstacles();
    
    // trex collision with obstacle
    if(obstaclesGroup.isTouching(trex))
    {
      dieSound.play();
      gameState=END;
    }
    
  }
  
  else if (gameState===END)
  {
    //everything freezes
    ground.velocityX=0;
    trex.velocityY=0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
   
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //gameover and restart is visible 
    gameOver.visible=true;
    restart.visible=true;
   
    // trex from running to collided
    trex.changeAnimation("collided",trex_collided);

    //restart
    if(mousePressedOver(restart) && gameState===END)
    {
      reset();
     // text("High Score : "+ localStorage["HighestScore"],400,50);
    }
  }
  
  //displaying score on screen
  text("Score: "+score, 500,50);
  
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset()
{
  //gamestate change
  gameState=PLAY;
  
  //restart and gameover invisible
  restart.visible=false;
  gameOver.visible=false;
  
  //destroy clouds and obstacles
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  //again moving ground 
  ground.velocityX=-6;
  
  //trex back to running
  trex.changeAnimation("running",trex_running);

  //storing the high score 
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"]=score;
  }
  //reset score to 0
  score=0;
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.45;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
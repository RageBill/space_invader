/* 
*************************************************************************************************
*  Helpers For Space Invaders Project - they are classes/functions which are ready to be used.  *
*************************************************************************************************
The helper functions here will help us simplify, reuse and order our codes more nicely.
*/

/*
***********************
*  Utility Functions  *
***********************
Utility functions here are for specific purposes in our game.
*/

// Check for collision between 2 objects
function Colliding(a, b){
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
}

// Game Over Function
function GameOver(screen, win){
  screen.clear(); // Clear the screen
  screen.ctx.font = "64px serif"; // Size of 
  screen.ctx.fillStyle = "white";
  screen.ctx.textAlign = "center";
  if(win){
    screen.ctx.fillText("You Win!!", screen.width / 2, screen.height / 2);
  } else {
    screen.ctx.fillText("Game Over", screen.width / 2, screen.height / 2);
  }
  document.getElementById("retry").style.display = "flex";
}

/*
*******************************************
*  Classes for Creating Object Instances  *
*******************************************

  There are 3 classes in this game:
  1. Screen
  2. Sprite
  3. Bullet
*/

// Class Definition for Screen
class Screen {
  constructor(width, height){
    this.width = width;
    this.height = height;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");

    document.getElementById("retry").before(this.canvas);
  }

  // drawSprite method to simplify drawing sprite on screen from 8 inputs to 3 inputs
  drawSprite(sprite, x, y) {
    this.ctx.drawImage(sprite.img, sprite.x, sprite.y, sprite.width, sprite.height, x, y, sprite.width, sprite.height);
  }

  // clear method to clear everything on the screen
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  // drawBullet method to draw the bullet on the screen
  drawBullet(bullet) {
    this.ctx.fillStyle = bullet.color;
    this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

// Class Definition for Sprite
class Sprite {
  constructor(img, x, y, width, height){
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

// Class Definition for Bullet
class Bullet {
  constructor(x, y, speed_y, width, height, color){
    this.x = x;
    this.y = y;
    this.speed_y = speed_y,
    this.width = width;
    this.height = height;
    this.color = color;
  }

  // update method for updating bullet's position with its speed in y-direction
  update() {
    this.y += this.speed_y;
  }
}

class City {
  constructor(tank, citySprite){
    this.sprite = citySprite;
    this.canvas = null; // City sprite will have its own canvas to be drawn on top of our original one
    this.y = tank.y - (30 + citySprite.height); // Putting cities 30 pixels on top of the tank
    this.height = citySprite.height;
  }

  // init() function for cities' canvas
  init(){
    this.canvas = document.createElement("canvas");
    this.canvas.width = screen.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");

    // Drawing 4 city sprites
    for(let i = 0; i < 4; i++){
      let citySprite = this.sprite;
      this.ctx.drawImage(citySprite.img, citySprite.x, citySprite.y, citySprite.width, citySprite.height, 68 + 111 * i, 0, citySprite.width, citySprite.height);
    }
  }

  // takeDamage() function generates damaged image for when the cities take a bullet shot
  takeDamage(x, y){
    x = Math.floor(x / 2) * 2;
    y = Math.floor(y / 2) * 2;

    this.ctx.clearRect(x-2, y-2, 4, 4);
    this.ctx.clearRect(x+2, y-4, 2, 4);
    this.ctx.clearRect(x+4, y, 2, 2);
    this.ctx.clearRect(x+2, y+2, 2, 2);
    this.ctx.clearRect(x-4, y+2, 2, 2);
    this.ctx.clearRect(x-6, y, 2, 2);
    this.ctx.clearRect(x-4, y-4, 2, 2);
    this.ctx.clearRect(x-2, y-6, 2, 2);
  }

  // gotHit() function for checking if the cities take a bullet shot
  gotHit(x, y){
    y -= this.y; // Getting the relative position of y on cities' own canvas
    let data = this.ctx.getImageData(x, y, 1, 1);
    // data = R, G, B, Alpha Channel (transparency, 255 means fully visible)
    if(data.data[3] != 0){
      this.takeDamage(x, y);
      return true;
    }
    return false;
  }
}
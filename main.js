//canvas is a built-in web API that allows you to do 2D animations in the browser

//set up our canvas
//gives us access to drawing properties
const canvas = document.querySelector('canvas');

//give it context - A context object includes information about colors, line widths, fonts, and other graphic parameters that can be drawn on a canvas.
const ctx = canvas.getContext('2d')
//Returns an object that provides methods and properties for drawing and manipulating images and graphics on a canvas element in a document. 

//set where on the browser we want to draw our animation

//setting the width to only what you can see called the viewport
const width = canvas.width = window.innerWidth;
//innerWidth is the inner width of the window or more accurately viewport (not including toolbars, window chrome, etc.; but including the space occupied by the vertical scrollbar, if any).

//The innerHeight property returns the height of a window's content area.
const height = canvas.height = window.innerHeight;

//our functions should really only do one thing
// function to generate random number

//The random() function takes two numbers as arguments, and returns a random number in the range between the two.

//Math.random() returns a value in the range [0, 1). 0 is included but 1 is excluded.
//max = 10 and min 5, then within the range you would have six available numbers not 5 cuz 5, 6, 7, 8, 9, 10 is six numbers.
//If I do max - min I get 5 which is 1 short. max - min gives you the distance from 5 to 10
//You always have to add 1 to that if you want the total amount of numbers = (max - min + 1)
//At this point the formula can generate the correct amount of numbers but they always start at 0 because the range from Math.random starts from 0.
  //0, 1, 2, 3, 4,  5 // What we have
  //5, 6, 7, 8, 9, 10 // What we want
//So if we add the min value onto the end of our formula, it will shift all the numbers over to the ones we want.
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//function to generate a random RGB color
//The randomRGB() function generates a random color represented as an rgb() string.

function randomRGB() {
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`
}

//building our balls with constructor

//x and y coordinates — the horizontal and vertical coordinates where the ball starts on the screen.
//horizontal and vertical velocity (velX and velY)(the speed and angle the balls move on the canvas) — each ball is given a horizontal and vertical velocity; 
class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

  //ctx = canvas.getContext('2d')
  draw() {
    ctx.beginPath(); //start drawing the shape
    ctx.fillStyle = this.color; //define what color we want the shape to be
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); //trace an arc shape on the paper
      //The x and y position of the arc's center
      //size property is the radius of the arc
      //The last two parameters specify the start and end number of degrees around the circle that the arc is drawn between. Here we specify 0 degrees, and 2 * PI, which is the equivalent of 360 degrees in radians (the arc method uses radians)
    ctx.fill(); //states "finish drawing the path we started with beginPath(), and fill the area it takes up with the color we specified earlier in fillStyle."
  }

  update() {
    //if the ball is hitting the edge of the screen in the horizontal (or x) direction

    //we include the size of the ball in the calculation because the x/y coordinates are in the center of the ball, but we want the edge of the ball to bounce off the perimeter — we don't want the ball to go halfway off the screen before it starts to bounce back.

    //hits right side of the screen; the width in this statement is the width of the screen
    if((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    //hits left side of the screen
    if((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    //hits the top edge of the screen
    if((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    //hits the bottom edge of the screen
    if((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    //we need to move the ball and how we do that in animation terms is that each time we redraw the ball (for each frame in the animation that we redraw), we want to redraw it in a slightly different location because thats how animations simulates movement.
    
    //so with each frame, take the existing x location and add the the velocity X value to the x coordinate because it will redraw it in a slightly different position according to the current velocity (thats going to control how fast it looks like its going) - higher velocity will be redrawn further away with each frame and lower velocity will be redrawn closer together with each frame
    this.x += this.velX;

    //so with each frame, take the existing y location and add the the velocity Y value to the y coordinate because it will redraw it in a slightly different position according to the current velocity
    this.y += this.velY;
  }
  
  collisionDetect() {
    //For each ball, we need to check every other ball to see if it has collided with the current ball. To do this, we start another for...of loop to loop through all the balls in the balls[] array.
    for (const ball of balls) {
      //Immediately inside the for loop, we use an if statement to check whether the current ball being looped through is the same ball as the one we are currently checking. We don't want to check whether a ball has collided with itself

      
      if (!(this === ball)) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
          //This algorithm works by taking the center points of the two circles and ensuring the distance between the center points are less than the two radii added together.
          if (distance < this.size + ball.size) {
          // collision detected!
          //If a collision is detected, the code inside the inner if statement is run. 
          //In this case we only set the color property of both the circles to a new random color. 
            ball.color = this.color = randomRGB();
          }
      }
    }
  }
 
}

/* while (condition) {
  // code block to be executed
} */

const balls = [];

while (balls.length < 50) {
  const size = random(10, 40);
  const ball = new Ball (
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    //
    random(0 + size, width - size), // x-coordinate
    random(0 + size, height - size), //y-coordinate
    random(-10, 10), //velX
    random(-10, 10), //velY
    randomRGB(), // color
    size
  );
    //then push()es it onto the end of our balls array, but only while the number of balls in the array is less than 25.
  balls.push(ball)
}

//All programs that animate things generally involve an animation loop, which serves to update the information in the program and then render the resulting view on each frame of the animation; this is the basis for most games and other such programs.

function loop() {
  //The color of the fill is set to semi-transparent, rgba(0,0,0,0.25), to allow the previous few frames to shine through slightly, producing the little trails behind the balls as they move.
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';

  //Sets the canvas fill color to semi-transparent black, then draws a rectangle of the color across the whole width and height of the canvas, using fillRect() (the four parameters provide a start coordinate on each axis, and a width and height for the rectangle drawn). 
  //This serves to cover up the previous frame's drawing before the next one is drawn. If you don't do this, you'll just see long snakes worming their way around the canvas instead of balls moving! 
  ctx.fillRect(0, 0, width, height);

  //Loops through all the balls in the balls array, and runs each ball's draw() and update() function to draw each one on the screen, then do the necessary updates to position and velocity in time for the next frame.
  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  //Runs the loop function again using the requestAnimationFrame() method — when this method is repeatedly run and passed with the same function name, it runs that function a set number of times per second to create a smooth animation. 
  //This is generally done recursively — which means that the function is calling itself every time it runs, so it runs over and over again.
  requestAnimationFrame(loop);
}

loop();
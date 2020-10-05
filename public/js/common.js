
// Initilize Font
feather.replace()



// Animate bubbles
class Bubble { 
constructor(x, y, size, angleX, angleY) {
this.size = size;
this.x = x;
this.y = y;
this.angleX = angleX;
this.angleY = angleY;
}

//Setters and Getters
getSize() {
return this.size;
}

getX() {
return this.x;
}

getY() {
return this.y;
}

setX(x) {
this.x = x;
}

setY(y) {
this.y = y;
}

updatePosition() {
//Bubble motion
this.angleY -= Math.random();

this.y -= this.size / 15 + Math.max(0, Math.cos(this.angleY));
}

draw() {
context.beginPath();
context.fillStyle = "lightblue";
//Circle shape
context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true); 

context.fill(); 
}
}

//Reference to HTML canvas
const canvas = document.querySelector("#bubbles"); 
const context = canvas.getContext("2d");

canvas.width = window.innerWidth/2;
canvas.height = window.innerHeight;

const bubbleCount = 10;
const bubble = [];

for (let i = 0; i < bubbleCount; i++) {
const x = Math.random() * canvas.width;
const y = Math.random() * canvas.height;
const size = Math.floor(Math.random() * (10 - 5) + 2); // size of bubble
const angleX = Math.random() * (4 + 2) - 2;
const angleY = Math.random() * (4 + 2) - 2;

bubble.push(new Bubble(x, y, size, angleX, angleY));
}

drawCanvas();

function drawCanvas() {
context.clearRect(0, 0, canvas.width, canvas.height);

bubble.forEach(bubble => {
bubble.updatePosition();

//Reset bubble position once it goes off-screen
if (bubble.getY() < 0 - bubble.getSize()) {
bubble.setY(canvas.height);
}

bubble.draw();
});

requestAnimationFrame(drawCanvas);
}

//Listener for windowresize
window.addEventListener("resize", () => {
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
});

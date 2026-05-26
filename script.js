const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* 
   APPLICATION STAGE
   -----------------------------------------------------
   Handles:
   - Game logic
   - Player movement
   - Enemy movement
   - Score updates
 */

let score = 0;

let gamePaused = false;
let animationId;

const player = {
    x:50,
    y:50,
    radius:15,
    color:"lime",
    speed:4
};

const enemy = {
    x:700,
    y:500,
    radius:15,
    color:"red",
    speed:2
};

const keys = {};

document.addEventListener("keydown", (e) => {

    keys[e.key] = true;

    if(e.key === " " ){

        gamePaused = true;
    }

    if(e.key === "r" || e.key === "R"){

        if(gamePaused){

            gamePaused = false;

            gameLoop();
        }
    }

    if(e.key === "q" || e.key === "Q"){

    cancelAnimationFrame(animationId);

    alert("Game Stopped");
}

});

document.addEventListener("keyup", (e) => {

    keys[e.key] = false;

});

//  Maze Walls
 
const walls = [

    {x:100,y:100,w:200,h:20},
    {x:400,y:100,w:250,h:20},

    {x:150,y:200,w:20,h:150},
    {x:500,y:200,w:20,h:200},

    {x:250,y:300,w:200,h:20},

    {x:100,y:450,w:250,h:20},
    {x:450,y:450,w:200,h:20}

];

// Collectable Dots

let dots = [];

for(let i=0;i<15;i++){

    dots.push({
        x:Math.random()*700 + 50,
        y:Math.random()*500 + 50,
        radius:5
    });

}

/* 
   GEOMETRY STAGE
   -----------------------------------------------------
   Handles:
   - Position calculations
   - Collision calculations
   - Distance checking
*/

function update(){

    if(keys["ArrowUp"]) player.y -= player.speed;
    if(keys["ArrowDown"]) player.y += player.speed;
    if(keys["ArrowLeft"]) player.x -= player.speed;
    if(keys["ArrowRight"]) player.x += player.speed;


    if(enemy.x < player.x) enemy.x += enemy.speed;
    if(enemy.x > player.x) enemy.x -= enemy.speed;

    if(enemy.y < player.y) enemy.y += enemy.speed;
    if(enemy.y > player.y) enemy.y -= enemy.speed;


    walls.forEach(wall=>{

        if(
            player.x + player.radius > wall.x &&
            player.x - player.radius < wall.x + wall.w &&
            player.y + player.radius > wall.y &&
            player.y - player.radius < wall.y + wall.h
        ){
            player.x = 50;
            player.y = 50;
        }

    });


    dots = dots.filter(dot=>{

        const dx = player.x - dot.x;
        const dy = player.y - dot.y;

        const distance = Math.sqrt(dx*dx + dy*dy);

        if(distance < player.radius + dot.radius){

            score += 10;
            return false;
        }

        return true;
    });


    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;

    const distance = Math.sqrt(dx*dx + dy*dy);

    if(distance < player.radius + enemy.radius){

    alert("Game Over! Score: " + score);

    resetGame();
}
}

function resetGame(){

    player.x = 50;
    player.y = 50;

    enemy.x = 700;
    enemy.y = 500;

    score = 0;

    dots = [];

    for(let i=0;i<15;i++){

        dots.push({
            x:Math.random()*700 + 50,
            y:Math.random()*500 + 50,
            radius:5
        });

    }

}

/* 
   RASTERIZATION STAGE
   -----------------------------------------------------
   Draws objects onto pixels using Canvas API
 */

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score,20,30);

    ctx.strokeStyle = "#00f7ff";
    ctx.lineWidth = 4;

    walls.forEach(wall=>{

        ctx.strokeRect(wall.x,wall.y,wall.w,wall.h);

    });


    dots.forEach(dot=>{

        ctx.beginPath();
        ctx.arc(dot.x,dot.y,dot.radius,0,Math.PI*2);
        ctx.fillStyle = "yellow";
        ctx.fill();

    });


    ctx.beginPath();
    ctx.arc(player.x,player.y,player.radius,0,Math.PI*2);
    ctx.fillStyle = player.color;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(enemy.x,enemy.y,enemy.radius,0,Math.PI*2);
    ctx.fillStyle = enemy.color;
    ctx.fill();

}

function drawPauseScreen(){

    draw();

    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText("GAME PAUSED", 250, 250);

    ctx.font = "25px Arial";
    ctx.fillText("Press r to Resume", 290, 320);
}

// Main Game Loop

function gameLoop(){

    if(gamePaused){

        drawPauseScreen();
        return;
    }

    update();
    draw();

    animationId = requestAnimationFrame(gameLoop);
}

gameLoop();
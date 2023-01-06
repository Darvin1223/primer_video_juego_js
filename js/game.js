const canvas = document.querySelector("#game"); //llamamos al elemento canvas
const game = canvas.getContext("2d"); //aqui creamos el contexto del elemento .
let canvasSize;
let elementsSize;
const btnUp = document.getElementById("up"),
  btnDown = document.getElementById("down"),
  btnLeft = document.getElementById("left"),
  btnRight = document.getElementById("right");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");
const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};
let level = 0;
let enemiesPosition = [];
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;


const movePlayer = () => {
  const giftCollisionX =
    playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
  const giftCollisionY =
    playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);
  const gitfCollition = giftCollisionX && giftCollisionY;

  if (gitfCollition) {
    levelWin();
  }

  const enemyCollision = enemiesPosition.find((enemy) => {
    const enemyCollisionX = enemy.x.toFixed(2) == playerPosition.x.toFixed(2);
    const enemyCollisionY = enemy.y.toFixed(2) == playerPosition.y.toFixed(2);

    return enemyCollisionX && enemyCollisionY;
  });

  if (enemyCollision) {
    console.log("Chocaste contra un enemigo");
    levelLose();
  }

  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
};

/* This is the main function */
const startGame = () => {
  // ejemplo
  game.font = `${elementsSize}px Lato`;
  game.textAlign = "end";

  // Con esta constante tomamos el elemento que esta en la posicion #1 o la posicion que quisieramos del array.
  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }
  if(!timeStart){
    timeStart = Date.now();
    timeInterval = setInterval(showTime,100);
    showRecord();
  }

  // En esta constante le asignamos el valor del elemento que tomamos en el array, y luegos usamos el metodo trim() para eliminar los espacio dentro de ese elemento, luego usamos el metodo split() que nos permite separar los elementos dependiendo el parametro que le pongamos, en este caso no le pusimos ninguno eso significa que va a separa elemento por elemento. Ejemplo let nombre ="Darvin"; al usar el metodo trim pasaria lo siguiente nombre.split(); el resultado seria el siguiente: 'D','a','r','v','i','n'.
  const mapRows = map.trim().split("\n");

  const mapRowCols = mapRows.map((row) => row.trim().split(""));

  enemiesPosition = [];

  game.clearRect(0, 0, canvasSize, canvasSize);

  mapRowCols.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colIndex + 1);
      const posY = elementsSize * (rowIndex + 1);

      if (col == "O") {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          // console.log({playerPosition})
        }
      } else if (col == "I") {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == "X") {
        enemiesPosition.push({
          x: posX,
          y: posY,
        });
      }
      game.fillText(emoji, posX, posY);
    });
  });
  showLives();
  movePlayer();
};

function gameWin() {
  console.log("terminaste el juego");
  clearInterval(timeInterval)
  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;
  if(recordTime){
    if(recordTime >= playerTime){
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = "Superaste el record!!"
    }else{
        pResult.innerHTML = "Lo siento no superaste el record 😔";
    }
  }else{
    localStorage.setItem('record_time', playerTime);
    pResult.innerHTML = "Primera vez?, pero ahora trata de superar tu tiempo";
  }
}

function levelWin() {
  console.log("Subiste de nivel");
  level++;
  startGame();
}
function levelLose() {
  lives--;

  if (lives <= 0) {
    console.log("Perdiste el nivel");
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function showLives() {
  let heartArray = Array(lives).fill(emojis["HEART"]);
  spanLives.innerHTML = "";
  heartArray.forEach((heart) => {
    spanLives.innerHTML += heart;
  });
}

function showTime(){
  spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time');
}
const setCanvasSize = () => {
  // canvasSize = window.innerWidth * 0.70; //solucion 1
  // let canvasSize;
  if (window.innerHeight > window.innerWidth) {
    //solucion 2
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }
  canvasSize = Number(canvasSize.toFixed(0));
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);
  // window.innerHeight //Para saber el alto de la ventana
  // window.innerWidth //para saberl el ancho de la ventana
  elementsSize = canvasSize / 10;
  console.log(elementsSize)
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
};

const moveUp = () => {
  if (playerPosition.y - elementsSize < elementsSize) {
    console.log("OUT");
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
};
const moveDown = () => {
  if (playerPosition.y + elementsSize > canvasSize) {
    console.log("OUT");
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
};
const moveLeft = () => {
  if (playerPosition.x - elementsSize < elementsSize) {
    console.log("OUT");
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
};
const moveRight = () => {
  if (playerPosition.x + elementsSize > canvasSize) {
    console.log("OUT");
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
};

const moveByKey = (e) => {
  let key = e.key;
  switch (key) {
    case "ArrowUp":
      moveUp();
      break;
    case "ArrowDown":
      moveDown();
      break;
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
    default:
      console.log("No esta precionando ningunas de las teclas disponible");
      break;
  }
};

document.addEventListener("keydown", moveByKey);
btnUp.addEventListener("click", moveUp);

btnDown.addEventListener("click", moveDown);

btnLeft.addEventListener("click", moveLeft);

btnRight.addEventListener("click", moveRight);

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

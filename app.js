document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const man = document.createElement("div");
  let isGameOver = false;
  let speed = 3;
  let platformCount = 5;
  let platforms = [];
  let score = 0;
  let manLeftSpace = 50;
  let startPoint = 150;
  let manBottomSpace = startPoint;
  const gravity = 0.9;
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;

  class Platform {
    constructor(newPlatBottom) {
      this.left = Math.random() * 315;
      this.bottom = newPlatBottom;
      this.visual = document.createElement("div");

      const visual = this.visual;
      visual.classList.add("platform");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platGap = 600 / platformCount;
      let newPlatBottom = 100 + i * platGap;
      let newPlatform = new Platform(newPlatBottom);
      platforms.push(newPlatform);
      console.log(platforms);
    }
  }

  function movePlatforms() {
    if (manBottomSpace > 200) {
      platforms.forEach((platform) => {
        platform.bottom -= 4;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + "px";

        if (platform.bottom < 10) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove("platform");
          platforms.shift();
          console.log(platforms);
          score++;
          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  function createMan() {
    grid.appendChild(man);
    man.classList.add("man");
    manLeftSpace = platforms[0].left;
    man.style.left = manLeftSpace + "px";
    man.style.bottom = manBottomSpace + "px";
  }

  function fall() {
    isJumping = false;
    clearInterval(upTimerId);
    downTimerId = setInterval(function () {
      manBottomSpace -= 5;
      man.style.bottom = manBottomSpace + "px";
      if (manBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach((platform) => {
        if (
          manBottomSpace >= platform.bottom &&
          manBottomSpace <= platform.bottom + 15 &&
          manLeftSpace + 60 >= platform.left &&
          manLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          console.log("tick");
          startPoint = manBottomSpace;
          jump();
          console.log("start", startPoint);
          isJumping = true;
        }
      });
    }, 25);
  }

  function jump() {
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      console.log(startPoint);
      console.log("1", manBottomSpace);
      manBottomSpace += 20;
      man.style.bottom = manBottomSpace + "px";
      console.log("2", manBottomSpace);
      console.log("s", startPoint);
      if (manBottomSpace > startPoint + 200) {
        fall();
        isJumping = false;
      }
    }, 30);
  }

  function moveLeft() {
    if (isGoingLeft) {
      return;
    }
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function () {
      if (manLeftSpace >= 0) {
        console.log("going left");
        manLeftSpace -= 5;
        man.style.left = manLeftSpace + "px";
      } else moveRight();
    }, 25);
  }

  function moveRight() {
    if (isGoingRight) {
      return;
    }
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(function () {
      //changed to 313 to fit man image
      if (manLeftSpace <= 313) {
        console.log("going right");
        manLeftSpace += 5;
        man.style.left = manLeftSpace + "px";
      } else moveLeft();
    }, 25);
  }

  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  //assign functions to keyCodes
  function control(e) {
    man.style.bottom = manBottomSpace + "px";
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    } else if (e.key === "ArrowUp") {
      moveStraight();
    }
  }

  function gameOver() {
    isGameOver = true;
    while (grid.firstChild) {
      console.log("remove");
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function start() {
    if (!isGameOver) {
      createPlatforms();
      createMan();
      setInterval(movePlatforms, 30);
      jump(startPoint);
      document.addEventListener("keyup", control);
    }
  }
  start();
});

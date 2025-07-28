const playBtn = document.getElementById('play-button');
let isPressed = false;
let hasPrayedAtCurrentTemple = false;

playBtn.addEventListener('mousedown', () => {
  playBtn.src = "Homescreen/Play_pressed.png";
  isPressed = true;
});

playBtn.addEventListener('mouseup', () => {
  if (isPressed) {
    playBtn.src = "Homescreen/Play.png";

    // Hide the home screen
    const homeScreen = document.getElementById('home-screen');
    homeScreen.style.display = "none";

    // Show the gameplay screen
    const gameScreen = document.getElementById('game-screen');
    gameScreen.style.display = "block";

    // Show the scrolling background
    const scrollingBg = document.getElementById('scrolling-bg');
    scrollingBg.style.display = "flex";

    isPressed = false;
  }
});

playBtn.addEventListener('mouseleave', () => {
  playBtn.src = "Homescreen/Play.png";
  isPressed = false;
});


// KISHORE WALKING GIF
let score = 0;
let isPraying = false;
let healthLevel = 0;

const player = document.getElementById('kishoreWalk');
const scoreValue = document.getElementById('score-value');
let scrollBg = document.getElementById('scrolling-bg');

// for later when we add temples
let currentTemple = null;
let healthBar = null;


// TEMPLE ANIMATION
let temple = document.getElementById('temple');
let templeSpeed = 7.0;
let templeX = window.innerWidth + Math.random() * 300 + 200;

temple.style.transform = `translateX(${templeX}px)`;

// Animate the temple toward the player
function moveTemple() {
  if (!isPraying) {
    templeX -= templeSpeed;
    temple.style.transform = `translateX(${templeX}px)`;

    // Respawn when off-screen
    if (templeX < -150) {
      templeX = window.innerWidth + Math.random() * 300 + 200;
      healthLevel = 0;
    }
  }

  requestAnimationFrame(moveTemple);
}

moveTemple();


// RAMDOM TEMPLES
const templeImages = [
  "GamePlay/Temple1.png",
  "GamePlay/Temple2.png",
  "GamePlay/Temple3.png",
  "GamePlay/Temple4.png",
  "GamePlay/Temple5.png"
];

function setRandomTempleImage() {
  const randomIndex = Math.floor(Math.random() * templeImages.length);
  temple.src = templeImages[randomIndex];
}


//Player and Temple Interaction
function moveTemple() {
  if (!isPraying) {
    templeX -= templeSpeed;
    temple.style.transform = `translateX(${templeX}px)`;

    checkTempleOverlap(); // ✅ NEW

    // Respawn temple if off-screen
    if (templeX < -150) {
    templeX = window.innerWidth + Math.random() * 300 + 200;
    healthLevel = 0;
    hasPrayedAtCurrentTemple = false;
    setRandomTempleImage(); // ✅ Randomize next temple
    }
  }

  requestAnimationFrame(moveTemple);
}


function checkTempleOverlap() {
  const playerRect = player.getBoundingClientRect();
  const templeRect = temple.getBoundingClientRect();

  const isOverlapping = !(
    playerRect.right < templeRect.left ||
    playerRect.left > templeRect.right ||
    playerRect.bottom < templeRect.top ||
    playerRect.top > templeRect.bottom
  );

  if (!isPraying && isOverlapping) {
    document.body.classList.add("can-pray");
  } else {
    document.body.classList.remove("can-pray");
  }
}

function checkTempleOverlapLoop() {
  checkTempleOverlap();
  requestAnimationFrame(checkTempleOverlapLoop);
}

checkTempleOverlapLoop();


function startPraying() {
  if (isPraying || hasPrayedAtCurrentTemple) return; // 🛑 prevent repeat prayer

  isPraying = true;
  hasPrayedAtCurrentTemple = true; // ✅ mark this temple as already prayed at

  scrollBg.style.animationPlayState = "paused";
  player.src = "GamePlay/KishorePraying.gif";
  document.getElementById('health-bar').src = "GamePlay/Healthbar_1.png";
  document.getElementById('health-bar').style.display = "block";

  healthLevel = 1;

  setTimeout(() => {
    if (isPraying && healthLevel === 1) {
      document.getElementById('health-bar').src = "GamePlay/Healthbar_2.png";
      healthLevel = 2;
    }
  }, 1500);

  setTimeout(() => {
    if (isPraying && healthLevel === 2) {
      document.getElementById('health-bar').src = "GamePlay/Healthbar_3.png";
      healthLevel = 3;

      setTimeout(() => {
        if (isPraying) {
          completePrayer();
        }
      }, 500);
    }
  }, 3000);
}


function completePrayer() {
  stopPraying();
  document.getElementById('health-bar').style.display = "none";

  if (score < 5) {
    score++;
    document.getElementById('score-value').src = `GamePlay/${score}-5-7-27-2025.png`;

    // ✅ Prevent multiple prayers at same temple
    hasPrayedAtCurrentTemple = true;

  }

  // ✅ Check after score is updated
  if (score >= 5) {
    showEndScreen();
  }
}



function stopPraying() {
  if (!isPraying) return;

  isPraying = false;
  scrollBg.style.animationPlayState = "running";
  player.src = "GamePlay/Kishorewalking.gif";
  document.getElementById('health-bar').style.display = "none";
  healthLevel = 0;

  console.log("Stopped praying...");
}



document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault(); // 👈 ADD THIS
    if (document.body.classList.contains('can-pray')) {
      startPraying();
    }
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    stopPraying();
  }
});



function showEndScreen() {
  // Hide gameplay
  document.getElementById('game-screen').style.display = "none";
  document.getElementById('scrolling-bg').style.display = "none";

  // Show end screen
  document.getElementById('end-screen').style.display = "block";
}


const replayBtn = document.getElementById('replay-button');

replayBtn.addEventListener('click', () => {
  // Reset values
  score = 0;
  healthLevel = 0;
  isPraying = false;
  canPrayForCurrentTemple = true;
  document.getElementById('score-value').src = "GamePlay/0-5-7-27-2025.png";
  document.getElementById('health-bar').style.display = "none";

  // Reset temple position
  templeX = window.innerWidth + Math.random() * 300 + 200;
  temple.style.transform = `translateX(${templeX}px)`;

  // Show gameplay again
  document.getElementById('end-screen').style.display = "none";
  document.getElementById('game-screen').style.display = "block";
  document.getElementById('scrolling-bg').style.display = "flex";
});

// Handle replay button press visual change
replayBtn.addEventListener('mousedown', () => {
  replayBtn.src = "Endscreen/Replay button pressed.png";
});

replayBtn.addEventListener('mouseup', () => {
  replayBtn.src = "Endscreen/Replay button.png";
});

replayBtn.addEventListener('mouseleave', () => {
  replayBtn.src = "Endscreen/Replay button.png";
});



// closing window 
const xButton = document.getElementById('x-button');

xButton.addEventListener('mousedown', () => {
  xButton.src = "Endscreen/X pressed.png";
});

xButton.addEventListener('mouseup', () => {
  xButton.src = "Endscreen/X button.png";
  window.close(); // ⚠️ Only works if the tab was opened via JS (like window.open)
});

xButton.addEventListener('mouseleave', () => {
  xButton.src = "Endscreen/X button.png";
});

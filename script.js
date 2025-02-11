let gameState = {
  playerChoice: '',
  battingTeam: '',
  wickets: 0,
  gameType: '',
  score: 0,
  wicketsLost: 0,
  maxNumbers: 6,
  history: [],
  overs: 0,
  balls: 0,
  maxOvers: 10,
  boundaries: 0,
  dotBalls: 0,
  firstInningsScore: 0,
  highestScore: 0,
  bestStrikeRate: 0,
  bestOver: 0,
  currentOverRuns: 0,
  isSecondInnings: false
};

// Initialize sounds
const runSound = document.getElementById('runSound');
const boundarySound = document.getElementById('boundarySound');
const wicketSound = document.getElementById('wicketSound');

// Initialize wickets buttons
const wicketsGrid = document.getElementById('wicketsGrid');
for (let i = 1; i <= 10; i++) {
  const button = document.createElement('button');
  button.className = 'number-btn';
  button.textContent = i;
  button.onclick = () => selectWickets(i);
  wicketsGrid.appendChild(button);
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

function makeChoice(choice) {
  gameState.playerChoice = choice;
  document.getElementById('playerChoice').textContent = choice;
  showScreen('numberScreen');
  updateNumberButtons(10); // For toss
}

function updateNumberButtons(max) {
  const grid = document.getElementById('numbersGrid');
  grid.innerHTML = '';
  for (let i = 1; i <= max; i++) {
      const button = document.createElement('button');
      button.className = 'number-btn';
      button.textContent = i;
      button.onclick = () => selectNumber(i);
      grid.appendChild(button);
  }
}

function selectNumber(num) {
  const computerNum = Math.floor(Math.random() * 10) + 1;
  const sum = num + computerNum;
  const isEven = sum % 2 === 0;
  const playerWins = (isEven && gameState.playerChoice === 'even') || 
                    (!isEven && gameState.playerChoice === 'odd');

  document.getElementById('playerNumber').textContent = num;
  document.getElementById('computerNumber').textContent = computerNum;
  document.getElementById('sum').textContent = sum;
  document.getElementById('result').textContent = isEven ? 'Even' : 'Odd';
  document.getElementById('winner').textContent = playerWins ? 
      'You won the toss!' : 'Computer won the toss!';

  const tossChoice = document.getElementById('tossChoice');
  if (playerWins) {
      tossChoice.style.display = 'block';
  } else {
      tossChoice.style.display = 'none';
      const computerChoice = Math.random() < 0.5 ? 'batting' : 'bowling';
      gameState.battingTeam = computerChoice === 'batting' ? 'computer' : 'player';
      document.getElementById('winner').textContent += 
          ` Computer chose ${computerChoice}!`;
      
      // Add setTimeout to give user time to read the result
      setTimeout(() => {
          showScreen('wicketsScreen');
      }, 2500);
  }

  showScreen('resultScreen');
}

function selectToss(choice) {
  gameState.battingTeam = choice === 'batting' ? 'player' : 'computer';
  showScreen('wicketsScreen');
}

function selectWickets(wickets) {
  gameState.wickets = wickets;
  showScreen('gameTypeScreen');
}

function selectGameType(type) {
  gameState.gameType = type;
  gameState.maxNumbers = type === 'classic' ? 6 : 10;
  gameState.maxOvers = type === 'classic' ? 10 : 20;
  initializeGame();
}

function initializeGame() {
  document.getElementById('currentScore').textContent = `${gameState.score}/${gameState.wicketsLost}`;
  document.getElementById('battingTeam').textContent = 
      gameState.battingTeam === 'player' ? 'You' : 'Computer';
  document.getElementById('oversCount').textContent = `${gameState.overs}.${gameState.balls}`;
  
  if (gameState.isSecondInnings) {
      document.getElementById('targetDisplay').textContent = 
          `Target: ${gameState.firstInningsScore + 1}`;
  }
  
  updateGameNumbers();
  updateRunRate();
  showScreen('gameScreen');
}

function updateGameNumbers() {
  const grid = document.getElementById('gameNumbers');
  grid.innerHTML = '';
  for (let i = 1; i <= gameState.maxNumbers; i++) {
      const button = document.createElement('button');
      button.className = 'number-btn';
      button.textContent = i;
      button.onclick = () => playTurn(i);
      grid.appendChild(button);
  }
}

function updateOvers() {
  gameState.balls++;
  if (gameState.balls === 6) {
      gameState.overs++;
      gameState.balls = 0;
      if (gameState.currentOverRuns > gameState.bestOver) {
          gameState.bestOver = gameState.currentOverRuns;
          document.getElementById('bestOver').textContent = gameState.bestOver;
      }
      gameState.currentOverRuns = 0;
  }
  document.getElementById('oversCount').textContent = 
      `${gameState.overs}.${gameState.balls}`;
}

function updateRunRate() {
  const totalOvers = gameState.overs + (gameState.balls / 6);
  const runRate = totalOvers > 0 ? (gameState.score / totalOvers).toFixed(2) : '0.00';
  document.getElementById('runRate').textContent = runRate;

  if (gameState.isSecondInnings) {
      const remainingBalls = (gameState.maxOvers * 6) - (gameState.overs * 6 + gameState.balls);
      const remainingRuns = gameState.firstInningsScore - gameState.score + 1;
      const reqRate = remainingBalls > 0 ? 
          ((remainingRuns / remainingBalls) * 6).toFixed(2) : '-';
      document.getElementById('reqRate').textContent = reqRate;
  }
}

function playSound(runs) {
  if (runs === 0) return;
  if (runs === 4 || runs === 6) {
      boundarySound.play();
  } else {
      runSound.play();
  }
}

function playTurn(playerNum) {
  const computerNum = Math.floor(Math.random() * gameState.maxNumbers) + 1;
  const isWicket = playerNum === computerNum;
  
  if (isWicket) {
      wicketSound.play();
      gameState.wicketsLost++;
      document.getElementById('wicketsThisOver').textContent = 
          parseInt(document.getElementById('wicketsThisOver').textContent) + 1;
  } else {
      const runs = gameState.battingTeam === 'player' ? playerNum : computerNum;
      playSound(runs);
      gameState.score += runs;
      gameState.currentOverRuns += runs;

      if (runs === 0) gameState.dotBalls++;
      if (runs === 4 || runs === 6) gameState.boundaries++;

      document.getElementById('boundaries').textContent = gameState.boundaries;
      document.getElementById('dotBalls').textContent = gameState.dotBalls;
  }

  updateOvers();
  updateRunRate();
  updateScoreboard();

  const ballResult = isWicket ? 'W' : (gameState.battingTeam === 'player' ? playerNum : computerNum);
  gameState.history.unshift(
      `Over ${gameState.overs}.${gameState.balls}: Player chose ${playerNum}, Computer chose ${computerNum} - ${ballResult}`
  );
  updateGameHistory();

  if (gameState.wicketsLost >= gameState.wickets || 
      gameState.overs >= gameState.maxOvers ||
      (gameState.isSecondInnings && gameState.score > gameState.firstInningsScore)) {
      endInnings();
  }
}

function updateGameHistory() {
  const history = document.getElementById('gameHistory');
  history.innerHTML = gameState.history
      .map(entry => `<div>${entry}</div>`)
      .join('');
}

function updateScoreboard() {
  document.getElementById('currentScore').textContent = 
      `${gameState.score}/${gameState.wicketsLost}`;
}

function endInnings() {
  if (!gameState.isSecondInnings) {
      gameState.firstInningsScore = gameState.score;
      gameState.isSecondInnings = true;
      // Reset for second innings
      gameState.score = 0;
      gameState.wicketsLost = 0;
      gameState.overs = 0;
      gameState.balls = 0;
      gameState.boundaries = 0;
      gameState.dotBalls = 0;
      gameState.currentOverRuns = 0;
      gameState.battingTeam = gameState.battingTeam === 'player' ? 'computer' : 'player';
      
      document.getElementById('targetDisplay').textContent = 
          `Target: ${gameState.firstInningsScore + 1}`;
      gameState.history = [];
      initializeGame();
  } else {
      endGame();
  }
}

function endGame() {
  const winner = gameState.score > gameState.firstInningsScore ? 
      gameState.battingTeam : (gameState.battingTeam === 'player' ? 'computer' : 'player');
  
  document.getElementById('finalScore').textContent = 
      `First Innings: ${gameState.firstInningsScore}\n` +
      `Second Innings: ${gameState.score}\n` +
      `${winner === 'player' ? 'You' : 'Computer'} won!`;
  
  if (gameState.score > gameState.highestScore) {
      gameState.highestScore = gameState.score;
      document.getElementById('highestScore').textContent = gameState.highestScore;
  }
  
  showScreen('finalScreen');
}

function resetGame() {
  gameState = {
      playerChoice: '',
      battingTeam: '',
      wickets: 0,
      gameType: '',
      score: 0,
      wicketsLost: 0,
      maxNumbers: 6,
      history: [],
      overs: 0,
      balls: 0,
      maxOvers: 10,
      boundaries: 0,
      dotBalls: 0,
      firstInningsScore: 0,
      bestOver: 0,
      currentOverRuns: 0,
      isSecondInnings: false
  };
  showScreen('choiceScreen');
}
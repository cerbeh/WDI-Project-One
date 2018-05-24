//generates a 10x10 grid with objects stored inside it.
const characterGrid = Array(10).fill(null).map(() => {
  return Array(10).fill(null).map(generateObject);
});

let scoreValue = 0;
let livesLeft = 5;
let clockIntervalTiming ;
let gameSpeedTiming;
let timerLength = 0;
let playerName ;

//Used to generate the initial objects that occupy the grid, ensuring they're all unique
function generateObject() {
  return {
    characterValue: 0,
    rowNumber: 0
  };
}

const pointsSystem = {
  leftClick: {
    neutral: -5,
    save: +15,
    kill: -15,
    blank: 0
  },
  rightClick: {
    neutral: -5,
    save: -15,
    kill: +15,
    blank: 0
  }
};

const levelDifficulty = {
  //Interval timings for each level difficulty
  'Level One': 2750,
  'Level Two': 2500,
  'Level Three': 2250,
  'Level Four': 2000,
  'Level Five': 1700,
  'Level Six': 1500,
  'Level Seven': 1250,
  'Level Eight': 1000,
  //Passes scoreValue through this function to understand what level has been reached so that speed can be changed.
  score: function() {
    if (scoreValue < 125) return 'levelOne';
    if (scoreValue >= 125 && scoreValue <250) return 'levelTwo';
    if (scoreValue >= 250 && scoreValue < 400) return 'levelThree';
    if (scoreValue >= 400 && scoreValue < 750) return 'levelFour';
    if (scoreValue >= 750 && scoreValue < 1000) return 'levelFive';
    if (scoreValue >= 1000 && scoreValue < 1300) return 'levelSix';
    if (scoreValue >= 1300 && scoreValue < 1500) return 'levelSeven';
    if (scoreValue >= 1500 && scoreValue < 2000) return 'levelEight';
  }
};

//This function feeds the grid data and the divs through and will
//append the colour of each corresponding div on the new objects data
function reAssignColours(array) {
  array.forEach(function(row, i) {
    const $rowElements = $('div[rowNumber*=' + i + ']');
    row.forEach(function(cell, j) {
      switch (cell.characterValue) {
        case 0:
          $rowElements.eq(j).attr('class', 'blank');
          break;
        case 1:
          $rowElements.eq(j).attr('class', 'neutral');
          break;
        case 2:
          $rowElements.eq(j).attr('class', 'kill');
          break;
        case 3:
          $rowElements.eq(j).attr('class', 'save');
          break;
      }
    });
  });
}

//Will receive the last row of the grid and check if any of the objects hold a value that should decrease lives
function lifeCheck(array) {
  array.forEach(function(element) {
    if (element.characterValue === 2 || element.characterValue === 3) livesLeft--;
  });
}

//Assigns random values to the objects in the first row of the grid
//and then calls on reAssignColours to change their colours.
function populateFirstRow(array) {
  array[0].forEach(function(element){
    element.characterValue = Math.round(Math.random()*3);
  });
}

//shifts all data inside characterGrid up one index and inserts a new element in index 0.
//then runs though the grid reassigning colours.

$(()=>{

  const highScores = window.localStorage;
  const $playButton = $('#play');
  const $resetButton = $('#reset');
  const $map = $('#map');
  const $score = $('.score');
  const $lives = $('.lives');
  const $clock = $('#clock-face');
  const $scoreBoard = $('.score-board');
  const $sideBar = $('.side-bar');
  const $submit = $('input:submit');
  const $input = $('input:text');
  const $playerName = $('#player-name');
  const $newPlayer = $('#new-player');
  const $highScore = $('.high-score');
  const $highScoreName = $('#high-score-name');
  const $highScoreValue = $('#high-score-value');
  const $level = $('#level');
  const $submitSection = $('.input-wrap');

  function setup() {
    pregameBoard();
    createBoard();
    defaultHighScores();
    orderHighScores();
  }

  /*
  ##########################
  ###Difficulty Settings####
  ##########################
  */

  function checkGameDifficulty() {
    switch(levelDifficulty.score()) {
      case 'levelTwo':
        increaseDifficulty('Level Two');
        console.log('level two');
        break;
      case 'levelThree':
        increaseDifficulty('Level Three');
        console.log('level three');
        break;
      case 'levelFour':
        increaseDifficulty('Level Four');
        break;
      case 'levelFive':
        increaseDifficulty('Level Five');
        break;
      case 'levelSix':
        increaseDifficulty('Level Six');
        break;
      case 'levelSeven':
        increaseDifficulty('Level Seven');
        break;
      case 'levelEight':
        increaseDifficulty('Level Eight');
        break;
    }
  }

  function increaseDifficulty(levelReached) {
    clearInterval(gameSpeedTiming);
    gameSpeedTiming = setInterval(startGame,levelDifficulty[levelReached]);
    $level.text(`Reached ${levelReached}`);
  }

  /*
  ##########################
  ########Game Logic########
  ##########################
  */

  function tileMover(array) {
    array.pop();
    array.unshift(Array(10).fill(null).map(generateObject));
    populateFirstRow(array);
    reAssignColours(array);
    lifeCheck(array[array.length-1]);
    updateScoreboard();
  }

  function checkGameOver() {
    //During testing you will change timerLength. Default should be 90
    if (timerLength === 90 || livesLeft <= 0) {
      clearInterval(clockIntervalTiming);
      clearInterval(gameSpeedTiming);
      orderHighScores();
      endGameBoard();
      updateScoreboard();
    }

  }

  function updateScoreboard() {
    $score.text(scoreValue);
    $lives.text(livesLeft);
    $clock.text(timerLength);
  }

  /*
  ##########################
  #######High Scores########
  ##########################
  */

  function defaultHighScores() {
    //This button can go somewhere on the highscore board?
    //highScores.clear();
    highScores.setItem('Edward', 700);
    highScores.setItem('Flamie', 500);
    highScores.setItem('Zeus', 250);
    highScores.setItem('s1mple', 100);
    highScores.setItem('electronic', 50);
  }

  function orderHighScores() {
    highScores.setItem(playerName, scoreValue);
    const scoreOrder = Object.values(highScores).sort(function(a,b){
      return b - a;
    });
    //console.log(scoreOrder);
    const nameOrder = Object.keys(highScores).sort(function(a,b){
      return highScores[b]-highScores[a];
    });
    //console.log(nameOrder);
    addHighScore(scoreOrder, nameOrder);
  }

  function addHighScore(score, name) {
    $highScoreName.empty();
    $highScoreValue.empty();
    for (let i = 0; i < 5; i++) {
      const $name = $('<li />');
      const $score = $('<li />');
      $name.text(`${i+1}: ${name[i]}`).appendTo($highScoreName);
      $score.text(score[i]).appendTo($highScoreValue);
    }
    console.log($highScoreName);
  }

  /*
  ##########################
  ####Click Interactions####
  ##########################
  */

  function handleClick(buttonClicked,x,y,$squareClicked) {
    playerClick(buttonClicked, $squareClicked);
    changeScore(x, y, $squareClicked);
  }

  function playerClick(buttonClicked, squareClicked) {
    scoreValue = scoreValue + pointsSystem[buttonClicked][squareClicked.attr('class')];
    updateScoreboard();
  }

  function changeScore(x, y, squareClicked) {
    updateScoreboard();
    characterGrid[x][y].characterValue = 0;
    squareClicked.attr('class', 'blank');
  }

  /*
  ##########################
  #######Game Starter#######
  ##########################
  */

  function startGame() {
    tileMover(characterGrid);
    checkGameDifficulty();
  }

  function playGame() {
    gameBoard();
    timerLength = 0;
    livesLeft = 5;
    scoreValue = 0;
    updateScoreboard();
    tileMover(characterGrid);
    clockIntervalTiming = setInterval(startTimer,1000);
    gameSpeedTiming = setInterval(startGame,levelDifficulty['Level One']);
    $level.text('Reached Level One');
    $level.slideDown();
  }

  function startTimer() {
    timerLength++;
    updateScoreboard();
    checkGameOver();
  }

  function resetGame() {
    emptyBoardColours(characterGrid);
    reAssignColours(characterGrid);
    gameBoard();
    $sideBar.slideDown();
    $resetButton.fadeOut();
    playGame();
  }

  /*
  ##########################
  ####Game Board States#####
  ##########################
  */

  function pregameBoard() {
    $map.hide();
    $newPlayer.hide();
    $scoreBoard.hide();
    $playButton.hide();
    $sideBar.css('width', '850px');
    $resetButton.hide();
    $level.hide();
  }

  function gameBoard() {
    $playButton.hide();
    $scoreBoard.fadeIn();
    $sideBar.animate({'width': '500px'}, 500, function() {
      $map.slideDown();
    });
  }

  function endGameBoard() {
    $map.slideUp();
    $sideBar.slideUp();
    $resetButton.show();
    $highScore.css({'height': '350px', 'width': '1075px'});
    $highScore.show();
    $newPlayer.show();
  }

  function createBoard() {
    $.each(characterGrid, (i, row) => {
      $.each(row, (j) => {
        const $element = $('<div />');
        characterGrid[i][j].rowNumber = i;
        $element.attr({
          class: 'blank',
          rowNumber: i
        });
        $element.data({x: i, y: j});
        $element.appendTo('#map');
      });
    });
  }

  function emptyBoardColours(array) {
    array.forEach(function(i){
      i.forEach(function(j){
        j.characterValue = 0;
      });
    });
  }

  /*
  ##########################
  ##########BUTTONS#########
  ##########################
  */
  //Submit Button
  $submit.on('click', function() {
    playerName = $input.val();
    $playerName.text(playerName);
    $submitSection.hide();
    $playButton.fadeIn();
    $highScore.hide();
  });


  //Play Button
  $playButton.on('click', playGame);

  //Left Click
  $map.on('click', 'div', function(){
    const x = $(this).data('x');
    const y = $(this).data('y');
    const $squareClicked = $(this);
    handleClick('leftClick',x,y,$squareClicked);
  });

  //Right Click
  $map.on('contextmenu', 'div', function(e) {
    const x = $(this).data('x');
    const y = $(this).data('y');
    const $squareClicked = $(this);
    handleClick('rightClick',x,y,$squareClicked);
    e.preventDefault();
  });

  //Reset Button
  $resetButton.on('click', resetGame);

  setup();
});

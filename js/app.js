//generates a 10x10 grid with objects stored inside it.
const characterGrid = Array(10).fill(null).map(() => {
  return Array(10).fill(null).map(generateObject);
});

let scoreValue = 0;
let livesLeft = 5;
let clockIntervalTiming ;
let gameSpeedTiming;
let timerLength = 0;

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
  levelOneSpeed: 2750,
  levelTwoSpeed: 2500,
  levelThreeSpeed: 2250,
  levelFourSpeed: 2000,
  levelFiveSpeed: 1500,
  levelSixSpeed: 1000,
  levelSevenSpeed: 750,
  levelEightSpeed: 500,
  //Passes scoreValue through this function to understand what level has been reached so that speed can be changed.
  score: function() {
    if (scoreValue < 150) return 'levelOne';
    if (scoreValue >= 125 && scoreValue <250) return 'levelTwo';
    if (scoreValue >= 250 && scoreValue < 400) return 'levelThree';
    if (scoreValue >= 400 && scoreValue < 750) return 'levelFour';
    if (scoreValue >= 750 && scoreValue < 1000) return 'levelFive';
    if (scoreValue >= 1000 && scoreValue < 1300) return 'levelSix';
    if (scoreValue >= 1300 && scoreValue < 1500) return 'levelSeven';
    if (scoreValue >= 1500 && scoreValue < 2000) return 'levelTwo';
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

  const $playButton = $('#play');
  const $resetButton = $('#reset');
  const $map = $('#map');
  const $score = $('.score');
  const $lives = $('.lives');
  const $clock = $('#clock');
  const $scoreBoard = $('.score-board');
  const $sideBar = $('.side-bar');


  //accepts arguments from the button click and adjusts the score
  function playerClick(buttonClicked, squareClicked) {
    scoreValue = scoreValue + pointsSystem[buttonClicked][squareClicked.attr('class')];
    $score.text(scoreValue);
  }

  //Increases the game difficulty depending on the score achieved so far.

  //This function is called gameDifficulty but also executes the code to be done every tick.
  //Move functions out of it? Have a different function that the game ticks are happening on
  //and they call on this function to change difficulty
  function gameDifficulty() {
    switch(levelDifficulty.score()) {
      case 'levelTwo':
        increaseDifficulty('levelTwoSpeed');
        break;
      case 'levelThree':
        increaseDifficulty('levelThreeSpeed');
        break;
      case 'levelFour':
        increaseDifficulty('levelFourSpeed');
        break;
      case 'levelFive':
        increaseDifficulty('levelFiveSpeed');
        break;
      case 'levelSix':
        increaseDifficulty('levelSixSpeed');
        break;
      case 'levelSeven':
        increaseDifficulty('levelSevenSpeed');
        break;
      case 'levelEight':
        increaseDifficulty('levelEightSpeed');
        break;
    }
    moveTilesDown(characterGrid);
    gameOver();
  }

  //function inside gameDifficulty that clears the timer, decreases it, and then sets the game at the new difficulty
  function increaseDifficulty(levelReached) {
    clearInterval(gameSpeedTiming);
    gameSpeedTiming = setInterval(gameDifficulty,levelDifficulty[levelReached]);
  }

  //arguement to be passed through the setInterval function to begin clock
  function startTimer() {
    timerLength++;
    $clock.text(timerLength);
    gameOver();
  }

  function moveTilesDown(array) {
    array.pop();
    array.unshift(Array(10).fill(null).map(generateObject));
    populateFirstRow(array);
    reAssignColours(array);
    lifeCheck(array[array.length-1]);
    $lives.text(livesLeft);
  }

  function gameOver() {
    if (timerLength === 300 || livesLeft <= 0) {
      clearInterval(clockIntervalTiming);
      clearInterval(gameSpeedTiming);
      endGameBoard();
      //Function to change scoreboard states? (Lives, score, time?)
      $lives.text(0);
    }
  }

  function scoreUpdater(x, y, squareClicked) {
    $score.text(scoreValue);
    characterGrid[x][y].characterValue = 0;
    squareClicked.attr('class', 'blank');
  }

  function playGame() {
    gameBoard();
    moveTilesDown(characterGrid);
    clockIntervalTiming = setInterval(startTimer,1000);
    gameSpeedTiming = setInterval(gameDifficulty,levelDifficulty['levelOneSpeed']);
  }

  /*
  ##########################
  ####Game Board States#####
  ##########################
  */

  function pregameBoard() {
    $map.hide();
    $scoreBoard.hide();
    $sideBar.css('width', '850px');
    $resetButton.hide();
  }

  //This will go in some sort of setup function?
  pregameBoard();

  function gameBoard() {
    $map.slideDown();
    $playButton.hide();
    $scoreBoard.show();
    $sideBar.css('width', '500px');
  }
  function endGameBoard() {
    $map.slideUp();
    $sideBar.hide();
    $resetButton.show();
  }

  /*
  ##########################
  ##########BUTTONS#########
  ##########################
  */

  //Left Click
  $map.on('click', 'div', function(){
    const x = $(this).data('x');
    const y = $(this).data('y');
    const buttonClicked = 'leftClick';
    const $squareClicked = $(this);

    //Needs refactoring. Repeated in both button clicks. Condense functions used?
    playerClick(buttonClicked, $squareClicked);
    scoreUpdater(x, y, $squareClicked);
  });

  //Right Click
  $map.on('contextmenu', 'div', function(e) {
    e.preventDefault();

    const x = $(this).data('x');
    const y = $(this).data('y');
    const buttonClicked = 'rightClick';
    const $squareClicked = $(this);

    //Needs refactoring. Repeated in both button clicks. Condense functions used?
    playerClick(buttonClicked, $squareClicked);
    scoreUpdater(x, y, $squareClicked);
  });

  //Play Button
  $playButton.on('click', playGame);

  //Reset Button
  $resetButton.on('click', function() {
    console.log('clicked');
  });

  //sets the css of each square in the grid depending on value entered in array
  $.each(characterGrid, (i, row) => {
    $.each(row, (j, cell) => {
      const $element = $('<div />');
      characterGrid[i][j].rowNumber = i;
      switch (cell.characterValue) {
        case 0:
          $element.attr('class', 'blank');
          break;
        case 1:
          $element.attr('class', 'neutral');
          break;
        case 2:
          $element.attr('class', 'kill');
          break;
        case 3:
          $element.attr('class', 'save');
          break;
      }
      $element.data({x: i, y: j});
      $element.attr('rowNumber', i);
      $element.attr('columnNumber', j);

      $element.appendTo('#map');
    });
  });
});

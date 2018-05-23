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
  levelFiveSpeed: 1700,
  levelSixSpeed: 1500,
  levelSevenSpeed: 1250,
  levelEightSpeed: 1000,
  //Passes scoreValue through this function to understand what level has been reached so that speed can be changed.
  score: function() {
    if (scoreValue < 150) return 'levelOne';
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

  const $playButton = $('#play');
  const $resetButton = $('#reset');
  const $map = $('#map');
  const $score = $('.score');
  const $lives = $('.lives');
  const $clock = $('#clock');
  const $scoreBoard = $('.score-board');
  const $sideBar = $('.side-bar');



  /*
  ##########################
  ###Difficulty Settings####
  ##########################
  */

  function gameDifficulty() {
    console.log('difficulty checked');
    switch(levelDifficulty.score()) {
      case 'levelTwo':
        increaseDifficulty('levelTwoSpeed');
        console.log('2');
        break;
      case 'levelThree':
        increaseDifficulty('levelThreeSpeed');
        console.log('3');
        break;
      case 'levelFour':
        increaseDifficulty('levelFourSpeed');
        console.log('4');
        break;
      case 'levelFive':
        console.log('5');
        increaseDifficulty('levelFiveSpeed');
        break;
      case 'levelSix':
        increaseDifficulty('levelSixSpeed');
        console.log('6');
        break;
      case 'levelSeven':
        console.log('7');
        increaseDifficulty('levelSevenSpeed');
        break;
      case 'levelEight':
        console.log('8');
        increaseDifficulty('levelEightSpeed');
        break;
    }
  }

  function increaseDifficulty(levelReached) {
    clearInterval(gameSpeedTiming);
    gameSpeedTiming = setInterval(gameStarter,levelDifficulty[levelReached]);
  }

  //arguement to be passed through the setInterval function to begin clock

  function moveTilesDown(array) {
    console.log('Tiles moved');
    array.pop();
    array.unshift(Array(10).fill(null).map(generateObject));
    populateFirstRow(array);
    reAssignColours(array);
    lifeCheck(array[array.length-1]);
    $lives.text(livesLeft);
  }

  function gameOver() {
    if (timerLength === 60 || livesLeft <= 0) {
      console.log('game over');
      clearInterval(clockIntervalTiming);
      clearInterval(gameSpeedTiming);
      endGameBoard();
      //Function to change scoreboard states? (Lives, score, time?)
      $lives.text(0);
    }

  }

  /*
  ##########################
  ####Click Interactions####
  ##########################
  */

  function handleClick(buttonClicked,x,y,$squareClicked) {
    playerClick(buttonClicked, $squareClicked);
    scoreUpdater(x, y, $squareClicked);
  }

  function playerClick(buttonClicked, squareClicked) {
    scoreValue = scoreValue + pointsSystem[buttonClicked][squareClicked.attr('class')];
    $score.text(scoreValue);
  }

  function scoreUpdater(x, y, squareClicked) {
    console.log('score updated');
    $score.text(scoreValue);
    characterGrid[x][y].characterValue = 0;
    squareClicked.attr('class', 'blank');
  }

  /*
  ##########################
  #######Game Starter#######
  ##########################
  */

  function gameStarter() {
    gameOver();
    moveTilesDown(characterGrid);
    gameDifficulty();
  }

  function playGame() {
    gameBoard();
    moveTilesDown(characterGrid);
    clockIntervalTiming = setInterval(startTimer,1000);
    gameSpeedTiming = setInterval(gameStarter,levelDifficulty['levelOneSpeed']);
  }

  function startTimer() {
    console.log('clock updated');
    timerLength++;
    $clock.text(timerLength);
    gameOver();
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
    $sideBar.slideUp();
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

  //Play Button
  $playButton.on('click', playGame);

  //Reset Button
  $resetButton.on('click', function() {
    console.log('clicked');
  });

  //sets the css of each square in the grid depending on value entered in array
  //This needs to go in to a function that can then be executed for a reset. So does the array filler.
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

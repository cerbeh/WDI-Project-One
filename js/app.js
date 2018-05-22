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
  levelOneSpeed: 3000,
  levelTwoSpeed: 2750,
  levelThreeSpeed: 2500,
  levelFourSpeed: 2000,
  levelFiveSpeed: 1500,
  levelSixSpeed: 1000,
  levelSevenSpeed: 750,
  levelEightSpeed: 500,
  //Passes scoreValue through this function to understand what level has been reached so that speed can be changed.
  score: function() {
    if (scoreValue < 150) return 'levelOne';
    if (scoreValue >= 150 && scoreValue <300) return 'levelTwo';
    if (scoreValue >= 300 && scoreValue < 500) return 'levelThree';
    if (scoreValue >= 500 && scoreValue < 750) return 'levelFour';
    if (scoreValue >= 750 && scoreValue < 1000) return 'levelFive';
    if (scoreValue >= 1000 && scoreValue < 1300) return 'levelSix';
    if (scoreValue >= 1300 && scoreValue < 1500) return 'levelSeven';
    if (scoreValue >= 1500 && scoreValue < 2000) return 'levelTwo';
  }
};

function gameOver() {
  if (timerLength === 300 || livesLeft <= 0) {
    clearInterval(clockIntervalTiming);
    clearInterval(gameSpeedTiming);
  }
}

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

  const $testbutton = $('#test');
  const $testbuttonTwo = $('#test2');
  const $map = $('#map');
  const $cellAddress = $('#cell-address');
  const $score = $('.score');
  const $lives = $('.lives');
  const $clock = $('#clock');

  //accepts arguments from the button click and adjusts the score
  function playerClick(buttonClicked, squareClicked) {
    scoreValue = scoreValue + pointsSystem[buttonClicked][squareClicked.attr('class')];
    $score.text(scoreValue);
  }

  //Increases the game difficulty depending on the score achieved so far.
  function gameDifficulty() {
    switch(levelDifficulty.score()) {
      case 'levelTwo':
        console.log('Reached Level Two');
        increaseDifficulty('levelTwoSpeed');
        break;
      case 'levelThree':
        console.log('Reached Level Three');
        increaseDifficulty('levelThreeSpeed');
        break;
      case 'levelFour':
        console.log('reached level four');
        increaseDifficulty('levelFourSpeed');
        break;
      case 'levelFive':
        console.log('reached level five');
        increaseDifficulty('levelFiveSpeed');
        break;
      case 'levelSix':
        console.log('reached level six');
        increaseDifficulty('levelSixSpeed');
        break;
      case 'levelSeven':
        console.log('reached level seven');
        increaseDifficulty('levelSevenSpeed');
        break;
      case 'levelEight':
        console.log('reached level Eight');
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
    //timerRunOut();
    //Event to happen when timer = 0. Clear screen or game over?
  }

  function moveTilesDown(array) {
    array.pop();
    array.unshift(Array(10).fill(null).map(generateObject));
    populateFirstRow(array);
    reAssignColours(array);
    lifeCheck(array[array.length-1]);
    $lives.text(livesLeft);
  }

  function scoreUpdater(x, y, squareClicked) {
    $score.text(scoreValue);
    characterGrid[x][y].characterValue = 0;
    squareClicked.attr('class', 'blank');
  }

  //shows the coordinates of square hovered over.
  $map.on('mouseover', 'div', function(){
    $cellAddress.val(`${ $(this).data('x') }-${ $(this).data('y') }`);
  });

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

    playerClick(buttonClicked, $squareClicked);
    scoreUpdater(x, y, $squareClicked);
  });

  //Test button one
  $testbuttonTwo.on('click', function() {

  });

  //Test button two
  $testbutton.on('click', function() {
    clockIntervalTiming = setInterval(startTimer,1000);
    gameSpeedTiming = setInterval(gameDifficulty,levelDifficulty['levelOneSpeed']);
    console.log(levelDifficulty['levelOneSpeed']);
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
        //case 4:
        //case 5:
      }
      $element.data({x: i, y: j});
      $element.attr('rowNumber', i);
      $element.attr('columnNumber', j);

      $element.appendTo('#map');
    });
  });
});

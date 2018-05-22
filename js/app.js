//generates a 10x10 grid with objects stored inside it.
const characterGrid = Array(10).fill(null).map(() => {
  return Array(10).fill(null).map(generateObject);
});

let scoreValue = 0;
let livesLeft = 5;

//Used to generate the initial objects that occupy the grid, ensuring they're all unique
function generateObject() {
  return {
    characterValue: 0,
    action: 2,
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

//This function feeds the grid data and the divs through and will
//append the colour of each corresponding div on the new objects data
function reAssignColours(array) {
  array.forEach(function(row, i) {
    const $rowElements = $('div[rowNumber*=' + i + ']');
    $rowElements.attr('class', 'save');
    row.forEach(function(cell, index) {
      switch (cell.characterValue) {
        case 0:
          $rowElements.eq(index).attr('class', 'blank');
          break;
        case 1:
          $rowElements.eq(index).attr('class', 'neutral');
          break;
        case 2:
          $rowElements.eq(index).attr('class', 'kill');
          break;
        case 3:
          $rowElements.eq(index).attr('class', 'save');
          break;
      }
    });
  });
}

function lifeCheck(array) {
  array.forEach(function(element) {
    if (element.characterValue === 2 || element.characterValue === 3) {
      livesLeft--;
    }
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

  //accepts arguements from the button click and adjusts the score
  function playerClick(buttonClicked, squareClicked) {
    scoreValue = scoreValue + pointsSystem[buttonClicked][squareClicked.attr('class')];
    $score.text(scoreValue);
  }

  function copyRowAbove(array) {
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
    console.log(squareClicked);
    squareClicked.attr('class', 'blank');
  }

  //shows the coordinates of square hovered over.
  $map.on('mouseover', 'div', function(){
    $cellAddress.val(`${ $(this).data('x') }-${ $(this).data('y') }`);
  });


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

  /*
  #############################
  Test Buttons
  #############################
  */

  $testbuttonTwo.on('click', function() {
    copyRowAbove(characterGrid);
  });

  $testbutton.on('click', function() {
    const leftClick = 'leftClick';
    const squareClicked = 'kill';
    playerClick(leftClick, squareClicked);
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

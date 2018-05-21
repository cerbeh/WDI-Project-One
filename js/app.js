//generates a 10x10 grid with objects stored inside it.
const characterGrid = Array(10).fill(null).map(() => {
  return Array(10).fill(null).map(generateObject);
});

//Used to generate the initial objects that occupy the grid,
//ensuring they're all unique
function generateObject() {
  return {
    characterValue: 0,
    playerCharacter: true,
    action: 2,
    rowNumber: 0
  };
}

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


//Assigns random values to the objects in the first row of the grid
//and then calls on reAssignColours to change their colours.
function populateFirstRow(array) {
  array[0].forEach(function(element){
    element.characterValue = Math.round(Math.random()*3);
  });
}

//shifts all daya inside characterGrid up one index and inserts a new element in index 0.
//then runs though the grid reassigning colours.
function copyRowAbove(array) {
  array.pop();
  array.unshift(Array(10).fill(null).map(generateObject));
  populateFirstRow(array);
  reAssignColours(array);
}

$(()=>{

  const $testbutton = $('#test');
  const $testbuttonTwo = $('#test2');
  const $map = $('#map');
  const $cellAddress = $('#cell-address');

  $testbuttonTwo.on('click', function() {
    copyRowAbove(characterGrid);
  });

  //Button now obselete due to function it passes being used on button two.
  $testbutton.on('click', function() {
    populateFirstRow(characterGrid);
  });

  $map.on('mouseover', 'div', function(){
    $cellAddress.val(`${ $(this).data('x') }-${ $(this).data('y') }`);
  });

  $map.on('click', 'div', function(){
    console.log($(this).attr('class'));


    // if ($('this').hasClass('save')) {
    //   console.log('SAVED!');
    // }
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

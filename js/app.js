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

//This function will grab the elements on the top row and reassign them based on the characterValue
//at the index of the array they correspond to.
/* we are currently asking it to specify a row number, but what if we grabbed the entire amount
of them and some how linke them with the entire array so that every time this function is run it
will grab the object data and then convert the div data based on that. */

function reAssignColours(array) {
  array.forEach(function(row, i) {
    const $rowElements = $('div[rowNumber*=' + i + ']');
    console.log($rowElements, i);
    row.forEach(function(cell, j) {
      //console.log(cell, j);
      //console.log(cell.characterValue);
      // switch (element.characterValue) {
      //   case 0:
      //     $rowElements.eq(i).attr('class', 'blank');
      //     break;
      //   case 1:
      //     $rowElements.eq(i).attr('class', 'neutral');
      //     break;
      //   case 2:
      //     $rowElements.eq(i).attr('class', 'kill');
      //     break;
      //   case 3:
      //     $rowElements.eq(i).attr('class', 'save');
      //     break;
      // }
    });
    //console.log(row);
    //console.log(index);
  });
  // for (let i = 0; i < array.length; i++) {
  //   const $rowElements = $('div[rowNumber*=' + i + ']');
  //   //console.log($rowElements);
  //   // console.log(array[i],i);
  //   // console.log($rowElements);
  //   $rowElements.each(function(index, element) {
  //     console.log(element);
  //     //console.log($rowElements);
  //     //console.log(index);
  //     //console.log(element, 'element');

  //     //console.log($rowElements);
  //   });
  // }
}


//Assigns random values to the objects in the first row of the grid
//and then calls on reAssignColours to change their colours.
function populateFirstRow(array) {
  array[0].forEach(function(element){
    element.characterValue = Math.round(Math.random()*3);
  });
  reAssignColours(array);
}



/* Rather then replacing the elements why arent we just popping the array at the end of the
array and then shifting in the new one with all the new properties.

In order to move them down we pop the last row, unshift in a new row and then populate first row. */

function copyRowAbove(array) {
  array.pop();
  array.unshift(Array(10).fill(null).map(generateObject));
  //console.log(array);
  //console.log(characterGrid[0][0]);
  //console.log(characterGrid[1][0]);
  const number = Math.round(Math.random()*10);
  populateFirstRow(array, number);
}

$(()=>{

  const $testbutton = $('#test');
  const $testbuttonTwo = $('#test2');
  const $map = $('#map');
  const $cellAddress = $('#cell-address');

  /*Can you create the equivalent array of characterGrid filled with the relevant divs.
  does this help with linking the two for colour changes.*/

  $testbuttonTwo.on('click', function() {
    copyRowAbove(characterGrid);
    reAssignColours();
  });

  $testbutton.on('click', function() {
    populateFirstRow(characterGrid);
  });

  $map.on('mouseover', 'div', function(){
    $cellAddress.val(`${ $(this).data('x') }-${ $(this).data('y') }`);
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

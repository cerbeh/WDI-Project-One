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
    action: 2
  };
}

//This function will grab the elements on the top row and reassign them based on the characterValue
//at the index of the array they correspond to.
function reAssignColours(array) {
  const $rowElements = $('div[rowNumber*=0]');
  //console.log($rowElements);
  //const $rowElements = $(`div[rowNumber*=${array[index].rowNumber}]`);
  $rowElements.each(function(index) {
    //console.log(element, 'element');
    switch (array[index].characterValue) {
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
      /*When game is built more, extra cases will be used
      to increase the odds on certain colours being used
      rather then current 25% for each*/
      // case 4:
      //   break;
      // case 5:
      //   break;
    }
  });
}


//Assigns random values to the objects in the first row of the grid
//and then calls on reAssignColours to change their colours.
function populateFirstRow(array) {
  console.log(array);
  array.forEach(function(element){
    element.characterValue = Math.round(Math.random()*3);
  });
  reAssignColours(array);
}



/* Rather then replacing the elements why arent we just popping the array at the end of the
array and then shifting in the new one with all the new properties.

In order to move them down we pop the last row, unshift in a new row and then populate first row.
*/

//function is currently copying all the information stored in row one down all the arrays.
function copyRowAbove(array) {
  console.log(array);
  array.pop();
  console.log(array);
  array.unshift(Array(10).fill(null).map(generateObject));
  console.log(array);
  populateFirstRow(array);
  // array.forEach(function(element, index) {
  //   //console.log(element, 'element');
  //   //console.log(index, array[index], 'array index');
  //   if (index > 0) {
  //     array[index] = array[index-1].slice();
  //   }
  //});
}

const $rowZeroDivs = $('div[rowNumber*=0]');

$(()=>{

  const $testbutton = $('#test');
  const $testbuttonTwo = $('#test2');
  const $map = $('#map');
  const $cellAddress = $('#cell-address');

  /*Can you create the equivalent array of characterGrid filled with the relevant divs.
  does this help with linking the two for colour changes.*/

  $testbuttonTwo.on('click', function() {
    copyRowAbove(characterGrid);
  });

  $testbutton.on('click', function() {
    populateFirstRow(characterGrid[0],);
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

function generateObject() {
  return {
    characterValue: Math.round(Math.random()*5),
    playerCharacter: true,
    action: 2
  };
}

//generates a 10x10 grid with objects stored inside it.
const characterGrid = Array(10).fill(null).map(() => {
  return Array(10).fill(null).map(generateObject);
});

//This function will grab the elements on the top row and reassign them based on the characterValue
//at the index of the array they correspond to.
function reAssignColours(array) {
  const $rowElements = $('div[rowNumber*=0]');
  console.log($rowElements);
  console.log(array);
  $rowElements.each(function(element) {
    switch (array[element].characterValue) {
      case 0:
        $rowElements.attr('class', 'blank');
        break;
      case 1:
        $rowElements.attr('class', 'neutral');
        break;
      case 2:
        $rowElements.attr('class', 'kill');
        break;
      case 3:
        $rowElements.attr('class', 'save');
        break;
      // case 4:
      //   break;
      // case 5:
      //   break;
    }
  });
}


function populateFirstRow(array) {
  array.forEach(function(element){
    console.log(element.characterValue, 'before');
    element.characterValue = Math.round(Math.random()*3);
    console.log(element.characterValue, 'after');
  });
  reAssignColours(array);
}


// function populateFirstRow(array) {
//   return array.map()
//
//   array.forEach(function(i){
//     const object = generateObject();
//     console.log(object.characterValue);
//     reassignValue(index, object);
//   });
// };


$(()=>{

  const $testbutton = $('#test');
  const $map = $('#map');
  const $cellAddress = $('#cell-address');

  $testbutton.on('click', function() {
    populateFirstRow(characterGrid[0]);
  });

  $map.on('mouseover', 'div', function(){
    $cellAddress.val(`${ $(this).data('x') }-${ $(this).data('y') }`);
  });

  //sets the css of each square in the grid depending on value entered in array
  $.each(characterGrid, (i, row) => {
    $.each(row, (j, cell) => {
      const $element = $('<div />');
      switch (cell.characterValue) {
        case 0:
        case 1:
        case 2:
          $element.attr('class', 'blank');
          break;
        case 3:
          $element.attr('class', 'neutral');
          break;
        case 4:
          $element.attr('class', 'kill');
          break;
        case 5:
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

function characterGenerator() {
  return +[Math.floor(Math.random()*5)];
}

function generateObjects() {
  return {
    characterValue: characterGenerator(),
    playerCharacter: true,
    action: 2
  };
}

const objectValues = {
  characterValue: 0,
  playerCharacter: true,
  action: 2
};

//generates a 10x10 grid with objects stored inside it.
const characterGrid = Array(10).fill(Array(10).fill(objectValues));

//This function will grab the elements on the top row and reassign them based on the characterValue
//at the index of the array they correspond to.
function reAssignColours(array) {
  const $rowElements = $("div[rowNumber*='0']");
  console.log($rowElements);
  $rowElements.each(function(element) {
    switch (array[element].characterValue) {
      case 0:
      case 1:
      case 2:
        $rowElements.attr('class', 'blank');
        break;
      case 3:
        $rowElements.attr('class', 'neutral');
        break;
      case 4:
        $rowElements.attr('class', 'kill');
        break;
      case 5:
        $rowElements.attr('class', 'save');
        break;
    }
  });
}

function reassignValue(index, object) {
  index.characterValue = object.characterValue;
}

//Currently this function is reassiging ALL object.characterValue in the grid to have the final value from the random number generator.
function populateFirstRow(array) {
  array.forEach(function(index){
    const object = generateObjects();
    console.log(object.characterValue);
    reassignValue(index, object);
  });

  /*
  var someArray = [  whatever  ];
// ...
someArray.forEach(function(arrayElement) {
  // ... code code code for this one element
  someAsynchronousFunction(arrayElement, function() {
    arrayElement.doSomething();
  });
});
*/



  reAssignColours(array);
}

$(()=>{

  const $testbutton = $('#test');

  $testbutton.on('click', function() {
    populateFirstRow(characterGrid[0]);
  });

  $('#map').on('mouseover', 'div', function(){
    $('#cell-address').val(`${ $(this).data('x') }-${ $(this).data('y') }`);
  });

  //sets the css of each square in the grid depending on value entered in array
  $.each(characterGrid, (i, row) => {
    $.each(row, (j, cell) => {
      const $element = $('<div />');
      switch (cell.characterValue) {
        case 0:
          $element.addClass('blank');
          break;
        case 1:
          $element.addClass('neutral');
          break;
        case 2:
          $element.addClass('kill');
          break;
        case 3:
          $element.addClass('save');
          break;
      }
      $element.data({x: i, y: j});
      $element.attr('rowNumber', i);
      $element.attr('columnNumber', j);

      $element.appendTo('#map');
    });
  });
});

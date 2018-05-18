function characterGenerator() {
  return +[Math.floor(Math.random()*6)];
}

const objectValues = {
  characterValue: 0,
  playerCharacter: true,
  action: 2
};
const characterGrid = Array(10).fill(Array(10).fill(objectValues));

function populateFirstRow(array) {

  const $rowElements = $("div[rowNumber*='0']");

  //changing the character value of the object.
  array[0].forEach(function(element) {
    element.characterValue = characterGenerator();
    console.log(element.characterValue);
  });

  console.log($rowElements);


  $rowElements.each(function(element) {
    //console.log(element.characterValue);
    switch (element.characterValue) {
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
    //$rowElements.appendTo('#map');
  });

}

$(()=>{

  const $testbutton = $('#test');

  $testbutton.on('click', function() {
    populateFirstRow(characterGrid);
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

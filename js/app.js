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


    //console.log(element.characterValue);


  //console.log($rowElements);

  //
  // const $rowElements = $("div[rowNumber*='0']");
  // $rowElements.each(function(element) {
  //   //console.log(element.characterValue);
  //   switch (element.characterValue) {
  //     case 0:
  //     case 1:
  //     case 2:
  //       $rowElements.attr('class', 'blank');
  //       break;
  //     case 3:
  //       $rowElements.attr('class', 'neutral');
  //       break;
  //     case 4:
  //       $rowElements.attr('class', 'kill');
  //       break;
  //     case 5:
  //       $rowElements.attr('class', 'save');
  //       break;
  //   }
  //   //$rowElements.appendTo('#map');
  // });

function populateFirstRow(array) {
  array[0].forEach(function(index){
    const object = generateObjects();
    console.log(object.characterValue);
    index.characterValue = object.characterValue;
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

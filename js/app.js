function characterGenerator() {
  return +[Math.floor(Math.random()*4)];
}

const objectValues = {
  characterValue: 0,
  playerCharater: 1,
  action: 1
};
const characterGrid = Array(10).fill(Array(10).fill(objectValues));

function populateFirstRow(array) {
  array[0][0].characterValue = characterGenerator();
}

//more arrays and then indexes to show what the character is in it and then the other for where the user is.
//or objects
//local storage for scoreboard if character position = bottom row (array length -1)

//as they fall they will be taking the value of the index above them





//need to randomly generate an array, and populate it with objects that have two values.

//every element of the character array wants to have an something in it that will somehow be what is returning the random numbers.

//something along the lines of objectName.function() and the function will generate the random number.

$(()=>{

  const $testbutton = $('#test');
  console.log($testbutton);

  $testbutton.on('click', function() {
    populateFirstRow(characterGrid);
    console.log('click');
  });

  $('#map').on('mouseover', 'div', function(){
    $('#cell-address').val(`${$(this).data('x')}-${$(this).data('y')}`);
  });

  //sets the css of each square in the grid depending on value entered in array
  $.each(characterGrid, (i, row) => {
    $.each(row, (j, cell) => {
      const $element = $('<div />');
      //This will turn in to a switch for what shows on the grid. possible outcomes will be 4.
      //Blank, Neutral, Kill, Save
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

      $element.on('click', function() {
        console.log($(this).data());
      });
      $element.appendTo('#map');
    });
  });
});

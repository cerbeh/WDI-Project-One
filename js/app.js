
//You will need two grids. One is for the characters and the other for the user. and then there'll be a function comparing
const grid = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0]
];

$(()=>{

  $('#map').on('mouseover', 'div', function(){
    $('#cell-address').val(`${$(this).data('x')}-${$(this).data('y')}`);
  });

  $.each(grid, (i, row) => {
    $.each(row, (j, cell) => {
      const $element = $('<div />');
      //This will turn in to a switch for what shows on the grid. possible outcomes will be 4.
      //Blank, Neutral, Kill, Save
      if(cell === 0) {
        $element.addClass('blank');
      } else if(cell === 1) {
        $element.addClass('path');
      }

      $element.data({x: i, y: j});

      $element.on('click', function() {
        console.log($(this).data());
      });
      $element.appendTo('#map');
    });
  });
});

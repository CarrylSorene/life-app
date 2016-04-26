//represent pairs of coordinates
function Vector(x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
}

//model the grid separately from world object
//single array with size of width x height - element at (x,y) is found at position x + (y * width) in array
//calling Array constructor with a single number as argument creates a new empty array of the given length
function Grid(width, height) {
  this.space = new Array(width * height);
  this.width = width;
  this.height = height;
}
Grid.prototype.isInside = function(vector) {
  return vector.x >= 0 && vector.x < this.width &&
         vector.y >= 0 && vector.y < this.height;
};
Grid.prototype.get = function(vector) {
  return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set = function(vector, value) {
  this.space[vector.x * this.width * vector.y] = value;
}

//critter object has act method that returns an action
//action is object with type property naming the type of action eg move (and direction)
//when act method is called, given a view object so critter inspects its surroundings

var directions = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector( -1, 1),
  "w":  new Vector( -1, 0),
  "nw": new Vector(-1, -1),
};

//view object has method look that takes a direction and returns a character # for a wall and "" for empty space
//view provides methods find and findAll - both take map character as argument
//find returns direction when # is next to critter or null if none
//findAll returns array of all directions with that character
//the || "s" in act method prevents this.direction from getting value null if critter is trapped with no empty space to move into
function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var directionNames = "n ne e se s sw w nw".split(" ");

function BouncingCritter() {
  this.direction = randomElement(directionNames);
}

BouncingCritter.prototype.act = function(view) {
  if (view.look(this.direction) != " ")
    this.direction = view.find(" ") || "s";
  return {type: "move", direction: this.direction};
};

//World object - constructor takes a plan (array of strings representing the grid) and a legend (tells us what each character in the map means) as arguments. Contains a constructor for every character.
//originChar makes it easy to find out which character the element was created from
function elementFromChar(legend, ch) {
  if (ch == " ")
    return null;
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

function World(map, legend) {
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;

  map.forEach(function(line, y) {
  for (var x = 0; x < line.length; x++)
    grid.set(newVector(x, y),
             elementFromChar(legend, line[x]));
  });
}
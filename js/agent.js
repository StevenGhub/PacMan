var GAMEBOARD = [];
var PX = 0 , PY = 0, preMove = [], STUCK = false;


var getXY = function(x, y) {
  var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP/2)/BUBBLES_GAP );
  var j = Math.floor((y - BUBBLES_Y_START + 9)/17.75);

  return {x: i, y: j};
}

var buildGameboard = function () {
  GAMEBOARD = [];
  for(var i = 0; i < 26; i++) {
    GAMEBOARD.push([]);
    for(var j = 0; j < 29; j++) {
      GAMEBOARD[i].push({
        bubble: false,
        superBubble: false,
        ghost: false,
        afraid: 0,
        pacman: false,
        eaten: false,
        visited: false,
        fruit: false,
        x: i,
        y: j
      });
    }
  }

  for(var i = 0; i < BUBBLES_ARRAY.length; i++) {
    var bubbleParams = BUBBLES_ARRAY[i].split( ";" );
    var y = parseInt(bubbleParams[1]) - 1;
    var x = parseInt(bubbleParams[2]) - 1;
    var type = bubbleParams[3];
    var eaten = parseInt(bubbleParams[4]);
    if (type === "b") {
      GAMEBOARD[x][y].bubble = true;
    } else {
      GAMEBOARD[x][y].superBubble = true;
    }
    if(eaten === 0) {
      GAMEBOARD[x][y].eaten = false;
    } else {
      GAMEBOARD[x][y].eaten = true;
    }
  }

  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      if(!GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].superBubble){
          GAMEBOARD[i][j] = null;
      }
    }
  }

  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      if((i === 0 && (j === 13)) ||
      (i === 1 && (j === 13)) ||
      (i === 2 && (j === 13)) ||
      (i === 3 && (j === 13)) ||
      (i === 4 && (j === 13)) ||
      (i === 6 && (j === 13)) ||
      (i === 7 && (j === 13)) ||
      (i === 8 && (j >= 10 && j <= 18)) ||
      (i === 9 && (j === 10 || j === 16)) ||
      (i === 10 && (j === 10 || j === 16)) ||
      (i === 11 && (((j >= 8) && (j <= 10)) || j === 16)) ||
      (i === 12 && (j === 10 || j === 16)) ||
      (i === 13 && (j === 10 || j === 16)) ||
      (i === 14 && (((j >= 8) && (j <= 10)) || j === 16)) ||
      (i === 15 && (j === 10 || j === 16)) ||
      (i === 16 && (j === 10 || j === 16)) ||
      (i === 17 && (j >= 10 && j <= 18)) ||
      (i === 18 && (j === 13)) ||
      (i === 19 && (j === 13)) ||
      (i === 21 && (j === 13)) ||
      (i === 22 && (j === 13)) ||
      (i === 23 && (j === 13)) ||
      (i === 24 && (j === 13)) ||
      (i === 25 && (j === 13)))  {
        GAMEBOARD[i][j] = {
          bubble: false,
          superBubble: false,
          ghost: false,
          afraid: 0,
          pacman: false,
          eaten: false,
          visited: false,
          fruit: false,
          x: i,
          y: j
        };
      }
    }
  }

  var p = getXY(GHOST_INKY_POSITION_X,GHOST_INKY_POSITION_Y);
  if(GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) {
    GAMEBOARD[p.x][p.y].ghost = true;
    GAMEBOARD[p.x][p.y].afraid = GHOST_INKY_STATE;
  }
  p = getXY(GHOST_PINKY_POSITION_X,GHOST_PINKY_POSITION_Y);
  if(GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) {
     GAMEBOARD[p.x][p.y].ghost = true;
     GAMEBOARD[p.x][p.y].afraid = GHOST_PINKY_STATE;
  }
  p = getXY(GHOST_BLINKY_POSITION_X,GHOST_BLINKY_POSITION_Y);
  if(GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) {
    GAMEBOARD[p.x][p.y].ghost = true;
    GAMEBOARD[p.x][p.y].afraid = GHOST_BLINKY_STATE ;
  }
  p = getXY(GHOST_CLYDE_POSITION_X,GHOST_CLYDE_POSITION_Y);
  if(GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) {
    GAMEBOARD[p.x][p.y].ghost = true;
    GAMEBOARD[p.x][p.y].afraid = GHOST_CLYDE_STATE;
  }
  p = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
  if(GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].pacman = true;
  /*p = getXY(FRUITS_POSITION_X , FRUITS_POSITION_Y);
  if(FRUIT === "cherry" || FRUIT === "strawberry" || FRUIT === "orange" || FRUIT === "apple" ||
    FRUIT === "melon"|| FRUIT === "galboss" || FRUIT === "bell" || FRUIT === "key")
    GAMEBOARD[p.x][p.y].fruit = true;*/

};

function drawRect(i,j) {
  var ctx = PACMAN_CANVAS_CONTEXT;
  var ygap = 17.75;
  var x = BUBBLES_X_START + i*BUBBLES_GAP - BUBBLES_GAP/2 + 5;
  var y = BUBBLES_Y_START + j*ygap- 9;
  var w = BUBBLES_GAP;
  var h = ygap;

  if(GAMEBOARD[i][j]){
    ctx.strokeStyle = "green";
    ctx.rect(x,y,w,h);
    ctx.stroke();
  }
}

function drawDebug() {
  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      drawRect(i,j);
    }
  }
}


function selectMove() {

  buildGameboard();
  var x, y;
  x = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y).x;
  y = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y).y;

  if (!PACMAN_DEAD && !GAMEOVER && !LOCK && !PAUSE )  { // make sure the game is running
    var directions = [], stuck = 1;
    for (var i = 1; i < 5; i++) {
        if (canMovePacman(i)) directions.push(i);
    }

    if(!PACMAN_MOVING)
      movePacman(BFSGhost(directions[0], x, y));

    if(PX != x || PY != y)  {
      preMove.push({x: x,y: y});
    }
    PX = x;
    PY = y;

    if (preMove.length > 11 ) {
      for(var i = 0; i < 12; i++) {
        if (!STUCK && Math.abs(preMove[i].x + preMove[i].y - x - y) <= 1) {
          stuck *= 1;
        } else
          stuck *= 0;
      }
      if(stuck == 1) {
        switch(PACMAN_DIRECTION) {
          case 1: 
            if(x + 1 < 26 && GAMEBOARD[x + 1][y] != undefined)
              movePacman(BFSGhost(1, x, y));
            break;
          case 2:
            if(y + 1 < 29 && GAMEBOARD[x][y + 1] != undefined)
              movePacman(BFSGhost(2, x, y));
            break;
          case 4:
            if(y - 1 >= 0 && GAMEBOARD[x][y - 1] != undefined)
              movePacman(BFSGhost(3, x, y));
            break;
          case 3:
            if(x - 1 >= 0 && GAMEBOARD[x - 1][y] != undefined)
              movePacman(BFSGhost(4, x, y));
            break;
          }
      } else {
        preMove = [];
        m = BFSGhost(BFS(x, y), x, y);
        movePacman(m);
      }
    } else{
      m = BFSGhost(BFS(x, y), x, y);
      movePacman(m);
    }
  }
};

//setInterval(drawDebug, 1000/3);

var BFS = function (theX, theY) {

  var queue = [], source;
  for (var i = 1; i < 5; i++) {
    switch(i) {
      case 1:
        if(theX + 1 < 26 && GAMEBOARD[theX + 1][theY] != null)
          queue.push({GB: GAMEBOARD[theX + 1][theY], dir: 1});
        break;
      case 2:
        if(theY + 1 < 29 && GAMEBOARD[theX][theY + 1] != null) 
          queue.push({GB: GAMEBOARD[theX][theY + 1], dir: 2});
        break;
      case 3:
        if(theX - 1>= 0 && GAMEBOARD[theX - 1][theY] != null)
          queue.push({GB: GAMEBOARD[theX - 1][theY], dir: 3});
        break;
      case 4:
        if(theY - 1 >= 0 && GAMEBOARD[theX][theY - 1] != null)
          queue.push({GB: GAMEBOARD[theX][theY - 1], dir: 4});
        break;
    }
  }
  GAMEBOARD[theX][theY].visited = true;

  while(queue.length != 0) {
    source = queue.shift();
    if(!source.GB.visited) {
      source.GB.visited = true;
      if (source.GB.afraid === 1 || (source.GB.bubble && !source.GB.eaten)
        || (source.GB.superBubble && !source.GB.eaten) || source.GB.fruit) {
        return source.dir;
      } else {
        if (source.GB.x + 1 < 26 && GAMEBOARD[source.GB.x + 1][source.GB.y] != null 
          && !GAMEBOARD[source.GB.x + 1][source.GB.y].visited)
          queue.push({GB: GAMEBOARD[source.GB.x + 1][source.GB.y], dir: source.dir});
        if (source.GB.x - 1 >= 0 && GAMEBOARD[source.GB.x - 1][source.GB.y] != null 
          && !GAMEBOARD[source.GB.x - 1][source.GB.y].visited)
          queue.push({GB: GAMEBOARD[source.GB.x - 1][source.GB.y], dir: source.dir});
        if (source.GB.y + 1 < 29 && GAMEBOARD[source.GB.x][source.GB.y + 1] != null 
          && !GAMEBOARD[source.GB.x][source.GB.y + 1].visited) 
          queue.push({GB: GAMEBOARD[source.GB.x][source.GB.y + 1], dir: source.dir});
        if (source.GB.y - 1 >= 0 && GAMEBOARD[source.GB.x][source.GB.y - 1] != null 
          && !GAMEBOARD[source.GB.x][source.GB.y - 1].visited)
          queue.push({GB: GAMEBOARD[source.GB.x][source.GB.y - 1], dir: source.dir});
      }
    }
  }
}

var BFSGhost = function(theNextMove, theX, theY) {
  buildGameboard();
  var queue  = [], source, canMove = [], count = 0;

  for (var i = 1; i < 5; i++) {
    if (i != theNextMove) 
      canMove.push(i);
    }
  GAMEBOARD[theX][theY].visited = true;

  switch(theNextMove) {
    case 1:
      if(GAMEBOARD[theX + 1][theY] != undefined)
        queue.push({GB: GAMEBOARD[theX + 1][theY], dir: 1});
      break;
    case 2:
      if(GAMEBOARD[theX][theY + 1] != undefined) 
        queue.push({GB: GAMEBOARD[theX][theY + 1], dir: 2});
      break;
    case 3:
      if(GAMEBOARD[theX - 1][theY] != undefined)
        queue.push({GB: GAMEBOARD[theX - 1][theY], dir: 3});
      break;
    case 4:
      if(GAMEBOARD[theX][theY - 1] != undefined)
        queue.push({GB: GAMEBOARD[theX][theY - 1], dir: 4});
      break;
  }
  while(queue.length != 0 && count < 5) {
    count ++;
    source = queue.shift();
    if (!source.GB.visited) {
      source.GB.visited = true;
      if( source.GB.ghost && source.GB.afraid == 0) {
        for (var i = 1; i < 5; i++) {
          if (canMovePacman(i) && i != source.dir) return i;
        }
      } else {
        if (source.GB.x + 1 < 26 && GAMEBOARD[source.GB.x + 1][source.GB.y] != undefined && !GAMEBOARD[source.GB.x + 1][source.GB.y].visited)
            queue.push({GB: GAMEBOARD[source.GB.x + 1][source.GB.y], dir: source.dir});
        if (source.GB.x - 1 >= 0 && GAMEBOARD[source.GB.x - 1][source.GB.y] != undefined && !GAMEBOARD[source.GB.x - 1][source.GB.y].visited)
            queue.push({GB: GAMEBOARD[source.GB.x - 1][source.GB.y], dir: source.dir});
        if (source.GB.y + 1 < 29 && GAMEBOARD[source.GB.x][source.GB.y + 1] != undefined && !GAMEBOARD[source.GB.x][source.GB.y + 1].visited) 
            queue.push({GB: GAMEBOARD[source.GB.x][source.GB.y + 1], dir: source.dir});
        if (source.GB.y - 1 >= 0 && GAMEBOARD[source.GB.x][source.GB.y - 1] != undefined && !GAMEBOARD[source.GB.x][source.GB.y - 1].visited)
            queue.push({GB: GAMEBOARD[source.GB.x][source.GB.y - 1], dir: source.dir});
      }
    }
  }
  return theNextMove;
}
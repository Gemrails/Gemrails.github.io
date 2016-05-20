
function PushScore(proj){ 
  var Nscore = document.getElementById("score").innerHTML.split('<')[0];
  var Hscore = document.getElementById("hscore").innerHTML.split('<')[0];
  if ((parseInt(Nscore) != 0) && (parseInt(Nscore) == parseInt(Hscore))) {
    var nname = GetName();
    var URL = "http://123.57.69.171:8001/goal/name="+nname+"&score="+Nscore;
    //var URL = "http://127.0.0.1:8080/goal/name="+nname+"&score="+Nscore;
    var pdata = {"proj":proj};
    $.ajax({
      async:false,
      type:'GET',
      url: URL,
      data:pdata,
    }).success(function(gdata){
      alert(gdata);
    }).fail(function(){
      return;
    });
  }
}

function GetList(proj, kind){
    var URL = "http://123.57.69.171:8001/goalin";
    var pdata = {"proj":proj}
    $.ajax({
      async:false,
      type:'POST',
      url: URL,
      data:pdata,
    }).success(function(gdata){
        if(gdata == 'None'){
            return
        }else{
            insert_tb(kind, gdata);
        }
        
    }).fail(function(){
        return;
    });
}

function insert_tb(kind, str){
//eg: str = "薛之谦=5678;路人甲=4536;秋引=3452;雪丽糍=3322;隔壁老王=2422;贾玲=2345;小默=998"
    var strdata =  str.split(';');
    var strtr = "";
    for (var m=0; m<strdata.length; m++){
        stritem = strdata[m].split('=');
        var strtd = "";
        for (var n=0; n<3; n++){
            strtd += "<td>"+stritem[n]+"</td>";
        }
        strtr += "<tr>"+strtd+"</tr>";
    }
    document.getElementById(kind).innerHTML=strtr;
}

function GetName(){
  //填写昵称
    var nname = window.prompt("出现最高分，输入一个昵称通知全世界","贾玲");
    if (nname == "贾玲") {
        var rnum = parseInt(10*Math.random()); 
        var namelist = ["大张伟","薛之谦","白眉大侠","隔壁老王","孔连顺","贾玲","秋引","小默","矮子乐","大力山德罗"];    
        nname = namelist[rnum];
    };     
    return nname;
}



function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
        PushScore("2048");
      } else if (metadata.won) {
        self.message(true); // You win!
        PushScore("2048");
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};

GetList('2048', 'table');

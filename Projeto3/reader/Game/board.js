/**
 * Board class, deals with all board related issues
 * @param {CGFscene} scene
 * @param {int} height
 * @param {int} width
 */
function Board(scene,height,width) {

  CGFobject.call(this, scene);

  this.scene=scene;

  this.height=height;
  this.width=width;
  this.board=[];
  this.move='firstCell'; //para saber que célula está a selecionar (primeira ou segunda)
  this.firstCell=new Point2D(-1,-1);
  this.secondCell=new Point2D(-1,-1);
  this.playerOnePoints=0;
  this.playerTwoPoints=0;
  this.currX=-1; //Último x e y escolhidos
  this.currY=-1;

  this.animateCell=false;
  this.makingAMove=false;

  this.initBoard();

}

/**
 * Updates board and verifies if it is ready to make a move
 * @param  {int} time
 */
Board.prototype.update=function(time){

  for(var i=0;i<this.height;i++)
  {
    for(var j=0;j<this.board[i].length;j++)
    {
      this.board[i][j].update(time);
    }
  }

  this.verifyReadyToUpdateBoard();
  this.updateMakingAMove();

};

/**
 * Initializes Board
 */
Board.prototype.initBoard=function(){

  var tmpId=1;

  for(var i=0;i<this.height;i++)
  {
    this.board.push([]);

    for(var j=0;j<this.width;j++)
    {
      var piece= this.verifyPiece(j,i);
      console.log("Piece("+j+","+i+"): "+piece);
      this.board[i].push(new Cell(this.scene,i,j,piece,tmpId));
      tmpId++;
    }
  }

};

/**
 * Sets board pieces according to argument
 * @param {array} board new board display
 */
Board.prototype.setBoard=function(board){

  var tmpId=1;
  var tmpBoard=[];
  for(var i=0;i<this.height;i++)
  {
    tmpBoard.push([]);

    for(var j=0;j<this.width;j++)
    {
      tmpId++;
    }
  }

};

/**
 * Returns the board in a single string to be passed into prolog
 */
Board.prototype.getBoard=function(){

  var tmpBoard=[];
  for(var i=0;i<this.height;i++)
  {
    tmpBoard.push([]);

    for(var j=0;j<this.width;j++)
    {
      tmpBoard[i].push(this.board[i][j].piece.type);
    }
  }
  return tmpBoard;

};

/**
 * Returns a copy o the board
 */
Board.prototype.getCopyBoard=function(){

  var tmpId=1;
  var tmpBoard=[];

  for(var i=0;i<this.height;i++)
  {
    tmpBoard.push([]);

    for(var j=0;j<this.width;j++)
    {
      tmpBoard[i].push(new Cell(this.scene,i,j,this.board[i][j].type,tmpId));
      tmpId++;
    }

  }

  return tmpBoard;

};

/**
 * Displays board
 */
Board.prototype.display=function(){

  var dist=1.1;
  var divDist=0.4;

  this.scene.pushMatrix();

  this.scene.translate(-1.65,0,-4);

  for(var i=0;i<this.height;i++)
  {

    if(i===4)
    {
      this.scene.translate(0,0,divDist);
    }

    for(var j=0;j<this.board[i].length;j++)
    {
      this.scene.pushMatrix();
      this.scene.translate(dist*j,0,0);
      this.board[i][j].display();
      this.scene.popMatrix();
    }

    this.scene.translate(0,0,dist);

  }

  this.scene.popMatrix();

};

/**
 * Makes a move if it is a valid move
 * @param  {array} validMoves array with valid moves
 * @param  {string} player     identifies which player made the move
 * @param  {string} bot        identifies if player is a bot
 * @param  {int} xi         initial cell x
 * @param  {int} yi         initial cell y
 * @param  {int} xf         final cell x
 * @param  {int} yf         final cell y
 */
Board.prototype.movePiece = function(validMoves,player,bot,xi,yi,xf,yf){

  var validPlay=0;
  if(bot=='player'){
    for(var i =0; i<validMoves.length; i++){
      if(validMoves[i][2]==this.secondCell.x && validMoves[i][3]==this.secondCell.y){
        validPlay=1;
      }
    }
  }

  var span=null;

  if(bot == 'bot'){
    this.firstCell.x=xi;
    this.firstCell.y=yi;
    this.secondCell.x=xf;
    this.secondCell.y=yf;
    span=4;
    validPlay=1;
      //console.log("asdasdasdasda");
  }

  if(validPlay==1){
    var points=0;
    if(this.board[this.secondCell.y][this.secondCell.x].type === 'queen'){
      points=3;
    }else if(this.board[this.secondCell.y][this.secondCell.x].type === 'drone'){
      points=2;
    }else if(this.board[this.secondCell.y][this.secondCell.x].type === 'pawn'){
      points=1;
    }
    if(player==='player1'){
      this.playerOnePoints+=points;
    }else{
      this.playerTwoPoints+=points;
    }

    var initialPointAnimation=new Point2D(this.firstCell.x*1.1,this.firstCell.y*1.1);
    var finalPointAnimation=new Point2D(this.secondCell.x*1.1,this.secondCell.y*1.1);

    this.board[this.firstCell.y][this.firstCell.x].animation=new moveAnimation(this.scene,initialPointAnimation,finalPointAnimation,this.firstCell.x,this.firstCell.y,span);
    this.board[this.firstCell.y][this.firstCell.x].animate=true;

    this.animateCell=true;

    return points;
  }
  return -1;

};

/**
 * Verifies if board is ready to be updated
 */
Board.prototype.verifyReadyToUpdateBoard=function(){

  if(this.animateCell)
  {

    if(this.board[this.firstCell.y][this.firstCell.x].animate==false)
    {
      this.board[this.secondCell.y][this.secondCell.x].updatePiece(this.board[this.firstCell.y][this.firstCell.x].type);
      this.board[this.firstCell.y][this.firstCell.x].updatePiece('empty');
      this.cleanSelections();

      this.animateCell=false;
    }

  }

};

/**
 * Cleans cells selection
 */
Board.prototype.cleanSelections = function(){

  for(var i = 0; i<this.board.length; i++){
    for(var j = 0; j<this.board[0].length; j++){
      this.board[i][j].unsetSelected();
    }
  }

};

/**
 * Verifies the type of the piece in given cell
 * @param  {int} x x coordinate
 * @param  {int} y y coordinate
 */
Board.prototype.verifyPiece=function(x,y){

  if((x==0 && y==0) || (x==1 && y==0) || (x==0 && y==1) || (x==this.width-1 && y==this.height-1) || (x==this.width-1 && y==this.height-2) || (x==this.width-2 && y==this.height-1))
  {
    return 'queen';
  }
  else if((x==2 && y==0) || (x==1 && y==1) || (x==0 && y==2))
  {
    return 'drone';
  }
  else if((x==this.width-3 && y==this.height-1) || (x==this.width-1 && y==this.height-3) || (x==this.width-2 && y==this.height-2))
  {
    return 'drone';
  }
  else if((x==1 && y==2) || (x==2 && y==2) || (x==2 && y==1))
  {
    return 'pawn';
  }
  else if((x==this.width-2 && y==this.height-3) || (x==this.width-3 && y==this.height-3) || (x==this.width-3 && y==this.height-2))
  {
    return 'pawn';
  }

  return 'empty';

};

/**
 * Verifies if final cell if valid and returns its coordinates
 * @param  {string} player
 */
Board.prototype.verifyMovementBoard=function(player){

  if (this.scene.pickMode === false) {
    var selection = 0;
		if (this.scene.pickResults !== null && this.scene.pickResults.length > 0) {
			for (var i=0; i< this.scene.pickResults.length; i++) {
				var obj = this.scene.pickResults[i][0];
				if (obj)
				{
					var customId = this.scene.pickResults[i][1];

          console.log("ID: "+customId);

          this.currX=customId%4;
          if(this.currX===0)
          {
            this.currX=3;
            this.currY=Math.floor(customId/4)-1;
          }
          else{
            this.currX--;
            this.currY=Math.floor(customId/4);
          }

          console.log('X,Y: '+this.currX+','+this.currY);

          this.verifyIfSameCell();
          selection = this.getCoordsToMove(customId,player);

          console.log(this.move);

          console.log("Picked object: " + obj + ", with pick id " + customId);

				}
			}
			this.scene.pickResults.splice(0,this.scene.pickResults.length);
      return selection;
		}
	}

  return 0;

};

/**
 * Gets coordinates to move
 * @param  {int} id
 * @param  {string} player
 */
Board.prototype.getCoordsToMove=function(id, player){

  if(this.move==='notAMove')
    return;

  if(this.move==='firstCell' && this.board[this.currY][this.currX].type!='empty')
  {
    if(player === 'player1' && this.currY >= 4){
      return 0;
    }else if(player === 'player2' && this.currY < 4){
      return 0;
    }
    this.firstCell.x=this.currX;
    this.firstCell.y=this.currY;


    this.move='secondCell';
    return 1;
  }
  else if(this.move==='secondCell')
  {
    this.secondCell.x=this.currX;
    this.secondCell.y=this.currY;

    console.log('Movimento a realizar: \n'+'Fx,Fy: '+this.firstCell.x+','+this.firstCell.y+'\nSx,Sy: '+this.secondCell.x+','+this.secondCell.y);

    this.move='firstCell';

    return 2;
  }

  return 0;

};

/**
 * Returns first selected cell
 */
Board.prototype.getFirstCell = function(){

  return this.firstCell;

};

/**
 * Returns second selected cell
 */
Board.prototype.getSecondCell = function(){

  return this.secondCell;

};

/**
 * Verifies if second cell is the same as the first
 */
Board.prototype.verifyIfSameCell=function(){

  if(this.firstCell.x===this.currX && this.firstCell.y===this.currY)
  {

    //Sendo a celula selecionada a mesma da anterior, então tira-se a cor de selecionada da peça
    if(this.firstCell.x%2==this.firstCell.y%2)
    {
      this.board[this.currY][this.currX].material=this.scene.woodMaterial;
    }
    else {
      this.board[this.currY][this.currX].material=this.scene.whiteWoodMaterial;
    }

    this.move='notAMove';

    this.firstCell.x=-1;
    this.firstCell.y=-1;

  }
  else {
    this.board[this.currY][this.currX].material=this.scene.pickedMaterial;

    if(this.move==='notAMove')
    {
      this.move='firstCell';
    }

  }

};


/**
 * Sets board
 * @param {array} board
 */
Board.prototype.setBoard=function(board){

  var tmpId=1;
  var tmpBoard=[];
  for(var i=0;i<this.height;i++)
  {
    tmpBoard.push([]);

    for(var j=0;j<this.width;j++)
    {
      tmpId++;
      var piece = board[i][j];
      console.log("Piece("+j+","+i+"): "+piece);
      tmpBoard[i].push(new Cell(this.scene,i,j,piece,tmpId));
    }
  }
  this.board=tmpBoard;

};


/**
 * returns boad
 */
Board.prototype.getBoard=function(){

  var tmpBoard=[];
  for(var i=0;i<this.height;i++)
  {
    tmpBoard.push([]);

    for(var j=0;j<this.width;j++)
    {
      tmpBoard[i].push(this.board[i][j].type);
    }
  }
  return tmpBoard;

};

/**
 * updates makingAMove flag
 */
Board.prototype.updateMakingAMove=function(){

  if(this.move==='notAMove')
  {
    this.makingAMove=false;
  }
  else{
    this.makingAMove=true;
  }

};

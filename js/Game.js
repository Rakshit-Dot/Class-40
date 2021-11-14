class Game {
  constructor() {
    this.resetButton = createButton("reset");
    this.resetTitle = createElement("h2");
    this.leaderTitle = createElement("h3");
    this.leader1 = createElement("h3");
    this.leader2 = createElement("h3");

  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {

    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    fuelGroup = new Group();
    powerCoinGroup = new Group();
    obstacleGroup = new Group();


    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;
    cars = [car1, car2];

    this.addSprites(fuelGroup, 4, fuelImg, 0.02);
    this.addSprites(powerCoinGroup, 18, powerCoinImg, 0.09);

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    this.addSprites(obstacleGroup, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions)





  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leaderTitle.html("LeaderBoard");
    this.resetTitle.class("leaderTitle");
    this.resetTitle.position(width / 2 - 200, 40);

    this.leader1.class("leaderText");
    this.leader1.position(width / 2 - 200, 50);

    this.leader2.class("leaderText");
    this.leader2.position(width / 2 - 200, 60);
  }
  showleaderBoard() {
    var leader1, leader2
    var players = Object.values(allPlayers);
    if (players[0].rank === 0 && players[1].rank === -0 || players[0].rank === 1) {
      leader1 = players[0].rank + " " + players[0].name + " " + players[0].score
      leader2 = players[1].rank + " " + players[1].name + " " + players[1].score;

    }
    if (players[1].rank === 1) {
      leader2 = players[0].rank + " " + players[0].name + " " + players[0].score
      leader1 = players[1].rank + " " + players[1].name + " " + players[1].score;
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }


  play() {
    this.handleElements();

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.showleaderBoard();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;
        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60)
          //Game Camera Position
          camera.position.x = cars[index - 1].position.x
          camera.position.y = cars[index - 1].position.y
        }
      }

      this.handlePlayerControls();
      this.handleresetButton();
      drawSprites();
    }
  }

  handlePlayerControls() {
    // handling keyboard events
    if (keyIsDown(DOWN_ARROW)) {
      player.positionY += 10;
      player.update();
    }
  }
  handleresetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0, gameState: 0, players: {}
      })
      window.location.reload();
    })
  }
  addSprites(spriteGroup, noOfSprites, spriteImg, scale, positions = []) {
    for (var i = 0; i < noOfSprites; i++) {
      var x = random(width / 2 + 150, width / 2 - 150)
      var y = random(-height * 4.5, height - 400);
      if (positions.length > 0 ){
        x=positions[i].x
        y=positions[i].y
        spriteImg=positions[i].image
      }
      var sprite = createSprite(x, y)
      sprite.addImage("sprite", spriteImg);
      sprite.scale = scale
      spriteGroup.add(sprite);


    }
  }
}



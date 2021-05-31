let player = null;
let currentLevel = null;
const GRAVITY = 0.4;

let levelSprite = 0;
let images = {}

function preload() {
    images["floor"] = loadImage("images/grass/grass.png");
    images["steen"] = loadImage("images/stone/stoneMid.png");
    images["steenMuur"] = loadImage("images/stone/stoneCenter.png");
    images["heuvel"] = loadImage("images/stone/stoneHill_left.png");
    images["heuvel2"] = loadImage("images/stone/stoneCorner_left.png");
    images["metaal"] = loadImage("images/metalHalf.png");
    images["wall"] = loadImage("images/grass/grassCenter.png");
    images["player"] = loadImage("images/p3_spritesheet.png");
    images["spider"] = loadImage("images/spider.png");
    images["spikes"] = loadImage("images/obstacles/spikes.png");
    images["omgekeerdeSpikes"] = loadImage("images/obstacles/omgekeerdeSpikes.png");
    images["lava"] = loadImage("images/obstacles/lava.png");
    images["onderkantLava"] = loadImage("images/obstacles/onderkantLava.png");
}

function setup() {
    createCanvas(1900, 600);

    angleMode(DEGREES);

    currentLevel = CreateLevel1();
    player = CreatePlayer();
}

function draw() {
    background(200);

    translate(player.position.x * -1 + width / 2, 0);

    currentLevel.metaal.toArray().forEach(metaal => {

        // Check of het platform op zijn attractionPoint is belandt
        x = metaal.originelePositie.x;
        if (metaal.originelePositie.x + 10 === metaal.position.x) {
            console.log(metaal);
            // Stel het attractionPoint in op het originele attractionPoint
            metaal.attractionPoint(3, x - 10, metaal.position.y);
        } else if (metaal.originelePositie.x === metaal.position.x) {
            metaal.attractionPoint(3, x + 10, metaal.position.y);
        }
    });

    drawSprites();


    resetMatrix();
    textSize(32);
    text(player.score, width - 50, 100);


}

function DrawFloor() {
    fill(this.shapeColor);
    rect(0, 0, this.width, this.height);

    image(images.floor, 0, 0, this.width, this.height);
}
function DrawSteen() {
    fill(this.shapeColor);
    rect(0, 0, this.width, this.height);

    image(images.steen, 0, 0, this.width, this.height);
}
function DrawSteenMuur() {
    fill(this.shapeColor);
    rect(0, 0, this.width, this.height);

    image(images.steenMuur, 0, 0, this.width, this.height);
}
function DrawMetaal() {
    image(images.metaal, 0, 0, 100, this.height);
}

function DrawWall() {
    fill(this.shapeColor);
    rect(0, 0, this.width, this.height);

    image(images.wall, 0, 0, this.width, this.height);
}

function DrawHeuvel() {


    image(images.heuvel, 0, 0, this.width, this.height);
}

function DrawHeuvel2() {


    image(images.heuvel2, 0, 0, this.width, this.height);
}
function keyPressed() {
    if (keyCode === UP_ARROW && player.onFloor === true) {
        player.setSpeed(10, 265);
        player.onFloor = false;
    }
}

function CreatePlayer() {
    let playerSprite = createSprite(100, 200, 68 * 2 / 3, 93 * 2 / 3);
    playerSprite.shapeColor = color("red");
    playerSprite.draw = DrawPlayer;
    playerSprite["onFloor"] = false;
    playerSprite["foot"] = createSprite(0, 0, playerSprite.width - 20, 5);
    playerSprite["score"] = 0;
    playerSprite.foot.shapeColor.setAlpha(0);

    playerSprite["frames"] = {
        walk1: {
            x: 146,
            y: 0,
            width: 72,
            height: 97
        },
        walk2: {
            x: 73,
            y: 0,
            width: 72,
            height: 97
        },
        jump: {
            x: 438,
            y: 93,
            width: 67,
            height: 94
        }

    };

    return playerSprite;
}


function DrawPlayer() {
    let frame = this.frames.walk1;
    let secondsPassed = floor(millis() / 100);

    if (this.deltaX !== 0) {
        if (secondsPassed % 2 === 0) {
            frame = this.frames.walk2;
        }
    }

    if (player.onFloor === false) {
        frame = this.frames.jump;
    }

    image(images.player, 0, 0, this.width, this.height, frame.x, frame.y, frame.width, frame.height);

    this.foot.position.x = this.position.x;
    this.foot.position.y = this.position.y;
    this.foot.position.y += this.height / 2;

    let playerFallSpeed = this.velocity.y + GRAVITY;
    this.setSpeed(playerFallSpeed, 90);

    if (keyIsDown(LEFT_ARROW) === true) {
        this.addSpeed(5, 180);
    }
    if (keyIsDown(RIGHT_ARROW) === true) {
        this.addSpeed(5, 0);
    }
    this.collide(currentLevel.floors);
    this.collide(currentLevel.metaal);
    this.collide(currentLevel.walls);
    this.collide(currentLevel.steen);
    this.collide(currentLevel.steenMuur);
    this.collide(currentLevel.heuvel);
    this.collide(currentLevel.heuvel2);
    this.foot.overlap(currentLevel.enemies, PlayerHitsEnemy);
    this.foot.overlap(currentLevel.spider, PlayerHitsSpider);
    this.foot.overlap(currentLevel.spikes, PlayerLandedOnSpikes);
    this.foot.overlap(currentLevel.omgekeerdeSpikes, PlayerLandedOnOmgekeerdeSpikes);
    this.foot.overlap(currentLevel.lava, PlayerLandedOnLava);
    this.foot.overlap(currentLevel.onderkantLava, PlayerLandedOnOnderkantLava);
    this.collide(currentLevel.coins, PlayerCollectedCoin);
    this.overlap(currentLevel.enemies, EnemyHitsPlayer);
    this.overlap(currentLevel.spider, SpiderHitsPlayer);
    this.foot.overlap(currentLevel.floors, PlayerLandedOnFloor);
    this.foot.overlap(currentLevel.steen, PlayerLandedOnSteen);
    this.foot.overlap(currentLevel.steenMuur, PlayerLandedOnSteenMuur);
    this.foot.overlap(currentLevel.metaal, PlayerLandedOnMetaal);
    this.foot.overlap(currentLevel.heuvel, PlayerLandedOnHeuvel);
}

function CreateSpikes(x, y) {
    let spikeSprite = createSprite(x, y, 50, 30);
    spikeSprite.shapeColor = color("grey");
    spikeSprite.draw = DrawSpikes;


    return spikeSprite;
}
function CreateOmgekeerdeSpikes(x, y) {
    let omgekeerdeSpikesSprite = createSprite(x, y, 50, 30);
    omgekeerdeSpikesSprite.shapeColor = color("grey");
    omgekeerdeSpikesSprite.draw = DrawOmgekeerdeSpikes;


    return omgekeerdeSpikesSprite;
}

function CreateLava(x, y) {
    let lavaSprite = createSprite(x, y, 50, 30);
    lavaSprite.shapeColor = color("orange");
    lavaSprite.draw = DrawLava;


    return lavaSprite;
}

function CreateOnderkantLava(x, y) {
    let onderkantLavaSprite = createSprite(x, y, 50, 30);
    onderkantLavaSprite.shapeColor = color("orange");
    onderkantLavaSprite.draw = DrawOnderkantLava;


    return onderkantLavaSprite;
}

function DrawSpikes() {
    image(images.spikes, 0, 0, this.width, this.height);
}
function DrawOmgekeerdeSpikes() {
    image(images.omgekeerdeSpikes, 0, 0, this.width, this.height);
}

function DrawOnderkantLava() {
    image(images.onderkantLava, 0, 0, this.width, this.height);
}

function DrawLava() {
    image(images.lava, 0, 0, this.width, this.height);
}

function PlayerLandedOnSpikes(playerfoot, spikes) {
    player.remove();

}
function PlayerLandedOnOmgekeerdeSpikes(playerfoot, omgekeerdeSpikes) {
    player.remove();

}
function PlayerLandedOnLava(playerfoot, lava) {
    player.remove();

}

function PlayerLandedOnOnderkantLava(playerfoot, onderkantLava) {
    player.remove();

}

function EnemyHitsPlayer(player, enemy) {
    player.remove();
}

function PlayerHitsEnemy(player, enemy) {
    enemy.remove();
}

function SpiderHitsPlayer(player, spider) {
    player.remove();
}

function PlayerHitsSpider(player, spider) {
    spider.remove();
}

function PlayerCollectedCoin(player, coin) {
    coin.remove();
    player.score++;
}

function CreateLevel1() {
    levelSprite = createSprite(2000, 400, 4000, 400);
    levelSprite.shapeColor = color("green");
    levelSprite.shapeColor.setAlpha(50);
    levelSprite.draw = DrawLevel1;

    levelSprite["floors"] = new Group();
    levelSprite["steen"] = new Group();
    levelSprite["steenMuur"] = new Group();
    levelSprite["metaal"] = new Group();
    levelSprite["walls"] = new Group();
    levelSprite["heuvel"] = new Group();
    levelSprite["heuvel2"] = new Group();
    levelSprite["coins"] = new Group();
    levelSprite["enemies"] = new Group();
    levelSprite["spider"] = new Group();
    levelSprite["spikes"] = new Group();
    levelSprite["omgekeerdeSpikes"] = new Group();
    levelSprite["lava"] = new Group();
    levelSprite["onderkantLava"] = new Group();


    let spider = CreateSpider(300, 250);
    levelSprite.spider.add(spider);

    let enemy = CreateEnemy(600, 250);
    levelSprite.enemies.add(enemy);

    enemy = CreateEnemy(1333, 250);
    levelSprite.enemies.add(enemy);



    let x = 0;
    let y = 0;

    let floor = null;
    x = -25
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 80; ++i) {
        x += 50;
        floor = CreateFloorBlock(x, y);
        levelSprite.floors.add(floor);
    }

    for (let i = 0; i < 5; ++i) {
        floor = CreateWallBlock(25, y);
        levelSprite.walls.add(floor);
        y -= 50;
    }

    floor = CreateFloorBlock(25, y);
    levelSprite.floors.add(floor);
    //Parkour 1

    for (let i = 0; i < 5; ++i) {
        floor = CreateSteenMuurBlock(1600, y + 200);
        levelSprite.steenMuur.add(floor);
        y -= 50;
    }
    floor = CreateSteenBlock(1600, y + 200);
    levelSprite.steen.add(floor);

    floor = CreateFloorBlock(1050, y - 20);
    levelSprite.floors.add(floor);

    x = 850;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {
        floor = CreateFloorBlock(x, y - 200);
        levelSprite.floors.add(floor);
        x += 50;
    }

    x = 1050;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {

        floor = CreateFloorBlock(x, y - 300);
        levelSprite.floors.add(floor);
        x += 100;
    }

    x = 1250;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {

        floor = CreateFloorBlock(x, y - 400);
        levelSprite.floors.add(floor);
        x += 100;
    }

    x = 500;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 3; ++i) {
        floor = CreateWallBlock(x, y - 50);
        levelSprite.walls.add(floor);
        floor = CreateFloorBlock(x, y - 100);
        levelSprite.floors.add(floor);
        x += 50;
    }

    x = 500;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 3; ++i) {
        floor = CreateFloorBlock(x, y - 100);
        levelSprite.floors.add(floor);
        x += 50;
    }

    x = 500;
    y -= 150;
    let coin = null;
    for (let i = 0; i < 3; ++i) {
        coin = CreateCoin(x, y, 10, 10);
        levelSprite.coins.add(coin);
        x += 50;
    }

    for (let i = 0; i < 1; ++i) {
        coin = CreateCoin(1050, y - 420, 10, 10);
        levelSprite.coins.add(coin);
        x += 50;
    }

    x = 650;
    y -= -110;
    for (let i = 0; i < 19; ++i) {
        spike = CreateSpikes(x, y, 10, 10);
        levelSprite.spikes.add(spike);
        x += 50;
    }

    x = 1900;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 40; ++i) {
        lava = CreateLava(x, y - 70, 10, 10);
        levelSprite.lava.add(lava);
        x += 50;
    }
    x = 1900;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 40; ++i) {
        onderkantLava = CreateOnderkantLava(x, y - 40, 10, 10);
        levelSprite.onderkantLava.add(onderkantLava);
        x += 50;
    }
    x = 1900;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 40; ++i) {
        onderkantLava = CreateOnderkantLava(x, y - 15, 10, 10);
        levelSprite.onderkantLava.add(onderkantLava);
        x += 50;
    }

    //metalen platformen
    x = 2350;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 5; ++i) {

        floor = CreateMetaalBlock(x, y - 120);

        floor.originelePositie = { x, y: y - 120 };
        levelSprite.metaal.add(floor);
        x += 330;
    }


    //Steen
    x = 1650;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {

        floor = CreateHeuvelBlock(x, y - 300);
        levelSprite.heuvel.add(floor);
        x += 50;
    }
    x = 1650;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {

        floor = CreateHeuvel2Block(x, y - 250);
        levelSprite.heuvel2.add(floor);
        x += 50;
    }
    x = 1650;
    for (let i = 0; i < 5; ++i) {
        floor = CreateSteenMuurBlock(x, y);
        levelSprite.walls.add(floor);
        y -= 50;
    }

    x = 1700;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {

        floor = CreateHeuvelBlock(x, y - 250);
        levelSprite.heuvel.add(floor);
        x += 50;
    }
    x = 1700;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {

        floor = CreateHeuvel2Block(x, y - 200);
        levelSprite.heuvel2.add(floor);
        x += 50;
    }
    x = 1700;
    for (let i = 0; i < 4; ++i) {
        floor = CreateSteenMuurBlock(x, y);
        levelSprite.steenMuur.add(floor);
        y -= 50;
    }

    x = 1750;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {

        floor = CreateHeuvelBlock(x, y - 200);
        levelSprite.heuvel.add(floor);
        x += 50;
    }
    x = 1750;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {

        floor = CreateHeuvel2Block(x, y - 150);
        levelSprite.heuvel2.add(floor);
        x += 50;
    }
    x = 1750;
    for (let i = 0; i < 3; ++i) {
        floor = CreateSteenMuurBlock(x, y);
        levelSprite.steenMuur.add(floor);
        y -= 50;
    }
    x = 1800;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 6; ++i) {
        floor = CreateSteenMuurBlock(x, y - 100);
        levelSprite.floors.add(floor);
        floor = CreateSteenMuurBlock(x, y - 50);
        levelSprite.walls.add(floor);
        floor = CreateSteenMuurBlock(x, y - 0);
        levelSprite.walls.add(floor);
        floor = CreateSteenBlock(x, y - 150);
        levelSprite.floors.add(floor);

        x += 50;
    }

    x = 3400
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 80; ++i) {
        x += 50;
        floor = CreateSteenBlock(x, y);
        levelSprite.floors.add(floor);
    }
    //na lava
    x = 3400;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 6; ++i) {
        floor = CreateSteenMuurBlock(x, y - 100);
        levelSprite.floors.add(floor);
        floor = CreateSteenMuurBlock(x, y - 50);
        levelSprite.walls.add(floor);
        floor = CreateSteenMuurBlock(x, y - 0);
        levelSprite.walls.add(floor);
        floor = CreateSteenBlock(x, y - 150);
        levelSprite.floors.add(floor);
        x += 50;
    }
    x = 3700;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 6; ++i) {
        floor = CreateSteenMuurBlock(x, y - 100);
        levelSprite.floors.add(floor);
        floor = CreateSteenMuurBlock(x, y - 50);
        levelSprite.walls.add(floor);
        floor = CreateSteenMuurBlock(x, y - 0);
        levelSprite.walls.add(floor);
        floor = CreateSteenBlock(x, y - 150);
        levelSprite.floors.add(floor);
        x += 50;
    }
    x = 1900
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 35; ++i) {
        x += 50;
        floor = CreateSteenBlock(x, y - 80);
        levelSprite.floors.add(floor);
    }
    // 3de parkour
    x = 4220;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {

        floor = CreateSteenBlock(x, y - 250);
        levelSprite.floors.add(floor);
        x += 50;
    }
    x = 4400;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {

        floor = CreateSteenBlock(x, y - 350);
        levelSprite.floors.add(floor);
        x += 50;
    }
    x = 4330;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {
        floor = CreateSteenBlock(x, y - 50);
        levelSprite.floors.add(floor);
        floor = CreateSteenMuurBlock(x, y);
        levelSprite.floors.add(floor);
        x += 50;
    }
    x = 4000;
    y = levelSprite.position.y + levelSprite.height / 2;
    for (let i = 0; i < 7; ++i) {
        spike = CreateSpikes(x, y - 40, 10, 10);
        levelSprite.spikes.add(spike);
        x += 50;
    }
    x = 4400;
    y = levelSprite.position.y + levelSprite.height / 2;
    for (let i = 0; i < 1; ++i) {
        spike = CreateSpikes(x, y - 390, 10, 10);
        levelSprite.spikes.add(spike);
        x += 50;
    }
    x = 4380;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 5; ++i) {
        lava = CreateLava(x, y - 40, 10, 10);
        levelSprite.lava.add(lava);
        x += 50;
    }
    x = 4400;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {
        floor = CreateSteenMuurBlock(x, y - 300);
        levelSprite.floors.add(floor);
        floor = CreateSteenMuurBlock(x, y - 250);
        levelSprite.walls.add(floor);
        floor = CreateSteenMuurBlock(x, y - 230);
        levelSprite.walls.add(floor);
        x += 50;
    }
    x = 4630;
    y = levelSprite.position.y + levelSprite.height / 2
    for (let i = 0; i < 1; ++i) {
        floor = CreateSteenBlock(x, y - 50);
        levelSprite.floors.add(floor);
        floor = CreateSteenMuurBlock(x, y);
        levelSprite.floors.add(floor);
        x += 50;
    }
    x = 4220;
    y = levelSprite.position.y + levelSprite.height / 2;
    for (let i = 0; i < 1; ++i) {
        spike = CreateOmgekeerdeSpikes(x, y - 210, 10, 10);
        levelSprite.omgekeerdeSpikes.add(spike);
        x += 50;
    }

    return levelSprite;
}

function CreateEnemy(x, y) {
    let enemySprite = createSprite(x, y, 68 * 2 / 3, 93 * 2 / 3);
    enemySprite.shapeColor = color("blue");
    enemySprite.draw = DrawEnemy;
    enemySprite["onFloor"] = false;
    enemySprite["foot"] = createSprite(0, 0, enemySprite.width - 20, 5);
    enemySprite["direction"] = createVector(-1, 0);
    enemySprite["frames"] = {
        walk1: {
            x: 146,
            y: 0,
            width: 72,
            height: 97
        },
        walk2: {
            x: 73,
            y: 0,
            width: 72,
            height: 97
        },
        jump: {
            x: 438,
            y: 93,
            width: 67,
            height: 94
        }
    }

    return enemySprite;
}
function CreateSpider(x, y) {
    let spiderSprite = createSprite(x, y, 68 * 2 / 3, 93 * 2 / 3);
    spiderSprite.draw = DrawSpider;
    spiderSprite["onFloor"] = false;
    spiderSprite["foot"] = createSprite(0, 0, spiderSprite.width - 20, 5);
    spiderSprite["direction"] = createVector(-1, 0);
    spiderSprite["frames"] = {
        walk1: {
            x: 146,
            y: 0,
            width: 72,
            height: 97
        },
        walk2: {
            x: 73,
            y: 0,
            width: 72,
            height: 97
        },
        jump: {
            x: 438,
            y: 93,
            width: 67,
            height: 94
        }
    }

    return spiderSprite;
}

function DrawEnemy() {
    let frame = this.frames.walk1;
    let secondsPassed = floor(millis() / 100);

    if (this.deltaX !== 0) {
        if (secondsPassed % 2 === 0) {
            frame = this.frames.walk2;
        }
    }

    tint("blue");
    image(images.player, 0, 0, this.width, this.height, frame.x, frame.y, frame.width, frame.height);

    let playerFallSpeed = this.velocity.y + GRAVITY;
    this.setSpeed(playerFallSpeed, 90);

    this.collide(currentLevel.walls, EnemyCollidedWithWall);
    this.collide(currentLevel.floors, EnemyLandedOnFloor);

    this.addSpeed(this.direction.x * 2, 0);

}
Spider.SPEED = 100;


function DrawSpider() {
    let frame = this.frames.walk1;
    let secondsPassed = floor(millis() / 100);

    if (this.deltaX !== 0) {
        if (secondsPassed % 2 === 0) {
            frame = this.frames.walk2;
        }
    }

    image(images.spider, 9, 9, this.width, this.height, frame.x, frame.y, frame.width, frame.height);

    let spiderFallSpeed = this.velocity.y + GRAVITY;
    this.setSpeed(spiderFallSpeed, 90);

    this.collide(currentLevel.walls, SpiderCollidedWithWall);
    this.collide(currentLevel.floors, SpiderLandedOnFloor);

    this.addSpeed(this.direction.x * 2, 0);

}


function EnemyCollidedWithWall(enemy, wall) {
    enemy.direction.x = enemy.direction.x * -1;
}

function EnemyLandedOnFloor(enemy, floor) {
    enemy.velocity.y = 0;
}
function SpiderCollidedWithWall(spider, wall) {
    spider.direction.x = spider.direction.x * -1;
}

function SpiderLandedOnFloor(spider, floor) {
    spider.velocity.y = 0;
}

function CreateCoin(x, y) {
    let coin = createSprite(x, y, 15, 15);
    coin.shapeColor = color("gold");
    coin.draw = DrawCoin;

    return coin;
}

function DrawCoin() {
    strokeWeight(2);
    stroke(color("orange"))
    fill(this.shapeColor);
    ellipse(0, 0, this.width, this.height);
}

function CreateFloorBlock(x, y) {
    let floorSprite = createSprite(x, y, 50, 50);
    floorSprite.shapeColor = color("green");
    floorSprite.draw = DrawFloor;
    return floorSprite;
}

function CreateSteenBlock(x, y) {
    let steenSprite = createSprite(x, y, 50, 50);
    steenSprite.shapeColor = color("grey");
    steenSprite.draw = DrawSteen;

    return steenSprite;
}
function CreateMetaalBlock(x, y) {
    let metaalSprite = createSprite(x, y, 50, 50);
    metaalSprite.shapeColor = color("grey");
    metaalSprite.draw = DrawMetaal;

    return metaalSprite;
}
function CreateSteenMuurBlock(x, y) {
    let steenMuurSprite = createSprite(x, y, 50, 50);
    steenMuurSprite.shapeColor = color("grey");
    steenMuurSprite.draw = DrawSteenMuur;

    return steenMuurSprite;
}

function CreateWallBlock(x, y) {
    let wallSprite = createSprite(x, y, 50, 50);
    wallSprite.shapeColor = color("brown");
    wallSprite.draw = DrawWall;

    return wallSprite;
}

function CreateHeuvelBlock(x, y) {
    let heuvelSprite = createSprite(x, y, 50, 50);

    heuvelSprite.draw = DrawHeuvel;

    return heuvelSprite;
}
function CreateHeuvel2Block(x, y) {
    let heuvel2Sprite = createSprite(x, y, 50, 50);

    heuvel2Sprite.draw = DrawHeuvel2;

    return heuvel2Sprite;
}

function PlayerLandedOnFloor() {
    player.velocity.y = 0;
    player.onFloor = true;
}
function PlayerLandedOnSteen() {
    player.velocity.y = 0;
    player.onFloor = true;
}
function PlayerLandedOnSteenMuur() {
    player.velocity.y = 0;
    player.onFloor = true;
}
function PlayerLandedOnMetaal() {
    player.velocity.y = 0;
    player.onFloor = true;
}
function PlayerLandedOnHeuvel() {
    player.velocity.y = 0;
    player.onFloor = true;
}


function DrawLevel1() {
    fill(this.shapeColor);
    rect(0, 0, this.width, this.height);
}
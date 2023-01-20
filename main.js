let canvas = document.querySelector('canvas');

canvas.width = innerWidth;
canvas.height = innerHeight;

const ctx = canvas.getContext('2d')

const x = canvas.width / 2;
const y = innerHeight / 2;

let dead = false;
let stage = 0;
let level = 1;
let freezemultiplier = 1;
let terrainmultiplier = 1;

let ss = 12000;

let secreted = false;

let speed = 12;
let damage = 15;

let health = 1800;
let maxhealth = 1800;
let reload_time = 15;

let projlifetime = 60;

let clickable = false;

let lifelevel = 0;
let powerlevel = 0;
let speedlevel = 0;

let gravitylevel = 0;
let points = 0;

let spawntimer = 0;
let novatimer = 0;
let firetimer = 0;
let gravtimer = 0;
let attacktimer = 0;

let pierce = 1;
let pause = 0;

let fragments = 0;

let randomizer = Math.random();

let enemyattacks = 0;

let hpbartoggle = 0;
let infotoggle = 0;

let cta = 0;

let nav = 1;

let radangle = 0;
let angularvelocity = 0;

let weakened = false;

let incin = 0;

let updated = false;

let winnable = true;

let activated = false;

let players;
let orderedplayers = [];

let player = new Player(x, y, 60, 'blue');

let projectile = new Projectile(renderingPosX(player.x), renderingPosY(player.y), 5, 'black', {x:1, y:1}, true, pierce);
let projectiles = [];
let enemies = [];
let enemyprojectiles = [];


let frames = 0;


let keys = {"w": false, "a": false, "s": false, "d": false}

window.addEventListener("keydown", event => {
    keys[event.key.toLowerCase()] = true
})

window.addEventListener("keyup", event => {
    keys[event.key.toLowerCase()] = false
})

window.onresize = event => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }

// movement
function updateLocation() {
    if (keys["w"] && keys["a"] && player.y > 0 && pause % 2 === 0) {
        if (player.y > 0 && pause % 2 === 0) {
            player.y -= speed/Math.sqrt(2)*freezemultiplier*terrainmultiplier
            projectiles.forEach((projectile, indexp) => {
                if (projectile.isrotating === true) {
                    projectile.y -= speed/Math.sqrt(2)
                }
            })
        }
        if (player.x > 0 && pause % 2 === 0) {
            player.x -= speed/Math.sqrt(2)*freezemultiplier*terrainmultiplier
            projectiles.forEach((projectile, indexp) => {
                if (projectile.isrotating === true) {
                    projectile.x -= speed/Math.sqrt(2)
                }
            })
        }
    } else if (keys["w"] && keys["d"] && player.y > 0 && pause % 2 === 0) {
        if (player.y > 0 && pause % 2 === 0) {
            player.y -= speed/Math.sqrt(2)*freezemultiplier*terrainmultiplier
            projectiles.forEach((projectile, indexp) => {
                if (projectile.isrotating === true) {
                    projectile.y -= speed/Math.sqrt(2)
                }
            })
        }
        if (player.x < 5000 && pause % 2 === 0) {
            player.x += speed/Math.sqrt(2)*freezemultiplier*terrainmultiplier
            projectiles.forEach((projectile, indexp) => {
                if (projectile.isrotating === true) {
                    projectile.x += speed/Math.sqrt(2)
                }
            })
        }
    } else if (keys["s"] && keys["a"] && player.y > 0 && pause % 2 === 0) {
        if (player.y < 5000 && pause % 2 === 0) {
            player.y += speed/Math.sqrt(2)*freezemultiplier*terrainmultiplier
            projectiles.forEach((projectile, indexp) => {
                if (projectile.isrotating === true) {
                    projectile.y += speed/Math.sqrt(2)
                }
            })
        }
        if (player.x  > 0 && pause % 2 === 0) {
            player.x -= speed/Math.sqrt(2)*freezemultiplier*terrainmultiplier
            projectiles.forEach((projectile, indexp) => {
                if (projectile.isrotating === true) {
                    projectile.x -= speed/Math.sqrt(2)
                }
            })
        }
    } else if (keys["s"] && keys["d"] && player.y > 0 && pause % 2 === 0) {
        if (player.y < 5000 && pause % 2 === 0) {
            player.y += speed/Math.sqrt(2)*freezemultiplier*terrainmultiplier
            projectiles.forEach((projectile, indexp) => {
                if (projectile.isrotating === true) {
                    projectile.y += speed/Math.sqrt(2)
                }
            })
        }
        if (player.x < 5000 && pause % 2 === 0) {
            player.x += speed/Math.sqrt(2)*freezemultiplier*terrainmultiplier
            projectiles.forEach((projectile, indexp) => {
                if (projectile.isrotating === true) {
                    projectile.x += speed/Math.sqrt(2)
                }
            })
        }
    } else {
        if (keys["w"] && player.y  > 0 && pause % 2 === 0) {
            player.y -= speed*freezemultiplier*terrainmultiplier
            projectiles.forEach((projectile, indexp) => {
                if (projectile.isrotating === true) {
                    projectile.y -= speed
                }
            })
        }
        if (keys["a"] && player.x  > 0 && pause % 2 === 0) {
            player.x -= speed*freezemultiplier*terrainmultiplier
            projectiles.forEach((projectile, indexp) => {
                if (projectile.isrotating === true) {
                    projectile.x -= speed
                }
            })
        }
        if (keys["s"] && player.y < 5000 && pause % 2 === 0) {
            player.y += speed*freezemultiplier*terrainmultiplier
            projectiles.forEach((projectile, indexp) => {
                if (projectile.isrotating === true) {
                    projectile.y += speed
                }
            })
        }
        if (keys["d"] && player.x < 5000 && pause % 2 === 0) {
            player.x += speed*freezemultiplier*terrainmultiplier
            projectiles.forEach((projectile, indexp) => {
                if (projectile.isrotating === true) {
                    projectile.x += speed
                }
            })
        }
    }
}

// all rendering pos coordinates are on the currently displayed canvas
function renderingPosX(x) {
    return x + canvas.width / 2 - player.x;
}
function renderingPosY(y) {
    return y + canvas.height / 2 - player.y;
}

// add projectiles to gravitational armor
function regengravity(amount, range) {
    for (let i = 0; i < amount; i++) {
        radangle = Math.PI*2*i/amount;
        angularvelocity = {x:Math.cos(radangle)*0, y:Math.sin(radangle)*0}
        if (projectiles.length < 200) projectiles.push(new Projectile(player.x + Math.cos(radangle)*range, player.y + Math.sin(radangle)*range, 6, (stage == 10 || secreted == true) ? "#FFFFFF" : "#444444", angularvelocity, 1, true, true, radangle, 100 + Math.random()*200))
    }
}

function gravitywave(amount, range) {
	for (let i = 0; i < amount; i++) {
		radangle = Math.PI*2*i/amount;
		projv = {x:-Math.cos(radangle)*6, y:-Math.sin(radangle)*6};
		projectiles.push(new Projectile(player.x + Math.cos(radangle)*range, player.y + Math.sin(radangle)*range, 5, (stage == 10 || secreted == true) ? "#FFFFFF" : "#444444", projv, 1, false, false));
	}
}


// enemy deaths and item drops
function enemydeath(enemy) {
	if (enemy.radius == 120) {
		secreted = true;
		secretStage()	
	}
    if (enemy.isSuperBoss === true && winnable === true) {
        newStage()
        winnable = false;
    }
}


// enemy boss nova
function bossnova(enemy, damage, projectilecount) {
    for (let i = 0; i < projectilecount; i++) {
        let velocity = {x:Math.cos(Math.PI*2*i/projectilecount)*10, y:Math.sin(Math.PI*2*i/projectilecount)*10}
        enemyprojectiles.push(new enemyProjectile(enemy.x, enemy.y, 10, "#F00000", velocity, 1, damage, false, false))
    }
}


// normal projectile arcs
function arc(projectilecount, colour, speed) {
    const angle = Math.atan2(mousePos.y - canvas.height / 2, mousePos.x - canvas.width / 2)
    for (let i = -projectilecount; i <= projectilecount; i++) {
        let velocity = {x:Math.cos(angle + 0.01*i)*speed, y:Math.sin(angle + 0.01*i)*speed}
        projectiles.push(new Projectile(player.x, player.y, 5, colour, velocity, pierce))
    }
}

let grid = [];
let minimap = [];
noise.seed(Math.random());

function edgeDist(x, y) {
	let a = 50 - x;
	let b = 50 - y;
	return Math.sqrt(a * a + b * b);
}

// generates map tile colours
function getColor(value) {
	if (stage < 3) {
		if (value < 0.04) {
			return "#B19A6A";
        } else if (value < 0.09) {
			return "#B9A57A";
        } else if (value < 0.13) {
			return "#C2B18B";
        } else if (value < 0.18) {
			return "#CBBC9B";
        } else if (value < 0.24) {
            return "#D4C7AC";
        } else if (value < 0.31) {
            return "#CEE8F0";
        } else {
            return "#ADD8E6";
        }
	} else if (stage < 5) {
		if (value < 0.04) {
			return "#CCCCCC";
        } else if (value < 0.09) {
			return "#BBBBBB";
        } else if (value < 0.13) {
			return "#AAAAAA";
        } else if (value < 0.18) {
			return "#999999";
        } else if (value < 0.24) {
            return "#888888";
        } else if (value < 0.31) {
            return "#777777";
        } else {
            return "#666666";
        }
	} else if (stage < 10) {
		if (value < 0.09) {
			return "#FF7233";
        } else if (value < 0.11) {
			return "#FF6119";
        } else if (value < 0.13) {
			return "#FF4F00";
        } else if (value < 0.16) {
			return "#BBBBBB";
        } else if (value < 0.19) {
            return "#999999";
        } else if (value < 0.23) {
            return "#777777";
        } else {
            return "#555555";
        }
	} else {
		return "#000000";	
	}
		
}

mousePos = {x:0, y:0}
addEventListener("mousemove", event => {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
})

function getImage(src){
    let img = new Image()
    img.src = src
    return img
}

// spawn enemies and create levels

// constructor(x, y, radius, velocity, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage, isFrozen, isDot, isHomingProj, nova, multi, image, isBoss, isSuperBoss, isUnique)
function spawnEnemy(x, y, radius, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage) {
    let velocity = {x: 0, y: 0};
    enemies.push(new Enemy(x, y, radius, velocity, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage, false, false, false, 0, 1, "enemy.png", false, false, false))
}

function spawnSecretBoss(x, y, radius, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage) {
    let velocity = {x: 0, y: 0};
    enemies.push(new Enemy(x, y, radius, velocity, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage, false, false, false, 0, 1, "secretboss.png", false, false, false))
}

function spawnSecretEnemy(x, y, radius, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage) {
    let velocity = {x: 0, y: 0};
    enemies.push(new Enemy(x, y, radius, velocity, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage, false, false, false, 0, 1, "secretenemy.png", false, false, false))
}

function spawnHomingEnemy(x, y, radius, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage) {
    let velocity = {x: 0, y: 0};
    enemies.push(new Enemy(x, y, radius, velocity, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage, false, false, true, 0, 1, "homingenemy.png", false, false, false))
}

function spawnMultiEnemy(x, y, radius, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage, multi) {
    let velocity = {x: 0, y: 0};
    enemies.push(new Enemy(x, y, radius, velocity, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage, false, false, false, 0, multi, "multienemy.png", false, false, false))
}

function spawnFireEnemy(x, y, radius, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage) {
    let velocity = {x: 0, y: 0};
    enemies.push(new Enemy(x, y, radius, velocity, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage, false, false, false, 0, 1, "fireenemy.png", false, false, false))
}

function spawnSuperBoss(x, y, radius, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage) {
    let velocity = {x: 0, y: 0};
    enemies.push(new Enemy(x, y, radius, velocity, health, maxhealth, expdrop, projradius, projcolor, projpierce, enemyReloadTime, enemyReloadTimer, damage, false, false, false, 0, stage == 5 ? 20 : 5 + Math.floor(stage/3), "mountainsuperboss.png", true, true, false))
}


function spawnNextStage(stage) {
	
	if (stage == 11) {
		for (let i = 0; i < 200; i++) {
           	spawnSecretEnemy(Math.random()*5000, Math.random()*5000, 25, 1.4**stage*15, 1.4**stage*15, Math.floor(1.06**stage*1.5), 5, "#FF0000", 1, 75, 75, stage/2);
    	}
		
		spawnSuperBoss(4500, 4500, 150, 1.6**stage*900*Math.floor(1 + stage/10), 1.6**stage*900*Math.floor(1 + stage/10), Math.floor((level + 10)*1.06**stage*0.75*Math.floor(1 + stage/10)), 15, "#00F000", 1, 10, 10, stage/2)
	} else if (stage <= 10) {
		for (let i = 0; i < 60 + stage*6; i++) {
           	spawnEnemy(Math.random()*5000, Math.random()*5000, 25, 1.4**stage*15, 1.4**stage*15, Math.floor(1.06**stage*1.5), 5, "#FF0000", 1, 75, 75, stage/2);
    	}
		
		if (stage > 2) {
			for (let i = 0; i < 30 + stage*3; i++) {
        		spawnHomingEnemy(Math.random()*5000, Math.random()*5000, 35, 1.4**stage*22, 1.4**stage*22, Math.floor(1.06**stage*1.5), 5, "#800000", 1, 65, 65, stage/2 + 1);
        	}	
		}
		
		if (stage > 5) {
			for (let i = 0; i < 20 + stage*2; i++) {
        		spawnMultiEnemy(Math.random()*5000, Math.random()*5000, 35, 1.4**stage*30, 1.4**stage*30, Math.floor(1.06**stage*1.5), 5, "#F00000", 1, 75, 75, stage/2, Math.floor(Math.random()*6 + 6));
        	}
		}
		
		if (stage < 10) {
			spawnSuperBoss(2500, 2500, 150, 1.6**stage*200*Math.floor(1 + stage/10), 1.6**stage*200*Math.floor(1 + stage/10), Math.floor((level + 10)*1.06**stage*0.75*Math.floor(1 + stage/10)), 15, "#00F000", 1, 10, 10, stage/2)
		} else if (stage === 10) {
			spawnSuperBoss(2500, 2500, 150, 1.6**stage*400*Math.floor(1 + stage/10), 1.6**stage*400*Math.floor(1 + stage/10), Math.floor((level + 10)*1.06**stage*21*Math.floor(1 + stage/10)), 15, "#00F000", 1, 10, 10, stage*2)
		
			// secret
			spawnSecretBoss(6000, -1000, 120, 1.6**stage*600*Math.floor(1 + stage/10), 1.6**stage*600*Math.floor(1 + stage/10), Math.floor(1.06**stage*1.5), 12, "#FF0000", 1, 8, 8, stage*2);
		}
	}
}

function newBoosts() {
	noise.seed(Math.random())
    grid = []
    for (let x = 0; x < 50; x++) {
        grid.push([]);
        for (let y = 0; y < 50; y++) {
            grid[grid.length - 1].push(~~(((p1.get(x / 50, y / 50) + p1.get(x / 100, y / 100) + p2.get(x / 25, y / 25) + p2.get(x / 10, y / 10) * 0.3) / 3.3 + 0.5) * 255));  
        }  
    }
    setTimeout(() => {
        if (pause % 2 == 0) {
            pause += 1;
        }
    }, 1)

    infotoggle = 0;
    points += 2;
    maxhealth += 400;
	if (stage >= 5) maxhealth += 600;
    health = maxhealth;
    enemies.length = 0;
    projectiles.length = 0;
    enemyprojectiles.length = 0;
}

function newStage() {
    newBoosts()
    stage += 1;

    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

	if (stage == 2) fragments = 3;
	if (stage == 4) fragments = 5;
	if (stage == 6 || stage == 8) gravitylevel += 5;
	if (stage == 7) damage *= 0.4;
    if (stage <= 10) {
        spawnNextStage(stage)
    }
}

function secretStage() {
	newBoosts()
	
	player.x = canvas.width / 2;
    player.y = canvas.height / 2;
	stage = 11;
	spawnNextStage(stage);
}

addEventListener("keydown", event => {
    if (event.keyCode === 32 && dead === false && (stage <= 10 || stage == 11 && secreted == true)) {
        pause += 1;
    } else if (event.key === "k" && (stage <= 10 || stage == 11 && secreted == true)) {
        infotoggle += 1;
    }
})

function multilineText(passage, splitCharLength, x, y, spacing, maxSize) {
	let passageArray = passage.split(' ');
	let charIndex = 0;
	let cycles = 0;
	while (charIndex < passageArray.length) {
		let rowPassageArray = [];
		let rowPassageSize = 0;
		do {
			rowPassageArray.push(passageArray[charIndex]);
			rowPassageSize += passageArray[charIndex] ? passageArray[charIndex].length : 1;
			charIndex++;
		} while (rowPassageSize <= splitCharLength);
		let rowPassage = rowPassageArray.join(' ');
		ctx.fillText(rowPassage, x, y + spacing * cycles, maxSize);
		cycles++;
	}
}

newStage()

animate()

/*
Sources
https://plato.stanford.edu/entries/democritus/
https://www.britannica.com/science/gravity-physics/Newtons-law-of-gravity
https://www.khanacademy.org/science/chemistry/electronic-structure-of-atoms/history-of-atomic-structure/a/discovery-of-the-electron-and-nucleus
https://www.space.com/36273-theory-special-relativity.html
https://chemistrytalk.org/discovering-the-nucleus-rutherfords-gold-foil-experiment/
https://www.amnh.org/explore/videos/space/gravity-making-waves/newton-einstein-gravity

*/


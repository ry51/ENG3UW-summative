function animate() {
    requestAnimationFrame(animate);
	
	winnable = true;
	
	enemyattacks = 0;
	updated = false;

	if (pause % 2 === 0) frames ++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineTo(renderingPosX(0), renderingPosY(0));
    ctx.lineTo(renderingPosX(5000), renderingPosY(0));
    ctx.lineTo(renderingPosX(5000), renderingPosY(5000));
    ctx.lineTo(renderingPosX(0), renderingPosY(5000));
    ctx.lineTo(renderingPosX(0), renderingPosY(0));
    ctx.lineWidth = 6;
    ctx.strokeStyle = "black";
    ctx.stroke();

	for (let x = 0; x < grid.length; x++) {
       	for (let y = 0; y < grid[x].length; y++) {
            if (renderingPosX(100 * x) < - 100 || renderingPosX(100 * x) > canvas.width + 100 || renderingPosY(100 * y) < -100 || renderingPosY(100 * y) > canvas.height + 100) {
                continue;
            }  
           	ctx.fillStyle = getColor(grid[x][y]/610);
           	ctx.fillRect(renderingPosX(100 * x), renderingPosY(100 * y), 101, 101);
       	}
    }

    ctx.fillStyle = "#000000";
    ctx.fillRect(canvas.width - 152, canvas.height - 152, 104, 104);

		for (let x = 0; x < grid.length; x += 2) {
        	for (let y = 0; y < grid[x].length; y += 2) {
            	ctx.fillStyle = getColor(grid[x][y]/610);
            	ctx.fillRect(canvas.width - 150 + 2*x, canvas.height - 150 + 2*y, 4, 4);
        	}
    	}
	
	if (pause % 2 === 0 && stage >= 3) {
		if (pause % 2 === 0) {
			gravtimer += 1;
		}
		if (gravtimer > 96 - gravitylevel*3) {
			gravtimer = 0;
			regengravity(10 + gravitylevel*0.5, 100 + Math.random()*200);	
			if (stage >= 9) gravitywave(20 + gravitylevel, 339);
		}
    }
	
	let tilex = Math.min(99, Math.max(0, Math.floor(player.x / 100)));
	let tiley = Math.min(99, Math.max(0, Math.floor(player.y / 100)));
	
    ctx.fillStyle = "#000000";
    ctx.fillRect(renderingPosX(player.x) - 42, renderingPosY(player.y) - 42 - player.radius, 84, 24);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(renderingPosX(player.x) - 40, renderingPosY(player.y) - 40 - player.radius, 80, 20);
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(renderingPosX(player.x) - 40, renderingPosY(player.y) - 40 - player.radius, 80*(health/maxhealth), 20);
	

    enemies.forEach((enemy, index) => {
            ctx.fillStyle = "#000000";
            ctx.fillRect(renderingPosX(enemy.x) - 42, renderingPosY(enemy.y) - 42 - enemy.radius, 84, 24);
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(renderingPosX(enemy.x) - 40, renderingPosY(enemy.y) - 40 - enemy.radius, 80, 20);
            if (enemy.health <= enemy.maxhealth) {
                ctx.fillStyle = "#00FF00";
                ctx.fillRect(renderingPosX(enemy.x) - 40, renderingPosY(enemy.y) - 40 - enemy.radius, 80*(enemy.health/enemy.maxhealth), 20);
            } else {
                if (enemy.health <= enemy.maxhealth*25) {
                    ctx.fillStyle = `rgb(0, ${Math.floor(255 - enemy.health/enemy.maxhealth*25)}, 0)`;
                    ctx.fillRect(renderingPosX(enemy.x) - 40, renderingPosY(enemy.y) - 40 - enemy.radius, 80, 20);
                } else {
                    ctx.fillStyle = "#000000";
                    ctx.fillRect(renderingPosX(enemy.x) - 40, renderingPosY(enemy.y) - 40 - enemy.radius, 80, 20);        
                }
           
            }
        if (enemy.isSuperBoss === true) {
            ctx.fillStyle = "#FF0000";
            ctx.beginPath();
            ctx.arc(canvas.width - 150 + enemy.x / 50, canvas.height - 150 + enemy.y / 50, 3, 0, Math.PI*2, true);
            ctx.fill();
            ctx.closePath();

			if (Math.hypot(enemy.x - player.x, enemy.y - player.y) < 800) {
				if (pause % 2 == 0) novatimer++;
				if (novatimer > (360 - stage*3)) {
					novatimer = 0;
					bossnova(enemy, 5 + stage, 100 + stage*4);
					
				}
			}
			if (stage === 10 && Math.hypot(enemy.x - player.x, enemy.y - player.y) < 800) {
				spawntimer += 1;
				if (spawntimer > 30 && enemies.length < 400) {
					spawntimer = 0;
					spawnEnemy(enemy.x + Math.random()*800 - 400, enemy.y + Math.random()*800 - 400, 25, 75, 75, 0, 5, "#FF0000", 1, 60, 60, 6);
				}
			}
			
			if (enemy.health < enemy.maxhealth) {
				enemy.health += stage/5;	
			}
        } else if (enemy.radius == 120) {
			ctx.fillStyle = "#FFD700";
            ctx.beginPath();
            ctx.arc(canvas.width - 150 + enemy.x / 50, canvas.height - 150 + enemy.y / 50, 2, 0, Math.PI*2, true);
            ctx.fill();
            ctx.closePath();
		} else {
			ctx.fillStyle = "#444444";
            ctx.beginPath();
            ctx.arc(canvas.width - 150 + enemy.x / 50, canvas.height - 150 + enemy.y / 50, 2, 0, Math.PI*2, true);
            ctx.fill();
            ctx.closePath();
		}
    })

	if (stage === 30) {
		ctx.fillStyle = "#FFFFFF";
	} else {
		ctx.fillStyle = "#000000";
	}
    
    ctx.beginPath()
    ctx.arc(canvas.width - 150 + player.x / 50, canvas.height - 150 + player.y / 50, 3, 0, Math.PI*2, true)
    ctx.fill()

    player.draw()
    player.update()
   

    projectiles.forEach((projectile, indexp) => {
        if (projectile.isrotating === true) {
            if (pause % 2 === 0) {
                projectile.rotationangle += (0.03 + gravitylevel*0.003);
            }
            projectile.x = Math.cos(projectile.rotationangle)*(projectile.rotationrange) + player.x;
            projectile.y = Math.sin(projectile.rotationangle)*(projectile.rotationrange) + player.y;
        }
       
        if ((pause % 2 === 0 && projectile.isrotating === false) || (pause % 2 === 0 && projectile.isrotating === undefined)) {
            projectile.lifeTime--
        }
        if (projectile.lifeTime <= 0) {
            projectiles.splice(indexp, 1)
        }
        projectile.update()
    })

    enemyprojectiles.forEach((enemyprojectile, indexe) => {
        const distance = Math.hypot(enemyprojectile.x - player.x, enemyprojectile.y - player.y)
        if (distance - player.radius < 0) {
            health -= enemyprojectiles[indexe].damage;
            enemyattacks += 1;
			if (enemyprojectile.isFreezing == true) {
				freeze(0.6);
			}
            if (health <= 0) {
                if (pause % 2 === 0) {
                    pause += 1;
                }
                dead = true
                ctx.font = "70px Courier New"
                ctx.fillStyle = "red"
                ctx.textAlign = "center"
                ctx.fillText("You died", canvas.width / 2, canvas.height / 2 - 35)
                ctx.font = "30px Courier New"
                ctx.fillStyle = "black"
            }
            enemyprojectiles.splice(indexe, 1)
            if (health <= 0) {
                if (pause % 2 === 0) {
                    pause += 1;
                }
                dead = true
                ctx.font = "70px Courier New"
                ctx.fillStyle = "red"
                ctx.textAlign = "center"
                ctx.fillText("You died", canvas.width / 2, canvas.height / 2 - 35)
                ctx.font = "30px Courier New"
                ctx.fillStyle = "black"
            }
        }
        if (pause % 2 === 0) {
            enemyprojectile.lifeTime--
        if (enemyprojectile.isHoming === true) {
            let fade = enemyprojectile.lifeTime / 540;
            enemyprojectile.color = `rgba(128, 0, 0, ${fade})`
        } else if (enemyprojectile.color === "#F00000") {
            let fade = enemyprojectile.lifeTime / 90;
            enemyprojectile.color = `rgba(240, 0, 0, ${fade})`
        } else {
            let fade = enemyprojectile.lifeTime / 90;
            enemyprojectile.color = `rgba(240, 0, 0, ${fade})`
        }

        }
        if (enemyprojectile.lifeTime <= 0) {
            enemyprojectiles.splice(indexe, 1)
        }
        enemyprojectile.update()
    })

    enemies.forEach((enemy, index) => {
        if (Math.hypot(enemy.x - player.x, enemy.y - player.y) < 1000 + stage * 80) {
            let angle = Math.atan2(player.y - enemy.y, player.x - enemy.x)
            if (pause % 2 === 0 && stage < 8) {
                enemy.velocity = {x: Math.cos(angle)*(4 + level*0.01 + stage*0.02), y: Math.sin(angle)*(4 + level*0.01 + stage*0.02)}
                enemy.update()
            } else if (pause % 2 == 0 && Math.hypot(enemy.x - player.x, enemy.y - player.y) < 300) {
                enemy.velocity = {x: 1.6*Math.cos(angle)*(4 + level*0.01 + stage*0.02), y: 1.6*Math.sin(angle)*(4 + level*0.01 + stage*0.02)}
                enemy.update()
            } else if (pause % 2 == 0 && Math.hypot(enemy.x - player.x, enemy.y - player.y) >= 300) {
                enemy.velocity = {x: Math.cos(angle)*(4 + level*0.01 + stage*0.02), y: Math.sin(angle)*(4 + level*0.01 + stage*0.02)}
                enemy.update()
            } else {
				enemy.velocity = {x:0, y:0};
				enemy.update()	
			}
        } else {
            enemy.draw()
        }

        projectiles.forEach((projectile, indexp) => {
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
			if (distance - enemy.radius - projectile.radius < 150 && stage >= 5 && projectile.radius > 4) {
				let angle = Math.atan2(projectile.y - enemy.y, projectile.x - enemy.x);
				if (stage < 6) projectile.velocity = {x:-Math.cos(angle)*8, y:-Math.sin(angle)*8};	
				else projectile.velocity = {x:-Math.cos(angle)*18, y:-Math.sin(angle)*18};	
			}
            if (distance - enemy.radius - projectile.radius < 0) {
                projectiles[indexp].pierce -= 1;
                enemy.isDot = true;
                // frag splitting when a projectiles's pierce runs out
                if (projectiles[indexp].pierce <= 0) {
                    // only split if the projectile hasn't already split and isn't part of the gravitational armor
                    if ((fragments > 0) && projectile.og === true && projectile.isrotating === false) {
                        for (let i = 0; i < fragments; i++) {
                            const velocity = {x:Math.cos(Math.PI*i*2/fragments)*10, y:Math.sin(Math.PI*i*2/fragments)*10}
                            projectiles.push(new Projectile(projectile.x, projectile.y, 4, ((stage == 10 || secreted == true) ? "#FFFFFF" : "#000000"), velocity, 1, false))  
                        }
                    }
                // splice original projectile after splitting
                    projectiles.splice(indexp, 1);
                }
				if (stage > 7 && Math.hypot(player.x - enemy.x, player.y - enemy.y) < 300) enemies[index].health -= damage*3;
                else enemies[index].health -= damage
                if (health > maxhealth) {
                    health = maxhealth;
                }
                if (enemies[index].health <= 0) {
                    enemydeath(enemy)
                    enemies.splice(index, 1)
                }
            }
        })

        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y)
            if (distance - enemy.radius < 0 && health > 0 && enemyattacks <= 10 && pause % 2 === 0) {
                health -= (1 + stage/4);
                enemyattacks += 1
            } else if (distance - enemy.radius < 0 && health <= 0) {
                if (pause % 2 === 0) {
                    pause += 1;
                }
            dead = true

            }
    })

    if (dead === true) {    
        ctx.font = "70px Courier New"
        ctx.fillStyle = "red"
        ctx.textAlign = "center"
        ctx.fillText("You died", canvas.width / 2, canvas.height / 2 - 35)
    }

    updateLocation()
    ctx.font = "18px Courier New"
    ctx.textAlign = "left"
	if (stage == 10 || stage == 11 && secreted == true) {
		ctx.fillStyle = "white";
	} else {
		ctx.fillStyle = "black";	
	}
    if (stage <= 10) ctx.fillText("Stage: " + stage, 60, 50)
	else if (stage == 11 && secreted == true) ctx.fillText("Stage ???", 60, 50)
    ctx.fillText("Health: " + Math.floor(health), 60, 100)
    ctx.fillText("Damage: " + Math.floor(damage), 60, 125)
	ctx.fillText("Speed: " + Math.floor(speed*10)/10, 60, 150)	

	if (stage == 10 || stage == 11 && secreted == true) {
		ctx.fillStyle = "white";
	} else {
		ctx.fillStyle = "black";	
	}
    ctx.textAlign = "left"
    ctx.fillText("Points: " + points, 60, 250)
    if (frames < 3600) {
        ctx.fillText("Time: " + Math.floor(frames/60), 60, canvas.height - 80)
    } else if (frames >= 3600 && frames%3600 < 600) {
        ctx.fillText("Time: " + Math.floor(frames/3600) + ":0" + Math.floor((frames%3600)/60), 60, canvas.height - 80)
    } else {
        ctx.fillText("Time: " + Math.floor(frames/3600) + ":" + Math.floor((frames%3600)/60), 60, canvas.height - 80)
    }
   

    if (pause % 2 === 1) {
        ctx.textAlign = "right";
        ctx.fillText("SPACE TO UNPAUSE", canvas.width - 80, 80)
        ctx.textAlign = "left";
    }
	if (stage <= 10 || stage == 11 && secreted == true) {
        if (stage >= 1) {
            ctx.font = "18px Courier New"
            ctx.fillText(`LIFE [z]  Level: ${lifelevel}`, 60, 310)
            ctx.font = "15px Courier New"
            ctx.fillText("Increases your health by a stacking 15%.", 60, 330)
            ctx.fillText("You are currently gaining " + lifelevel*15 + "% more health.", 60, 350)
        }
        if (stage >= 2) {
            ctx.font = "18px Courier New"
            ctx.fillText(`POWER [x]  Level: ${powerlevel}`, 60, 380)
            ctx.font = "15px Courier New"
            ctx.fillText("Increases your damage by a stacking 10%.", 60, 400)
            ctx.fillText("You are currently gaining " + powerlevel*10 + "% more damage.", 60, 420)
        }
        if (stage >= 3) {
            ctx.font = "18px Courier New"
            ctx.fillText(`SPEED [c]  Level: ${speedlevel}`, 60, 450)
            ctx.font = "15px Courier New"
            ctx.fillText("Increases your speed by a stacking 15%.", 60, 470)
            ctx.fillText("You are currently gaining " + speedlevel*15 + "% more speed.", 60, 490)
        }
        if (stage >= 4) {
            ctx.font = "18px Courier New"
            ctx.fillText(`GRAVITY [v]  Level: ${gravitylevel}`, 60, 520)
            ctx.font = "15px Courier New"
            if (stage < 9) ctx.fillText("Increases speed, regen speed, and projectile count of rotating projectiles.", 60, 540)
			else ctx.fillText("Enhances gravitational armor and also increases the strength of gravitational waves.", 60, 540)
            ctx.fillText("Gravity regens every " + (96 - 3*gravitylevel) + " frames, with " + Math.floor(10 + 0.5*gravitylevel) + " projectiles.", 60, 560)
        }
	}
	

    if (infotoggle % 2 === 0) {
        ctx.fillStyle = "#000000"
        ctx.fillRect(150, 150, canvas.width - 300, canvas.height - 300)
        ctx.fillStyle = (stage == 12 && secreted == true) ? "#FFD700" : "#EEEEEE";
        ctx.fillRect(153, 153, canvas.width - 306, canvas.height - 306)
        if (stage === 1) {
            ctx.font = "24px Courier New"
            ctx.fillStyle = "black"
        } else if ((stage > 10 && secreted == false) || stage == 12) {
            ctx.font = "24px Courier New"
            ctx.fillStyle = "black"
            ctx.fillText("Congratulations, you won!!", 200, 200)
			ctx.font = "15px Courier New"
			if (frames < 3600) {
        		ctx.fillText("Time taken: " + Math.floor(frames/60), 200, 240)
    		} else if (frames >= 3600 && frames%3600 < 600) {
        		ctx.fillText("Time taken: " + Math.floor(frames/3600) + ":0" + Math.floor((frames%3600)/60), 200, 240)
    		} else {
        		ctx.fillText("Time taken: " + Math.floor(frames/3600) + ":" + Math.floor((frames%3600)/60), 200, 240)
    		}
			if (stage == 12) multilineText("Thank you for playing this game and congrats on being able to find the secret! Hopefully you now have a better understanding on how physics evolved.", 50, 200, 280, 17, canvas.width - 400);
			else {
				multilineText("Thank you for playing this game. Hopefully you now have a better understanding on how physics evolved... and what kinds of observations yielded useful information...", 50, 200, 280, 17, canvas.width - 400);
			}
        } else {
            ctx.font = "24px Courier New"
            ctx.fillStyle = "black"
            
        }
        if (stage === 1) {
			ctx.font = "20px Courier New"
            ctx.fillText("Overview", 180, 200)
            ctx.font = "15px Courier New"
			multilineText("This game is intended to take you through the major breakthroughs in physics history in an adventure-like way. Each stage will have a different time period and theme, arranged in chronological order. This game follows two seemingly unrelated concepts: the idea of gravity and the discovery of the atom.", 50, 180, 230, 17, canvas.width - 400);

            ctx.font = "20px Courier New"
            ctx.fillText("Rules", 180, 350)
            ctx.font = "15px Courier New"
			multilineText("W, a, s, and d keys to move. The game autofires for you, and you can control the direction of shooting with your mouse. Defeat the boss of each stage to move onto the next (bosses are highlighted for you on the minimap in red - you do not have to kill every single enemy). Every time you pass a stage, you will gain stat points, which you can spend on different attributes that will be unlocked by pressing their respective hotkeys (ex. clicking z gives you life). Clearing 10 stages wins the game, and reaching zero or lower health will make you lose. You can use the space bar to pause/unpause the game. Press k to close this menu.", 50, 180, 370, 17, canvas.width - 400);
            ctx.fillText("Good luck!", 180, 560);
			
        } else if (stage === 2) {
            ctx.font = "20px Courier New"
            ctx.fillText("400 B.C.", 180, 200)
            ctx.font = "15px Courier New"
			multilineText("Around 400 B.C., the first atomic theory was proposed by a Greek philosopher named Democritus. His thought process was very simple - he imagined cutting a piece of matter until it was eventually in indivisible particles (indivisible was the root for the word atom). His atomic theory was widely criticized because most people at the time believed Aristotle's theory of elements to be correct - that matter was all made up of Earth, Air, Fire, and Water all in different amounts. It would be over 2200 years until the truth about atoms was finally brought to light.", 50, 180, 230, 17, canvas.width - 400);
			
			multilineText("Since atoms are indivisible, there will eventually be a point where matter is seperated into individual atoms - the smallest possible form. Your projectiles will now split once upon hitting an enemy into 3 seperate projectiles to further illustrate this idea. They obviously won't be able to split infinitely - this was the idea that fueled the atomic theory.", 50, 180, 420, 17, canvas.width - 400);
			
        } else if (stage === 3) {
            ctx.font = "20px Courier New"
            ctx.fillText("1687", 180, 200)
            ctx.font = "15px Courier New"
			multilineText("In 1687, a revolutionary theory was proposed by Isaac Newton. Although the classic story of an apple falling on his head might not have been true, he did have the idea that a same universal force was causing things to fall and causing celestial bodies to orbit each other. This can be visualized with the Earth and the Moon - the Moon accelerates towards the Earth due to gravity but is going so fast that when it travels horizontally, it travels away from the Earth just enough to make up for the fact that it falls slightly back towards Earth. Newton's idea was brilliant and thought to be correct for over 200 years, when an important discovery would challenge the creator of Calculus, showing that incorrect theories can still have a decisive positive impact.", 50, 180, 230, 17, canvas.width - 400);
			
			multilineText("Due to the existence of gravity, you now gain a gravitational shield - an aura of revolving projectiles. It will consistently generate projectiles around you to damage nearby enemies, and can be upgraded later in the game to regenerate faster. All projectiles are held to you (the player) and will travel together when you move.", 50, 180, 453, 17, canvas.width - 400);
        } else if (stage === 4) {
            ctx.font = "20px Courier New"
            ctx.fillText("1808", 180, 200)
            ctx.font = "15px Courier New"
			multilineText("In 1808, English chemist John Dalton proposed the first ever theory that described all of matter in terms of atoms. His theory builds on Democritus's original idea but incorporates experimental evidence and previously discovered laws.  The basis of his theory was from the law of conservation of matter (that matter in a closed system can't be created or destroyed) and the law of constant composition (that a pure compound always contains the same proportions of elements). His theory stated the following properties:", 50, 180, 230, 17, canvas.width - 400);
			ctx.fillText("1) All matter is made of atoms.", 180, 370);
			ctx.fillText("2) All atoms of the same element are identical.", 180, 387);
			ctx.fillText("3) Compounds can be made by combining multiple pure elements.", 180, 404);
			ctx.fillText("4) Chemical reactions are a rearragement of existing atoms.", 180, 421);

			multilineText("Projectiles now split into 5 mini projectiles after hitting an enemy - representing the idea that atomic theory was more widely accepted after Dalton's properties were published. There were still many people who doubted the theory and claimed that some experimental evidence may have been fake but it has gotten a lot more attention due to how it elegantly explains many natural phenomena that has not been explained in the past.", 50, 180, 450, 17, canvas.width - 400);
        } else if (stage === 5) {
            ctx.font = "20px Courier New"
            ctx.fillText("1897", 180, 200)
            ctx.font = "15px Courier New"
			multilineText("The first subatomic particle, the electron, was discovered in 1897. This was a big step in the development of the atomic theory because it proved that atoms weren't the smallest things in the universe - rather they were a combination of other things (which we now know are protons, neutrons, and electrons). Electrons were originally discovered by J. J. Thompson, who used a Cathode Ray Tube experiment. The experiment used an almost entirely empty charged tube with a very high voltage between the two ends, forming a beam of particles between them. Two charged plates were placed on either end of the tube, and Thompson noticed that the beam of particles within the tube were bent towards the positively charged plate. Thompson's model was ultimately incorrect, however, because he assumed that atoms were an overall positively charged sphere with electrons scattered throughout, known as the Plum Pudding Model.", 50, 180, 230, 17, canvas.width - 400);

			multilineText("Projectiles are now electrically charged. To simulate this idea, projectiles will be drawn to enemies once they get close, giving a powerful homing effect.", 50, 180, 495, 17, canvas.width - 400);
        } else if (stage === 6) {
            ctx.font = "20px Courier New"
            ctx.fillText("1905", 180, 200)
            ctx.font = "15px Courier New"
			multilineText("1905 is often known as Albert Einstein's Miracle Year. In 1905, he discovered special relativity, an explanation of how speed affects time and space. It is known as special relativity because it only analyzes a very special case - when the speed involved is close or equal to lightspeed. This is the origin of the famous equation E = mc^2 and also laid the foundation for general relativity which will follow ten years later. Special relativity provided a system to represent motion in an intertial frame of reference - when the object in motion is following a straight line at a constant velocity.", 50, 180, 230, 17, canvas.width - 400);

			multilineText("Enemies now gain a slight time warp around them, causing your projectiles to speed up when near an enemy. In addition, you gain 5 levels of gravity for free, giving a stronger gravity aura.", 50, 180, 495, 17, canvas.width - 400);
        } else if (stage === 7) {
            ctx.font = "20px Courier New"
            ctx.fillText("1911", 180, 200)
            ctx.font = "15px Courier New"
			multilineText("British physicist Ernest Rutherford discovered the nucleus in 1911, the part of an atom that contains the positive charge and most of the mass in the atom. It was discovered by the famous Gold Foil experiment, where alpha (positively charged helium) particles were shot at a piece of gold foil. Rutherford assumed that Thompson's plum pudding model was correct and that most of the particles would pass through the foil - but that wasn't the case. By placing a phosphorescent screen (a screen that would emit light once hit by charged particles) around the beam of alpha particles, most of the particles were deflected off the foil onto the screen. From these results, Rutherford concluded that there must be something small, dense, and charged inside of the atom: what we know now as the nucleus.", 50, 180, 230, 17, canvas.width - 400);

			multilineText("You now fire the equivalent of a nucleus every shot - a barrage of multiple weaker projectiles. You gain 5x projectile count but your damage is reduced by 60% - essentially giving a net total of double damage.", 50, 180, 475, 17, canvas.width - 400);
        } else if (stage === 8) {
            ctx.font = "20px Courier New"
            ctx.fillText("1915", 180, 200)
            ctx.font = "15px Courier New"
			multilineText("The year 1915 holds one of the most famous leaps in physics history: general relativity. Unlike special relativity, the equations of general relativity would model the speed and acceleration for every body of matter in the universe. The idea of general relativity was that space-time could be represented like a fabric - a warped plane containing every piece of matter in the universe. Each object would exert a force on this fabric due to its mass, changing its shape. This undermined Newton's theory of Gravity yet could explain the why - the reason gravity occurs. Albert Einstein barely edged out David Hilbert in the race to discover the equations of relativity, and the result was published late November 1915.", 50, 180, 230, 17, canvas.width - 400);

			multilineText("To represent general relativity, enemies now accelerate towards you when they become closer and take more damage. In addition, gain 5 move levels of gravity.", 50, 180, 475, 17, canvas.width - 400);
        } else if (stage === 9) {
            ctx.font = "20px Courier New"
            ctx.fillText("1974", 180, 200)
            ctx.font = "15px Courier New"
			multilineText("In 1915, Einstein predicted that the fabric of space-time can be altered with gravitational waves - waves that are sent when some form of mass changes. Gravitational waves can be visualized as the changes when a bowling ball is dropped on a trampoline - they start at the source and then ripple outward. Although Einstein was satisfied with his prediction, scientists were unable to gather any evidence on the existence of these waves. The first notable discovery was in 1974, when astronomers Joseph Taylor and Russell Hulse were observing a pair of neutron stars (collapsed cores of massive stars) orbiting each other whose pattern aligned perfectly with Einstein's equations when gravitational waves were being generated.", 50, 180, 230, 17, canvas.width - 400);

			multilineText("You now generate periodic gravity waves! These waves will act like gravitational waves in the real world, starting outward and rippling inward (imagine that you are a sphere on a trampoline, the trampoline would curve downwards and objects would be drawn towards your location). These will be in sync with gravitational armor and can be strengthened with the gravity upgrade [v].", 50, 180, 445, 17, canvas.width - 400);
        } else if (stage === 10) {
            ctx.font = "20px Courier New"
            ctx.fillText("The present", 180, 200)
            ctx.font = "15px Courier New"
			multilineText("So what do we know? The atom we now know as the simple building block of matter, made up of charged particles and a dense nucleus in the middle. Gravity is not how everyone originally imagined, being a warping of space-time instead of a force between every pair of objects in the universe. However, there are still things yet to be discovered. No matter how much we know about the world, it will never be enough. So keep looking, keep searching, and perhaps one day the unknown will shine through.", 50, 180, 230, 17, canvas.width - 400);

			multilineText("Life is like a bicycle. To keep your balance, you must keep moving. - Albert Einstein", 50, 180, 475, 17, canvas.width - 400);
        } else if (stage === 11 && secreted == true) {
            ctx.font = "15px Courier New"
			multilineText("Where are you? This place seems unfamiliar. In fact, it seems like an entirely new dimension...", 50, 180, 230, 17, canvas.width - 400);

        }

        ctx.font = "15px Courier New"
		if (stage == 4) ctx.fillText("[K] to close menu", 180, 581);
        else if (stage > 1) ctx.fillText("[K] to close menu", 180, 560);
    }


}
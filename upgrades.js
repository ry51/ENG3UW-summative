function max_health_update() {
    maxhealth *= (1 + 0.15*lifelevel)/(1 + 0.15*(lifelevel-1));
    health *= (1 + 0.15*lifelevel)/(1 + 0.15*(lifelevel-1));
}
function damage_update() {
    damage *= (1 + 0.1*powerlevel)/(1 + 0.1*(powerlevel-1));
}
function speed_update() {
    speed *= (1 + 0.1*speedlevel)/(1 + 0.1*(speedlevel-1))
}

addEventListener("keydown", event => {
    if (event.key === "z" && stage >= 1 && points > 0) {
        lifelevel += 1;
        points -= 1;
        max_health_update()
    }
    if (event.key === "x" && stage >= 2 && points > 0) {
        powerlevel += 1;
        points -= 1;
        damage_update()
    }
    if (event.key === "c" && stage >= 3 && points > 0) {
        speedlevel += 1;
        points -= 1;
        speed_update()
    }
    if (event.key === "v" && stage >= 4 && points > 0) {
        gravitylevel += 1;
        points -= 1;
    }
})

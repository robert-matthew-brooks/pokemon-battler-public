function report(msg) {
    console.log(msg);
    if (document.getElementById('report-box')) {
        document.getElementById('report-box').innerHTML = document.getElementById('report-line').value + '\n' + document.getElementById('report-box').innerHTML;
        document.getElementById('report-line').value = msg;
    }
}

class Pokemon {
    #name;
    #hitPoints;
    #attackDamage;
    #move;

    getName() { return this.#name; }
    getHitPoints() { return this.#hitPoints; }
    getAttackDamage() { return this.#attackDamage; }
    getMove() { return this.#move; }
    setMove(newMove) { this.#move = newMove; }

    constructor(name, hitPoints, attackDamage, imgUrl) {
        this.#name = name;
        this.#hitPoints = hitPoints;
        this.#attackDamage = attackDamage;
        this.#move = 'Tackle';
        this.imgUrl = imgUrl;
    }

    takeDamage(damage) {
        if (damage > this.#hitPoints) {
            this.#hitPoints = 0;
        }
        else {
            this.#hitPoints -= damage;
        }
    }

    useMove() {
        report(`${this.#name} used ${this.#move}`);
        return this.#attackDamage;
    }

    hasFainted() {
        return this.#hitPoints === 0;
    }
}



// Elemental classes



class FirePokemon extends Pokemon {
    #type;

    getType() { return this.#type; }

    constructor(name, hitPoints, attackDamage, imgUrl) {
        super(name, hitPoints, attackDamage, imgUrl);
        this.#type = 'fire';
    }

    isEffectiveAgainst(target) { return target.getType() === 'grass' };
    isWeakTo(target) { return target.getType() === 'water' };
}

class WaterPokemon extends Pokemon {
    #type;

    getType() { return this.#type; }

    constructor(name, hitPoints, attackDamage, imgUrl) {
        super(name, hitPoints, attackDamage, imgUrl);
        this.#type = 'water';
    }

    isEffectiveAgainst(target) { return target.getType() === 'fire' };
    isWeakTo(target) { return target.getType() === 'grass' };
}

class GrassPokemon extends Pokemon {
    #type;

    getType() { return this.#type; }

    constructor(name, hitPoints, attackDamage, imgUrl) {
        super(name, hitPoints, attackDamage, imgUrl);
        this.#type = 'grass';
    }
    
    isEffectiveAgainst(target) { return target.getType() === 'water' };
    isWeakTo(target) { return target.getType() === 'fire' };
}

class NormalPokemon extends Pokemon {
    #type;

    getType() { return this.#type; }

    constructor(name, hitPoints, attackDamage, imgUrl) {
        super(name, hitPoints, attackDamage, imgUrl);
        this.#type = 'normal';
    }

    isEffectiveAgainst() { return false };
    isWeakTo() { return false };
}



// Species classes



class Charmander extends FirePokemon {
    constructor(name, hitPoints, attackDamage, imgUrl) {
        super(name, hitPoints, attackDamage, imgUrl);
        this.setMove('Ember');
    }
}

class Squirtle extends WaterPokemon {
    constructor(name, hitPoints, attackDamage, imgUrl) {
        super(name, hitPoints, attackDamage, imgUrl);
        this.setMove('Water Gun');
    }
}

class Bulbasaur extends GrassPokemon {
    constructor(name, hitPoints, attackDamage, imgUrl) {
        super(name, hitPoints, attackDamage, imgUrl);
        this.setMove('Vine Whip');
    }
}

class Rattata extends NormalPokemon {
    constructor(name, hitPoints, attackDamage, imgUrl) {
        super(name, hitPoints, attackDamage, imgUrl);
    }
}



// Pokeball



class Pokeball {
    #storedPokemon;

    getStoredPokemon() { return this.#storedPokemon; }

    constructor() {
        this.#storedPokemon = null;
    }

    throw(target) {
        if (target !== undefined) {
            if (this.isEmpty() === true) {
                this.#storedPokemon = target;
                report(`You caught ${this.#storedPokemon.getName()}`);
            }
            else report('not empty...');
        }
        else {
            if (this.isEmpty() === false) {
                report(`GO ${this.#storedPokemon.getName()}!!`);
                return this.#storedPokemon;
            }
            else report('empty...');
        }
    }

    isEmpty() {
        return this.#storedPokemon === null;
    }

    contains() {
        if (this.isEmpty() === false) {
            return this.#storedPokemon.getName();
        }
        else {
            return 'empty...';
        }
    }

    getImgUrl() {
        return this.#storedPokemon.imgUrl;
    }
}



// Humans



class Trainer {
    #lastCapturedIndex;
    #belt;
    getBelt() { return this.#belt};
    #remainingPokemon;
    getRemainingPokemon() { return this.#remainingPokemon };
    decrementPokemon() { this.#remainingPokemon-- };
    #isPlayer

    constructor(isPlayer) {
        this.#lastCapturedIndex = 0;
        this.#belt = [
            new Pokeball(),
            new Pokeball(),
            new Pokeball(),
            new Pokeball(),
            new Pokeball(),
            new Pokeball()
        ]
        this.#remainingPokemon = 0;
        this.#isPlayer = isPlayer;
    }

    getIndexOfFirstEmptyPokeball() {
        for (const [i, pokeball] of this.#belt.entries()) {
            if (pokeball.isEmpty()) return i;
        }
    }

    catch(target) {
        const i = this.getIndexOfFirstEmptyPokeball();
        
        if (i === undefined) {
            report('No empty pokeballs...')
        }
        else {
            this.#belt[i].throw(target);
            this.#remainingPokemon++;

            if (this.#isPlayer) {
                addToInterface(this.#lastCapturedIndex, target.getName());
                this.#lastCapturedIndex++;
            }
        }
    }

    getPokemon(name) {
        for (const pokeball of this.#belt) {
            if (pokeball.contains() === name) {
                return pokeball.throw();
            }
        }
    }

    getImgUrl(beltIndex) {
        return this.#belt[beltIndex].getImgUrl();
    }

    getBeltIndex(pokemon) {
        for (let i=0; i<this.#belt.length; i++) {
            if (this.#belt[i].getStoredPokemon() === pokemon) return i;
        }
    }
}



// Battle



class Battle {
    #trainerA;
    #pokemonA;
    #trainerB;
    #pokemonB;

    constructor(trainerA, pokemonA, trainerB, pokemonB) {
        this.#trainerA = trainerA;
        this.#pokemonA = pokemonA;
        this.#trainerB = trainerB;
        this.#pokemonB = pokemonB;
    }

    fight(attacker) {
        const defender = (attacker === this.#pokemonA) ? this.#pokemonB : this.#pokemonA;
        let fightMsg = '';

        let damage = attacker.useMove();

        if (attacker.isEffectiveAgainst(defender)) {
            damage = Math.round(damage * 1.25);
            fightMsg += 'The element is effective! ';
        }
        else if (attacker.isWeakTo(defender)) {
            damage = Math.round(damage * 0.75);
            fightMsg += 'The element is weak! ';
        }

        defender.takeDamage(damage);
        fightMsg += `Dealt ${damage} damage!`;

        report(fightMsg);
    }
}



/* module.exports = {
    Pokemon,
    FirePokemon,
    WaterPokemon,
    GrassPokemon,
    NormalPokemon,
    Charmander,
    Squirtle,
    Bulbasaur,
    Rattata,

    Pokeball,
    Trainer,
    Battle
} */



// Set Up Data



const player = new Trainer(true);
let activePlayerPokemon = null;
const customNames = [];
let gameOver = false;

const opponents = [];
opponents[0] = new Rattata('Wild Rattata', 26, 10, 'img/rattata.png');
opponents[1] = new Squirtle('Wild Squirtle', 28, 10, 'img/squirtle.png');
opponents[2] = new Charmander('Wild Charmander', 28, 12, 'img/charmander.png');
opponents[3] = new NormalPokemon('Wild Eevee', 30, 13, 'img/eevee.png');
opponents[4] = new Rattata('Rabid Rattata', 31, 14, 'img/rattata.png');
opponents[5] = new WaterPokemon('Wild Vaporeon', 36, 15, 'img/vaporeon.png');
opponents[6] = new GrassPokemon('Wild Leafon', 40, 17, 'img/leafeon.png');
opponents[7] = new Bulbasaur('Wild Bulbasaur', 43, 19, 'img/bulbasaur.png');
opponents[8] = new FirePokemon('Wild Flareon', 46, 20, 'img/flareon.png');
opponents[9] = new Charmander('Boss Charmander', 55, 23, 'img/charmander.png');

let enemy = 0;
const lastEnemy = opponents.length-1;
let activeEnemy = null;



// Interface functions



function showArea(areaId) {
    document.getElementById('catch-pokemon').classList.add('hidden');
    document.getElementById('big-message').classList.add('hidden');
    document.getElementById('battle-pokemon').classList.add('hidden');
    document.getElementById('choose-pokemon').classList.add('hidden');

    document.getElementById(areaId).classList.remove('hidden');
}

function lockButtons() {
    document.getElementById('ok-button').disabled = true;
    document.getElementById('move-button').disabled = true;
    document.getElementById('choose-button').disabled = true;
}

function addToInterface(lastCaughtIndex, lastCapturedName) {
    const newText = document.getElementById('choose-button').innerHTML.replace(/\d/, lastCaughtIndex+1)
    document.getElementById('choose-button').innerHTML = newText;

    document.getElementById('choose-pokemon-' + lastCaughtIndex).style.backgroundImage = `url('${player.getImgUrl(lastCaughtIndex)}')`;
    document.getElementById('choose-pokemon-' + lastCaughtIndex).onclick = () => choosePokemon(lastCapturedName);
}

function removeFromInterface(defeatedBeltIndex) {
    const newText = document.getElementById('choose-button').innerHTML.replace(/\d/, player.getRemainingPokemon())
    document.getElementById('choose-button').innerHTML = newText;

    document.getElementById('choose-pokemon-' + defeatedBeltIndex).style.backgroundImage = 'url("img/cross.png")';
    document.getElementById('choose-pokemon-' + defeatedBeltIndex).onclick = '';
}

function showHp(element, hp) {
    document.getElementById(element).innerHTML = hp + ' hp';
    
    if (hp < 10) {
        document.getElementById(element).classList.add('dangerText');
    }
    else {
        document.getElementById(element).classList.remove('dangerText');
    }
}

function clearAnimations() {
    document.getElementById('player-img').classList.remove('spin-animation');
    document.getElementById('player-img').classList.remove('player-attack-animation');
    document.getElementById('player-img').classList.remove('enemy-attack-animation');
    document.getElementById('player-img').classList.remove('fade-out');
    document.getElementById('opponent-img').classList.remove('spin-animation');
    document.getElementById('opponent-img').classList.remove('player-attack-animation');
    document.getElementById('opponent-img').classList.remove('enemy-attack-animation');
    document.getElementById('opponent-img').classList.remove('fade-out');
}
function animate(image, animationClass) {
    clearAnimations();
    setTimeout(animStart, 50, image, animationClass)
}
function animStart(image, animationClass) {
    document.getElementById(image).classList.add(animationClass);
}



function selectPokemon(chosenPk) {
    let name = prompt('What is this pokemon called?', chosenPk);
    if (name === null || name === '') return false;

    if (customNames.includes(name)) {
        alert('Name already chosen');
        return false;
    }
    else {
        customNames.push(name);
    }

    let createdPk;
    
    switch(chosenPk) {
        case 'Eevee':
            createdPk = new NormalPokemon(name, 55, 18, 'img/eevee.png');
            break;
        case 'Flareon':
            createdPk = new FirePokemon(name, 65, 20, 'img/flareon.png');
            break;
        case 'Vaporeon':
            createdPk = new WaterPokemon(name, 70, 19, 'img/vaporeon.png');
            break;
        case 'Leafon':
            createdPk = new GrassPokemon(name, 65, 17, 'img/leafeon.png');
            break;
        case 'Charmander':
            createdPk = new Charmander(name, 44, 17, 'img/charmander.png');
            break;
        case 'Squirtle':
            createdPk = new Squirtle(name, 44, 16, 'img/squirtle.png');
            break;
        case 'Bulbasaur':
            createdPk = new Bulbasaur(name, 45, 16, 'img/bulbasaur.png');
            break;
        case 'Rattata':
            createdPk = new Rattata(name, 45, 16, 'img/rattata.png');
            break;
    }

    player.catch(createdPk);

    if (document.getElementById('ok-button').disabled === true) {
        document.getElementById('ok-button').disabled = false;
        document.getElementById('ok-button').onclick = () => { startBattle() };
    }
};



function startChoose () {
    showArea('choose-pokemon');
    document.getElementById('ok-button').disabled = true;
    document.getElementById('move-button').disabled = true;
    document.getElementById('choose-button').disabled = true;
}

function choosePokemon(name) {
    activePlayerPokemon = player.getPokemon(name);

    document.getElementById('move-button').innerText = activePlayerPokemon.getMove();
    document.getElementById('move-button').disabled = false;
    startBattle();
}



function startBattle() {
    showArea('battle-pokemon');
    document.getElementById('ok-button').disabled = true;
    document.getElementById('move-button').disabled = false;
    document.getElementById('choose-button').disabled = false;

    if (activeEnemy === null) {
        activeEnemy = opponents[enemy];
        report(`${activeEnemy.getName()} appears!`)
    }

    if (activePlayerPokemon === null) {
        activePlayerPokemon = player.getPokemon(player.getBelt()[0].contains());
        document.getElementById('move-button').innerText = activePlayerPokemon.getMove();
    }
    
    showHp('player-pokemon-hp', activePlayerPokemon.getHitPoints());
    document.getElementById('player-img').style.backgroundImage = `url('${activePlayerPokemon.imgUrl}')`;

    // TRIGGER SPIN ANIMATION

    animate('player-img', 'spin-animation');

    document.getElementById('opponent-name').innerHTML = activeEnemy.getName() + ':';
    showHp('opponent-pokemon-hp', activeEnemy.getHitPoints());
    document.getElementById('opponent-img').style.backgroundImage = `url('${activeEnemy.imgUrl}')`;
}

function playerMove() {
    const battle = new Battle(player, activePlayerPokemon, null, activeEnemy);
    battle.fight(activePlayerPokemon);
    animate('player-img', 'player-attack-animation');
    showHp('opponent-pokemon-hp', activeEnemy.getHitPoints());

    lockButtons();

    if (activeEnemy.hasFainted() === true) {
        report(`${activeEnemy.getName()} has FAINTED!!!`);
        animate('opponent-img', 'fade-out');

        // animate enemy fade out to cross

        if (enemy === lastEnemy) {
            document.getElementById('big-title').innerHTML = 'You WIN!!!';
            document.getElementById('big-subtext').innerHTML = 'All pokemon defeated';
            document.getElementById('ok-button').onclick = () => { showBigMessage() };
            document.getElementById('ok-button').disabled = false;
        }

        else {
            document.getElementById('big-title').innerHTML = `${activeEnemy.getName()} defeated !!!`;;
            document.getElementById('big-subtext').innerHTML = `Enemies fainted: ${enemy+1}/${lastEnemy+1}`
            document.getElementById('ok-button').onclick = () => { showBigMessage() };
            document.getElementById('ok-button').disabled = false;
        }

        activeEnemy = null;
    }

    else {
        setTimeout(enemyMove, 2000);
    }
}



function enemyMove() {
    const battle = new Battle(player, activePlayerPokemon, null, activeEnemy);
    battle.fight(activeEnemy);
    animate('opponent-img', 'enemy-attack-animation');
    showHp('player-pokemon-hp', activePlayerPokemon.getHitPoints());

    if (activePlayerPokemon.hasFainted()) {
        report(`${activePlayerPokemon.getName()} has FAINTED!!!`);
        player.decrementPokemon();
        removeFromInterface(player.getBeltIndex(activePlayerPokemon));
        animate('player-img', 'fade-out');


        if (player.getRemainingPokemon() > 0) {
            document.getElementById('move-button').disabled = true;
            document.getElementById('choose-button').disabled = false;
        }
        else {
            gameOver = true;

            document.getElementById('big-title').innerHTML = 'Game OVER!!';
            document.getElementById('big-subtext').innerHTML = 'All your pokemon have fainted...';
            document.getElementById('ok-button').onclick = () => { showBigMessage() };
            document.getElementById('ok-button').disabled = false;
        }

    }

    else {
        document.getElementById('move-button').disabled = false;
        document.getElementById('choose-button').disabled = false;
    }
}



function showBigMessage() {
    lockButtons();
    showArea('big-message');

    if (enemy !== lastEnemy && gameOver === false) {
        enemy++;
        document.getElementById('ok-button').onclick = () => { startBattle() };
        document.getElementById('ok-button').disabled = false;
    }
}
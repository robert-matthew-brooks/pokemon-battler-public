const {
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
} = require('../pokemon-battler.js');

describe('pokemon-battler', () => {



    // #region SETUP DUMMY DATA



    const t_pkm = {}; // test pokemon, abbreviation because of repetition
    const t_ball = {}; // test pokeballs
    const t_trainer = {};
    const t_battle = {};

    let consoleSpy;

    beforeEach(() => { 
        t_pkm['eevee'] = new NormalPokemon('Eevee', 55, 18);
        t_pkm['flareon'] = new FirePokemon('Flareon', 65, 20);
        t_pkm['vaporeon'] = new WaterPokemon('Vaporeon', 70, 19);
        t_pkm['leafeon'] = new GrassPokemon('Leafeon', 65, 17);
        t_pkm['charmander'] = new Charmander('Charmander', 44, 17);
        t_pkm['squirtle'] = new Squirtle('Squirtle', 44, 16);
        t_pkm['bulbasaur'] = new Bulbasaur('Bulbasaur', 45, 16);
        t_pkm['eevee2'] = new NormalPokemon('Eevee2', 55, 18);

        t_ball['empty'] = new Pokeball();
        t_ball['eevee'] = new Pokeball()
        t_ball['eevee'].throw(t_pkm['eevee']);

        t_trainer['empty'] = new Trainer();
        t_trainer['full'] = new Trainer();
        t_trainer['full'].catch(t_pkm['eevee']);
        t_trainer['full'].catch(t_pkm['flareon']);
        t_trainer['full'].catch(t_pkm['vaporeon']);
        t_trainer['full'].catch(t_pkm['leafeon']);
        t_trainer['full'].catch(t_pkm['charmander']);
        t_trainer['full'].catch(t_pkm['squirtle']);

        t_trainer['charmander'] = new Trainer();
        t_trainer['charmander'].catch(t_pkm['charmander']);
        t_trainer['bulbasaur'] = new Trainer();
        t_trainer['bulbasaur'].catch(t_pkm['bulbasaur']);
        t_trainer['squirtle'] = new Trainer();
        t_trainer['squirtle'].catch(t_pkm['squirtle']);
        t_trainer['eevee'] = new Trainer();
        t_trainer['eevee'].catch(t_pkm['eevee']);
        t_trainer['eevee2'] = new Trainer();
        t_trainer['eevee2'].catch(t_pkm['eevee2']);

        t_battle['normal'] = new Battle(
            t_trainer['eevee'],
            t_pkm['eevee'],
            t_trainer['eevee2'],
            t_pkm['eevee2']
        );
        t_battle['water-fire'] = new Battle(
            t_trainer['squirtle'],
            t_pkm['squirtle'],
            t_trainer['charmander'],
            t_pkm['charmander']
        );
        t_battle['water-grass'] = new Battle(
            t_trainer['squirtle'],
            t_pkm['squirtle'],
            t_trainer['bulbasaur'],
            t_pkm['bulbasaur']
        );

        consoleSpy = jest.spyOn(console, 'log');
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });



    // #endregion END SETUP



    describe('Pokemon class', () => {
        describe('constructor', () => {
            it('should return an object', () => {
                expect(typeof t_pkm['eevee']).toBe('object');
            });

            it('should have default move of tackle', () => {
                expect(t_pkm['eevee'].getMove()).toBe('tackle');
            });

            it('should have required methods', () => {
                expect(typeof t_pkm['eevee'].takeDamage).toBe('function');
                expect(typeof t_pkm['eevee'].useMove).toBe('function');
                expect(typeof t_pkm['eevee'].hasFainted).toBe('function');
            });
        });

        describe('takeDamage()', () => {
            it('should reduce hitPoints by given number', () => {
                expect(t_pkm['eevee'].getHitPoints()).toBe(55);
                t_pkm['eevee'].takeDamage(1);
                expect(t_pkm['eevee'].getHitPoints()).toBe(54);
                t_pkm['eevee'].takeDamage(2);
                expect(t_pkm['eevee'].getHitPoints()).toBe(52);
                t_pkm['eevee'].takeDamage(3);
                expect(t_pkm['eevee'].getHitPoints()).toBe(49);
                t_pkm['eevee'].takeDamage(100);
                expect(t_pkm['eevee'].getHitPoints()).toBe(0);
                t_pkm['eevee'].takeDamage(1);
                expect(t_pkm['eevee'].getHitPoints()).toBe(0);
            });
        });

        describe('useMove()', () => {
            it('should return attackDamage', () => {
                expect(t_pkm['eevee'].useMove()).toBe(18);
                expect(t_pkm['flareon'].useMove()).toBe(20);
            });

            it('should log "[pokemon] used [move]"', () => {
                expect(consoleSpy).not.toHaveBeenCalledWith('Eevee used tackle');
                t_pkm['eevee'].useMove()
                expect(consoleSpy).toHaveBeenCalledWith('Eevee used tackle');

                expect(consoleSpy).not.toHaveBeenCalledWith('Flareon used tackle');
                t_pkm['flareon'].useMove()
                expect(consoleSpy).toHaveBeenCalledWith('Flareon used tackle');
            });
        })

        describe('hasFainted()', () => {
            it('should return false if hitPoints greater than 0', () => {
                expect(t_pkm['eevee'].hasFainted).not.toBe(false);
                t_pkm['eevee'].takeDamage(10);
                expect(t_pkm['eevee'].hasFainted).not.toBe(false);
            });

            it('should return true if hitPoints reduced to 0', () => {
                t_pkm['eevee'].takeDamage(100);
                expect(t_pkm['eevee'].hasFainted).not.toBe(true);
            });
        })
    });

    describe('Pokemon elemental classes', () => {
        describe('constructor', () => {
            it('should be extended from Pokemon class', () => {
                expect(t_pkm['flareon']).toBeInstanceOf(FirePokemon);
                expect(t_pkm['flareon']).toBeInstanceOf(Pokemon);

                expect(t_pkm['vaporeon']).toBeInstanceOf(WaterPokemon);
                expect(t_pkm['vaporeon']).toBeInstanceOf(Pokemon);
            });

            it('should have an elemental type property', () => {
                expect(t_pkm['flareon'].getType()).toBe('fire');
                expect(t_pkm['vaporeon'].getType()).toBe('water');
                expect(t_pkm['bulbasaur'].getType()).toBe('grass');
                expect(t_pkm['eevee'].getType()).toBe('normal');
            });
        });

        describe('isEffectiveAgainst()', () => {
            it('fire type should be strong against grass type', () => {
                expect(t_pkm['flareon'].isEffectiveAgainst(t_pkm['bulbasaur'])).toBe(true);
                expect(t_pkm['flareon'].isEffectiveAgainst(t_pkm['charmander'])).toBe(false);
                expect(t_pkm['flareon'].isEffectiveAgainst(t_pkm['vaporeon'])).toBe(false);
            });

            it('grass type should be strong against water type', () => {
                expect(t_pkm['bulbasaur'].isEffectiveAgainst(t_pkm['squirtle'])).toBe(true);
                expect(t_pkm['bulbasaur'].isEffectiveAgainst(t_pkm['eevee'])).toBe(false);
                expect(t_pkm['bulbasaur'].isEffectiveAgainst(t_pkm['flareon'])).toBe(false);
            });

            it('water type should be strong against fire type', () => {
                expect(t_pkm['squirtle'].isEffectiveAgainst(t_pkm['squirtle'])).toBe(false);
                expect(t_pkm['squirtle'].isEffectiveAgainst(t_pkm['eevee'])).toBe(false);
                expect(t_pkm['squirtle'].isEffectiveAgainst(t_pkm['flareon'])).toBe(true);
            });

            it('normal type should be strong against nothing', () => {
                expect(t_pkm['eevee'].isEffectiveAgainst(t_pkm['squirtle'])).toBe(false);
                expect(t_pkm['eevee'].isEffectiveAgainst(t_pkm['eevee'])).toBe(false);
                expect(t_pkm['eevee'].isEffectiveAgainst(t_pkm['flareon'])).toBe(false);
            });
        });

        describe('isWeakTo()', () => {
            it('fire type should be weak to water type', () => {
                expect(t_pkm['flareon'].isWeakTo(t_pkm['bulbasaur'])).toBe(false);
                expect(t_pkm['flareon'].isWeakTo(t_pkm['charmander'])).toBe(false);
                expect(t_pkm['flareon'].isWeakTo(t_pkm['vaporeon'])).toBe(true);
            });

            it('grass type should be weak to fire type', () => {
                expect(t_pkm['bulbasaur'].isWeakTo(t_pkm['squirtle'])).toBe(false);
                expect(t_pkm['bulbasaur'].isWeakTo(t_pkm['eevee'])).toBe(false);
                expect(t_pkm['bulbasaur'].isWeakTo(t_pkm['flareon'])).toBe(true);
            });

            it('water type should be weak to grass type', () => {
                expect(t_pkm['squirtle'].isWeakTo(t_pkm['leafeon'])).toBe(true);
                expect(t_pkm['squirtle'].isWeakTo(t_pkm['eevee'])).toBe(false);
                expect(t_pkm['squirtle'].isWeakTo(t_pkm['flareon'])).toBe(false);
            });

            it('normal type should be weak to nothing', () => {
                expect(t_pkm['eevee'].isWeakTo(t_pkm['leafeon'])).toBe(false);
                expect(t_pkm['eevee'].isWeakTo(t_pkm['eevee'])).toBe(false);
                expect(t_pkm['eevee'].isWeakTo(t_pkm['flareon'])).toBe(false);
            });
        });
    });

    describe('Pokemon species classes', () => {
        describe('constructor', () => {
            it('should be extended from Pokemon elemental class', () => {
                expect(t_pkm['charmander']).toBeInstanceOf(Charmander);
                expect(t_pkm['charmander']).toBeInstanceOf(FirePokemon);

                expect(t_pkm['squirtle']).toBeInstanceOf(Squirtle);
                expect(t_pkm['squirtle']).toBeInstanceOf(WaterPokemon);

                expect(t_pkm['bulbasaur']).toBeInstanceOf(Bulbasaur);
                expect(t_pkm['bulbasaur']).toBeInstanceOf(GrassPokemon);

                expect(new Rattata()).toBeInstanceOf(NormalPokemon);
            });

            it('should overwrite default move', () => {
                expect(t_pkm['charmander'].getMove()).toBe('ember');
                expect(t_pkm['squirtle'].getMove()).toBe('water gun');
                expect(t_pkm['bulbasaur'].getMove()).toBe('vine whip');
            });
        });
    });

    describe('Pokeball class', () => {
        describe('constructor', () => {
            it('should return an object', () => {
                expect(typeof t_ball['empty']).toBe('object');
            });
        });

        describe('throw() - passed an argument', () => {

            // TODO purity tests? reference to pokemon or deep copy?

            it('should capture pokemon if pokeball is empty', () => {
                t_ball['empty'].throw(t_pkm['eevee']);
                expect(t_ball['empty'].getStoredPokemon()).toBe(t_pkm['eevee']);
            });

            it('should log "you caught [name]"', () => {
                expect(consoleSpy).not.toHaveBeenCalledWith('you caught Eevee');
                t_ball['empty'].throw(t_pkm['eevee']);
                expect(consoleSpy).toHaveBeenCalledWith('you caught Eevee');
            });

            it('should not capture if pokeball is not empty', () => {
                t_ball['eevee'].throw(t_pkm['bulbasaur']);
                expect(t_ball['empty'].pokemon).not.toBe(t_pkm['bulbasaur']);
            });

        });

        describe('throw() - not passed an argument', () => {
            it('should return pokemon if one stored', () => {
                console.log(t_ball['eevee'].pokemon)
                expect(t_ball['eevee'].throw()).toBe(t_pkm['eevee']);
            });

            it('should log "GO [name]!!" if pokemon stored', () => {
                expect(consoleSpy).not.toHaveBeenCalledWith('GO Eevee!!');
                t_ball['eevee'].throw();
                expect(consoleSpy).toHaveBeenCalledWith('GO Eevee!!');
            });

            it('should log "empty..." if no pokemon stored', () => {
                expect(consoleSpy).not.toHaveBeenCalledWith('empty...');
                t_ball['empty'].throw();
                expect(consoleSpy).toHaveBeenCalledWith('empty...');
            });
        });

        describe('isEmpty()', () => {
            it('should return true if no pokemon stored inside', () => {
                expect(t_ball['empty'].isEmpty()).toBe(true);
            });

            it('should return false if pokemon stored inside', () => {
                expect(t_ball['eevee'].isEmpty()).toBe(false);

                t_ball['empty'].throw(t_pkm['leafeon']);
                expect(t_ball['empty'].isEmpty()).toBe(false);
            });
        });

        describe('contains()', () => {
            it('should return pokemon name if one is stored inside', () => {
                expect(t_ball['eevee'].contains()).toBe('Eevee');

                t_ball['empty'].throw(t_pkm['leafeon']);
                expect(t_ball['empty'].contains()).toBe('Leafeon');
            });

            it('should return "empty..." if pokemon not stored inside', () => {
                expect(t_ball['empty'].contains()).toBe('empty...');
            });
        })
    });

    describe('Trainer class', () => {
        describe('constructor', () => {
            it('should return an object', () => {
                expect(typeof t_trainer['empty']).toBe('object');
            });
        })

        describe('catch()', () => {
            it('should throw() first available pokeball at the passed pokemon', () => {
                expect(t_trainer['empty'].getPokemon('Charmander')).not.toBe(t_pkm['charmander']);
                t_trainer['empty'].catch(t_pkm['charmander']);
                expect(t_trainer['empty'].getPokemon('Charmander')).toBe(t_pkm['charmander']);
            });

            it('should not allow more than 6 pokemon to be caught', () => {
                t_trainer['full'].catch(t_pkm['bulbasaur']);
                expect(consoleSpy).toHaveBeenCalledWith('no empty pokeballs...');
                expect(t_trainer['full'].getPokemon('bulbasaur')).not.toBe(t_pkm['bulbasaur']);
            });
        });

        describe('getPokemon()', () => {
            it('should throw() the pokeball containing the passed pokemon name', () => {
                expect(t_trainer['full'].getPokemon('Squirtle')).toBe(t_pkm['squirtle']);
                expect(t_trainer['full'].getPokemon('Charmander')).toBe(t_pkm['charmander']);
            });
        })
    });

    describe('Battle class', () => {
        describe('constructor', () => {
            it('should return an object', () => {
                expect(typeof t_battle['normal']).toBe('object');
            });
        });

        describe('fight()', () => {
            it('should reduce target pokemons hp', () => {
                // eevee vs eevee2

                // eevee has 55 hp
                // eevee has 18 atk
                // hp should go to 37, then 19

                expect(t_pkm['eevee2'].getHitPoints()).toBe(55);
                t_battle['normal'].fight(t_pkm['eevee']);
                expect(t_pkm['eevee2'].getHitPoints()).toBe(37);
                t_battle['normal'].fight(t_pkm['eevee']);
                expect(t_pkm['eevee2'].getHitPoints()).toBe(19);

                expect(t_pkm['eevee'].getHitPoints()).toBe(55);
                t_battle['normal'].fight(t_pkm['eevee2']);
                expect(t_pkm['eevee'].getHitPoints()).toBe(37);
                t_battle['normal'].fight(t_pkm['eevee2']);
                expect(t_pkm['eevee'].getHitPoints()).toBe(19);
            });

            it('should do x1.25 damage if element is effective', () => {
                // squirtle v charmander

                // charmander has 44 hp
                // squirtle has 16 atk --> x1.25 --> 20 atk
                // hp should go to 24, then 4

                expect(t_pkm['charmander'].getHitPoints()).toBe(44);
                t_battle['water-fire'].fight(t_pkm['squirtle']);
                expect(t_pkm['charmander'].getHitPoints()).toBe(24);
                t_battle['water-fire'].fight(t_pkm['squirtle']);
                expect(t_pkm['charmander'].getHitPoints()).toBe(4);
            });

            it('should do x0.75 damage if element is ineffective', () => {
                // squirtle v bulbasaur

                // bulbasaur has 45 hp
                // squirtle has 16 atk --> x0.75 --> 12 atk
                // hp should go to 33, then 21

                expect(t_pkm['bulbasaur'].getHitPoints()).toBe(45);
                t_battle['water-grass'].fight(t_pkm['squirtle']);
                expect(t_pkm['bulbasaur'].getHitPoints()).toBe(33);
                t_battle['water-grass'].fight(t_pkm['squirtle']);
                expect(t_pkm['bulbasaur'].getHitPoints()).toBe(21);
            });
        });
    });
});
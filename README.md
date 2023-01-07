# petnavi

petnavi is a **CLI-based RPG game** based on the *Mega Man Battle Network Series*, where you control an Internet Navigator
(or in this case, a Console Navigator) through the use of your console to defeat viruses and (possibly) save the world via turn-based fighting.

This is a summer project initially made out boredom, so while there may some horrible code in some places, this is after all a learning experience for me, so feedback is appreciated.

## Goals

1. Have a fully fleshed out battle system akin to the turn actions of most RPGs whilst conbining the ability to move similar to the MMBN or Starforce series
2. The player's navi is handled in a file containing their navi's information, affected by what happens in the game (Navi deletion is now real)
3. Learn about the Console Line Interface by making my own CLI tool, and serve as an example to others learning about making their own CLI

## Install

Run the following command (you'll need npm and [Node.js](https://nodejs.org) installed first):

```console
npm install petnavi -g
```


## That's great and all, but where is my navi?

On the console run the following command

```console
petnavi start
```

After solving the questionaire you a json file will be made with a name similar to `YourNaviDotEXE.json`, its contents should be akin to the following:

```json
{
	"name": "DefaultNavi.EXE",
	"level": 10,
	"core": "NEUTRAL",
	"maxHP": 100,
	"HP": 100,
	"maxCP": 20,
	"CP": 20,
	"CPattacks": [
		"Cannon",
		"Cannon",
		"Vulcan",
		"Vulcan",
		"Sword",
		"WideSword",
		"AirShot",
		"HP30",
		"HP30",
	],
	"willBeDeleted": false,
	"dir": ".",
	"zenny": 100,
	"chipLibrary": []
}
```

You can load your navi's info using the command:

```console
petnavi load YourNaviDotEXE.json
```

And save their info of any battles by running:

```console
petnavi save YourNavi.EXE
```

## Comands

The following descriptions are from the `help` command:

### > start

```console
petnavi start [flags]
```

Start your adventure by making your own navi.
After your navi is created, its information will be stored in a .json format.

Most commands will require you to be in the same to have this navi file loaded, so remember where you save it.

DO NOT MODIFY THIS JSON, otherwise you will be very uncool :(

`-s` or `--skip` Skips the dialog and go straight into the questions.

### > load
```console
petnavi load YourNaviDotEXE.json 
```

Load your navi into the module

Whatever file that is provided in <fileName> will be loaded and used for other commands or other activities like battling (after checking it's an actual Navi File, of course)

Most actions that happen to your navi through these commands will be applied to the loaded copy of your navi, after of which you will save your progress via the 'save' command.

### > save
Save your navi into a file

```console
petnavi save YourNavi.EXE 
```

If your navi was previously loaded into the module, it will be saved into a json file similar to the one created via the `start` command, but now with stats reflecting any changes the navi had.

Your navi's name is provided in `YourNavi.EXE` and is what is used to get access to your navi's information. Remember your navi's name includes a ".EXE" suffix aswell, so be sure to add that.

### > battle
Do a battle!

```console
petnavi battle YourNavi.EXE 
```

Prototype command for starting a battle, use one loaded navi
to battle a randomly generated battle agaisnt 3 enemies.

On your turn, you can do one of 4 actions:
- Attack with your buster ( only deal 10 `NEUTRAL` type damage )
- Use a Cyber Chip ( if you have enough CP to use it )
- Defend agaisnt incoming attacks ( and recover some of your CP )
- Escape the battle

After you decide what to do, its the enemies's turn!

Each enemy has its own patterns and guidelines for attacking you, while others will attack with no discernable pattern.

### > loaded
Show the current loaded navis.
And does so with a neat navi card :)`

```console
petnavi loaded
```
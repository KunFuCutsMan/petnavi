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
	"name": "YourNavi.EXE",
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
		"HP30"
	]
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
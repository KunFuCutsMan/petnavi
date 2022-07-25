const menus = {
  main: `
    rpg-cli [command] <options>

    -v or version ...... Show package version
    -h or help ......... Show help menu for a command
    ping ............... Replies with "Pong!"
    start .............. Start your adventure by making your own navi`,
  ping: `
    rpg-cli ping

    Replies with "Pong!"
    Not much else is going on.`,
  start: `
    rpg-cli start <args>

    Start your adventure by making your own navi.
    
    After your navi is created, its information will be
    stored in a .json format.

    Most commands will require you to be in the same
    folder as where your navi is stored in.

    DO NOT MODIFY THIS JSON, otherwise you will be very uncool :(

    FLAGS:
    -s or -skip ........ Skip the dialog and go straight into the questions`
}

module.exports = (args) => {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

  console.log(menus[subCmd] || menus.main)
}
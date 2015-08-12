GTE.UI = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Tools object.
    * @class
    */
    function Tools() {
        this.activePlayer = -1;
    }

    /**
    * Function called when New button is pressed.
    * It creates a new Tree and draws it
    */
    Tools.prototype.newTree = function() {
        this.resetPlayers();
        this.activePlayer = -1;
        var root = new GTE.TREE.Node(null);
        var child1 = new GTE.TREE.Node(root);
        var child2 = new GTE.TREE.Node(root);
        GTE.tree = new GTE.TREE.Tree(root);

        // Add a second Player
        this.addPlayer();

        GTE.tree.updatePositions();
        // Create a node and draw it
        GTE.tree.draw();
        this.switchMode(GTE.MODES.ADD);
    };

    /**
    * Function that switches mode to the one specified by the button pressed
    * @param {Button} button Button pressed that will activate mode
    */
    Tools.prototype.switchMode = function(modeToSwitch){
        // Remove active class from current active button
        var activeButton = document.getElementsByClassName("active button")[0];
        if (activeButton !== undefined) {
            activeButton.className =
                activeButton.className.replace(/\bactive\b/,'');
        }

        // Change the class of the button to active
        var buttonToSwitch = "";
        switch (modeToSwitch) {
            case GTE.MODES.ADD:
                buttonToSwitch = "button-add";
                break;
            case GTE.MODES.DELETE:
                buttonToSwitch = "button-remove";
                break;
            case GTE.MODES.PLAYERS:
                buttonToSwitch = "button-player-" + this.activePlayer;
                break;
            default:

        }
        document.getElementById(buttonToSwitch).className += " " + "active";

        GTE.MODE = modeToSwitch;
        if (GTE.MODE === GTE.MODES.PLAYERS) {
            GTE.tree.hideLeaves();
        } else {
            GTE.tree.showLeaves();
        }
    };

    /**
    * Function that selects a player
    * @param {Player} player Player to be set as active
    */
    Tools.prototype.selectPlayer = function (player) {
        // Set player as active player and mode to PLAYERS mode
        this.activePlayer = player;
        this.switchMode(GTE.MODES.PLAYERS);
    };

    /**
    * Handles player buttons onclicks
    * @param {Number|String} playerId Player to be selected
    */
    Tools.prototype.buttonPlayerHandler = function(playerId) {
        return function () {
            GTE.tools.selectPlayer(parseInt(playerId));
        };
    };

    /**
    * Function that adds a player button to the toolbar
    */
    Tools.prototype.addPlayer = function () {
        if (GTE.tree.numberOfPlayers() < GTE.CONSTANTS.MAX_PLAYERS) {
            // Create a new player
            var player = GTE.tree.newPlayer();
            if (player !== null) {
                if (player.id == GTE.CONSTANTS.MIN_PLAYERS + 1) {
                    document.getElementById("button-player-less").className =
                        document.getElementById("button-player-less").className
                                                    .replace(/\bdisabled\b/,'');
                }
                if (player.id == GTE.CONSTANTS.MAX_PLAYERS) {
                    document.getElementById("button-player-more")
                                                .className += " " + "disabled";
                }
                // Get the last player button
                var playerButtons = document.getElementById("player-buttons");
                var lastPlayer = playerButtons.lastElementChild;
                // Insert a new button after the last button
                lastPlayer.insertAdjacentHTML("afterend",
                    "<li><button style='color:"+ player.colour +
                    "' id='button-player-" + player.id +
                    "' class='button button--sacnite button--inverted button-player'" +
                    " alt='Player " + player.id +
                    "' title='Player " + player.id +
                    "' player='" + player.id +
                    "'><i class='icon-user'></i><span>" + player.id + "</span></button></li>");
                // Get the newly added button
                lastPlayer = playerButtons.lastElementChild;
                // And add a click event that will call the selectPlayer function
                lastPlayer.firstElementChild.addEventListener("click",
                                        this.buttonPlayerHandler(player.id));
            }
        }
    };

    /**
    * Function that removes last player from the Toolbar
    */
    Tools.prototype.removeLastPlayer = function () {
        if (GTE.tree.numberOfPlayers() > GTE.CONSTANTS.MIN_PLAYERS) {
            // Remove last player from the list of players
            var playerId = GTE.tree.removeLastPlayer();
            // Activate more players button again
            if (playerId == GTE.CONSTANTS.MAX_PLAYERS) {
                document.getElementById("button-player-more").className =
                    document.getElementById("button-player-more").className
                                                    .replace(/\bdisabled\b/,'');
            }
            // Remove button
            var playerButtons = document.getElementById("player-buttons");
            var lastPlayer = playerButtons.lastElementChild.lastElementChild;
            this.removePlayerButton(lastPlayer);
        }
    };

    /**
    * Returns the colour correspondent to a given index. It is used to get the
    * player colour. Player id would be the same as colourIndex
    * @param  {Number} colourIndex  Colour index in the list of colours
    * @return {Colour} colour       Colour hex code
    */
    Tools.prototype.getColour = function (colourIndex) {
        return GTE.COLOURS[Object.keys(GTE.COLOURS)[colourIndex]];
    };

    /**
    * Function that gets the active player (the player button that is selected)
    * @return {Player} activePlayer Currently selected player
    */
    Tools.prototype.getActivePlayer = function () {
        return this.activePlayer;
    };

    Tools.prototype.removePlayerButton = function (button) {
        var playerId = parseInt(button.getAttribute("player"));
        // get the <li>
        var parent = button.parentNode;
        // remove the <li> from the <ul>
        parent.parentNode.removeChild(parent);
        // If there are only two players (Chance, Player 1),
        // disable the remove button
        if (playerId === GTE.CONSTANTS.MIN_PLAYERS + 1) {
            document.getElementById("button-player-less").className += " disabled";
        }
        // If the removed player was the active one, select the previous one
        if (playerId === this.activePlayer) {
            this.selectPlayer(this.activePlayer-1);
        }
    };

    /**
    * Removes all players from the toolbar
    */
    Tools.prototype.resetPlayers = function () {
        var buttons = document.getElementsByClassName("button-player");
        while(buttons.length > 2) {
            this.removePlayerButton(buttons[buttons.length-1]);
        }
    };

    // Add class to parent module
    parentModule.Tools = Tools;

    return parentModule;
}(GTE.UI)); // Add to GTE.UI sub-module

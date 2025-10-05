game();

function game() {
    const gameScreen = document.querySelector("main");
    gameScreen.replaceChildren();
    // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
    let gameScreenWidth = gameScreen.offsetWidth - 50;
    let gameScreenHeight = gameScreen.offsetHeight - 50;

    // Pre-defined boundary
    const xBoundaries = [0, gameScreenWidth];
    const yBoundaries = [5, gameScreenHeight];

    // https://developer.mozilla.org/en-US/docs/Web/CSS/translate
    // Default x, y values - centers sprite on screen as start position
    let xPosition = gameScreenWidth / 2;
    let yPosition = gameScreenHeight / 2;


    sprite(); // Create sprite - spawns it on web page, moves it with player's control using Keyboard Event API and Mobile Touch Control
    foodSpawn(); // Spawn Foods.. (one food spawn at page load and spawns a food every 3-9 seconds)


    function sprite() {
        spriteMovementController();
        animateSprite();
        //browserResize();

        const character = document.createElement("div");
        character.classList.add("food-man");
        const sprite = document.createElement("img");

        const arraySpriteLayers = ["/assets/sprites/sprite_1.png", "/assets/sprites/sprite_2.png"];
        sprite.src = arraySpriteLayers[1];

        character.appendChild(sprite);

        gameScreen.appendChild(character);

        let interval;

        character.style.translate = `${xPosition}px ${yPosition}px`;

        const incDec = 5;

        let prevKeyPressed = "up";

        function spriteMovementController() { // Move Sprite. Listen to WASD, Arrow Key, and Mobile Touch Button Presses.
            mobileTouchControl(); // Enables Mobile Touch Control

            function mobileTouchControl() {
                const mobileTouchControlBox = document.querySelector(".mobile-touch-control");
                const touchButtons = document.querySelectorAll(".touch-button");

                mobileTouchControlBox.style.display = "block";

                for (const touchButtonEl of touchButtons) {
                    touchButtonEl.addEventListener("click", (event) => {
                        const touchButtonPressed = event.currentTarget;

                        switch (touchButtonPressed.classList[1]) {
                            case "touch-up":
                                controlSpriteMovement("UP");
                                break;
                            case "touch-right":
                                controlSpriteMovement("RIGHT");
                                break;
                            case "touch-down":
                                controlSpriteMovement("DOWN");
                                break;
                            case "touch-left":
                                controlSpriteMovement("LEFT");
                                break;
                            case "touch-stop":
                                controlSpriteMovement("STOP");
                                break;
                        }
                    });
                }
            }

            document.body.addEventListener("keydown", (keyboardEvent) => {
                // Using Keyboard Event API (Built-in Browser) => https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
                const key = keyboardEvent.key.toUpperCase();

                switch (key) {
                    case "W":
                    case "ARROWUP":
                        controlSpriteMovement("UP");
                        break;
                    case "A":
                    case "ARROWLEFT":
                        controlSpriteMovement("LEFT");
                        break;
                    case "S":
                    case "ARROWDOWN":
                        controlSpriteMovement("DOWN");
                        break;
                    case "D":
                    case "ARROWRIGHT":
                        controlSpriteMovement("RIGHT");
                        break;
                    case " ": // Space Bar, keyboardEvent API has it as " " for some reason.
                        controlSpriteMovement("STOP");
                        break;
                }
            });

            function controlSpriteMovement(direction) {
                clearInterval(interval); // Interval is cleared before calling moveSprite(), this ensures an interval runs in a direction rather than multiple simultaneously which causes glitch.
                moveSprite(direction);
            }
        }

        function animateSprite() {
            setInterval(() => { // Switches sprite layer every 150ms (.15 seconds)
                sprite.src = sprite.src.includes(arraySpriteLayers[0]) ? arraySpriteLayers[1] : arraySpriteLayers[0];
            }, 150);
        }

        function moveSprite(direction) {
            interval = setInterval(() => { // setInterval() ensures Sprite keeps moving every 100ms with a condition (direction)
                //console.log(xPosition, yPosition);

                // Resets sprite rotation
                character.style.rotate = "0deg";
                character.style.transform = "rotateY(0deg)";

                switch (direction) {
                    case "UP":
                        // check if current xPos, yPos is within pre-defined boundary
                        // One parameter is adjusted, reversely in a specified direction to prevent sprite being trapped at boundary
                        if (boundary(xPosition, yPosition - incDec)) {
                            // Increase/decrease x, y position and positions sprite accordingly using CSS
                            yPosition -= incDec;
                            character.style.translate = `${xPosition}px ${yPosition}px`;
                            character.style.rotate = "-90deg";
                        }
                        break;
                    case "LEFT":
                        if (boundary(xPosition - incDec, yPosition)) {
                            xPosition -= incDec;
                            character.style.translate = `${xPosition}px ${yPosition}px`;
                            character.style.transform = "rotateY(180deg)";
                        }
                        break;
                    case "DOWN":
                        if (boundary(xPosition, yPosition + incDec)) {
                            yPosition += incDec;
                            character.style.translate = `${xPosition}px ${yPosition}px`;
                            character.style.rotate = "90deg";
                        }
                        break;
                    case "RIGHT":
                        if (boundary(xPosition + incDec, yPosition)) {
                            xPosition += incDec;
                            character.style.translate = `${xPosition}px ${yPosition}px`;
                            character.style.rotate = "0deg";
                        }
                        break;
                    case "STOP":
                        clearInterval(interval);
                        break;
                }

                collisionDetection();
            }, 25);
        }

        function boundary(x, y) {
            // Check sprite's position against boundary, return true if sprite is still inside.  Returns false otherwise.
            if (xBoundaries[0] < x && x < xBoundaries[1] && yBoundaries[0] < y && y < yBoundaries[1]) {
                return true;
            } else {
                clearInterval(interval); // Clears interval declared globally, we don't need setInterval() within moveSprite(direction) to run anymore.
                return false;
            }
        }

        function browserResize() {
            // Ensures sprite is inside game screen, in case player resize browser during the game.
            // I caught sprite moving outside the browser window, I implemented "browserResize()" as error catch handler
            window.addEventListener("resize", (event) => {
                game();

                //character.style.translate = `${gameScreenWidth / 2}px ${gameScreenHeight / 3}px`;
            });
        }
    }

    function foodSpawn() {
        spawnGeneratedFood(); // Spawn first food

        // Spawn food at a time for every 3-0 second(s) throughout the game
        const foodSpawnInterval = setInterval(() => { spawnGeneratedFood(); }, (2000 * Math.ceil(Math.random() * 3)));

        function spawnGeneratedFood() {
            const foodPosition = [Math.floor(Math.random() * gameScreenWidth), Math.floor(Math.random() * gameScreenHeight - 25)];
            const food = document.createElement("div");
            food.classList.add("food");

            const foodImg = document.createElement("img");
            foodImg.src = `/assets/sprites/food/food${Math.ceil(Math.random() * 7)}.png`;

            food.appendChild(foodImg);

            food.style.translate = `${foodPosition[0]}px ${foodPosition[1]}px`;

            /* Food Position Display for Troubleshooting */
            /*
            const pos = document.createElement("p");
            pos.textContent = `(x: ${foodPosition[0]}, y: ${foodPosition[1]})`;
            food.appendChild(pos)
            */

            gameScreen.appendChild(food);
        }
    }

    function collisionDetection() {
        // https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Collision_detection
        /*
            The x position of the food-man is greater than the x position of the food.
            The x position of the food-man is less than the x position of the food plus its width.
            The y position of the food-man is greater than the y position of the food.
            The y position of the food-man is less than the y position of the food plus its height.
        */
        const foods = document.querySelectorAll(".food");

        for (const food of foods) {
            /* Access translate value from CSS style rules that was used to repaints on web page 
               Every food element and extracts it as [x, y] positions
            */
            const xPositionFood = food.style.translate.replaceAll("px", "").split(" ").map((x) => parseInt(x))[0];
            const yPositionFood = food.style.translate.replaceAll("px", "").split(" ").map((x) => parseInt(x))[1];
            //console.log("Food-Man Position: ", xPosition, yPosition)

            if (xPosition > xPositionFood - 25 && xPosition < (xPositionFood + 66) && yPosition > yPositionFood - 10 && yPosition < (yPositionFood + 75)) {
                /*
                console.log("Food-Man Position: ", xPosition, yPosition)
                console.log("Food Position", xPositionFood, yPositionFood);
                console.log("collison detected");
                */

                // Specific food was detected by collision with food man
                // DOM API allows us to remove an element (specific food collided with food man) using DOMElement.remove()
                food.remove();
            }
        }

    }
}
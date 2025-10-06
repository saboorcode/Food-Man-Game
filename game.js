game(); // Start game | Hungry Food Man Game

function game() {
    const gameScreen = document.querySelector("main");
    gameScreen.replaceChildren();
    // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
    let gameScreenWidth = gameScreen.offsetWidth - 50;
    let gameScreenHeight = gameScreen.offsetHeight - 50;

    // Pre-defined boundary
    const xBoundaries = [5, gameScreenWidth];
    const yBoundaries = [5, gameScreenHeight];

    // https://developer.mozilla.org/en-US/docs/Web/CSS/translate
    // Default x, y values - centers sprite on screen as start position
    let xPosition = gameScreenWidth / 2;
    let yPosition = gameScreenHeight / 2;

    const incDec = 5; // Increase/decrease speed in a direction | sprite movement

    let foodsEatenCount = -1;
    let gameClock = 0;

    /* Hoisted Function Calls */
    sprite(); // Create Food Man sprite - spawns it on web page, moves it with player's control using Keyboard Event API and Mobile Touch Control
    foodSpawn(); // Spawn Foods.. (one food spawn at page load and spawns a food every 3-9 seconds)
    scoreBoard();
    grandmaSprite();
    setInterval(() => {
        collisionDetection();
    }, 25);

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
            setInterval(() => { // Switches sprite layer every 150ms (.15 seconds) | 1000ms = 1 second
                sprite.src = sprite.src.includes(arraySpriteLayers[0]) ? arraySpriteLayers[1] : arraySpriteLayers[0];
            }, 150);
        }

        const pos1 = document.createElement("ul");
        pos1.innerHTML = `<li>x: ${xPosition}px</li> <li> y: ${yPosition}px</li>`;
        pos1.style.margin = "0";
        pos1.style.translate = `${xPosition-685}px ${yPosition+50}px`;
        pos1.style.fontSize = "16px";
        gameScreen.appendChild(pos1);

        function moveSprite(direction) {
            interval = setInterval(() => { // setInterval() ensures Sprite keeps moving every 100ms with a condition (direction)
                //console.log(xPosition, yPosition);

                // Resets sprite rotation
                character.style.rotate = "0deg";
                character.style.transform = "rotateY(0deg)";

                pos1.innerHTML = `<li>x: ${xPosition}px</li> <li> y: ${yPosition}px</li>`;
                pos1.style.translate = `${xPosition-685}px ${yPosition+50}px`;

                switch (direction) {
                    case "UP":
                        // check if current xPos, yPos is within pre-defined boundary
                        // One parameter is adjusted, reversely in a specified direction to prevent foodman being trapped at boundary
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

        // Spawn food every 2-6 second(s) throughout the game
        const foodSpawnInterval = setInterval(() => { spawnGeneratedFood(); }, (2000 * Math.ceil(Math.random() * 3)));

        function spawnGeneratedFood() {
            const foodPosition = [Math.floor(Math.random() * gameScreenWidth), Math.floor(Math.random() * gameScreenHeight)];
            const food = document.createElement("div");
            food.classList.add("food", "collision-object");

            const foodImg = document.createElement("img");
            foodImg.src = `/assets/sprites/food/food${Math.ceil(Math.random() * 7)}.png`;

            food.appendChild(foodImg);

            food.style.translate = `${foodPosition[0]}px ${foodPosition[1]}px`;

            /* Position Display for Troubleshooting */
            const pos = document.createElement("p");
            pos.textContent = `(x: ${foodPosition[0]}, y: ${foodPosition[1]})`;
            pos.style.margin = "0";
            foodImg.style.border = "2px solid white";
            food.appendChild(pos)
            /* Position Display for Troubleshooting */

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
        const collisionObjects = document.querySelectorAll(".collision-object");

        for (const collisionObject of collisionObjects) {
            /* Access translate value from CSS style rules that was used to repaints on web page 
               Every food element and extracts it as [x, y] positions
            */
            const xPositionObjectCollided = collisionObject.style.translate.replaceAll("px", "").split(" ").map((x) => parseInt(x))[0];
            const yPositionObjectCollided = collisionObject.style.translate.replaceAll("px", "").split(" ").map((x) => parseInt(x))[1];
            //console.log("Food-Man Position: ", xPosition, yPosition)

            // Detect and remove food collided with food man using collision detection algorithm
            if (xPosition > xPositionObjectCollided - 30 && xPosition < (xPositionObjectCollided + 55) && yPosition > yPositionObjectCollided - 43 && yPosition < (yPositionObjectCollided + 36)) {
                /*
                console.log("Food-Man Position: ", xPosition, yPosition)
                console.log("Food Position", xPositionObjectCollided, yPositionObjectCollided);
                console.log("collison detected");
                */

                // Specific food or GRANDMA was detected by collision with food man
                // DOM API allows us to remove an element (specific food collided with food man) using DOMElement.remove()
                console.log(collisionObject.classList.value.includes("grandma"))

                if (collisionObject.classList.value.includes("grandma")) { // Grandma caught up to Food Man
                    collisionObject.remove();
                    const result = scoreBoard();

                    alert(`Grandma catched you! Game Over!\nTime Played: ${result[0]} seconds\nFoods Eaten: ${result[1]}`);
                } else { // Remove specific food that collided with Food Man
                    collisionObject.remove();
                    foodsEatenCounter();
                }
            }
        }

    }

    function scoreBoard() { /* Score Board Generator */
        const scoreBoard = document.createElement("div");
        scoreBoard.classList.add("score-board");
        const totalScore = document.createElement("p");
        totalScore.classList.add("total-score");

        const timer = document.createElement("p");
        timer.classList.add("timer");
        timer.textContent = `Time played: ${gameClock}s`;

        scoreBoard.appendChild(timer);
        scoreBoard.appendChild(totalScore);
        gameScreen.appendChild(scoreBoard);

        setInterval(() => {
            gameClock += 1;

            timer.textContent = `Time played: ${gameClock}s`;
        }, 1000);

        foodsEatenCounter(); // Initial score of 0.

        return [gameClock, foodsEatenCount];
    }

    function foodsEatenCounter() { // Increase "Foods Eaten" Score by 1 on the Score Board
        // I wish I could place this and call this function inside scoreBoard() but it wouldn't be accessible outside (like inside collisionDetection()) due to scope
        foodsEatenCount += 1;

        document.querySelector(".total-score").textContent = `Foods Eaten: ${foodsEatenCount}`;
    }

    function grandmaSprite() {
        const grandmaSpriteLayers = {
            sleepOne: "/assets/sprites/grandma/grandma_1.png",
            sleepTwo: "/assets/sprites/grandma/grandma_2.png",
            awake: "/assets/sprites/grandma/grandma_3.png",
            chasing: "/assets/sprites/grandma/grandma_4.png",
            angry: "/assets/sprites/grandma/grandma_5.png"
        }

        const grandma = document.createElement("div");
        grandma.classList.add("grandma", "collision-object");
        const grandmaImg = document.createElement("img");
        grandmaImg.src = grandmaSpriteLayers.sleepOne;
        grandma.style.translate = "15px 15px";

        grandma.appendChild(grandmaImg);

        gameScreen.appendChild(grandma);

        const pos = document.createElement("ul");
        pos.innerHTML = `<li>x: ${15}px</li> <li> y: ${15}px</li>`;
        pos.style.margin = "0";
        grandma.appendChild(pos);

        const sleepingGrandmaInterval = setInterval(() => { // Animate Sleeping GrandMa at Page load for 3 seconds
            if (grandmaImg.src.includes(grandmaSpriteLayers.sleepOne)) {
                grandmaImg.src = grandmaSpriteLayers.sleepTwo;
            } else {
                grandmaImg.src = grandmaSpriteLayers.sleepOne;
            }

            if (foodsEatenCount >= 1) {
                clearInterval(sleepingGrandmaInterval);
                grandmaImg.src = grandmaSpriteLayers.awake;

                setTimeout(() => {
                    grandmaChase();
                }, 2000);
            }
        }, 300);

        function grandmaChase() {
            console.log("Grandma is now chasing");
            grandmaImg.src = grandmaSpriteLayers.chasing;

            let grandmaXPosition = grandma.style.translate.replaceAll("px", "").split(" ").map((x) => parseInt(x))[0];
            let grandmaYPosition = grandma.style.translate.replaceAll("px", "").split(" ").map((x) => parseInt(x))[1];
            let grandmaSpeed = incDec * .3; // Half of food man's speed because she's a grandma right?

            setInterval(() => {
                // Recalculate food man's position and have grandma chase accordingly
                //if (grandmaXPosition !== xPosition) {
                if (grandmaXPosition < xPosition) {
                    grandmaXPosition += grandmaSpeed;
                }

                if (grandmaXPosition > xPosition) {
                    grandmaXPosition -= grandmaSpeed;
                }
                //} else if (grandmaYPosition !== yPosition) {
                if (grandmaYPosition < yPosition) {
                    grandmaYPosition += grandmaSpeed;
                }

                if (grandmaYPosition > yPosition) {
                    grandmaYPosition -= grandmaSpeed;
                }
                //}


                pos.innerHTML = `<li>x: ${Math.ceil(grandmaXPosition)}px</li> <li> y: ${Math.ceil(grandmaYPosition)}px</li>`;

                grandma.style.translate = `${grandmaXPosition}px ${grandmaYPosition}px`;
            }, 25);

            setInterval(() => {
                if (grandmaImg.src.includes(grandmaSpriteLayers.chasing)) {
                    grandmaImg.src = grandmaSpriteLayers.angry;
                    grandmaSpeed = incDec * .6;
                } else {
                    grandmaImg.src = grandmaSpriteLayers.chasing;
                    grandmaSpeed = incDec * .3;
                }
            }, 5000);
        }
    }
}
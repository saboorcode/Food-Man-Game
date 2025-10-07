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

    const speed = 3; // Speed increase/decrease in a direction | Sprite movement speed

    let foodsEatenCount = -1;
    let gameClock = 0;

    let direction;

    let foodManSpriteAnimationReq;

    /* Hoisted Function Calls */
    sprite(); // Create Food Man sprite - spawns it on web page, moves it with player's control using Keyboard Event API and Mobile Touch Control
    foodSpawn(); // Spawn Foods.. (one food spawn at page load and spawns a food every 3-9 seconds)
    scoreBoard();
    grandmaSprite();
    requestAnimationFrame(collisionDetection);

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

        // Move Sprite. Listen to WASD, Arrow Key, and Mobile Touch Button Presses.
        function spriteMovementController() {
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
                        direction = "UP";
                        foodManSpriteAnimationReq = requestAnimationFrame(moveSprite);
                        break;
                    case "A":
                    case "ARROWLEFT":
                        direction = "LEFT";
                        foodManSpriteAnimationReq = requestAnimationFrame(moveSprite);
                        break;
                    case "S":
                    case "ARROWDOWN":
                        direction = "DOWN";
                        foodManSpriteAnimationReq = requestAnimationFrame(moveSprite);
                        break;
                    case "D":
                    case "ARROWRIGHT":
                        direction = "RIGHT";
                        foodManSpriteAnimationReq = requestAnimationFrame(moveSprite);
                        break;
                    case " ": // Space Bar, keyboardEvent API has it as " " for some reason.
                        direction = "STOP";
                        foodManSpriteAnimationReq = requestAnimationFrame(moveSprite);
                        break;
                }
            });
        }

        function animateSprite() {
            setInterval(() => { // Switches sprite layer every 150ms (.15 seconds) | 1000ms = 1 second
                sprite.src = sprite.src.includes(arraySpriteLayers[0]) ? arraySpriteLayers[1] : arraySpriteLayers[0];
            }, 150);
        }

        function moveSprite() {
            //interval = setInterval(() => { // setInterval() ensures Sprite keeps moving every 100ms with a condition (direction)
            // Resets sprite rotation
            character.style.rotate = "0deg";
            character.style.transform = "rotateY(0deg)";

            switch (direction) {
                case "UP":
                    // check if current xPos, yPos is within pre-defined boundary
                    // One parameter is adjusted, reversely in a specified direction to prevent foodman being trapped at boundary
                    if (boundary(xPosition, yPosition - speed)) {
                        // Increase/decrease x, y position and positions sprite accordingly using CSS
                        yPosition -= speed;
                        character.style.translate = `${xPosition}px ${yPosition}px`;
                        character.style.rotate = "-90deg";
                    }
                    break;
                case "LEFT":
                    if (boundary(xPosition - speed, yPosition)) {
                        xPosition -= speed;
                        character.style.translate = `${xPosition}px ${yPosition}px`;
                        character.style.transform = "rotateY(180deg)";
                    }
                    break;
                case "DOWN":
                    if (boundary(xPosition, yPosition + speed)) {
                        yPosition += speed;
                        character.style.translate = `${xPosition}px ${yPosition}px`;
                        character.style.rotate = "90deg";
                    }
                    break;
                case "RIGHT":
                    if (boundary(xPosition + speed, yPosition)) {
                        xPosition += speed;
                        character.style.translate = `${xPosition}px ${yPosition}px`;
                        character.style.rotate = "0deg";
                    }
                    break;
                case "STOP":
                    clearInterval(interval);
                    break;
            }

            //collisionDetection();

            cancelAnimationFrame(foodManSpriteAnimationReq);
            requestAnimationFrame(moveSprite);
            //}, 25);
        }

        function boundary(x, y) {
            // Check sprite's position against boundary, return true if sprite is still inside.  Returns false otherwise.
            if (xBoundaries[0] < x && x < xBoundaries[1] && yBoundaries[0] < y && y < yBoundaries[1]) {
                return true;
            } else {
                return false;
            }
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

            // Detect and remove food collided with food man using collision detection algorithm
            if (xPosition > xPositionObjectCollided - 30 && xPosition < (xPositionObjectCollided + 55) && yPosition > yPositionObjectCollided - 43 && yPosition < (yPositionObjectCollided + 36)) {
                // Specific food or GRANDMA was detected by collision with food man
                // DOM API allows us to remove an element (specific food collided with food man) using DOMElement.remove()
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

        requestAnimationFrame(collisionDetection);
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
        grandma.classList.add("grandma");
        const grandmaImg = document.createElement("img");
        grandmaImg.src = grandmaSpriteLayers.sleepOne;
        grandma.style.translate = "15px 15px";

        grandma.appendChild(grandmaImg);

        gameScreen.appendChild(grandma);

        const sleepingGrandmaInterval = setInterval(() => { // Animate Sleeping GrandMa at Page load for 3 seconds
            if (grandmaImg.src.includes(grandmaSpriteLayers.sleepOne)) {
                grandmaImg.src = grandmaSpriteLayers.sleepTwo;
            } else {
                grandmaImg.src = grandmaSpriteLayers.sleepOne;
            }

            if (foodsEatenCount >= 1) {
                clearInterval(sleepingGrandmaInterval);
                grandmaImg.src = grandmaSpriteLayers.awake;
                grandma.classList.add("collision-object");

                setTimeout(() => {
                    grandmaChase();
                }, 2000);
            }
        }, 300);

        function grandmaChase() {
            grandmaImg.src = grandmaSpriteLayers.chasing;

            let grandmaXPosition = grandma.style.translate.replaceAll("px", "").split(" ").map((x) => parseInt(x))[0];
            let grandmaYPosition = grandma.style.translate.replaceAll("px", "").split(" ").map((x) => parseInt(x))[1];
            let grandmaSpeed = speed * .3; // Half of food man's speed because she's a grandma right?

            function grandmaChaseAnimation() {
                // Recalculate food man's position and have grandma chase accordingly
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

                grandma.style.translate = `${grandmaXPosition}px ${grandmaYPosition}px`;

                requestAnimationFrame(grandmaChaseAnimation);
            }

            requestAnimationFrame(grandmaChaseAnimation);

            setInterval(() => {
                if (grandmaImg.src.includes(grandmaSpriteLayers.chasing)) {
                    grandmaImg.src = grandmaSpriteLayers.angry;
                    grandmaSpeed = speed * .6;
                } else {
                    grandmaImg.src = grandmaSpriteLayers.chasing;
                    grandmaSpeed = speed * .3;
                }
            }, 5000);
        }
    }
}
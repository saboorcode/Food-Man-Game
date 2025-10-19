game(); // Start game | Hungry Food Man Game

function game() {
    const gameScreen = document.querySelector("main");
    gameScreen.replaceChildren(); // Clears out everything on game screen

    // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
    // Determine the dimensions of Game Screen prior to gameplay. I use this to calculate spawn positions of Food-Man, Grandma and Foods.
    let gameScreenWidth = gameScreen.offsetWidth - 50;
    let gameScreenHeight = gameScreen.offsetHeight - 50;

    // https://developer.mozilla.org/en-US/docs/Web/CSS/translate
    // Default x, y values - centers sprite on screen as start position
    let playerPositionX = gameScreenWidth / 2;
    let playerPositionY = gameScreenHeight / 2;

    const playerSpeed = 3; // Sprite movement speed

    let foodEatenCount = -1;
    let gameTimer = 0;

    let playerDirection; // Direction status: "UP", "RIGHT", etc or "STOP"

    let foodSpawnCount = 0;

    let starvationBarIncrementerInterval;

    /* Hoisted Function Calls */
    playerSprite(); // Create Food Man sprite - spawns it on web page, moves it with player's control using Keyboard Event API and Mobile Touch Control
    foodSpawner(); // Spawn Foods.. (one food spawn at page load and spawns a food every 3-9 seconds)
    scoreBoard();
    grandmaSprite();
    requestAnimationFrame(collisionDetection); // Collision-detection, continous check with collision objects (foods or grandma) per animation frame.
    resizeOutOfBounds(); // Check if game objects are out of bounds at page loads

    addEventListener("resize", (event) => { // Check if game objects are moved to out of bounds when user resizes
        gameScreenWidth = gameScreen.offsetWidth - 50;
        gameScreenHeight = gameScreen.offsetHeight - 50;

        resizeOutOfBounds();
    });

    function playerSprite() {
        playerController();
        animateSprite();
        requestAnimationFrame(moveSprite);

        const character = document.createElement("div");
        character.classList.add("food-man");
        const sprite = document.createElement("img");

        const arraySpriteLayers = ["/assets/sprites/sprite_1.png", "/assets/sprites/sprite_2.png"];
        sprite.src = arraySpriteLayers[1];

        character.appendChild(sprite);

        gameScreen.appendChild(character);


        character.style.translate = `${playerPositionX}px ${playerPositionY}px`;


        // Move Sprite. Listen to WASD, Arrow Key, and Mobile Touch Button Presses.
        function playerController() {
            mobileTouchControl(); // Enables Mobile Touch Control

            function mobileTouchControl() {
                const mobileTouchControlBox = document.querySelector(".mobile-touch-control");
                const touchButtons = document.querySelectorAll(".touch-button");

                mobileTouchControlBox.style.display = "block";

                // Mouse left clicks, Mobile Touches Listening
                for (const touchButtonEl of touchButtons) {
                    touchButtonEl.addEventListener("click", (event) => {
                        const touchButtonPressed = event.currentTarget;

                        switch (touchButtonPressed.classList[1]) {
                            case "touch-up":
                                playerDirection = "UP";
                                break;
                            case "touch-right":
                                playerDirection = "RIGHT";
                                break;
                            case "touch-down":
                                playerDirection = "DOWN";
                                break;
                            case "touch-left":
                                playerDirection = "LEFT";
                                break;
                            case "touch-stop":
                                playerDirection = "STOP";
                                break;
                        }
                    });
                }
            }

            // Key Presses Listening | WASD and Arrows
            document.body.addEventListener("keydown", (keyboardEvent) => {
                // Using Keyboard Event API (Built-in Browser) => https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
                const key = keyboardEvent.key.toUpperCase();

                switch (key) {
                    case "W":
                    case "ARROWUP":
                        playerDirection = "UP";
                        break;
                    case "A":
                    case "ARROWLEFT":
                        playerDirection = "LEFT";
                        break;
                    case "S":
                    case "ARROWDOWN":
                        playerDirection = "DOWN";
                        break;
                    case "D":
                    case "ARROWRIGHT":
                        playerDirection = "RIGHT";
                        break;
                    case " ": // Space starvationBar, keyboardEvent API has it as " " for some reason.
                        playerDirection = "STOP";
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
            // Resets player sprite rotation
            character.style.rotate = "0deg";
            character.style.transform = "rotateY(0deg)";

            switch (playerDirection) {
                case "UP":
                    // check if current xPos, yPos is within pre-defined boundary
                    // One parameter is adjusted, reversely in a specified playerDirection to prevent foodman being trapped at boundary
                    if (boundary(playerPositionX, playerPositionY - playerSpeed)) {
                        // Increase/decrease x, y position and positions sprite accordingly using CSS
                        playerPositionY -= playerSpeed;
                        character.style.translate = `${playerPositionX}px ${playerPositionY}px`;
                        character.style.rotate = "-90deg";
                    }
                    break;
                case "LEFT":
                    if (boundary(playerPositionX - playerSpeed, playerPositionY)) {
                        playerPositionX -= playerSpeed;
                        character.style.translate = `${playerPositionX}px ${playerPositionY}px`;
                        character.style.transform = "rotateY(180deg)";
                    }
                    break;
                case "DOWN":
                    if (boundary(playerPositionX, playerPositionY + playerSpeed)) {
                        playerPositionY += playerSpeed;
                        character.style.translate = `${playerPositionX}px ${playerPositionY}px`;
                        character.style.rotate = "90deg";
                    }
                    break;
                case "RIGHT":
                    if (boundary(playerPositionX + playerSpeed, playerPositionY)) {
                        playerPositionX += playerSpeed;
                        character.style.translate = `${playerPositionX}px ${playerPositionY}px`;
                        character.style.rotate = "0deg";
                    }
                    break;
                case "STOP":
                    // do nothing
                    break;
            }

            requestAnimationFrame(moveSprite);
        }

        function boundary(x, y) {
            // Check sprite's position against boundary, return true if sprite is still inside.  Returns false otherwise.
            if (5 < x && x < gameScreenWidth && 5 < y && y < gameScreenHeight) {
                return true;
            } else {
                return false;
            }
        }

    }

    function foodSpawner() {
        spawnGeneratedFood(); // Spawn first food

        // Spawn food every 2-6 second(s) throughout the game
        const foodSpawnInterval = setInterval(() => {
            if (foodSpawnCount < 11) { // Foods spawn is capped at 10 to prevent infinite spawning, I had 50+ at some point.
                spawnGeneratedFood();
            }
        }, (2000 * Math.ceil(Math.random() * 3)));

        function spawnGeneratedFood() {
            const foodPosition = [Math.floor(Math.random() * gameScreenWidth), Math.floor(Math.random() * gameScreenHeight)];
            const food = document.createElement("div");
            food.classList.add("food", "collision-object");

            const foodImg = document.createElement("img");
            foodImg.src = `/assets/sprites/food/food${Math.ceil(Math.random() * 7)}.png`;

            food.appendChild(foodImg);

            food.style.translate = `${foodPosition[0]}px ${foodPosition[1]}px`;
            gameScreen.appendChild(food);

            foodSpawnCount += 1;
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
            const userPositionX = playerPositionX + 20; // Readjusted x position of food man so it's equal to x position of object items like foods.
            const userPositionY = playerPositionY + 35;
            const collisionObjectXPosition = collisionObject.style.translate.replaceAll("px", "").split(" ").map((x) => parseInt(x))[0];
            const collisionObjectYPosition = collisionObject.style.translate.replaceAll("px", "").split(" ").map((x) => parseInt(x))[1];

            if (collisionObject.classList.value.includes("grandma")) { // Grandma caught up to Food Man
                if (userPositionX > (collisionObjectXPosition - 16) && userPositionX < (collisionObjectXPosition + 57) && userPositionY > collisionObjectYPosition && userPositionY < (collisionObjectYPosition + 72)) {
                    // Specific food collided with food man
                    // DOM API allows us to remove an element (specific food collided with food man) using DOMElement.remove()

                    collisionObject.remove();
                    endGame("grandma");
                }
            } else if (collisionObject.classList.value.includes("food")) { // Remove specific food that collided with Food Man
                // Detect and remove food collided with food man using collision detection algorithm
                if (userPositionX + 15 > collisionObjectXPosition && userPositionX + 15 < collisionObjectXPosition + 67 && userPositionY > collisionObjectYPosition && userPositionY < collisionObjectYPosition + 68) {
                    // Specific food collided with food man
                    // DOM API allows us to remove an element (specific food collided with food man) using DOMElement.remove()
                    collisionObject.remove();
                    foodCountIncrementerAndStarvationBar();
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

        const starvationBarDiv = document.createElement("div");
        starvationBarDiv.classList.add("starvation-bar-div");
        const starvationP = document.createElement("p");
        starvationP.textContent = "Starvation: ";

        const starvationBar = document.createElement("div");
        starvationBar.classList.add("starvation-bar");
        starvationBar.style.width = "100%";

        starvationBarDiv.appendChild(starvationP);
        starvationBarDiv.appendChild(starvationBar);

        const timer = document.createElement("p");
        timer.classList.add("timer");
        timer.textContent = `Time played: ${gameTimer}s`;

        //scoreBoard.appendChild(timer);
        scoreBoard.appendChild(starvationBarDiv);
        scoreBoard.appendChild(totalScore);
        gameScreen.appendChild(scoreBoard);

        setInterval(() => {
            gameTimer += 1;

            timer.textContent = `Time played: ${gameTimer}s`;
        }, 1000);

        foodCountIncrementerAndStarvationBar();

        return [gameTimer, foodEatenCount - 1];
    }

    function foodCountIncrementerAndStarvationBar() {
        clearInterval(starvationBarIncrementerInterval);

        foodEatenCount += 1;
        foodSpawnCount -= 1;

        document.querySelector(".total-score").textContent = `Foods Eaten: ${foodEatenCount}`;

        const starvationBar = document.querySelector(".starvation-bar");

        starvationBarIncrementerInterval = setInterval(() => {
            if (parseInt(starvationBar.style.width) - 3 <= 0) {
                starvationBar.style.width = `0%`;
                endGame("starvation");
            } else {
                starvationBar.style.width = `${parseInt(starvationBar.style.width) - 3}%`;
            }
        }, 1000);

        if (parseInt(starvationBar.style.width) + 10 >= 100) {
            starvationBar.style.width = `100%`;
        } else {
            starvationBar.style.width = `${parseInt(starvationBar.style.width) + 10}%`;
        }
    }

    function grandmaSprite() {
        const grandmaSpriteLayers = {
            sleepOne: "/assets/sprites/grandma/sleep-one.png",
            sleepTwo: "/assets/sprites/grandma/sleep-two.png",
            awake: "/assets/sprites/grandma/awake.png",
            chasing: "/assets/sprites/grandma/chasing.png",
            angry: "/assets/sprites/grandma/angry.png"
        }

        const grandma = document.createElement("div");
        grandma.classList.add("grandma");
        const grandmaImg = document.createElement("img");
        grandmaImg.src = grandmaSpriteLayers.sleepOne;
        grandma.style.translate = "15px 15px";

        grandma.appendChild(grandmaImg);

        gameScreen.appendChild(grandma);

        const sleepingGrandmaInterval = setInterval(() => { // Animate Sleeping GrandMa at Page load
            if (grandmaImg.src.includes(grandmaSpriteLayers.sleepOne)) {
                grandmaImg.src = grandmaSpriteLayers.sleepTwo;
            } else {
                grandmaImg.src = grandmaSpriteLayers.sleepOne;
            }

            if (foodEatenCount >= 1) {
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

            let grandmaplayerPositionX = grandma.style.translate.replaceAll("px", "").split(" ").map((x) => parseInt(x))[0];
            let grandmaplayerPositionY = grandma.style.translate.replaceAll("px", "").split(" ").map((x) => parseInt(x))[1];
            let grandmaplayerSpeed = playerSpeed * .3; // Half of food man's playerSpeed because she's a grandma right?

            function grandmaChaseAnimation() {
                // Recalculate food man's position and have grandma chase accordingly
                if (grandmaplayerPositionX < playerPositionX) {
                    grandmaplayerPositionX += grandmaplayerSpeed;
                }

                if (grandmaplayerPositionX > playerPositionX) {
                    grandmaplayerPositionX -= grandmaplayerSpeed;
                }
                if (grandmaplayerPositionY < playerPositionY) {
                    grandmaplayerPositionY += grandmaplayerSpeed;
                }

                if (grandmaplayerPositionY > playerPositionY) {
                    grandmaplayerPositionY -= grandmaplayerSpeed;
                }

                grandma.style.translate = `${grandmaplayerPositionX}px ${grandmaplayerPositionY}px`;

                requestAnimationFrame(grandmaChaseAnimation);
            }

            requestAnimationFrame(grandmaChaseAnimation);

            setInterval(() => {
                if (grandmaImg.src.includes(grandmaSpriteLayers.chasing)) {
                    grandmaImg.src = grandmaSpriteLayers.angry;
                    grandmaplayerSpeed = playerSpeed * .6;
                } else {
                    grandmaImg.src = grandmaSpriteLayers.chasing;
                    grandmaplayerSpeed = playerSpeed * .3;
                }
            }, 5000);
        }
    }

    function resizeOutOfBounds() {
        const foods = document.querySelectorAll(".food");
        const foodMan = document.querySelector(".food-man");

        for (const food of foods) {
            // food is an element, we can manipulate its position using DOM API
            const foodPosition = food.style.translate.split(" ").map((pos) => parseInt(pos));

            if (foodPosition[0] >= gameScreenWidth) {
                food.style.translate = `${gameScreenWidth}px ${foodPosition[1]}px`;
            }

            if (foodPosition[1] >= gameScreenHeight) {
                food.style.translate = `${foodPosition[0]}px ${gameScreenHeight}px`;
            }

            if (foodPosition[1] <= 10) {
                food.style.translate = `${foodPosition[0]}px ${10}px`;
            }

        }

        if (playerPositionX >= gameScreenWidth) {
            playerDirection = "STOP";
            playerPositionX = gameScreenWidth;
            foodMan.style.translate = `${playerPositionX}px ${playerPositionY}px`;
        }

        if (playerPositionY >= gameScreenHeight) {
            playerDirection = "STOP";
            playerPositionY = gameScreenHeight;
            foodMan.style.translate = `${playerPositionX}px ${playerPositionY}px`;
        }

        if (playerPositionY <= 10) {
            playerDirection = "STOP";
            playerPositionY = 10;
            foodMan.style.translate = `${playerPositionX}px ${10}px`;
        }
    }

    function endGame(status) {
        if (status === "grandma") {
            const result = scoreBoard();
            alert(`Grandma catched you! Game Over!\nTime Played: ${result[0]} seconds\nFoods Eaten: ${result[1]}`);

            window.location.reload(); // Game Restart
        }

        if (status === "starvation") {
            const result = scoreBoard();
            alert(`Food-Man Starved... Game Over!\nTime Played: ${result[0]} seconds\nFoods Eaten: ${result[1]}`);

            window.location.reload(); // Game Restart
        }
    }
}
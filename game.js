game();

function game() {
    const gameScreen = document.querySelector("main");
    // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
    let gameScreenWidth = gameScreen.offsetWidth - 50;
    let gameScreenHeight = gameScreen.offsetHeight - 50;

    // Pre-defined boundary
    const xBoundaries = [0, gameScreenWidth];
    const yBoundaries = [5, gameScreenHeight];

    sprite(); // Create sprite - spawns it on web page, moves it with player's control using Keyboard Event API
    foodSpawn(); // Spawn Foods..

    function sprite() {
        spriteMovementController();
        animateSprite();
        browserResize();
        /* functions to be called within */
        /*
            moveSprite(direction);
            boundary(x, y);
            pauseSprite();
        */

        const character = document.getElementById("food-man");
        const sprite = document.createElement("img");

        const arraySpriteLayers = ["/assets/sprites/sprite_1.png", "/assets/sprites/sprite_2.png"];
        sprite.src = arraySpriteLayers[1];

        character.appendChild(sprite);

        let interval;

        // https://developer.mozilla.org/en-US/docs/Web/CSS/translate
        // Default x, y values - centers sprite on screen as start position
        let xPosition = gameScreenWidth / 2;
        let yPosition = gameScreenHeight / 3;

        console.log(gameScreenWidth, gameScreenHeight)

        character.style.translate = `${xPosition}px ${yPosition}px`;

        const incDec = 5;

        let prevKeyPressed = "up";

        function spriteMovementController() { // Listen to WASD and Arrow key presses
            document.body.addEventListener("keydown", (keyboardEvent) => {
                // Using Keyboard Event API (Built-in Browser) => https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
                const key = keyboardEvent.key.toUpperCase();

                // Resets sprite rotation
                character.style.rotate = "0deg";
                character.style.transform = "rotateY(0deg)";

                switch (key) {
                    case "W":
                    case "ARROWUP":
                        // Interval is cleared before calling moveSprite(), this ensures an interval runs in a direction rather than multiple simultaneously.
                        clearInterval(interval);
                        moveSprite("up"); // Move sprite in a direction "up, left, down, right"
                        break;
                    case "A":
                    case "ARROWLEFT":
                        clearInterval(interval);
                        moveSprite("left");
                        break;
                    case "S":
                    case "ARROWDOWN":
                        clearInterval(interval);
                        moveSprite("down");
                        break;
                    case "D":
                    case "ARROWRIGHT":
                        clearInterval(interval);
                        moveSprite("right");
                        break;
                    case " ": // Space Bar, keyboardEvent API has it as " " for some reason.
                        pauseSprite();
                        break;
                }
            })
        }

        function animateSprite() {
            setInterval(() => { // Switches sprite layer every 150ms (.15 seconds)
                sprite.src = sprite.src.includes(arraySpriteLayers[0]) ? arraySpriteLayers[1] : arraySpriteLayers[0];
            }, 150);
        }

        function moveSprite(direction) {
            interval = setInterval(() => { // setInterval() ensures Sprite keeps moving every 100ms with a condition (direction)
                //console.log(xPosition, yPosition);

                switch (direction) {
                    case "up":
                        // check if current xPos, yPos is within pre-defined boundary
                        // One parameter is adjusted, reversely in a specified direction to prevent sprite being trapped at boundary
                        if (boundary(xPosition, yPosition - incDec)) {
                            // Increase/decrease x, y position and positions sprite accordingly using CSS
                            yPosition -= incDec;
                            character.style.translate = `${xPosition}px ${yPosition}px`;
                            character.style.rotate = "-90deg";
                        }
                        break;
                    case "left":
                        if (boundary(xPosition - incDec, yPosition)) {
                            xPosition -= incDec;
                            character.style.translate = `${xPosition}px ${yPosition}px`;
                            character.style.transform = "rotateY(180deg)";
                        }
                        break;
                    case "down":
                        if (boundary(xPosition, yPosition + incDec)) {
                            yPosition += incDec;
                            character.style.translate = `${xPosition}px ${yPosition}px`;
                            character.style.rotate = "90deg";
                        }
                        break;
                    case "right":
                        if (boundary(xPosition + incDec, yPosition)) {
                            xPosition += incDec;
                            character.style.translate = `${xPosition}px ${yPosition}px`;
                            character.style.rotate = "0deg";
                        }
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

        function pauseSprite() {
            clearInterval(interval); // Clears interval declared globally, stops sprite's movement
        }

        function browserResize() {
            // Ensures sprite is inside game screen, in case player resize browser during the game.
            // I caught sprite moving outside the browser window, I implemented "browserResize()" as error catch handler
            window.addEventListener("resize", (event) => {
                gameScreenWidth = document.querySelector("main").offsetWidth;
                gameScreenHeight = document.querySelector("main").offsetHeight;

                character.style.translate = `${gameScreenWidth / 2}px ${gameScreenHeight / 3}px`;
            });
        }
    }

    function foodSpawn() {
        spawnGeneratedFood(); // Spawn first food

        // Spawn food at a time for every 1-5 seconds throughout the game
        const foodSpawnInterval = setInterval(() => { spawnGeneratedFood() }, (Math.floor(Math.random() * 5000)));

        function spawnGeneratedFood() {
            const food = document.createElement("div");
            food.classList.add("food");

            const foodImg = document.createElement("img");
            foodImg.src = `/assets/sprites/food/food${Math.ceil(Math.random() * 7)}.png`;

            food.appendChild(foodImg);

            food.style.translate = `${Math.floor(Math.random() * gameScreenWidth)}px ${Math.floor(Math.random() * gameScreenHeight - 25)}px`;

            gameScreen.appendChild(food);
        }



    }
}
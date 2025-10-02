game(); // start game

function game() {
    playerMovementController();

    // X and Y Positions to control translate property of character in CSS
    // https://developer.mozilla.org/en-US/docs/Web/CSS/translate
    let xPosition = 50;
    let yPosition = 50;

    const speed = 1;

    character.style.translate = `${xPosition}vw ${yPosition}vh`;

    function playerMovementController() { // Listen to WASD and Arrow key presses
        document.body.addEventListener("keydown", (keyboardEvent) => { // Keyboard Event API => https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
            const key = keyboardEvent.key;

            const character = document.getElementById("character");

            switch (key) {
                case "w":
                case "W":
                case "ArrowUp":
                    yPosition -= speed;
                    character.style.translate = `${xPosition}vw ${yPosition}vh`; // Adjusts element's position using CSS translate property with x, y values
                    break;
                case "a":
                case "A":
                case "ArrowLeft":
                    xPosition -= speed;
                    character.style.translate = `${xPosition}vw ${yPosition}vh`;
                    break;
                case "s":
                case "S":
                case "ArrowDown":
                    yPosition += speed;
                    character.style.translate = `${xPosition}vw ${yPosition}vh`;
                    break;
                case "d":
                case "D":
                case "ArrowRight":
                    xPosition += speed;
                    character.style.translate = `${xPosition}vw ${yPosition}vh`;
                    break;
            }
        })
    }


}
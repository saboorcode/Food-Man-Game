game(); // start game

function game() {

    const character = document.getElementById("character");
    const sprite = document.createElement("img");

    const arraySpriteLayers = ["/assets/sprites/sprite_1.png", "/assets/sprites/sprite_2.png"];
    sprite.src = arraySpriteLayers[1];

    character.appendChild(sprite);

    // X and Y Positions to control translate property of character in CSS
    // https://developer.mozilla.org/en-US/docs/Web/CSS/translate
    let xPosition = 50;
    let yPosition = 50;

    const speed = 1;

    character.style.translate = `${xPosition}vw ${yPosition}vh`;

    function playerMovementController() { // Listen to WASD and Arrow key presses
        document.body.addEventListener("keydown", (keyboardEvent) => { // Keyboard Event API => https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
            const key = keyboardEvent.key;

           character.style.rotate = "0deg";
            character.style.transform = "rotateY(0deg)";

            switch (key) {
                case "w":
                case "W":
                case "ArrowUp":
                    yPosition -= speed;
                    character.style.rotate = "-90deg";
                    break;
                case "a":
                case "A":
                case "ArrowLeft":
                    xPosition -= speed;
                    character.style.transform = "rotateY(180deg)";
                    break;
                case "s":
                case "S":
                case "ArrowDown":
                    yPosition += speed;
                    character.style.rotate = "90deg";
                    break;
                case "d":
                case "D":
                case "ArrowRight":
                    xPosition += speed;
                    character.style.rotate = "0deg";
                    break;
            }
        })
    }

    function animateSprite(){        
        setInterval(() => {
            sprite.src = sprite.src.includes(arraySpriteLayers[0]) ? arraySpriteLayers[1] : arraySpriteLayers[0];
            character.style.translate = `${xPosition}vw ${yPosition}vh`; // Adjusts element's position using CSS translate property with x, y values
        }, 150);
    }

    playerMovementController();
    animateSprite();
}
# Blackjack Web Application

## Overview
This is a simple web application that allows users to play a game of Blackjack directly in their browser. The game implements core Blackjack rules, including hitting, standing, and determining winners based on card values. Games is also a simple project made for uni purposes and nothing else or more.

## Features
- Fully playable Blackjack game.
- Dynamic card dealing with graphical representations of cards.
- Real-time score updates for both the player and the dealer.
- Interactive controls for gameplay (Hit, Stand, Restart).
- Responsive design for desktop and mobile screens.

## File Structure
```
project-root/
├── index.html       # Main HTML file.
├── style.css        # Stylesheet for styling the application.
├── script.js        # JavaScript file containing game logic.
├── assets/
│   └── cards/       # Folder containing card images.
│       ├── 2_of_hearts.png
│       ├── A_of_spades.png
│       └── ...
```

## How to Run
1. Clone or download the repository to your local machine.
2. Ensure the `assets/cards/` folder contains images for the cards with filenames in the format `<value>_of_<suit>.png` (e.g., `2_of_hearts.png`).
3. Open the `index.html` file in any modern web browser.
4. Start playing the game by clicking the "Hit" and "Stand" buttons.

## Game Rules
- **Objective**: Beat the dealer by having a hand value closest to 21 without exceeding it.
- **Card Values**:
  - Number cards are worth their face value.
  - Face cards (J, Q, K) are worth 10.
  - Aces are worth 1 or 11, whichever is more advantageous for the hand.
- The dealer must stand on 17 or higher and draw on 16 or lower.

## Controls
- **Hit**: Draw a card to improve your hand.
- **Stand**: End your turn and let the dealer play.
- **Restart**: Reset the game and start over.

## Customization
- Card images: Replace or add card images in the `assets/cards/` folder. Ensure filenames match the required format.
- Styling: Modify `style.css` to change the appearance of the application.
- Game logic: Update `script.js` for additional rules or gameplay tweaks.

## Possible future Enhancements
- Add betting functionality.
- Add option to choose different deck designs.
- Implement multiple-player support.
- Add animations for card dealing.
- Include sound effects for game actions.

## License
This project is open-source and can be modified or distributed freely.

## Acknowledgments
- Card images were used from a standard playing card set. Ensure proper licensing if using third-party assets.

Enjoy playing Blackjack!


# Blackjack Web Application

## Overview
This is a fully interactive web-based Blackjack game that allows players to play against a virtual dealer. The game follows standard Blackjack rules and includes advanced features such as betting, split hands, strategy analysis, and customizable card backs.

This project was developed as a **university project** and is not intended for commercial use.

## Features
- 🃏 **Fully playable Blackjack game** with real-time gameplay.
- 💰 **Betting system**: Players can place bets and manage their token balance.
- 📊 **Strategy analysis**: Tracks player moves and compares them to optimal Blackjack strategy.
- 🎴 **Dynamic card dealing** with graphical representations.
- 📏 **Real-time score updates** for both the player and the dealer.
- 🎨 **Customizable card backs**: Choose from multiple deck designs.
- 📱 **Responsive design**: Works on desktop and mobile browsers.
- 🔄 **Next Round button**: Allows continuous play without refreshing.
- 🔥 **Animations**: Smooth animations for card dealing.

## File Structure
```
project-root/
├── index.html        # Main HTML file.
├── style.css         # Stylesheet for styling the application.
├── script.js         # JavaScript file containing game logic.
├── assets/
│   ├── cardsV2/      # Default deck of cards (standard playing cards)
│   │   ├── 2_of_hearts.png
│   │   ├── A_of_spades.png
│   │   └── ...
│   ├── reverse_cards/  # Folder containing card back designs
│   │   ├── reverse1.png
│   │   ├── reverse2.png
│   │   └── ...
│   ├── images/       # Background images
│   │   ├── table2.jpg
│   │   ├── background3.jpg
│   │   └── ...
```

## How to Run
1. Clone or download the repository to your local machine.
2. Ensure the `assets/cardsV2/` folder contains images for the cards with filenames in the format `<value>_of_<suit>.png` (e.g., `2_of_hearts.png`).
3. Open `index.html` in any modern web browser.
4. Place a bet and start playing using the **Hit, Stand, and Split** buttons.

## Game Rules
- **Objective**: Beat the dealer by having a hand value closest to 21 without exceeding it.
- **Card Values**:
  - Number cards are worth their face value.
  - Face cards (J, Q, K) are worth 10.
  - Aces are worth 1 or 11, whichever is more advantageous.
- **Gameplay**:
  - Players can **Hit** (draw a card) or **Stand** (keep their current hand).
  - If the player's hand exceeds 21, they bust and lose the round.
  - If the dealer has 16 or lower, they must draw a card.
  - If the dealer has 17 or higher, they must stand.

## Controls
- 🎯 **Hit**: Draw an additional card.
- ✋ **Stand**: End your turn and let the dealer play.
- 🔄 **Restart**: Reset the game and start over.
- 💰 **Bet**: Enter an amount and place a bet before starting a new round.
- 🎴 **Change Card Back**: Select a custom card back from the settings.
- 📊 **Analyze Strategy**: View an analysis of your moves compared to the optimal strategy.

## Customization
- **Card Images**: Replace or add card images in the `assets/cardsV2/` folder.
- **Card Backs**: Add new images to `assets/reverse_cards/` and select them in the game.
- **Styling**: Modify `style.css` to change the appearance of the game.
- **Game Logic**: Customize `script.js` for additional rules or features.

## Future Enhancements
- 🎵 Add sound effects for card dealing and betting.
- 👥 Multiplayer support to play against real players.
- 🏆 Leaderboard to track best scores.
- 🔥 More animations for card dealing and chip movements.
- 📊 Improved AI for dealer behavior.

## License
This project is **open-source** and can be modified or distributed freely for educational purposes.

## Acknowledgments
- Card images were sourced from **a standard playing card set**.
- Background and table images were used from **free resources**.
- Inspired by **classic casino-style Blackjack games**.

Enjoy playing Blackjack! 🎰♠️♦️♣️♥️

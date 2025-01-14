// script.js

const dealerCards = document.getElementById("dealer-cards");
const playerCards = document.getElementById("player-cards");
const dealerScoreDisplay = document.getElementById("dealer-score");
const playerScoreDisplay = document.getElementById("player-score");
const messageDisplay = document.getElementById("message");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");
const restartButton = document.getElementById("restart-button");

let deck = [];
let playerHand = [];
let dealerHand = [];

function createDeck() {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    deck = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({ value, suit });
        }
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCard(hand, targetElement) {
    const card = deck.pop();
    hand.push(card);
    const cardElement = document.createElement("img");
    cardElement.classList.add("card");
    cardElement.src = `assets/cards/${card.value}_of_${card.suit}.png`;
    cardElement.alt = `${card.value} of ${card.suit}`;
    targetElement.appendChild(cardElement);
}

function calculateScore(hand) {
    let score = 0;
    let aces = 0;
    for (const card of hand) {
        if (card.value === "A") {
            score += 11;
            aces++;
        } else if (["K", "Q", "J"].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}

function updateScores() {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);
    playerScoreDisplay.textContent = `Score: ${playerScore}`;
    dealerScoreDisplay.textContent = `Score: ${dealerScore}`;
    return { playerScore, dealerScore };
}

function checkWinner() {
    const { playerScore, dealerScore } = updateScores();
    if (playerScore > 21) {
        messageDisplay.textContent = "You busted! Dealer wins!";
        endGame();
    } else if (dealerScore > 21) {
        messageDisplay.textContent = "Dealer busted! You win!";
        endGame();
    } else if (dealerScore >= 17) {
        if (playerScore > dealerScore) {
            messageDisplay.textContent = "You win!";
        } else if (playerScore < dealerScore) {
            messageDisplay.textContent = "Dealer wins!";
        } else {
            messageDisplay.textContent = "It's a tie!";
        }
        endGame();
    }
}

function dealerTurn() {
    while (calculateScore(dealerHand) < 17) {
        dealCard(dealerHand, dealerCards);
    }
    checkWinner();
}

function endGame() {
    hitButton.disabled = true;
    standButton.disabled = true;
}

function restartGame() {
    playerHand = [];
    dealerHand = [];
    dealerCards.innerHTML = "";
    playerCards.innerHTML = "";
    messageDisplay.textContent = "";
    hitButton.disabled = false;
    standButton.disabled = false;
    createDeck();
    dealCard(playerHand, playerCards);
    dealCard(playerHand, playerCards);
    dealCard(dealerHand, dealerCards);
}

hitButton.addEventListener("click", () => {
    dealCard(playerHand, playerCards);
    const { playerScore } = updateScores();
    if (playerScore > 21) {
        messageDisplay.textContent = "You busted! Dealer wins!";
        endGame();
    }
});

standButton.addEventListener("click", () => {
    dealerTurn();
});

restartButton.addEventListener("click", () => {
    restartGame();
});

// Initialize the game
createDeck();
restartGame();

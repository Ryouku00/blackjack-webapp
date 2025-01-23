// script.js

let deck = [];
let playerHand = [];
let dealerHand = [];

const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const restartButton = document.getElementById('restart-button');
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerCardsDiv = document.getElementById('player-cards');
const deckDiv = document.getElementById('deck');
const playerScoreDiv = document.getElementById('player-score');
const dealerScoreDiv = document.getElementById('dealer-score');
const messageDiv = document.getElementById('message');

// Elements for popup
const rulesButton = document.getElementById('rules-button');
const rulesPopup = document.getElementById('rules-popup');
const overlay = document.getElementById('overlay');
const closePopupButton = document.getElementById('close-popup');

// Initialize deck with cards
function initializeDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }

    deck = deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
    if (['J', 'Q', 'K'].includes(card.value)) {
        return 10;
    } else if (card.value === 'A') {
        return 11;
    } else {
        return parseInt(card.value);
    }
}

function calculateHandValue(hand) {
    let value = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = hand.filter(card => card.value === 'A').length;

    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }

    return value;
}

function renderHand(hand, container) {
    container.innerHTML = '';
    hand.forEach(card => {
        const cardImg = document.createElement('img');
        cardImg.src = `assets/cards/${card.value}_of_${card.suit}.png`;
        cardImg.classList.add('card');
        container.appendChild(cardImg);
    });
}

function updateScores() {
    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);
    playerScoreDiv.textContent = `Score: ${playerScore}`;
    dealerScoreDiv.textContent = `Score: ${dealerScore}`;
}

function checkGameState() {
    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);

    if (playerScore > 21) {
        messageDiv.textContent = 'You bust! Dealer wins.';
        endGame();
    } else if (dealerScore > 21) {
        messageDiv.textContent = 'Dealer busts! You win!';
        endGame();
    } else if (dealerScore >= 17 && playerScore <= 21) {
        if (dealerScore > playerScore) {
            messageDiv.textContent = 'Dealer wins!';
        } else if (dealerScore < playerScore) {
            messageDiv.textContent = 'You win!';
        } else {
            messageDiv.textContent = 'It\'s a tie!';
        }
        endGame();
    }
}

function dealerTurn() {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    renderHand(dealerHand, dealerCardsDiv);
    updateScores();
    checkGameState();
}

function endGame() {
    hitButton.disabled = true;
    standButton.disabled = true;
}

function resetGame() {
    initializeDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop()];
    renderHand(playerHand, playerCardsDiv);
    renderHand(dealerHand, dealerCardsDiv);
    updateScores();
    messageDiv.textContent = '';
    hitButton.disabled = false;
    standButton.disabled = false;
}

function moveCardToPlayer() {
    const card = deck.pop();
    const cardImg = document.createElement('img');
    cardImg.src = `assets/cards/${card.value}_of_${card.suit}.png`;
    cardImg.classList.add('card', 'card-moving');
    deckDiv.appendChild(cardImg);

    cardImg.addEventListener('animationend', () => {
        cardImg.classList.remove('card-moving');
        playerCardsDiv.appendChild(cardImg);
        playerHand.push(card);
        renderHand(playerHand, playerCardsDiv);
        updateScores();
        checkGameState();
    });
}

hitButton.addEventListener('click', () => {
    moveCardToPlayer();
});

standButton.addEventListener('click', () => {
    dealerTurn();
});

restartButton.addEventListener('click', resetGame);

// Open and close the popup for rules
rulesButton.addEventListener('click', () => {
    rulesPopup.classList.remove('hidden');
    overlay.classList.remove('hidden');
});

closePopupButton.addEventListener('click', () => {
    rulesPopup.classList.add('hidden');
    overlay.classList.add('hidden');
});

overlay.addEventListener('click', () => {
    rulesPopup.classList.add('hidden');
    overlay.classList.add('hidden');
});

resetGame();

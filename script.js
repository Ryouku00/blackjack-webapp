// Global variables
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerTokens = 1000;
let currentBet = 0;
let inRound = false; // indicates if a round is active

// Variables for split mode
let isSplit = false;
let splitHands = []; // holds the hands when a split occurs
let currentHandIndex = 0;

// Array to record player's moves for strategy analysis
let playerMoves = [];

// DOM elements
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const restartButton = document.getElementById('restart-button');
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerCardsDiv = document.getElementById('player-cards');
const deckDiv = document.getElementById('deck');
const playerScoreDiv = document.getElementById('player-score');
const dealerScoreDiv = document.getElementById('dealer-score');
const messageDiv = document.getElementById('message');

const betInput = document.getElementById('bet-input');
const placeBetButton = document.getElementById('place-bet-button');
const tokensDisplay = document.getElementById('tokens-display');
const nextRoundButton = document.getElementById('next-round-button');
const splitButton = document.getElementById('split-button');
const analyzeButton = document.getElementById('analyze-button');
const skinButton = document.getElementById('skin-button');

const rulesButton = document.getElementById('rules-button');
const rulesPopup = document.getElementById('rules-popup');
const skinPopup = document.getElementById('skin-popup');
const overlay = document.getElementById('overlay');
const closePopupButton = document.getElementById('close-popup');

// Update token display
function updateTokensDisplay() {
  tokensDisplay.textContent = `Tokens: ${playerTokens}`;
}

// Initialize deck
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

// Helper functions – card value and hand total
function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  else if (card.value === 'A') return 11;
  else return parseInt(card.value);
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

// Helper – format suit name (e.g. "clubs" => "Clubs")
function formatSuit(suit) {
  return suit.charAt(0).toUpperCase() + suit.slice(1);
}

// Render hand – now uses the format "7_of_Clubs.png"
function renderHand(hand, container) {
  container.innerHTML = '';
  hand.forEach(card => {
    const cardImg = document.createElement('img');
    const suitFormatted = formatSuit(card.suit);
    cardImg.src = `assets/cardsV2/${card.value}_of_${suitFormatted}.png`;
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

function updateSplitScore() {
  playerScoreDiv.textContent = `Score: ${calculateHandValue(splitHands[currentHandIndex])}`;
}

// ─────────────────────────────
// STRATEGY ANALYSIS FUNCTIONS
// ─────────────────────────────

// Record a player's move with the current hand context and dealer's upcard
function recordMove(move, handContext) {
  playerMoves.push({
    playerHand: JSON.parse(JSON.stringify(handContext)),
    dealerUpCard: dealerHand[0],
    move: move
  });
}

// Simplified function to determine the optimal decision based on basic strategy
function getOptimalDecision(playerHand, dealerUpCard) {
  // If the hand is a pair – for example, always split Aces or 8s
  if (playerHand.length === 2 && playerHand[0].value === playerHand[1].value) {
    if (playerHand[0].value === 'A' || playerHand[0].value === '8') {
      return 'split';
    }
  }
  // Calculate total and check if the hand is soft (contains Ace counted as 11)
  let total = 0, aces = 0;
  for (let card of playerHand) {
    total += getCardValue(card);
    if (card.value === 'A') aces++;
  }
  let isSoft = (aces > 0 && total <= 21);
  if (isSoft) {
    return total <= 17 ? 'hit' : 'stand';
  } else {
    if (total <= 11) return 'hit';
    if (total >= 17) return 'stand';
    let dealerVal = getCardValue(dealerUpCard);
    return (dealerVal >= 2 && dealerVal <= 6) ? 'stand' : 'hit';
  }
}

// Analyze recorded moves and display the accuracy
function analyzePlayerMoves() {
  if (playerMoves.length === 0) {
    alert("No moves recorded for analysis.");
    return;
  }
  let correct = 0;
  let details = "";
  playerMoves.forEach((entry, index) => {
    const optimal = getOptimalDecision(entry.playerHand, entry.dealerUpCard);
    const isCorrect = (entry.move === optimal);
    if (isCorrect) correct++;
    details += `Move ${index + 1}: you chose '${entry.move}', optimal is '${optimal}' – ${isCorrect ? "Correct" : "Incorrect"}\n`;
  });
  const accuracy = Math.round((correct / playerMoves.length) * 100);
  alert(`Move Accuracy: ${accuracy}%\n\nDetails:\n${details}`);
}

// ─────────────────────────────
// GAMEPLAY FUNCTIONS
// ─────────────────────────────

// Animate moving a card from the deck to the player's hand (non-split mode)
function moveCardToPlayer() {
  const card = deck.pop();
  const cardImg = document.createElement('img');
  const suitFormatted = formatSuit(card.suit);
  cardImg.src = `assets/cardsV2/${card.value}_of_${suitFormatted}.png`;
  cardImg.classList.add('card', 'card-moving');
  deckDiv.appendChild(cardImg);

  cardImg.addEventListener('animationend', () => {
    cardImg.classList.remove('card-moving');
    playerCardsDiv.appendChild(cardImg);
    playerHand.push(card);
    renderHand(playerHand, playerCardsDiv);
    updateScores();
    recordMove('hit', playerHand);
    if (calculateHandValue(playerHand) > 21) {
      messageDiv.textContent = 'You bust! Dealer wins.';
      endRoundNonSplit('lose');
    }
  });
}

// Start a new round – reset hands, deck, check for split option and blackjack
function startRound() {
  inRound = true;
  isSplit = false;
  splitHands = [];
  currentHandIndex = 0;
  initializeDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop()];
  renderHand(playerHand, playerCardsDiv);
  renderHand(dealerHand, dealerCardsDiv);
  updateScores();
  messageDiv.textContent = '';
  hitButton.disabled = false;
  standButton.disabled = false;
  nextRoundButton.style.display = 'none';
  splitButton.style.display = 'none';

  // If the two cards are the same and the player has enough tokens, show the split option
  if (playerHand[0].value === playerHand[1].value && playerTokens >= currentBet * 2) {
    splitButton.style.display = 'inline-block';
  }

  // If the player has a natural blackjack, register an automatic 'stand'
  if (!isSplit && playerHand.length === 2 && calculateHandValue(playerHand) === 21) {
    messageDiv.textContent = 'Blackjack! Wait for dealer\'s turn.';
    recordMove('stand', playerHand);
    hitButton.disabled = true;
    standButton.disabled = true;
    setTimeout(() => dealerTurn(), 1000);
  }
}

// When the bet is placed, start the round
placeBetButton.addEventListener('click', () => {
  const betValue = parseInt(betInput.value);
  if (isNaN(betValue) || betValue <= 0) {
    alert('Please enter a valid bet amount!');
    return;
  }
  if (betValue > playerTokens) {
    alert('You do not have enough tokens!');
    return;
  }
  currentBet = betValue;
  betInput.disabled = true;
  placeBetButton.disabled = true;
  startRound();
});

// Split button – record move and split the hand into two
splitButton.addEventListener('click', () => {
  recordMove('split', playerHand);
  isSplit = true;
  splitHands = [
    [playerHand[0]],
    [playerHand[1]]
  ];
  // Deal one extra card for each split hand
  splitHands[0].push(deck.pop());
  splitHands[1].push(deck.pop());
  currentHandIndex = 0;
  renderHand(splitHands[currentHandIndex], playerCardsDiv);
  updateSplitScore();
  messageDiv.textContent = 'Hand 1 (split): Choose Hit or Stand.';
  splitButton.style.display = 'none';
});

// Hit button – works differently in split mode vs non-split mode
hitButton.addEventListener('click', () => {
  if (!inRound) return;
  if (isSplit) {
    recordMove('hit', splitHands[currentHandIndex]);
    const card = deck.pop();
    splitHands[currentHandIndex].push(card);
    renderHand(splitHands[currentHandIndex], playerCardsDiv);
    updateSplitScore();
    if (calculateHandValue(splitHands[currentHandIndex]) > 21) {
      messageDiv.textContent = `Hand ${currentHandIndex + 1} busts!`;
      if (currentHandIndex === 0) {
        currentHandIndex = 1;
        renderHand(splitHands[currentHandIndex], playerCardsDiv);
        updateSplitScore();
        messageDiv.textContent += ' Now playing Hand 2.';
      } else {
        hitButton.disabled = true;
        standButton.disabled = true;
        dealerTurn();
      }
    }
  } else {
    moveCardToPlayer();
  }
});

// Stand button – in split mode, move to the next hand; in non-split mode, start dealer's turn
standButton.addEventListener('click', () => {
  if (!inRound) return;
  if (isSplit) {
    recordMove('stand', splitHands[currentHandIndex]);
    if (currentHandIndex === 0) {
      messageDiv.textContent = 'Hand 1 complete. Now playing Hand 2.';
      currentHandIndex = 1;
      renderHand(splitHands[currentHandIndex], playerCardsDiv);
      updateSplitScore();
    } else {
      hitButton.disabled = true;
      standButton.disabled = true;
      dealerTurn();
    }
  } else {
    recordMove('stand', playerHand);
    hitButton.disabled = true;
    standButton.disabled = true;
    dealerTurn();
  }
});

// Dealer's turn – dealer draws until reaching at least 17, then the round is settled
function dealerTurn() {
  while (calculateHandValue(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  renderHand(dealerHand, dealerCardsDiv);
  updateScores();
  const dealerScore = calculateHandValue(dealerHand);

  if (!isSplit) {
    const playerScore = calculateHandValue(playerHand);
    // Check for natural blackjack (150% payout)
    if (playerHand.length === 2 && playerScore === 21) {
      if (dealerHand.length === 2 && dealerScore === 21) {
        messageDiv.textContent = 'Both have Blackjack! It\'s a tie!';
      } else {
        messageDiv.textContent = 'Blackjack! You win 150% of your bet!';
        playerTokens += currentBet * 1.5;
      }
    } else {
      if (dealerScore > 21) {
        messageDiv.textContent = 'Dealer busts! You win!';
        playerTokens += currentBet;
      } else if (dealerScore > playerScore) {
        messageDiv.textContent = 'Dealer wins!';
        playerTokens -= currentBet;
      } else if (dealerScore < playerScore) {
        messageDiv.textContent = 'You win!';
        playerTokens += currentBet;
      } else {
        messageDiv.textContent = 'Push!';
      }
    }
    updateTokensDisplay();
    nextRoundButton.style.display = 'inline-block';
  } else {
    finalizeSplitRound();
  }
}

// End round for non-split mode
function endRoundNonSplit(result) {
  hitButton.disabled = true;
  standButton.disabled = true;
  inRound = false;
  if (result === 'win') {
    playerTokens += currentBet;
  } else if (result === 'lose') {
    playerTokens -= currentBet;
  }
  updateTokensDisplay();
  nextRoundButton.style.display = 'inline-block';
}

// Finalize round in split mode – settle each hand separately
function finalizeSplitRound() {
  const dealerScore = calculateHandValue(dealerHand);
  let results = [];
  for (let i = 0; i < 2; i++) {
    const hand = splitHands[i];
    const handScore = calculateHandValue(hand);
    let outcome = '';
    if (handScore > 21) {
      outcome = 'loss';
      playerTokens -= currentBet;
    } else if (dealerScore > 21) {
      if (hand.length === 2 && handScore === 21) {
        outcome = 'Blackjack';
        playerTokens += currentBet * 1.5;
      } else {
        outcome = 'win';
        playerTokens += currentBet;
      }
    } else if (handScore > dealerScore) {
      if (hand.length === 2 && handScore === 21) {
        outcome = 'Blackjack';
        playerTokens += currentBet * 1.5;
      } else {
        outcome = 'win';
        playerTokens += currentBet;
      }
    } else if (handScore < dealerScore) {
      outcome = 'loss';
      playerTokens -= currentBet;
    } else {
      outcome = 'push';
    }
    results.push(`Hand ${i + 1}: ${outcome}`);
  }
  messageDiv.textContent = results.join(' | ');
  updateTokensDisplay();
  nextRoundButton.style.display = 'inline-block';
}

// Restart – reset the game and token balance (1000 tokens)
restartButton.addEventListener('click', () => {
  playerTokens = 1000;
  currentBet = 0;
  inRound = false;
  isSplit = false;
  splitHands = [];
  currentHandIndex = 0;
  playerHand = [];
  dealerHand = [];
  playerCardsDiv.innerHTML = '';
  dealerCardsDiv.innerHTML = '';
  playerScoreDiv.textContent = 'Score: 0';
  dealerScoreDiv.textContent = 'Score: 0';
  messageDiv.textContent = '';
  betInput.value = '';
  betInput.disabled = false;
  placeBetButton.disabled = false;
  nextRoundButton.style.display = 'none';
  splitButton.style.display = 'none';
  updateTokensDisplay();
});

// Next Round – clear the board and allow a new bet
nextRoundButton.addEventListener('click', () => {
  inRound = false;
  isSplit = false;
  splitHands = [];
  currentHandIndex = 0;
  playerHand = [];
  dealerHand = [];
  playerCardsDiv.innerHTML = '';
  dealerCardsDiv.innerHTML = '';
  playerScoreDiv.textContent = 'Score: 0';
  dealerScoreDiv.textContent = 'Score: 0';
  messageDiv.textContent = '';
  betInput.value = '';
  betInput.disabled = false;
  placeBetButton.disabled = false;
  nextRoundButton.style.display = 'none';
  splitButton.style.display = 'none';
});

// Analyze Strategy button
analyzeButton.addEventListener('click', () => {
  analyzePlayerMoves();
});

// ─────────────────────────────
// POPUP HANDLING (Rules and Skin)
// ─────────────────────────────

// Rules popup
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
  skinPopup.classList.add('hidden');
  overlay.classList.add('hidden');
});

// Skin popup
skinButton.addEventListener('click', () => {
  skinPopup.classList.remove('hidden');
  overlay.classList.remove('hidden');
});

// Handle skin option clicks
const skinOptions = document.querySelectorAll('.skin-option');
skinOptions.forEach(option => {
  option.addEventListener('click', () => {
    const selectedSkin = option.getAttribute('data-skin');
    changeCardBack(selectedSkin);
    skinPopup.classList.add('hidden');
    overlay.classList.add('hidden');
  });
});

// Function to change the card back image
function changeCardBack(skin) {
  const deckImage = document.querySelector('#deck img');
  deckImage.src = `assets/reverse_cards/${skin}`;
}

// Initialize game state
updateTokensDisplay();
initializeDeck();
resetGame();


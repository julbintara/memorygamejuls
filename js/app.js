$(document).ready(function(){
  $('.modal').modal();

  

  let cardList = [
    'fa-diamond',
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-anchor',
    'fa-bolt',
    'fa-bolt',
    'fa-cube',
    'fa-cube',
    'fa-bomb',
    'fa-bomb',
    'fa-bicycle',
    'fa-bicycle',
    'fa-leaf',
    'fa-leaf'
  ];

  let stopW = new StopWatch();

  let modals = document.getElementById('game_modal');
  let mInstance = M.Modal.getInstance(modals);
  let resetButton = document.getElementById('reset-btn');
  let infoButton = document.getElementById('info-btn');
  let mText = document.getElementById('msg-text');
  let movText = document.getElementById('moves-text');
  let timesText = document.getElementById('time-text');
  let tResults = document.getElementById('time_results');
  let decks = document.getElementById('deck');
  let gSpan = document.getElementById('grade');
  let sList = document.getElementById('stars-list');
  let movResults = document.getElementById('moves_results');
  let gradeResults = document.getElementById('grade_results');
  let modal_reset_btn = document.getElementById('modal_reset_btn');
  
  let moves = 0;
  let grades = 'Great!';

  let gameIsOver = false;
  let didGameStarting = false;

  let matches = [];
  let lastFlipp = null;
  let paused = false;

  gSpan.innerText = grades;
  movText.innerText = moves;
  timesText.innerText = stopW.getTimeString();



  function createCard(card_class) {
    let li = document.createElement('li');
    li.classList.add('card');
    li.classList.add('card-' + card_class);
    li.setAttribute('data-card', card_class);
    let i = document.createElement('i');
    i.classList.add('card-icon', 'fa', card_class);
    i.setAttribute('data-card', card_class);
    li.appendChild(i);
    return li;
  }

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  resetButton.addEventListener('click', resetGame);
  modal_reset_btn.addEventListener('click', resetGame);
  infoButton.addEventListener('click', info);

 
  

  function clearDeck() {
    decks.innerHTML = '';
  }

  function generateCards() {
    let card_classes = shuffle(cardList);
    for(let index = 0; index < 16; index++) {
      let card_class = card_classes[index];
      let new_elm = createCard(card_class);
      decks.appendChild(new_elm);
    }
  }
  function updateGrade() {
    if(moves > 12) {
      if(grades !== "Average") {
        grades = "Average";
        gSpan.innerText = grades;
        sList.removeChild(sList.children[0]);
      }
    }
    if(moves > 24) {
      if(grades !== "Poor...") {
        grades = "Poor...";
        gSpan.innerText = grades;
        sList.removeChild(sList.children[0]);
      }
    }
  }
  function activateCards() {
    document.querySelectorAll('.card').forEach(function(card) {
      card.addEventListener('click', function() {
        if(didGameStarting === false) {
          
          didGameStarting = true;
          stopW.startTimer(function(){
            timesText.innerText = stopW.getTimeString();
          });
        }
        if (card === lastFlipp || matches.includes(card) || paused || gameIsOver) {
          
          return;
        }

        card.classList.add('open', 'show');

        if (lastFlipp) { 
          let thisCard = card.childNodes[0].getAttribute('data-card');
          let lastCard = lastFlipp.childNodes[0].getAttribute('data-card');
          moves++;
          movText.innerText = moves;
          updateGrade();

          if (thisCard === lastCard) {
            let message = 'match found!';
            console.log(message);
            flash_msg(message);
            card.classList.add('match');
            lastFlipp.classList.add('match');
            matches.push(card);
            matches.push(lastFlipp);
            lastFlipp = null;
            if(matches.length === 16) {
              gameOver();
              return;
            }
          }
          else {
            let message = 'no match.';
            console.log(message);
            flash_msg(message);
            paused = true;
            setTimeout(function() {
              card.classList.remove('open', 'show');
              lastFlipp.classList.remove('open', 'show');
              lastFlipp = null;
              paused = false;
            }, 1725);
          }
        }
        else {
         
          lastFlipp = card;
        }
      });
    });
  }

  function getRandomItem(array_obj) {
    return array_obj[Math.floor(Math.random() * array_obj.length)];
  }


  function hint() {
    let hiddenCards = Array.from(document.querySelectorAll('.card')).filter(function(card){
      return card.classList.contains('open') === false;
    });
    let cardItem = getRandomItem(hiddenCards);
    let card_name = '.card-' + cardItem.getAttribute('data-card');

    paused = true;
    document.querySelectorAll(card_name).forEach(function(card) {
      card.classList.add('open', 'show');
    });
    setTimeout(function(){
      document.querySelectorAll(card_name).forEach(function(card) {
        card.classList.remove('open', 'show');
      });
      paused = false;
    }, 3000);
  }

  function info() {
    alert('Grading System: \n\n\
    0-12 Moves = Great! \n\
    13-24 Moves = Average \n\
    25+ Moves = Poor...  \
    ');
  }

  function start() {
    generateCards();
    activateCards();
    flash_cards();
    console.log('game started.');
  }

  function gameOver() {
    gameIsOver = true;
    stopW.stopTimer();

    gradeResults.innerText = grades;
    movResults.innerText = moves;
    tResults.innerText = stopW.getTimeString();

    mInstance.open();
  }

  function resetGame(e) {
    if(e && e.preventDefault) { e.preventDefault(); }


    clearDeck();
    generateCards();
    activateCards();
    flash_cards();
    stopW.resetTimer();


    moves = 0;
    grades = 'Great!';
    gameIsOver = false;
    matches = [];
    lastFlipp = null;
    paused = false;
    didGameStarting = false;

    sList.innerHTML = '';
    sList.innerHTML += '<li><i class="fa fa-star"></i></li>';
    sList.innerHTML += '<li><i class="fa fa-star"></i></li>';
    sList.innerHTML += '<li><i class="fa fa-star"></i></li>';
    gSpan.innerText = grades;
    movText.innerText = moves;
    timesText.innerText = stopW.getTimeString();

    flash_msg('New Game!');
    console.log('game re-started.');
  }

  function flash_msg(message) {
    mText.innerText = message;
    setTimeout(function(){ mText.innerText = ''; }, 1725);
  }

  function flash_cards() {
    document.querySelectorAll('.card').forEach(function(card) {
      card.classList.add('open', 'show');
    });
    setTimeout(function(){
      document.querySelectorAll('.card').forEach(function(card) {
        card.classList.remove('open', 'show');
      });
    }, 3000);
  }

  start();
});

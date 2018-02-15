function generateWinningNumber() {
   return (Math.floor(Math.random() * 100)+ 1);
}

Game.prototype.generateRandomNumber = function() {
    var ranNum = 100 - this.playersGuess;
    if (this.isLower()) {
        return this.playersGuess + Math.floor(Math.random() * ranNum)
    } else {
        return Math.floor(Math.random() * ranNum)
    }
}

function shuffle(arr) {
    var arrLength = arr.length;
    var t;
    var i;

    while (arrLength) {
        i = Math.floor(Math.random() * arrLength--);
        t = arr[arrLength];
        arr[arrLength] = arr[i];
        arr[i] = t;
    }
    return arr;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    if (this.playersGuess < this.winningNumber) {
        return true;
    } else {
        return false;
    }
}

Game.prototype.playersGuessSubmission = function(num) {
    if (num < 1 || num > 100 || isNaN(num)) {
        return 'That is an invalid guess.'
    } else {
        this.playersGuess = num;
        return this.checkGuess();
    }
}

Game.prototype.checkGuess = function() {

    if (this.playersGuess === this.winningNumber) {
        return 'You Win!'
    } else if (this.pastGuesses.includes(this.playersGuess)) {
        return 'You have already guessed that number.'
    }

    this.pastGuesses.push(this.playersGuess);

    if (this.pastGuesses.length === 5) {
        return 'You Lose.'
    }

    if (this.difference() < 10) {
        return 'You\'re so close!';
    } else if (this.difference() < 25) {
        return 'You\'re getting warmer!';
    } else if (this.difference() < 50) {
        return 'You\'re lukewarm.';
    } else if (this.difference() < 100) {
        return 'You\'re ice cold!';
    }
}

Game.prototype.provideHint = function() {
    var hints = [];
    var randomHints = [];
    for (var i = 0; i < 3; i++) {
        randomHints.push(this.generateRandomNumber());
    }
    randomHints.push(this.winningNumber);
    shuffle(randomHints);
    hints.push('The winning number is one of: ' + randomHints);

    if (this.winningNumber % 2 === 0) {
        hints.push('It\'s an even number')
    } else {
        hints.push('It\'s an odd number')
    }
    return hints;
}

function reset(game) {
  game.pastGuesses = [];
  newGame = new Game();
  hintTrys = 2;
  $('#player-input').val('');
  $('h1').text('GUESSING GAME').css({'background-color': ''});
  $('#message').text('Go ahead, guess a number from 1 - 100:');
  $('.guess').text('#');
  $('#submit').attr('disabled', false);
  $('.btn-info').attr('disabled', false);
  $('.hintSection').text('');
  $('.hintSection').removeClass('hidden');
}

function pressedHint(game) {
  var giveHints = game.provideHint();
    hintTrys--;
    if (hintTrys >= 0) {
      $('.hintSection').text(giveHints[hintTrys]);
    } else {
      $('.hintSection').text('You have no more hints left!')
    }
  }

$(document).ready(function() {
    newGame = new Game();
    var takesAGuess;
    hintTrys = 2;

     $('#submit').on('click', function(e) {
          startPlay(newGame);
     });
     $('#reset').on('click', reset);
     $('#hint').on('click', pressedHint);

     $(document).on('keyup', function(event) {
         event.preventDefault();
         if (event.which == 13) {
            var focused = $(':focus');
            var focusedId = focused.attr('id');
            if (focusedId === 'player-input' || focusedId === 'submit') {
              startPlay(newGame);
            } else if (focusedId === 'hint') {
              pressedHint(newGame);
            } else if (focusedId === 'reset') {
              reset(newGame);
            }
         }
     });


    // function pressedHint() {
    //   hintTrys--;
    //   if (hintTrys >= 0) {
    //       $('.hintSection').text(giveHints[hintTrys]);
    //   } else {
    //       $('.hintSection').text('You have no more hints left!')
    //   }
    // }


    function startPlay(game) {
        var guess = +$('#player-input').val();
        takesAGuess = newGame.playersGuessSubmission(guess);
        $('#player-input').val('');
        $('.hintSection').text('');

        if (takesAGuess === 'That is an invalid guess.' || takesAGuess === 'You have already guessed that number.') {
            $('#message').text(takesAGuess);
        } else {
            $('.guess:nth-child(' + newGame.pastGuesses.length + ')').text(guess);
            if (newGame.isLower()) {
                $('#message').text(takesAGuess + ' Guess higher!');
            } else {
                $('#message').text(takesAGuess + ' Guess lower!');
            }
        }

        if (takesAGuess === 'You Lose.') {
            $('h1').text('YOU LOSE').css({'background-color':'red'});
            $('#message').text('The winning number was ' + newGame.winningNumber + '. Press RESET to play again!');
            $('#submit').attr('disabled', true);
            $('.btn-info').attr('disabled', true);
        } else if (takesAGuess === 'You Win!') {
            $('h1').text('YOU WIN!!!!').css({'background-color':'green'});
            $('#message').text('Press RESET to play again!');
            $('#submit').attr('disabled', true);
            $('.btn-info').attr('disabled', true);
        }
    }

});

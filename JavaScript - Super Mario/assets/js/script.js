const audioStart = new Audio('./assets/music/audio_theme.mp3');
const audioGameOver = new Audio('./assets/music/audio_gameover.mp3');

let gameLoop;

const startGame = () => 
{
  $('.pipe').addClass('pipe-animation');
  $('.start').hide();

  audioStart.currentTime = 0;
  audioStart.play();
  
  loop();
};

const restartGame = () => 
{
  clearInterval(gameLoop);
  
  $('.game-over').hide();
  $('.pipe').css('left', '').addClass('pipe-animation');

  $('.mario').attr('src', './assets/img/mario.gif').css({
    width: '150px',
    bottom: '30px'
  });

  audioGameOver.pause();
  audioGameOver.currentTime = 0;

  audioStart.currentTime = 0;
  audioStart.play();

  loop();
};

const jump = () => 
{
  $('.mario').addClass('jump');

  setTimeout(() => 
  {
    $('.mario').removeClass('jump');
  }, 800);
};

const loop = () => 
{
  gameLoop = setInterval(() => 
  {
    const pipePosition = $('.pipe').offset().left;
    const marioPosition = parseFloat($('.mario').css('bottom'));

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) 
    {
      $('.pipe').removeClass('pipe-animation').css('left', `${pipePosition}px`);

      $('.mario').removeClass('jump').css('bottom', `${marioPosition}px`).attr('src', './assets/img/game-over.png').css({
        width: '80px',
        marginLeft: '50px'
      });

      audioStart.pause();
      audioGameOver.currentTime = 0;
      audioGameOver.play();

      $('.game-over').css('display', 'flex');

      clearInterval(gameLoop);
    }
  }, 10);
};

$(document).on('keypress', (e) => 
{
  if (e.key === ' ') 
    jump();
});

$(document).on('touchstart', () => 
{
  jump();
});

$(document).on('keypress', (e) => 
{
  if (e.key === 'Enter') 
    startGame();
});

let tabataEvents;
let tabataTime = 0;
let tabataInterval = null;

let player;
let playerReady = false;

// Load audios
const audio_go = new Audio('sounds/321_go.mp3');
const audio_rest = new Audio('sounds/321_rest.mp3');
const audio_rounds = [];
for (let i = 1; i <= 8; i++) {
  audio_rounds.push(new Audio(`sounds/round_${i}.mp3`));
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: '', // OPf0YbXqDm0
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  playerReady = true;
}

document.querySelector('#start_btn').addEventListener('click', evt => {
  if (playerReady) {
    prepareTabata();
    player.playVideo();
  }
});

document.querySelector('#pause_btn').addEventListener('click', () => player.pauseVideo());

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    playTabata();
  } else if (event.data == YT.PlayerState.PAUSED) {
    pauseTabata();
  }
}

/************* Tabata *************/



function prepareTabata() {
  tabataEvents = {};
  const addTabataAudio = (time, audio) => {
    tabataEvents[Math.round(time * 10)] = audio;
  };
  for (let round = 0; round < 8; round++) {
    startTime = round * 30;
    addTabataAudio(startTime + 10 - audio_go.duration, audio_go);
    addTabataAudio(startTime + 12, audio_rounds[round]);
    addTabataAudio(startTime + 30 - audio_rest.duration, audio_rest);
  }
  console.log(tabataEvents)
}

function playTabata() {
  if (tabataInterval) {
    return;
  }
  tabataInterval = setInterval(evt => {
    tabataTime += 1;
    if (tabataEvents[tabataTime]) {
      player.setVolume(40);
      tabataEvents[tabataTime].currentTime = 0;
      tabataEvents[tabataTime].play();

      tabataEvents[tabataTime].onended = () => {
        player.setVolume(100);
      }
    }
  }, 100);
}

function pauseTabata() {
  clearInterval(tabataInterval);
  tabataInterval = null;
}

function stopTabata() {
  pauseTabata();
  tabataTime = 0;
}
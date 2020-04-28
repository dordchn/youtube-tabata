let youtubePlayer;
let youtubePlayerReady = false;
const tabataPlayer = document.querySelector('tabata-player');
window.onload = () => {
  tabataPlayer.onaudiostart = () => youtubePlayer.setVolume(40);
  tabataPlayer.onaudioend = () => youtubePlayer.setVolume(100);  
}

window.onYouTubeIframeAPIReady = function() {
  youtubePlayer = new YT.Player('player', {
    height: '390',
    width: '100%',
    videoId: 'OPf0YbXqDm0', // OPf0YbXqDm0
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

window.onPlayerReady = function(event) {
  youtubePlayerReady = true;
}

// document.querySelector('#start_btn').addEventListener('click', evt => {
//   if (youtubePlayerReady) {
//     youtubePlayer.playVideo();
//   }
// });

// document.querySelector('#pause_btn').addEventListener('click', () => youtubePlayer.pauseVideo());

window.onPlayerStateChange = function(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    tabataPlayer.play();
  } else if (event.data == YT.PlayerState.PAUSED) {
    tabataPlayer.pause();
  }
}

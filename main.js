let youtubePlayer;
let autoPause = false;
const tabataPlayer = document.querySelector('tabata-player');
const playlist = document.querySelector('x-playlist');

window.onload = () => {
  tabataPlayer.onaudiostart = () => youtubePlayer.setVolume(40);
  tabataPlayer.onaudioend = () => youtubePlayer.setVolume(100);  
}

window.onYouTubeIframeAPIReady = function() {
  youtubePlayer = new YT.Player('player', {
    height: '390',
    width: '100%',
    // videoId: 'OPf0YbXqDm0',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

window.onPlayerReady = function(event) {
  autoPause = true;
  playlist.selectFirstSong(); // automatically playing

}

window.onPlayerStateChange = function(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    if (autoPause) { // First load
      youtubePlayer.stopVideo();
      autoPause = false;
    } else { 
      tabataPlayer.play();
    }
  } else if (event.data == YT.PlayerState.PAUSED) {
    tabataPlayer.pause();
  }
}

playlist.addEventListener('play', evt => {
  youtubePlayer.loadVideoById(evt.detail);
  tabataPlayer.reset();
});
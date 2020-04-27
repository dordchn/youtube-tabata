
let youtubePlayer;
let youtubePlayerReady = false;
const tabataPlayer = new TabataPlayer();
tabataPlayer.onaudiostart = () => youtubePlayer.setVolume(40);
tabataPlayer.onaudioend = () => youtubePlayer.setVolume(100);

function onYouTubeIframeAPIReady() {
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

function onPlayerReady(event) {
  youtubePlayerReady = true;
  console.log(youtubePlayer)
}

// document.querySelector('#start_btn').addEventListener('click', evt => {
//   if (youtubePlayerReady) {
//     youtubePlayer.playVideo();
//   }
// });

// document.querySelector('#pause_btn').addEventListener('click', () => youtubePlayer.pauseVideo());

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
    tabataPlayer.play();
  } else if (event.data == YT.PlayerState.PAUSED) {
    tabataPlayer.pause();
  }
}

const inputSongElement = document.querySelector('#input_song');
inputSongElement.onkeydown = async evt => {
  if (evt.keyCode == 13 && inputSongElement.value) {
    const stream = await fetch(`https://noembed.com/embed?url=${inputSongElement.value}`);
    const videoData = await stream.json();
    if (videoData.error) {
      console.log(videoData.error); // TODO
    } else {
      console.log(videoData); // TODO
    }
  }
}

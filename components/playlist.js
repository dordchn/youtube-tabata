fetch("components/playlist.html")
  .then(stream => stream.text())
  .then(text => define(text))

const define = (html) => {
  class Playlist extends HTMLElement {
    constructor() {
      super();
      this.shadowDOM = this.attachShadow({ mode: "open" });
      this.shadowDOM.innerHTML = html;
      this.songTemplateNode = this.shadowDOM.querySelector('#song_template').content.firstElementChild;
      this.songs = this.shadowDOM.querySelector('.songs');

      const songInput = this.shadowDOM.querySelector('#input_song');
      songInput.onkeydown = async evt => {
        if (evt.keyCode == 13 && songInput.value) {
          const videoData = await this.getVideoData(songInput.value);
          console.log(videoData)
          if (videoData.error) {
            console.log(videoData.error); // TODO
          } else {
            this.addSong(videoData);
            songInput.value = '';
          }
        }
      }


      Promise.all([
        'https://www.youtube.com/watch?v=OPf0YbXqDm0',
        'https://www.youtube.com/watch?v=7wtfhZwyrcc'
      ].map(url => this.getVideoData(url)))
        .then(videosData => videosData.forEach(videoData => this.addSong(videoData)));
    }

    async getVideoData(url) {
      const stream = await fetch(`https://noembed.com/embed?url=${url}`);
      const videoData = await stream.json();
      videoData.videoId = this.getVideoId(url)
      return videoData;
    }

    getVideoId(url) {
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = url.match(regExp);
      return (match && match[7].length == 11) ? match[7] : false;
    }

    addSong(videoData) {
      const newSong = this.songTemplateNode.cloneNode(true);
      newSong.querySelector('.title').innerText = videoData.title;
      newSong.querySelector('.time').innerText = videoData.time || 'Unknown';
      newSong.setAttribute('data-video-id', videoData.videoId || '');
      newSong.querySelector('.title').onclick = () => this.selectSong(newSong);
      this.songs.appendChild(newSong);
    }

    selectSong(songElement) {
      this.dispatchEvent(new CustomEvent('play', { detail: songElement.getAttribute('data-video-id') }));
      Array.from(this.shadowDOM.querySelectorAll('.title')).forEach(title => title.classList.remove('selected'));
      songElement.querySelector('.title').classList.add('selected');
    }

    selectFirstSong() {
      this.selectSong(this.songs.querySelector('.song'));
    }
  }

  window.customElements.define('x-playlist', Playlist);
}
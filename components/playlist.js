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
          const stream = await fetch(`https://noembed.com/embed?url=${songInput.value}`);
          const videoData = await stream.json();
          if (videoData.error) {
            console.log(videoData.error); // TODO
          } else {
            this.addSong(videoData);
            songInput.value = '';
          }
        }
      }

      this.addSong({ title: 'Song 1', time: '4:15' });
      this.addSong({ title: 'Song 2', time: '3:57' });
      this.addSong({ title: 'Song 3', time: '5:01' });
    }

    addSong(videoData) {
      const newSong = this.songTemplateNode.cloneNode(true);
      newSong.querySelector('.title').innerText = videoData.title;
      newSong.querySelector('.time').innerText = videoData.time || 'Unknown';
      newSong.setAttribute('data-url', videoData.url || '');
      this.songs.appendChild(newSong);
    }
  }

  window.customElements.define('x-playlist', Playlist);
}
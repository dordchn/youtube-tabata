fetch("components/tabata-player.html")
  .then(stream => stream.text())
  .then(text => define(text))

const define = (html) => {
  class TabataPlayer extends HTMLElement {
    constructor() {
      super();
      this.shadowDOM = this.attachShadow({ mode: "open" });
      this.shadowDOM.innerHTML = html;

      // Tabata configurations
      this.tabataData = null;
      this.tabataTime = 0;
      this.tabataInterval = null;
      this.T = 50; // interval in ms
      this.F = 1000 / this.T; // frequency of loop (calls per second)

      // Properties
      this.audioStartCallback = null;
      this.audioEndCallback = null;
      this.progressBar = this.shadowDOM.querySelector('#progress_bar');
      this.progressLabel = this.shadowDOM.querySelector('#progress_label');

      // Load audios
      this.audio_go = new Audio('sounds/321_go.mp3');
      this.audio_rest = new Audio('sounds/321_rest.mp3');
      this.audio_rounds = [];
      for (let i = 1; i <= 8; i++) {
        this.audio_rounds.push(new Audio(`sounds/round_${i}.mp3`));
      }

      // Init
      this.reset();
    }

    prepareEvents() {
      this.tabataData = {
        duration: 4 * 60, // in seconds
        audioEvents: {},
        labelEvents: {},
      };
      const addAudioEvent = (time, audio) => this.tabataData.audioEvents[Math.round(time * this.F)] = audio;
      const addLabelEvent = (time, text) => this.tabataData.labelEvents[Math.round(time * this.F)] = text;
      addLabelEvent(0, 'Get ready');
      for (let round = 1; round <= 8; round++) {
        const startTime = (round - 1) * 30;
        addAudioEvent(startTime + 10 - this.audio_go.duration, this.audio_go);
        addLabelEvent(startTime + 10, `Round ${round}`);
        addAudioEvent(startTime + 12, this.audio_rounds[round - 1]);
        addAudioEvent(startTime + 30 - this.audio_rest.duration, this.audio_rest);
        addLabelEvent(startTime + 30, round < 8 ? 'Rest' : 'Completed');
      }
      console.log(this.tabataData);
    }

    reset() {
      this.stop();
      this.progressBar.style.width = '0%';
      this.progressLabel.innerText = 'Get ready';
    }

    play() {
      if (this.tabataInterval) {
        return;
      }
      if (!this.tabataData) {
        this.prepareEvents();
      }
      this.tabataInterval = setInterval(evt => {
        this.tabataTime += 1;
        this.progressBar.style.width = Math.min(100, 100 * this.tabataTime / (this.tabataData.duration * this.F)) + '%';
        if (this.tabataData.labelEvents[this.tabataTime]) {
          this.progressLabel.innerText = this.tabataData.labelEvents[this.tabataTime];
        }
        if (this.tabataData.audioEvents[this.tabataTime]) {
          if (this.audioStartCallback) this.audioStartCallback();
          this.tabataData.audioEvents[this.tabataTime].currentTime = 0;
          this.tabataData.audioEvents[this.tabataTime].play();

          this.tabataData.audioEvents[this.tabataTime].onended = () => {
            if (this.audioEndCallback) this.audioEndCallback();
          }
        }
      }, this.T);
    }

    pause() {
      clearInterval(this.tabataInterval);
      this.tabataInterval = null;
    }

    stop() {
      this.pause();
      this.tabataTime = 0;
    }

    set onaudiostart(callback) {
      this.audioStartCallback = callback;
    }
    set onaudioend(callback) {
      this.audioEndCallback = callback;
    }
  }

  window.customElements.define('tabata-player', TabataPlayer);
}
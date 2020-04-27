
class TabataPlayer {
  constructor() {
    this.tabataEvents = null;
    this.tabataTime = 0;
    this.tabataInterval = null;
    this.T = 100;
    this.audioStartCallback = null;
    this.audioEndCallback = null;

    // Load audios
    this.audio_go = new Audio('sounds/321_go.mp3');
    this.audio_rest = new Audio('sounds/321_rest.mp3');
    this.audio_rounds = [];
    for (let i = 1; i <= 8; i++) {
      this.audio_rounds.push(new Audio(`sounds/round_${i}.mp3`));
    }
  }

  prepareEvents() {
    this.tabataEvents = {};
    const addTabataAudio = (time, audio) => this.tabataEvents[Math.round(time * 1000 / this.T)] = audio;
    for (let round = 0; round < 8; round++) {
      const startTime = round * 30;
      addTabataAudio(startTime + 10 - this.audio_go.duration, this.audio_go);
      addTabataAudio(startTime + 12, this.audio_rounds[round]);
      addTabataAudio(startTime + 30 - this.audio_rest.duration, this.audio_rest);
    }
    console.log(this.tabataEvents);
  }

  play() {
    if (this.tabataInterval) {
      return;
    }
    if (!this.tabataEvents) {
      this.prepareEvents();
    }
    this.tabataInterval = setInterval(evt => {
      this.tabataTime += 1;
      if (this.tabataEvents[this.tabataTime]) {
        if (this.audioStartCallback) this.audioStartCallback();
        this.tabataEvents[this.tabataTime].currentTime = 0;
        this.tabataEvents[this.tabataTime].play();

        this.tabataEvents[this.tabataTime].onended = () => {
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
    pauseTabata();
    tabataTime = 0;
  }

  set onaudiostart(callback) {
    this.audioStartCallback = callback;
  }
  set onaudioend(callback) {
    this.audioEndCallback = callback;
  }
}

export default TabataPlayer;
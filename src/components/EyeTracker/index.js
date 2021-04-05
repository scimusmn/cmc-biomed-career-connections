/* eslint-disable */
import EventEmitter from 'events';

function lowpass(oldValue, newValue, filtering) {
  return filtering * oldValue + (1 - filtering) * newValue;
}

class EyeTracker extends EventEmitter {
  constructor(filtering = 0.2) {
    super();
    this.x = 0.5;
    this.y = 0.5;
    this.userIsPresent = false;
    this.filtering = filtering;

    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        switch (data.type) {
          case 'data':
            // console.log(data);
            this.parseData(data);
            break;

          case 'update':
            this.parseUpdate(data);
            break;

          default:
        }
      };
    };

    this.ws = ws;

    this.subscribers = [];

    this.on('presence', userIsPresent => this.subscribers.forEach(s => s.onPresence(userIsPresent)));
    this.on('position', (x, y) => this.subscribers.forEach(s => s.onPosition(x, y)));
  }

  waitOn(state, onSuccess, onFailure) {
    this.waiting = true;
    this.waitingOn = state;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
  }

  startCalibration(onSuccess, onFailure) {
    this.ws.send(JSON.stringify({ trigger: 'start-calibration' }));
    this.waitOn('calibration-started', onSuccess, onFailure);
  }

  collectData(x, y, onSuccess, onFailure) {
    this.ws.send(JSON.stringify({ trigger: 'collect-data', x, y }));
    this.waitOn('data-collected', onSuccess, onFailure);
  }

  discardData(x, y, onSuccess, onFailure) {
    this.ws.send(JSON.stringify({ trigger: 'discard-data', x, y }));
    this.waitOn('data-collected', onSuccess, onFailure);
  }

  finishCalibration(onSuccess, onFailure) {
    this.ws.send(JSON.stringify({ trigger: 'finish-calibration' }));
    this.waitOn('calibration-finished', onSuccess, onFailure);
  }

  parseUpdate(data) {
    if (!this.waiting) {
      return;
    }

    if (data.status === this.waitingOn) {
      this.onSuccess();
    } else {
      alert(data.status);
      this.onFailure();
    }
  }

  parseData(data) {
    console.log(data);
    if (data.userIsPresent === true) {
      if (!this.userIsPresent) {
        this.emit('presence', true);
        this.userIsPresent = true;
      }
      this.x = lowpass(this.x, data.x, this.filtering);
      this.y = lowpass(this.y, data.y, this.filtering);
      this.emit('position', this.x, this.y);
    } else if (this.userIsPresent) {
      this.emit('presence', false);
      this.userIsPresent = false;
    }
  }

  addSubscriber(subscriber) {
    this.subscribers.push(subscriber);
  }

  removeSubscriber(subscriber) {
    this.subscribers = this.subscribers.filter(s => s !== subscriber);
  }

  close() {
    this.ws.close();
  }
}

export default EyeTracker;

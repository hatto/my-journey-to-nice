var Format = class {
    constructor() {
    }

    getTotalDistance(activities) {
        let distance = 0;
        if (activities.length) {
          for (let item of activities) {
              distance += item.distance;
          }
        }
        return Math.round(distance/10, 2)/100;
    }

    getTotalTime(activities) {
        let time = 0;
        if (activities.length) {
          for (let item of activities) {
              time += item.moving_time;
          }
        }
        return time;
    }

    getTimeFormat(time) {
        if (time) {
            time = Math.floor(time/60);
        } else {
            time = 0;
        }
        let hours = Math.floor(time/60);
        let mins = time%60;
        mins = (mins < 10) ? "0"+mins : mins;
        let timeString = hours + ":" + mins;
        return timeString;
    }
}

module.exports = new Format();

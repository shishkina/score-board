class Widget {
  constructor(game) {
    this.baseUrl = 'http://statsapi.web.nhl.com';
    const {
      gamePk: id,
      link,
      gameData: {
        status: { abstractGameState },
        datetime: {
          dateTime,
          endDateTime,
        },
      },
      liveData: {
        linescore: {
          teams,
          currentPeriodTimeRemaining,
          currentPeriodOrdinal,
        },
      }
    } = game;

    this.status = abstractGameState;
    this.teams = teams;
    this.id = id;
    this.link = `${this.baseUrl}${link}`
    this.timeRemaining = currentPeriodTimeRemaining;
    this.period = currentPeriodOrdinal;
    this.startDateTime = dateTime;
    this.endDateTime = endDateTime;

    this.updateWidgetData = this.updateWidgetData.bind(this);
    this.getUpdatedGameData = this.getUpdatedGameData.bind(this);
    this.pollGameData = this.pollGameData.bind(this);
    this.nextPollTime = this.getNextPollTime();
    if (this.nextPollTime > 0) {
      setTimeout(this.pollGameData, this.nextPollTime);
    }
  }

  pollGameData () {
    while (!this.endDateTime) {
      this.interval = setInterval(this.updateWidgetData, 3000);
    }
    clearInterval(this.interval);
  }

  getNextPollTime () {
    const gameStartTime = new Date(this.startDateTime);
    const timeNow = new Date();
    const timeoutInMilliseconds = gameStartTime.getTime() - timeNow.getTime();
    return timeoutInMilliseconds;
  }

  async updateWidgetData () {
    const node = document.getElementById(this.id);
    const updatedGameData = await this.getUpdatedGameData();
    const updatedWidget = new Widget(updatedGameData);
    // render method returns a string, need to parse it into a DOM node to successfully replace existing node
    let doc = new DOMParser().parseFromString(updatedWidget.render(), 'text/html');
    node.parentNode.replaceChild(doc.body.firstChild, node);
  }

  async getUpdatedGameData () {
    const res = await fetch(this.link);
    const formattedResponse = await res.json();
    return formattedResponse;
  }

  getTeamScoreTempate (team) {
    return `
     <div class="team-container">
        <img src="https://via.placeholder.com/20.png/" class="team-logo"/>
        <div class="team-abbr">${team.team.abbreviation}</div>
        ${this.status !== 'Preview' ? `<div class="team-score">${team.goals}</div>` : ''}
     </div>
     `
  }

  getGameStatus() {
    return `
      <div class="scores__status-state">
        ${
          this.status === 'Live' ? `
          <span class="period">${this.period}</span>
          <span class="time-remaining">${this.timeRemaining}</span>
          `
          : `<span>${this.status}</span>
            ${ this.status === 'Preview' ? this.getformattedDate() : ''}
            `
        }
      </div>
    `;
  }

  getFormattedTimeZone (date) {
    c.toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2]
  }

  getformattedDate (startDateTime) {
    //source: https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
    let date = new Date(this.startDateTime);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;

    const formattedTimeZone = date.toLocaleTimeString('en-us',{ timeZoneName:'short' }).split(' ')[2];
    return `
      <span> ${strTime} </span>
      <span> ${formattedTimeZone} </span>
    `
  }

  render () {
    const homeTeamContainer = this.getTeamScoreTempate(this.teams.home);
    const awayTeamContainer = this.getTeamScoreTempate(this.teams.away);
    return `
      <li class="scores__list-item" id=${this.id}>
        <div class="scores__panel">
          ${[homeTeamContainer, awayTeamContainer].join('')}
        </div>
        ${this.getGameStatus()}
      </li>
    `;
  }
}

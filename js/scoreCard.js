class Widget {
  constructor(game) {
    const {
      gamePk: id,
      link,
      gameData: {
        status: { abstractGameState },
        datetime: { dateTime },
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
    this.link = `${baseUrl}${link}`
    this.timeRemaining = currentPeriodTimeRemaining;
    this.period = currentPeriodOrdinal;
    this.startDateTime = dateTime;
  }

  async updateWidgetData () {
    const node = document.getElementById(this.id);
    const updatedGameData = await this.getUpdatedGameData()
    const updatedWidget = new Widget(updatedGameData)

    node.parentNode.replaceChild(node, updatedWidget.render());
  }

  async getUpdatedGameData () {
    const res = await fetch(this.link);
    return await res.json();
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
          : `<span>${this.status}</span>`
        }
      </div>
    `;
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

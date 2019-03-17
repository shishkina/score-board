class ScoreCard {
  constructor(game) {
    const { teams } = game;
    this.status = game.status.abstractGameState;
    this.away = {};
    this.home = {};
  }

  setTeamData = async (team, teamData) => {
    this[team].score = teamData.score;
    this[team].name = teamData.team.name;

    //await  this.getTeamShortName(teamData.team.link).then(res => {
    // })

    // const {
    //   away: {
    //     team: { link: awayLink },
    //     score: awayTeamScore
    //   },
    //   home: {
    //     team: { link: homeLink },
    //     score: homeTeamScore
    //   },
    // } = teamsObj;
    // const awayName = await this.getTeamShortName(awayLink).then(res => {
    //   console.log( res, 'is this is ');
    // })
    // this.away = {
    //   name: this.getTeamShortName(awayLink),
    //   score: awayTeamScore
    // }
    // this.home = {
    //   name: this.getTeamShortName(homeLink),
    //   score: homeTeamScore
    // }
  }

  getTeamShortName = async (link) => {
    return await  fetch(`${baseUrl}${link}`).then(response => {
        response.json()
        .then(teamData => {
          return teamData.teams[0].abbreviation
        })
      })
    }

  createScoresBlock = (team) => {
    const logo = document.createElement('img');
    logo.setAttribute('src', 'https://via.placeholder.com/20.png/')
    const div = document.createElement('div');
    div.className = 'score-block';
    const name = document.createElement('div');
    name.className = 'team-name'
    name.innerHTML = team.name;
    name.prepend(logo);

    const score = document.createElement('div');
    score.className = 'team-score'
    score.innerHTML = team.score
    div.appendChild(name);
    div.appendChild(score);
    return div;
  }

  createCardElement = () => {
    const div = document.createElement('div');
    div.className = 'card_container';
    const away = this.createScoresBlock(this.away);
    const home = this.createScoresBlock(this.home)
    div.appendChild(away);
    div.appendChild(home);

    return div;
  }
}

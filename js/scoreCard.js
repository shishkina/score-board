class ScoreCard {
  constructor(game) {
    const { teams } = game;
    this.status = game.status.abstractGameState;
    this.gameLink = game.link;
    this.teamsData = {};
    this.setTeamData(teams);
  }

  checkStatus = () => {
    if (this.status === 'Live') setInterval(this.checkUpdateScore, 3000);
  }

  checkUpdateScore = () => {
    fetch(`${baseUrl}${this.gameLink}`)
    .then(res => res.json())
      .then(gamesData => {
        const keys = Object.keys(this.teamsData);
        keys.forEach(team => {
          if (gamesData.liveData.linescore.teams[team].goals !== this.teamsData[team].score) {
            this.teamsData[team].score = gamesData.liveData.linescore.teams[team].goals
            this.renderUpdateScore(this.teamsData[team].id, this.teamsData[team].score);
          }
        })
      });
  }

  renderUpdateScore = (id, score) => {
    console.log(document.getElementById(id));
    document.getElementById(id).innerHTML = score;
  }



  setTeamData = (teams) => {
    const cardTeams = Object.keys(teams);

    cardTeams.forEach(team => {
      console.log(teams[team]);
    // const name = this.getTeamShortName(teams[team].team.link)
    this.teamsData[team] = {
      id: teams[team].team.id,
      score: teams[team].score,
      name: teams[team].team.name,
      link: teams[team].team.link,

    }
      // return {
      //   team,
      //   score: teams[team].score,
      //   name: teams[team].team.name
      // }
    })
    //this.getTeamShortName(teamData.team.link).then(res => {
    //   console.log(res, 'res!!');
      // this[team].name = teamData.team.name;

    //})
  }

  // not resolving
  getTeamShortName = (link) => {
    const abbreviation = fetch(`${baseUrl}${link}`).then(response => {
        response.json()
        .then(teamData => {
          console.log(teamData.teams[0].abbreviation);
          return teamData.teams[0].abbreviation
        })
      });
      console.log(abbreviation);
    return abbreviation
  }
  createStatus = () => {
    const div = document.createElement('div');
    div.className = 'scores__status-state';
    div.innerHTML = this.status;
    return div;
  }

  createScoresBlock = (team) => {
    const logo = document.createElement('img');
    logo.setAttribute('src', 'https://via.placeholder.com/20.png/')
    const div = document.createElement('div');
    div.className = 'scores__panel';
    const name = document.createElement('div');
    name.className = 'team-name'
    name.innerHTML = team.name;
    name.prepend(logo);

    const score = document.createElement('div');
    score.className = 'team-score'
    score.setAttribute('id', team.id)
    score.innerHTML = team.score
    div.appendChild(name);
    div.appendChild(score);
    return div;
  }

  createCardElement = () => {
    const li = document.createElement('li');
    li.className = 'scores__list-item';
    const keys = Object.keys(this.teamsData);
    keys.forEach(team => {
      li.appendChild(this.createScoresBlock(this.teamsData[team]));
    })
    li.appendChild(this.createStatus());
    return li;
  }
}

window.onload = () => {
  console.log('loaded!');

  class App {
    constructor () {
      this.date = this.getFormattedDate();
      this.gamesData = [];
      this.cardsArray = [];
      this.shouldUpdateDate = false;
      this.isLive = false;
      this.shouldUpdateData = false;
    }
    // set date to yesterday intially to see scores of past games, then reset if the date changes or if the any game is live
    getFormattedDate = () => {
      const today = new Date();
      const dd = this.formatDate(today.getDate()) - 1;
      const month = today.getMonth() + 1;
      const mm = this.formatDate(month);
      const yyyy = today.getFullYear();
      return `${yyyy}-${mm}-${dd}`;
    }

    formatDate = (dayOrMonth) => {
      return dayOrMonth < 10 ? ('0' + dayOrMonth) : dayOrMonth;
    }

    getHours = () => {
      const date = new Date();
      return date.getHours();
    }

    getIsLive = () => {
      const hours = this.getHours();
      this.isLive = hours >= 7 && this.cardsArray.some(game => game.status === 'Live');
    }

    getShouldUpdateDate = () => {
      console.log('running', this.shouldUpdateDate, this.shouldUpdateData);
      const hours = this.getHours()
      if (hours === 0) this.shouldUpdateDate = true
    }

    getShouldUpdateData = () => {
      this.getIsLive();
      if (this.shouldUpdateDate || this.isLive) this.shouldUpdateData = true;
    }

    updateDate = () => {
      this.getShouldUpdateDate();
      if(this.shouldUpdateDate){
        this.date = this.getFormattedDate();
      }
    }

    updateData = () => {
      this.getShouldUpdateData();
      if(this.shouldUpdateData || !localStorage.getItem('scores-array')) {
        this.getData();
      }
    }

    getInitialData = () => {
    const scoresArray = localStorage.getItem('scores-array')
    const storageData = JSON.parse(scoresArray)

      if (!storageData) {
        this.getData()
          .then(response => { response.json()
            .then(json => {
              console.log(json);
              this.gamesData = json.dates[0].games;
              this.makeScoreCards();
              localStorage.setItem('scores-array', JSON.stringify(json.dates[0].games));
            })
        });
      }
      this.gamesData = storageData;
      this.cardsArray = this.makeScoreCards()
    }

    getData = async () => {
      const url = `${baseUrl}/api/v1/schedule?date=${this.date}`;
      console.log(url, 'this is url');
      return await fetch(url)
    }

    makeScoreCards = () => {
      return this.gamesData && this.gamesData.map(game => {
        const card = new ScoreCard(game);

        const cardTeams = Object.keys(game.teams)
        cardTeams.forEach(async (team) => {
          await card.setTeamData(team, game.teams[team])
        })
          return card
      });
    }

    renderScoreCards = () => {
      const container = document.getElementById('scores__list')
      this.cardsArray.map(card => {
        const el = card.createCardElement()
        container.appendChild(el)
      })
    }
  }
  const app = new App();
  app.getInitialData();
  console.log(app, 'this is app');
  app.renderScoreCards()

  setInterval(() => {
    app.updateDate();
    app.updateData();
  }, 3000);
}

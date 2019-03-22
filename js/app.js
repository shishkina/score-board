window.onload = () => {
  console.log('loaded!');

  class ScoreBoard {
    constructor() {
      this.baseUrl = 'http://statsapi.web.nhl.com';
    }


    renderGames (game) {
      const widget = new Widget(game);
      console.log(widget);
      return widget.render();
    }

    async init () {
      const url = this.getUrl();

      const gamesData = localStorage.getItem('all-games-array');
      let parsedGamesData = JSON.parse(gamesData);

      const lastDataUpdate = localStorage.getItem('last-update');
      const shouldUpdate = this.getFormattedDate() !== lastDataUpdate;

      if (!parsedGamesData || shouldUpdate) {
        const res = await fetch(url);
        const formattedResponse = await res.json();
        const games = formattedResponse.dates[0].games;
        const allGamesData = await Promise.all(games.map(game => fetch(`${this.baseUrl}${game.link}`)));
        parsedGamesData = await Promise.all(allGamesData.map(res => res.json()));

        const date = this.getFormattedDate()
        localStorage.setItem('all-games-array', JSON.stringify(parsedGamesData));
        localStorage.setItem('last-update', date);
      }

      const gamesList = parsedGamesData.map(game => this.renderGames(game));
      const wrapper = document.getElementById('scores__list')
      wrapper.innerHTML = gamesList.join('');
    }

    getUrl () {
      const date = this.getFormattedDate();
      return `${this.baseUrl}/api/v1/schedule?date=${date}`;
    }

    getFormattedDate () {
      const today = new Date();
      const dd = this.formatDayOrMonth(today.getDate());
      const month = today.getMonth() + 1;
      const mm = this.formatDayOrMonth(month);
      const yyyy = today.getFullYear();
      return `${yyyy}-${mm}-${dd}`;
    }

    formatDayOrMonth (dayOrMonth) {
      return dayOrMonth < 10 ? ('0' + dayOrMonth) : dayOrMonth;
    }
  }

  const board = new ScoreBoard();
  setInterval(board.init(), 1000 * 60 * 60);
}

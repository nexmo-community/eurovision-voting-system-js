const app = new Vue({
  el: '#app',
  async created() {
    if(localStorage.getItem('countries')) {
      this.countries = JSON.parse(localStorage.getItem('countries')) 
    } else {
      const countryResp = await fetch(this.baseURL + '/countries');
      const countries = await countryResp.json();
      this.countries = countries.map(country => {
        return { ...country, results: false, score: 0 }
      })
    }
  },
  data: {
    countries: [],
    toReveal: undefined,
    results: undefined,
    resultsCountry: undefined
  },
  computed: {
    leaderboard() {
      return this.countries.filter(c => c.final).sort((a, b) => b.score - a.score)
    },
    leftToReveal() {
      return this.countries.filter(c => !c.results)
    },
    baseURL() {
      if(location.hostname == 'localhost' || location.hostname == "127.0.0.1") {
        return "http://localhost:9000"
      }  else {
        return "https://eurovision-test.netlify.app/.netlify/functions"
      }
    },
    toRevealCountry() {
      const country = this.countries.find(c => c.iso == this.toReveal)
      return country.name
    }
  },
  methods: {
    async getScores() {
      // Get results
      const resultsResp = await fetch(this.baseURL + '/results?country=' + this.toReveal);
      this.results = await resultsResp.json();

      // Assign points to countries
      for(let result of this.results) {
        const country = this.countries.find(c => c.iso == result._id)
        country.score += result.points
      }

      // Remove item from results select
      const votingCountry = this.countries.find(c => c.iso == this.toReveal)
      votingCountry.results = true
      
      // Show country name in results pane
      this.resultsCountry = votingCountry.name

      // Store locally in case of refresh
      localStorage.setItem('countries', JSON.stringify(this.countries))
    }
  }
})
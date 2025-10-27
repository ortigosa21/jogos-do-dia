import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const response = await fetch('https://api.sportmonks.com/v3/football/fixtures', {
        headers: {
          'Authorization': 'Bearer SEU_TOKEN_AQUI',
        },
      });
      const data = await response.json();
      setGames(data.data);
    };

    fetchGames();
  }, []);

  const leagues = {
    39: 'Premier League',
    140: 'La Liga',
    135: 'Serie A',
    78: 'Bundesliga',
    71: 'Brasileirão Série A',
    72: 'Brasileirão Série B',
    2: 'Champions League',
    3: 'Libertadores',
  };

  const getLeagueName = (leagueId) => leagues[leagueId] || 'Liga Desconhecida';

  const getCountryFlag = (leagueId) => {
    const countryFlags = {
      39: '🇬🇧', // Premier League
      140: '🇪🇸', // La Liga
      135: '🇮🇹', // Serie A
      78: '🇩🇪', // Bundesliga
      71: '🇧🇷', // Brasileirão Série A
      72: '🇧🇷', // Brasileirão Série B
      2: '🇪🇺',  // Champions League
      3: '🇪🇺',  // Libertadores
    };
    return countryFlags[leagueId] || '🏳️';
  };

  return (
    <div className="App">
      <h1>Jogos do Dia</h1>
      <div className="games-container">
        {games.map((game) => {
          const leagueName = getLeagueName(game.league_id);
          const countryFlag = getCountryFlag(game.league_id);
          const homeTeam = game.localTeam.data.name;
          const awayTeam = game.visitorTeam.data.name;
          const matchTime = new Date(game.time.starting_at).toLocaleTimeString();

          return (
            <div className="game-card" key={game.id}>
              <div className="game-header">
                <span className="country-flag">{countryFlag}</span>
                <span className="league-name">{leagueName}</span>
              </div>
              <div className="teams">
                <span className="team-name">{homeTeam}</span> vs <span className="team-name">{awayTeam}</span>
              </div>
              <div className="match-time">{matchTime}</div>
              <div className="tv-channels">
                {game.tvStations && game.tvStations.map((channel, index) => (
                  <span key={index} className="tv-channel">{channel.name}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;

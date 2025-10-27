import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiToken = "JNzNoDErzBVwLPCht6NZssRcroMFqPSYxL1HEejGiM0dJRrB6YHbj4oCOmo8";

  // IDs das ligas + bandeira
  const leaguesInfo = {
    1958: { name: "Premier League", flag: "https://flagcdn.com/w40/gb.png" },
    1843: { name: "Bundesliga", flag: "https://flagcdn.com/w40/de.png" },
    564: { name: "LaLiga", flag: "https://flagcdn.com/w40/es.png" },
    197: { name: "Serie A (Itália)", flag: "https://flagcdn.com/w40/it.png" },
    271: { name: "Brasileirão Série A", flag: "https://flagcdn.com/w40/br.png" },
    273: { name: "Brasileirão Série B", flag: "https://flagcdn.com/w40/br.png" },
  };

  const leagueIds = Object.keys(leaguesInfo).map(Number);
  const today = new Date().toISOString().split("T")[0];
  const formattedDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const url = `https://api.sportmonks.com/v3/football/fixtures/date/${today}?api_token=${apiToken}&include=participants;league;venue;tvstations`;
        const response = await fetch(url);
        const data = await response.json();

        if (data?.data) {
          const filtered = data.data.filter((match) =>
            leagueIds.includes(match.league_id)
          );
          setMatches(filtered);
        } else {
          setMatches([]);
        }
      } catch (err) {
        setError("Erro ao carregar os jogos");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">⚽ Jogos do Dia</h1>
        <div className="date-banner">📅 {formattedDate}</div>
      </header>

      {loading && <p className="info">Carregando partidas...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && matches.length === 0 && (
        <p className="info">Nenhum jogo encontrado hoje.</p>
      )}

      <div className="cards-container">
        {matches.map((match) => {
          const home = match.participants.find((p) => p.meta.location === "home");
          const away = match.participants.find((p) => p.meta.location === "away");
          const league = leaguesInfo[match.league_id];
          const tv =
            match.tvstations && match.tvstations.length > 0
              ? match.tvstations.map((t) => t.name).join(", ")
              : "Não informado";

          return (
            <div className="card" key={match.id}>
              <div className="league-info">
                {league && (
                  <>
                    <img
                      src={league.flag}
                      alt={league.name}
                      className="flag"
                    />
                    <span>{league.name}</span>
                  </>
                )}
              </div>

              <div className="teams">
                <div className="team">
                  {home?.image_path && (
                    <img src={home.image_path} alt={home.name} className="logo" />
                  )}
                  <span>{home?.name}</span>
                </div>
                <span className="vs">vs</span>
                <div className="team">
                  {away?.image_path && (
                    <img src={away.image_path} alt={away.name} className="logo" />
                  )}
                  <span>{away?.name}</span>
                </div>
              </div>

              <div className="details">
                <p className="time">
                  🕒{" "}
                  {new Date(match.starting_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="tv">📺 {tv}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

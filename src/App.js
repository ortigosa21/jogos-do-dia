import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Token e Ligas desejadas
  const apiToken = "JNzNoDErzBVwLPCht6NZssRcroMFqPSYxL1HEejGiM0dJRrB6YHbj4oCOmo8";
  const leagues = [
    1958, // Premier League (Inglaterra)
    1843, // Bundesliga (Alemanha)
    564,  // LaLiga (Espanha)
    197,  // Serie A (Itália)
    271,  // Brasileiro Série A
    273,  // Brasileiro Série B
  ];

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const url = `https://api.sportmonks.com/v3/football/fixtures/date/${today}?api_token=${apiToken}&include=participants;league;venue;tvstations`;
        const response = await fetch(url);
        const data = await response.json();

        if (data?.data) {
          const filtered = data.data.filter(
            (match) => leagues.includes(match.league_id)
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
      <h1 className="title">⚽ Jogos do Dia</h1>

      {loading && <p className="info">Carregando partidas...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && matches.length === 0 && (
        <p className="info">Nenhum jogo encontrado hoje.</p>
      )}

      <div className="cards-container">
        {matches.map((match) => {
          const home = match.participants.find((p) => p.meta.location === "home");
          const away = match.participants.find((p) => p.meta.location === "away");
          const tv =
            match.tvstations && match.tvstations.length > 0
              ? match.tvstations.map((t) => t.name).join(", ")
              : "Não informado";

          return (
            <div className="card" key={match.id}>
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
                <p className="league">{match.league?.name}</p>
                <p className="time">
                  Horário:{" "}
                  {new Date(match.starting_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="tv">Transmissão: {tv}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

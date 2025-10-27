import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Token da API Sportmonks
  const apiToken = "JNzNoDErzBVwLPCht6NZssRcroMFqPSYxL1HEejGiM0dJRrB6YHbj4oCOmo8";
  const today = new Date().toISOString().split("T")[0];

  // IDs das ligas que vamos puxar
  const leagueIds = [78, 39, 140, 71, 72, 135, 2, 3]; // Bundesliga, Premier, La Liga, Brasileirão A, B, Serie A, Champions, Libertadores

  // Map de nomes das ligas e bandeiras
  const leagueMap = {
    78: { name: "Bundesliga", flag: "🇩🇪" },
    39: { name: "Premier League", flag: "🇬🇧" },
    140: { name: "La Liga", flag: "🇪🇸" },
    71: { name: "Brasileirão Série A", flag: "🇧🇷" },
    72: { name: "Brasileirão Série B", flag: "🇧🇷" },
    135: { name: "Serie A (Itália)", flag: "🇮🇹" },
    2: { name: "Champions League", flag: "🏆" },
    3: { name: "Libertadores", flag: "🏆" },
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        let allGames = [];

        for (const leagueId of leagueIds) {
          try {
            const res = await fetch(
              `https://soccer.sportmonks.com/api/v3/fixtures/league/${leagueId}/next/100?api_token=${apiToken}&include=localTeam,visitorTeam,tvstations,league`
            );
            const data = await res.json();

            if (data.data && Array.isArray(data.data)) {
              const todaysGames = data.data.filter(
                (game) => game.time?.starting_at?.date === today
              );
              allGames = allGames.concat(todaysGames);
            }
          } catch (innerErr) {
            console.warn(`Erro na liga ${leagueId}:`, innerErr);
          }
        }

        setGames(allGames);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading)
    return <div style={styles.centered}>Carregando jogos...</div>;
  if (error) return <div style={styles.centered}>Erro: {error}</div>;
  if (games.length === 0)
    return <div style={styles.centered}>Nenhum jogo encontrado hoje.</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Jogos do Dia</h1>
      <div style={styles.gamesArea}>
        {games.map((game) => (
          <div
            key={`${game.id}-${game.localTeam.data.id}-${game.visitorTeam.data.id}`}
            style={styles.card}
          >
            <div style={styles.teams}>
              <div style={styles.team}>
                {game.localTeam.data.logo_path && (
                  <img
                    src={game.localTeam.data.logo_path}
                    alt={game.localTeam.data.name}
                    style={styles.logo}
                  />
                )}
                {game.localTeam.data.name}
              </div>
              <span style={styles.vs}>vs</span>
              <div style={styles.team}>
                {game.visitorTeam.data.logo_path && (
                  <img
                    src={game.visitorTeam.data.logo_path}
                    alt={game.visitorTeam.data.name}
                    style={styles.logo}
                  />
                )}
                {game.visitorTeam.data.name}
              </div>
            </div>

            <div style={styles.league}>
              {leagueMap[game.league_id]?.flag} {leagueMap[game.league_id]?.name}
            </div>

            <div style={styles.time}>
              Horário:{" "}
              {new Date(game.time.starting_at.date_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            <div style={styles.tvSection}>
              <strong>Transmissão:</strong>{" "}
              {game.tvstations?.data?.length > 0 ? (
                <ul style={styles.tvList}>
                  {game.tvstations.data
                    .filter((tv) =>
                      tv.tvstation.match(/[A-Za-z]/)
                    )
                    .map((station) => (
                      <li key={station.tvstation}>{station.tvstation}</li>
                    ))}
                </ul>
              ) : (
                <span style={styles.noTv}>Sem transmissão disponível</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    maxWidth: "1000px",
    margin: "20px auto",
    padding: "0 15px",
    backgroundColor: "#1A237E",
    minHeight: "100vh",
    color: "#FDD835",
  },
  title: {
    textAlign: "center",
    fontSize: "3rem",
    marginBottom: "30px",
    color: "#FDD835",
  },
  gamesArea: {
    backgroundColor: "#3949AB",
    padding: "20px",
    borderRadius: "20px",
  },
  card: {
    backgroundColor: "#5C6BC0",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
    marginBottom: "20px",
    color: "#FFFFFF",
  },
  teams: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
    gap: "15px",
    marginBottom: "10px",
  },
  team: { display: "flex", alignItems: "center", gap: "10px" },
  logo: { width: "40px", height: "40px", objectFit: "contain" },
  vs: { color: "#E53935", fontWeight: "bold", fontSize: "1.5rem" },
  league: { textAlign: "center", fontStyle: "italic", marginBottom: "10px" },
  time: { textAlign: "center", marginBottom: "10px", fontWeight: "bold" },
  tvSection: { textAlign: "center", marginTop: "5px" },
  tvList: { listStyleType: "none", padding: 0, margin: "5px 0" },
  noTv: { color: "#FFCC80", fontStyle: "italic" },
  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontFamily: "'Arial', sans-serif",
    color: "#FFFFFF",
    backgroundColor: "#1A237E",
  },
};

import { useEffect, useState } from "react";

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔑 Token direto (GitHub Pages não suporta .env)
  const apiToken = "JNzNoDErzBVwLPCht6NZssRcroMFqPSYxL1HEejGiM0dJRrB6YHbj4oCOmo8";

  // Ligas: Bundesliga, Premier League, La Liga, Brasileirão A, Brasileirão B, Serie A (Itália)
  const leagueIds = [8, 1, 564, 271, 302, 384];

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    async function fetchGames() {
      try {
        let allGames = [];

        for (const leagueId of leagueIds) {
          const url = `https://soccer.sportmonks.com/api/v2.0/fixtures/date/${today}?api_token=${apiToken}&include=localTeam,visitorTeam,league,tvstations&leagues=${leagueId}`;
          const res = await fetch(url);
          const data = await res.json();

          if (data.data && Array.isArray(data.data)) {
            allGames = allGames.concat(data.data);
          }
        }

        setGames(allGames);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  if (loading)
    return <div style={styles.centered}>Carregando jogos...</div>;
  if (error)
    return <div style={styles.centered}>Erro: {error}</div>;
  if (games.length === 0)
    return <div style={styles.centered}>Nenhum jogo encontrado hoje.</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Jogos do Dia</h1>
      <div style={styles.gamesArea}>
        {games.map((game) => (
          <div key={game.id} style={styles.card}>
            <div style={styles.teams}>
              <div style={styles.team}>
                {game.localTeam?.data?.logo_path && (
                  <img
                    src={game.localTeam.data.logo_path}
                    alt={game.localTeam.data.name}
                    style={styles.logo}
                  />
                )}
                {game.localTeam?.data?.name}
              </div>
              <span style={styles.vs}>vs</span>
              <div style={styles.team}>
                {game.visitorTeam?.data?.logo_path && (
                  <img
                    src={game.visitorTeam.data.logo_path}
                    alt={game.visitorTeam.data.name}
                    style={styles.logo}
                  />
                )}
                {game.visitorTeam?.data?.name}
              </div>
            </div>
            <div style={styles.league}>{game.league?.data?.name}</div>
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
                  {game.tvstations.data.map((station) => (
                    <li key={station.id}>{station.tvstation}</li>
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
    backgroundColor: "#0D47A1", // Azul escuro
    minHeight: "100vh",
    color: "#FFEB3B", // Amarelo
  },
  title: {
    textAlign: "center",
    fontSize: "3rem",
    marginBottom: "30px",
    color: "#FFEB3B",
  },
  gamesArea: {
    backgroundColor: "#1976D2",
    padding: "20px",
    borderRadius: "20px",
  },
  card: {
    backgroundColor: "#2196F3",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
    marginBottom: "20px",
    color: "#FFF",
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
  noTv: { color: "#FFE082", fontStyle: "italic" },
  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontFamily: "'Arial', sans-serif",
    color: "#FFF",
    backgroundColor: "#0D47A1",
  },
};

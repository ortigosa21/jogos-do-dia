import { useEffect, useState } from "react";

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiToken = "269f214a6b837d108a9f7f20072b65a6"; // Sua API-Football
  const today = new Date().toISOString().split("T")[0];

  const leagues = [
    { id: 71, name: "Brasileirão Série A", country: "Brasil", flag: "🇧🇷" },
    { id: 72, name: "Brasileirão Série B", country: "Brasil", flag: "🇧🇷" },
    { id: 2, name: "Champions League", country: "UEFA", flag: "🇪🇺" },
    { id: 3, name: "Libertadores", country: "CONMEBOL", flag: "🌎" },
    { id: 8, name: "Premier League", country: "Inglaterra", flag: "🏴" },
    { id: 9, name: "La Liga", country: "Espanha", flag: "🇪🇸" },
    { id: 11, name: "Bundesliga", country: "Alemanha", flag: "🇩🇪" },
    { id: 12, name: "Serie A", country: "Itália", flag: "🇮🇹" }
  ];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        let allGames = [];
        for (const league of leagues) {
          const res = await fetch(
            `https://v3.football.api-sports.io/fixtures?league=${league.id}&season=2025&from=${today}&to=${today}`,
            { headers: { "x-apisports-key": apiToken } }
          );
          const data = await res.json();
          if (data.response && data.response.length > 0) {
            allGames = allGames.concat(data.response.map(g => ({ ...g, league })));
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

  if (loading) return <div style={styles.centered}>Carregando jogos...</div>;
  if (error) return <div style={styles.centered}>Erro: {error}</div>;
  if (games.length === 0) return <div style={styles.centered}>Nenhum jogo encontrado hoje.</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Jogos do Dia</h1>
      <div style={styles.gamesArea}>
        {games.map(game => (
          <div key={game.fixture.id} style={styles.card}>
            <div style={styles.teams}>
              <div style={styles.team}>
                {game.teams.home.logo && <img src={game.teams.home.logo} alt={game.teams.home.name} style={styles.logo} />}
                {game.teams.home.name}
              </div>
              <span style={styles.vs}>vs</span>
              <div style={styles.team}>
                {game.teams.away.logo && <img src={game.teams.away.logo} alt={game.teams.away.name} style={styles.logo} />}
                {game.teams.away.name}
              </div>
            </div>
            <div style={styles.league}>
              {game.league.flag} {game.league.name}
            </div>
            <div style={styles.time}>
              Horário: {new Date(game.fixture.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            {game.fixture.tv && game.fixture.tv.length > 0 && (
              <div style={styles.tvSection}>
                <strong>Transmissão:</strong>
                <ul style={styles.tvList}>
                  {game.fixture.tv.map(channel => <li key={channel}>{channel}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { fontFamily: "Arial, sans-serif", maxWidth: "1000px", margin: "20px auto", padding: "0 15px", backgroundColor: "#1A237E", minHeight: "100vh", color: "#FDD835" },
  title: { textAlign: "center", fontSize: "3rem", marginBottom: "30px", color: "#FDD835" },
  gamesArea: { backgroundColor: "#3949AB", padding: "20px", borderRadius: "20px" },
  card: { backgroundColor: "#5C6BC0", padding: "20px", borderRadius: "15px", boxShadow: "0 6px 15px rgba(0,0,0,0.2)", marginBottom: "20px", color: "#FFFFFF" },
  teams: { display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem", fontWeight: "bold", gap: "15px", marginBottom: "10px" },
  team: { display: "flex", alignItems: "center", gap: "10px" },
  logo: { width: "40px", height: "40px", objectFit: "contain" },
  vs: { color: "#E53935", fontWeight: "bold", fontSize: "1.5rem" },
  league: { textAlign: "center", fontStyle: "italic", marginBottom: "10px" },
  time: { textAlign: "center", marginBottom: "10px", fontWeight: "bold" },
  tvSection: { textAlign: "center", marginTop: "5px" },
  tvList: { listStyleType: "none", padding: 0, margin: "5px 0" },
  centered: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "Arial, sans-serif", color: "#FFFFFF", backgroundColor: "#1A237E" }
};

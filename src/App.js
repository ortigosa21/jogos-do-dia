import { useEffect, useState } from "react";

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiToken = "c4dbd3ce7bc383b06c1ede5df9671567"; // sua chave da API-Football
  const today = new Date().toISOString().split("T")[0];

  const leagueIds = [78, 39, 140, 71, 74, 135, 2, 3];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        let allGames = [];

        for (const leagueId of leagueIds) {
          const res = await fetch(
            `https://v3.football.api-sports.io/fixtures?league=${leagueId}&date=${today}`,
            {
              headers: {
                "x-apisports-key": apiToken
              }
            }
          );

          if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
          const data = await res.json();
          allGames = allGames.concat(data.response || []);
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

  // 🔎 Função para priorizar canais brasileiros
  const canaisBrasileiros = (lista) => {
    if (!lista || lista.length === 0) return [];

    const canaisBR = lista.filter((canal) =>
      canal.toLowerCase().includes("br") ||
      canal.toLowerCase().includes("sportv") ||
      canal.toLowerCase().includes("globo") ||
      canal.toLowerCase().includes("premiere")
    );

    return canaisBR.length > 0 ? canaisBR.slice(0, 2) : lista.slice(0, 2);
  };

  if (loading) return <div className="centered">Carregando jogos...</div>;
  if (error) return <div className="centered">Erro: {error}</div>;
  if (games.length === 0) return <div className="centered">Nenhum jogo encontrado hoje.</div>;

  return (
    <div className="container">
      <h1>Jogos do Dia</h1>
      <div className="gamesArea">
        {games.map((game) => (
          <div key={game.fixture.id} className="card">
            <div className="teams">
              <div className="team">
                {game.teams.home.logo && (
                  <img src={game.teams.home.logo} alt={game.teams.home.name} className="logo" />
                )}
                {game.teams.home.name}
              </div>
              <span className="vs">vs</span>
              <div className="team">
                {game.teams.away.logo && (
                  <img src={game.teams.away.logo} alt={game.teams.away.name} className="logo" />
                )}
                {game.teams.away.name}
              </div>
            </div>

            <div className="league">
              {game.league.flag && (
                <img src={game.league.flag} alt={game.league.name} style={{ width: "20px", marginRight: "5px" }} />
              )}
              {game.league.name}
            </div>

            <div className="time">
              Horário:{" "}
              {new Date(game.fixture.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>

            <div className="tvSection">
              <strong>Transmissão:</strong>
              {game.fixture.tv && game.fixture.tv.length > 0 ? (
                <ul className="tvList">
                  {canaisBrasileiros(game.fixture.tv).map((canal, idx) => (
                    <li key={idx}>{canal}</li>
                  ))}
                </ul>
              ) : (
                <span className="noTv">Sem transmissão disponível</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

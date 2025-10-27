import { useEffect, useState } from "react";

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiToken = "9796f5d87d734b8ab3570714f67228ce";
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(
          `https://api.football-data.org/v4/matches?dateFrom=${today}&dateTo=${today}`,
          {
            headers: {
              "X-Auth-Token": apiToken
            }
          }
        );

        if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
        const data = await res.json();
        setGames(data.matches || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Função para filtrar canais brasileiros
  const getCanaisBrasileiros = (tvList) => {
    if (!tvList || tvList.length === 0) return [];

    const canaisBR = tvList.filter((canal) =>
      canal.toLowerCase().includes("br") ||
      canal.toLowerCase().includes("globo") ||
      canal.toLowerCase().includes("sportv") ||
      canal.toLowerCase().includes("premiere")
    );

    return canaisBR.length > 0 ? canaisBR.slice(0, 2) : tvList.slice(0, 2);
  };

  if (loading) return <div className="centered">Carregando jogos...</div>;
  if (error) return <div className="centered">Erro: {error}</div>;
  if (games.length === 0) return <div className="centered">Nenhum jogo encontrado hoje.</div>;

  return (
    <div className="container">
      <h1>Jogos do Dia</h1>
      <div className="gamesArea">
        {games.map((game) => (
          <div key={game.id} className="card">
            <div className="teams">
              <div className="team">{game.homeTeam.name}</div>
              <span className="vs">vs</span>
              <div className="team">{game.awayTeam.name}</div>
            </div>

            <div className="league">{game.competition.name}</div>

            <div className="time">
              Horário:{" "}
              {new Date(game.utcDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>

            <div className="status">
              Status: {game.status === "FINISHED" ? "Encerrado" : game.status}
            </div>

            {/* Se a API Football-Data.org não tiver canais, substitua por sua fonte anterior */}
            {game.tv && game.tv.length > 0 && (
              <div className="tvSection">
                <strong>Transmissão:</strong>
                <ul className="tvList">
                  {getCanaisBrasileiros(game.tv).map((channel, idx) => (
                    <li key={idx}>{channel}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

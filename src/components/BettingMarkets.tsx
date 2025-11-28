import { useState, useEffect } from 'react';
import { fetchLiveOdds, convertOddsToMatches } from '../lib/odds-api';
import { SportsMenu } from './SportsMenu';

export function BettingMarkets({ onAddBet, selectedBets }) {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);

  useEffect(() => {
    loadMatches();
  }, [selectedSport, selectedLeague]);

  const loadMatches = async () => {
    const sportKey = selectedSport || 'upcoming';
    const data = await fetchLiveOdds(sportKey, selectedLeague || undefined);
    setMatches(convertOddsToMatches(data));
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* --- Dropdown for Sport + League --- */}
      <div className="bg-white/10 p-4 rounded-lg w-full max-w-md">
        <SportsMenu
          onSelectSport={(sport) => setSelectedSport(sport)}
          onSelectLeague={(league) => setSelectedLeague(league)}
        />
      </div>

      {/* --- Matches List --- */}
      <div className="flex flex-col gap-4">
        {matches.length === 0 ? (
          <p className="text-white/80">No upcoming matches for this selection</p>
        ) : (
          matches.map((match) => (
            <div
              key={match.id}
              className="p-4 bg-white/5 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="text-white font-semibold">
                  {match.homeTeam} vs {match.awayTeam}
                </p>
                <p className="text-white/70 text-sm">{match.sport} • {match.startTime}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    onAddBet({
                      id: match.id,
                      team: match.homeTeam,
                      odds: match.homeOdds,
                      amount: 0,
                      sport: match.sport,
                      match: `${match.homeTeam} vs ${match.awayTeam}`,
                      type: 'home',
                    })
                  }
                  className="bg-purple-600 px-3 py-1 rounded-lg text-white hover:bg-purple-700"
                >
                  {match.homeOdds}
                </button>
                <button
                  onClick={() =>
                    onAddBet({
                      id: match.id,
                      team: match.awayTeam,
                      odds: match.awayOdds,
                      amount: 0,
                      sport: match.sport,
                      match: `${match.homeTeam} vs ${match.awayTeam}`,
                      type: 'away',
                    })
                  }
                  className="bg-purple-600 px-3 py-1 rounded-lg text-white hover:bg-purple-700"
                >
                  {match.awayOdds}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

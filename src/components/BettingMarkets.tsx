import { useState, useEffect } from 'react';
import { Trophy, Flame, Target, RefreshCw } from 'lucide-react';
import { Bet } from './BettingApp';
import { fetchLiveOdds, convertOddsToMatches } from '../lib/odds-api';

interface Match {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeOdds: number;
  drawOdds: number | null;
  awayOdds: number;
  startTime: string;
  isLive?: boolean;
}

const mockMatches: Match[] = [
  {
    id: '1',
    sport: 'Soccer',
    league: 'Premier League',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    homeOdds: 2.45,
    drawOdds: 3.20,
    awayOdds: 2.80,
    startTime: '2 hours',
    isLive: false,
  },
  {
    id: '2',
    sport: 'Basketball',
    league: 'NBA',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    homeOdds: 1.85,
    drawOdds: null,
    awayOdds: 2.10,
    startTime: '4 hours',
    isLive: false,
  },
  {
    id: '3',
    sport: 'Soccer',
    league: 'La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    homeOdds: 2.15,
    drawOdds: 3.40,
    awayOdds: 3.25,
    startTime: 'Live',
    isLive: true,
  },
  {
    id: '4',
    sport: 'American Football',
    league: 'NFL',
    homeTeam: 'Patriots',
    awayTeam: 'Chiefs',
    homeOdds: 2.60,
    drawOdds: null,
    awayOdds: 1.65,
    startTime: '1 day',
    isLive: false,
  },
  {
    id: '5',
    sport: 'Soccer',
    league: 'Bundesliga',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    homeOdds: 1.75,
    drawOdds: 3.80,
    awayOdds: 4.20,
    startTime: '6 hours',
    isLive: false,
  },
];

interface BettingMarketsProps {
  onAddBet: (bet: Bet) => void;
  selectedBets: Bet[];
}

export function BettingMarkets({ onAddBet, selectedBets }: BettingMarketsProps) {
  const [filter, setFilter] = useState<'all' | 'live'>('all');
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [loading, setLoading] = useState(false);
  const [usingRealData, setUsingRealData] = useState(false);

  useEffect(() => {
    loadOdds();
  }, []);

  const loadOdds = async () => {
    setLoading(true);
    const oddsData = await fetchLiveOdds();
    
    if (oddsData.length > 0) {
      const convertedMatches = convertOddsToMatches(oddsData);
      setMatches(convertedMatches);
      setUsingRealData(true);
    } else {
      // Fallback to mock data if API fails
      setMatches(mockMatches);
      setUsingRealData(false);
    }
    setLoading(false);
  };

  const filteredMatches = filter === 'live' 
    ? matches.filter(m => m.isLive) 
    : matches;

  const isSelected = (matchId: string, type: 'home' | 'away' | 'draw') => {
    return selectedBets.some(bet => bet.id === `${matchId}-${type}`);
  };

  const handleBetClick = (match: Match, type: 'home' | 'away' | 'draw', odds: number, team: string) => {
    const bet: Bet = {
      id: `${match.id}-${type}`,
      team,
      odds,
      amount: 0,
      sport: match.sport,
      match: `${match.homeTeam} vs ${match.awayTeam}`,
      type,
    };
    onAddBet(bet);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            All Matches
          </button>
          <button
            onClick={() => setFilter('live')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              filter === 'live'
                ? 'bg-red-600 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <Flame className="w-4 h-4" />
            Live Now
          </button>
        </div>

        <div className="flex items-center gap-2">
          {!usingRealData && (
            <span className="text-yellow-400 text-sm">Mock Data</span>
          )}
          <button
            onClick={loadOdds}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
            title="Refresh odds"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {!usingRealData && (
        <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3 text-blue-400 text-sm">
          💡 Add your API key in <code>/lib/odds-api.ts</code> to get real sports odds from The Odds API
        </div>
      )}

      <div className="space-y-3">
        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-white/70 text-sm">{match.league}</span>
                <span className="text-white/50 text-sm">• {match.startTime}</span>
                {match.isLive && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-white">
                {match.homeTeam}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleBetClick(match, 'home', match.homeOdds, match.homeTeam)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    isSelected(match.id, 'home')
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {match.homeOdds.toFixed(2)}
                </button>
                
                {match.drawOdds && (
                  <button
                    onClick={() => handleBetClick(match, 'draw', match.drawOdds!, 'Draw')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      isSelected(match.id, 'draw')
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {match.drawOdds.toFixed(2)}
                  </button>
                )}
                
                <button
                  onClick={() => handleBetClick(match, 'away', match.awayOdds, match.awayTeam)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    isSelected(match.id, 'away')
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {match.awayOdds.toFixed(2)}
                </button>
              </div>
            </div>

            <div className="flex-1 text-white text-right mt-2">
              {match.awayTeam}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

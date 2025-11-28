// The Odds API Integration
// Get your free API key at: https://the-odds-api.com/
const ODDS_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ODDS_API_KEY) || '5134684df2aeb1b1fed5acfa9715e8f6';
const ODDS_API_BASE = 'https://api.the-odds-api.com/v4';

export interface OddsMatch {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

// Fetch live sports odds
export async function fetchLiveOdds(sport: string = 'upcoming'): Promise<OddsMatch[]> {
  // Check if API key is configured
  if (ODDS_API_KEY === '5134684df2aeb1b1fed5acfa9715e8f6') {
    console.log('ℹ️ The Odds API key not configured. Using mock data. Get your free key at https://the-odds-api.com/');
    return [];
  }

  try {
    const response = await fetch(
      `${ODDS_API_BASE}/sports/${sport}/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h&oddsFormat=decimal`,
      { method: 'GET' }
    );

    if (!response.ok) {
      console.log('The Odds API request failed. Using mock data.');
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Could not fetch odds from API. Using mock data.');
    return [];
  }
}

// Fetch available sports
export async function fetchSports() {
  if (ODDS_API_KEY === '5134684df2aeb1b1fed5acfa9715e8f6') {
    return [];
  }

  try {
    const response = await fetch(
      `${ODDS_API_BASE}/sports/?apiKey=${ODDS_API_KEY}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.log('Could not fetch sports from API');
    return [];
  }
}

// Convert API odds to app format
export function convertOddsToMatches(oddsData: OddsMatch[]) {
  return oddsData.map(match => {
    const bookmaker = match.bookmakers[0];
    const outcomes = bookmaker?.markets[0]?.outcomes || [];
    
    const homeOutcome = outcomes.find(o => o.name === match.home_team);
    const awayOutcome = outcomes.find(o => o.name === match.away_team);
    const drawOutcome = outcomes.find(o => o.name === 'Draw');

    const now = new Date();
    const commenceTime = new Date(match.commence_time);
    const hoursUntil = Math.floor((commenceTime.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    let timeDisplay = '';
    if (hoursUntil < 0) {
      timeDisplay = 'Live';
    } else if (hoursUntil < 24) {
      timeDisplay = `${hoursUntil} hours`;
    } else {
      timeDisplay = `${Math.floor(hoursUntil / 24)} days`;
    }

    return {
      id: match.id,
      sport: match.sport_title,
      league: match.sport_title,
      homeTeam: match.home_team,
      awayTeam: match.away_team,
      homeOdds: homeOutcome?.price || 2.0,
      drawOdds: drawOutcome?.price || null,
      awayOdds: awayOutcome?.price || 2.0,
      startTime: timeDisplay,
      isLive: hoursUntil < 0,
    };
  });
}

import { useState } from "react";
import { SPORTS } from "./sports-data";

interface SportsMenuProps {
  onSelectSport?: (sport: string) => void;
  onSelectLeague?: (league: string) => void;
}

export function SportsMenu({ onSelectSport, onSelectLeague }: SportsMenuProps) {
  const [openSport, setOpenSport] = useState<string | null>(null);

  const toggleSport = (sportId: string) => {
    const next = openSport === sportId ? null : sportId;
    setOpenSport(next);
    onSelectSport?.(sportId);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {SPORTS.map((sport) => (
        <div key={sport.id}>
          {/* Sport Button */}
          <button
            onClick={() => toggleSport(sport.id)}
            className="w-full flex items-center justify-between p-4
                       bg-white/10 hover:bg-white/20 text-white rounded-lg"
          >
            <span className="flex items-center gap-3">
              <img src={sport.logo} alt={sport.name} className="w-8 h-8" />
              <span className="text-lg">{sport.name}</span>
            </span>
            <span>{openSport === sport.id ? "▲" : "▼"}</span>
          </button>

          {/* Dropdown Leagues */}
          {openSport === sport.id && (
            <div className="mt-2 ml-8 flex flex-col gap-2">
              {sport.leagues.map((league) => (
                <button
                  key={league}
                  onClick={() => onSelectLeague?.(league)}
                  className="text-white/80 hover:text-white text-left"
                >
                  • {league}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

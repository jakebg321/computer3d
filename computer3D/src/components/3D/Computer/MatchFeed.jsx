// src/components/3D/Computer/MatchFeed.jsx
const MatchFeed = ({ matches }) => {
    return (
      <div className="match-feed">
        <h3>Live Match Feed ⚡</h3>
        <div className="matches-list">
          {matches.map((match, idx) => (
            <MatchItem key={idx} match={match} isLatest={idx === 0} />
          ))}
        </div>
      </div>
    );
  };
  
  const MatchItem = ({ match, isLatest }) => {
    return (
      <div className={`match-item ${isLatest ? 'latest' : ''}`}>
        <div className="value">{match.coin.name}</div>
        <div className="section-label">
          {match.meme.name} • Score: {match.meme.matchScore}
        </div>
        <div className={match.price.changes.h24 >= 0 ? 'percentage-positive' : 'percentage-negative'}>
          {match.price.changes.h24}%
        </div>
      </div>
    );
  };
  
  export default MatchFeed;
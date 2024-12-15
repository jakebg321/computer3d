// src/components/3D/Computer/TokenDetails.jsx
import { formatNumberWithSuffix } from '../../../utils/coinDisplayUtils';

const TokenDetails = ({ coin }) => {
  if (!coin) return null;
  
  return (
    <div className="token-details">
      {/* Basic Info Section */}
      <div className="details-section">
        <div className="details-header">Basic Info</div>
        <div className="details-grid">
          <span className="detail-label">Name</span>
          <span className="detail-value">{coin.coin.name}</span>
          <span className="detail-label">Symbol</span>
          <span className="detail-value">{coin.coin.symbol}</span>
          <span className="detail-label">Chain</span>
          <span className="detail-value">{coin.coin.chain}</span>
        </div>
      </div>

      {/* Performance Section */}
      <div className="details-section">
        <div className="details-header">Performance</div>
        <div className="details-grid">
          <span className="detail-label">1h</span>
          <span className="detail-value">{coin.price.changes.h1}%</span>
          <span className="detail-label">6h</span>
          <span className="detail-value">{coin.price.changes.h6}%</span>
          <span className="detail-label">24h</span>
          <span className="detail-value">{coin.price.changes.h24}%</span>
        </div>
      </div>

      {/* Volume Section */}
      <div className="details-section">
        <div className="details-header">Volume</div>
        <div className="details-grid">
          <span className="detail-label">1h</span>
          <span className="detail-value">${coin.volume.h1}</span>
          <span className="detail-label">6h</span>
          <span className="detail-value">${coin.volume.h6}</span>
          <span className="detail-label">24h</span>
          <span className="detail-value">${coin.volume.h24}</span>
        </div>
      </div>
    </div>
  );
};
export default TokenDetails;
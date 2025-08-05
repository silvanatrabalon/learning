import './ProgressBar.css'

function ProgressBar({ current, total, correct }) {
  const progress = (current / total) * 100
  const accuracy = current > 0 ? (correct / current) * 100 : 0

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-text">Progress</span>
        <span className="progress-numbers">{current}/{total}</span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {current > 0 && (
        <div className="accuracy-info">
          <div className="accuracy-bar">
            <div 
              className="accuracy-fill"
              style={{ width: `${accuracy}%` }}
            />
          </div>
          <span className="accuracy-text">
            Accuracy: {Math.round(accuracy)}%
          </span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar

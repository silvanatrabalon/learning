import { Link } from 'react-router-dom'
import './DetailedReport.css'

function DetailedReport({ sessionReport, topics, language, onRestartSession, onNewSession }) {

  const getTexts = () => {
    const texts = {
      en: {
        sessionComplete: 'Mixed Session Complete!',
        overallScore: 'Overall Score',
        excellent: 'Excellent Performance! 🌟',
        good: 'Good Performance! 👏',
        needsWork: 'Keep Practicing! 💪',
        topicBreakdown: 'Topic Breakdown',
        questions: 'questions',
        accuracy: 'accuracy',
        strongAreas: 'Strong Areas',
        areasToImprove: 'Areas to Improve',
        recommendations: 'Recommendations',
        tryAgain: '🔄 Try Again',
        newSession: '🎯 New Mixed Session',
        studyMore: '📚 Study Individual Topics'
      },
      es: {
        sessionComplete: '¡Sesión Mixta Completa!',
        overallScore: 'Puntuación General',
        excellent: '¡Excelente Desempeño! 🌟',
        good: '¡Buen Desempeño! 👏',
        needsWork: '¡Sigue Practicando! 💪',
        topicBreakdown: 'Desglose por Tema',
        questions: 'preguntas',
        accuracy: 'precisión',
        strongAreas: 'Áreas Fuertes',
        areasToImprove: 'Áreas a Mejorar',
        recommendations: 'Recomendaciones',
        tryAgain: '🔄 Intentar de Nuevo',
        newSession: '🎯 Nueva Sesión Mixta',
        studyMore: '📚 Estudiar Temas Individuales'
      }
    }
    
    return texts[language] || texts.en
  }

  const texts = getTexts()

  const getScoreMessage = () => {
    const percentage = sessionReport.overallScore
    if (percentage >= 80) return texts.excellent
    if (percentage >= 60) return texts.good
    return texts.needsWork
  }

  const getTopicName = (topicId) => {
    const topic = topics.find(t => t.id === topicId)
    return topic ? topic.name : topicId
  }

  const getTopicIcon = (topicId) => {
    const topic = topics.find(t => t.id === topicId)
    return topic ? topic.icon : '📚'
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#48bb78'
    if (percentage >= 60) return '#ed8936'
    return '#f56565'
  }

  const strongAreas = Object.entries(sessionReport.topics)
    .filter(([_, data]) => data.percentage >= 70)
    .sort((a, b) => b[1].percentage - a[1].percentage)

  const areasToImprove = Object.entries(sessionReport.topics)
    .filter(([_, data]) => data.percentage < 70)
    .sort((a, b) => a[1].percentage - b[1].percentage)

  return (
    <div className="detailed-report">
      <div className="report-header">
        <h1>{texts.sessionComplete}</h1>
        <div className="overall-score">
          <div className="score-circle">
            <div className="score-number">{sessionReport.overallScore}%</div>
            <div className="score-label">{texts.overallScore}</div>
          </div>
          <div className="score-message">
            <p>{getScoreMessage()}</p>
            <div className="score-stats">
              <span>{sessionReport.totalCorrect}/{sessionReport.totalQuestions} {texts.questions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Breakdown */}
      <div className="topic-breakdown">
        <h2>{texts.topicBreakdown}</h2>
        <div className="topics-grid">
          {Object.entries(sessionReport.topics).map(([topicId, data]) => (
            <div key={topicId} className="topic-result-card">
              <div className="topic-header">
                <span className="topic-icon">{getTopicIcon(topicId)}</span>
                <span className="topic-name">{getTopicName(topicId)}</span>
              </div>
              <div className="topic-score">
                <div 
                  className="score-bar"
                  style={{ 
                    background: `linear-gradient(90deg, ${getScoreColor(data.percentage)} ${data.percentage}%, #e2e8f0 ${data.percentage}%)` 
                  }}
                >
                  <span className="score-percentage">{data.percentage}%</span>
                </div>
                <div className="score-fraction">
                  {data.correct}/{data.total} {texts.questions}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="performance-analysis">
        <div className="analysis-section">
          <h3 className="section-title strong">
            <span className="icon">💪</span>
            {texts.strongAreas}
          </h3>
          {strongAreas.length > 0 ? (
            <div className="areas-list">
              {strongAreas.map(([topicId, data]) => (
                <div key={topicId} className="area-item strong">
                  <span className="area-icon">{getTopicIcon(topicId)}</span>
                  <span className="area-name">{getTopicName(topicId)}</span>
                  <span className="area-score">{data.percentage}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-areas">Keep practicing to build your strengths!</p>
          )}
        </div>

        <div className="analysis-section">
          <h3 className="section-title improve">
            <span className="icon">📈</span>
            {texts.areasToImprove}
          </h3>
          {areasToImprove.length > 0 ? (
            <div className="areas-list">
              {areasToImprove.map(([topicId, data]) => (
                <div key={topicId} className="area-item improve">
                  <span className="area-icon">{getTopicIcon(topicId)}</span>
                  <span className="area-name">{getTopicName(topicId)}</span>
                  <span className="area-score">{data.percentage}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-areas">Great job! All areas are performing well!</p>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {sessionReport.recommendations && sessionReport.recommendations.length > 0 && (
        <div className="recommendations">
          <h3>
            <span className="icon">💡</span>
            {texts.recommendations}
          </h3>
          <ul className="recommendations-list">
            {sessionReport.recommendations.map((rec, index) => (
              <li key={index} className="recommendation-item">{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="report-actions">
        <button onClick={onRestartSession} className="action-btn primary">
          {texts.tryAgain}
        </button>
        <button onClick={onNewSession} className="action-btn secondary">
          {texts.newSession}
        </button>
        <Link to="/start-learning" className="action-btn tertiary">
          {texts.studyMore}
        </Link>
      </div>
    </div>
  )
}

export default DetailedReport

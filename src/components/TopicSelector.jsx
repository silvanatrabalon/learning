import './TopicSelector.css'

function TopicSelector({ topics, selectedTopic, onTopicChange, language = 'en' }) {
  const getTexts = () => {
    const texts = {
      en: {
        selectTopic: 'Select Topic'
      },
      es: {
        selectTopic: 'Seleccionar Tópico'
      }
    }
    
    return texts[language] || texts.en
  }

  const texts = getTexts()

  return (
    <div className="topic-selector">
      <div className="topic-selector-label">
        <span>{texts.selectTopic}</span>
      </div>
      <div className="topic-list">
        {topics.map(topic => (
          <button
            key={topic.id}
            onClick={() => onTopicChange(topic.id)}
            className={`topic-button ${selectedTopic === topic.id ? 'active' : ''}`}
          >
            <span className="topic-icon">{topic.icon}</span>
            <span className="topic-name">{topic.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TopicSelector

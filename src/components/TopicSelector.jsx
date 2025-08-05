import './TopicSelector.css'

function TopicSelector({ topics, selectedTopic, onTopicChange }) {
  return (
    <div className="topic-selector">
      <h3>Select Topic</h3>
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

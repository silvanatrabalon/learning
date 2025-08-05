import { useState } from 'react'
import './TopicSelector.css'

function TopicSelector({ topics, selectedTopic, onTopicChange, language = 'en' }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const getTexts = () => {
    const texts = {
      en: {
        selectTopic: 'Select Topic',
      },
      es: {
        selectTopic: 'Seleccionar Tópico',
      }
    }
    
    return texts[language] || texts.en
  }

  const texts = getTexts()
  const currentTopic = topics.find(topic => topic.id === selectedTopic)

  const handleTopicChange = (topicId) => {
    onTopicChange(topicId)
    setIsDropdownOpen(false)
  }

  return (
    <div className="topic-selector">
      <div className="topic-dropdown">
        <button 
          className="topic-dropdown-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label={texts.selectTopic}
        >
          <div className="selected-topic">
            <span className="topic-icon">{currentTopic?.icon}</span>
            <span className="topic-name">{currentTopic?.name}</span>
          </div>
          <div className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </button>

        {isDropdownOpen && (
          <>
            <div className="dropdown-overlay" onClick={() => setIsDropdownOpen(false)} />
            <div className="topic-dropdown-menu">
              {topics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicChange(topic.id)}
                  className={`topic-dropdown-item ${selectedTopic === topic.id ? 'active' : ''}`}
                >
                  <span className="topic-icon">{topic.icon}</span>
                  <span className="topic-name">{topic.name}</span>
                  {selectedTopic === topic.id && <span className="check-icon">✓</span>}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TopicSelector

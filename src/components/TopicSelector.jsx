import { useState } from 'react'
import './TopicSelector.css'

function TopicSelector({ topics, selectedTopic, onTopicChange, language = 'en' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getTexts = () => {
    const texts = {
      en: {
        selectTopic: 'Select Topic',
        currentTopic: 'Current Topic',
        menu: 'Menu'
      },
      es: {
        selectTopic: 'Seleccionar Tópico',
        currentTopic: 'Tópico Actual',
        menu: 'Menú'
      }
    }
    
    return texts[language] || texts.en
  }

  const texts = getTexts()
  const currentTopic = topics.find(topic => topic.id === selectedTopic)

  const handleTopicChange = (topicId) => {
    onTopicChange(topicId)
    setIsMenuOpen(false) // Close menu after selection
  }

  return (
    <div className="topic-selector">
      {/* Desktop version */}
      <div className="topic-selector-desktop">
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

      {/* Mobile hamburger version */}
      <div className="topic-selector-mobile">
        <button 
          className="topic-hamburger-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={texts.menu}
        >
          <div className="current-topic-display">
            <span className="current-topic-icon">{currentTopic?.icon}</span>
            <span className="current-topic-text">{currentTopic?.name}</span>
          </div>
          <div className={`topic-hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {isMenuOpen && (
          <div className="topic-menu-overlay" onClick={() => setIsMenuOpen(false)}>
            <div className="topic-menu" onClick={(e) => e.stopPropagation()}>
              <div className="topic-menu-header">
                <h4>{texts.selectTopic}</h4>
                <button 
                  className="close-topic-menu"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="mobile-topic-list">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicChange(topic.id)}
                    className={`mobile-topic-button ${selectedTopic === topic.id ? 'active' : ''}`}
                  >
                    <div className="mobile-topic-header">
                      <span className="topic-icon">{topic.icon}</span>
                      <span className="topic-name">{topic.name}</span>
                      {selectedTopic === topic.id && <span className="check-icon">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopicSelector

import { useState } from 'react'
import './MobileMenu.css'

function MobileMenu({ 
  topics, 
  selectedTopic, 
  onTopicChange,
  mode,
  onModeChange,
  language,
  showModeSelector = false 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getTexts = () => {
    const texts = {
      en: {
        menu: 'Menu',
        selectTopic: 'Select Topic',
        selectMode: 'Select Mode',
        flashcard: '🃏 Flashcards',
        multipleChoice: '📝 Multiple Choice',
        flashcardDesc: 'Self-paced learning with flip cards',
        multipleChoiceDesc: 'Quick quiz with multiple options'
      },
      es: {
        menu: 'Menú',
        selectTopic: 'Seleccionar Tópico',
        selectMode: 'Seleccionar Modo',
        flashcard: '🃏 Flashcards',
        multipleChoice: '📝 Opción Múltiple',
        flashcardDesc: 'Aprendizaje auto-dirigido con tarjetas',
        multipleChoiceDesc: 'Quiz rápido con múltiples opciones'
      }
    }
    
    return texts[language] || texts.en
  }

  const texts = getTexts()

  const modes = [
    {
      id: 'flashcard',
      name: texts.flashcard,
      description: texts.flashcardDesc,
      icon: '🃏'
    },
    {
      id: 'multiple-choice',
      name: texts.multipleChoice,
      description: texts.multipleChoiceDesc,
      icon: '📝'
    }
  ]

  const handleTopicChange = (topicId) => {
    onTopicChange(topicId)
    setIsMenuOpen(false)
  }

  const handleModeChange = (newMode) => {
    onModeChange(newMode)
    setIsMenuOpen(false)
  }

  return (
    <div className="mobile-menu-container">
      <button 
        className="mobile-menu-trigger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={texts.menu}
      >
        <div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {isMenuOpen && (
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="menu-panel" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <h3>{texts.menu}</h3>
              <button 
                className="close-menu"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="menu-content">
              {/* Topic Selection */}
              <div className="menu-section">
                <h4>{texts.selectTopic}</h4>
                <div className="topic-options">
                  {topics.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicChange(topic.id)}
                      className={`menu-option ${selectedTopic === topic.id ? 'active' : ''}`}
                    >
                      <span className="option-icon">{topic.icon}</span>
                      <span className="option-name">{topic.name}</span>
                      {selectedTopic === topic.id && <span className="check-icon">✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selection - only show if showModeSelector is true */}
              {showModeSelector && (
                <div className="menu-section">
                  <h4>{texts.selectMode}</h4>
                  <div className="mode-options">
                    {modes.map(modeOption => (
                      <button
                        key={modeOption.id}
                        onClick={() => handleModeChange(modeOption.id)}
                        className={`menu-option mode-option ${mode === modeOption.id ? 'active' : ''}`}
                      >
                        <div className="option-main">
                          <span className="option-icon">{modeOption.icon}</span>
                          <div className="option-info">
                            <span className="option-name">{modeOption.name}</span>
                            <p className="option-description">{modeOption.description}</p>
                          </div>
                        </div>
                        {mode === modeOption.id && <span className="check-icon">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileMenu

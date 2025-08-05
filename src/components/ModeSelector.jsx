import { useState } from 'react'
import './ModeSelector.css'

function ModeSelector({ mode, onModeChange, language }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getTexts = () => {
    const texts = {
      en: {
        selectMode: 'Select Mode',
        flashcard: '🃏 Flashcards',
        multipleChoice: '📝 Multiple Choice',
        flashcardDesc: 'Self-paced learning with flip cards',
        multipleChoiceDesc: 'Quick quiz with multiple options',
        currentMode: 'Current Mode',
        menu: 'Menu'
      },
      es: {
        selectMode: 'Seleccionar Modo',
        flashcard: '🃏 Flashcards',
        multipleChoice: '📝 Opción Múltiple',
        flashcardDesc: 'Aprendizaje auto-dirigido con tarjetas',
        multipleChoiceDesc: 'Quiz rápido con múltiples opciones',
        currentMode: 'Modo Actual',
        menu: 'Menú'
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

  const currentModeData = modes.find(m => m.id === mode)

  const handleModeChange = (newMode) => {
    onModeChange(newMode)
    setIsMenuOpen(false) // Close menu after selection
  }

  return (
    <div className="mode-selector">
      {/* Desktop version */}
      <div className="mode-selector-desktop">
        <h3>{texts.selectMode}</h3>
        <div className="mode-list">
          {modes.map(modeOption => (
            <button
              key={modeOption.id}
              onClick={() => onModeChange(modeOption.id)}
              className={`mode-button ${mode === modeOption.id ? 'active' : ''}`}
            >
              <div className="mode-header">
                <span className="mode-icon">{modeOption.icon}</span>
                <span className="mode-name">{modeOption.name}</span>
              </div>
              <p className="mode-description">{modeOption.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile hamburger version */}
      <div className="mode-selector-mobile">
        <button 
          className="hamburger-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={texts.menu}
        >
          <div className="current-mode-display">
            <span className="current-mode-icon">{currentModeData?.icon}</span>
            <span className="current-mode-text">{currentModeData?.name}</span>
          </div>
          <div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {isMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}>
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-menu-header">
                <h4>{texts.selectMode}</h4>
                <button 
                  className="close-menu"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="mobile-mode-list">
                {modes.map(modeOption => (
                  <button
                    key={modeOption.id}
                    onClick={() => handleModeChange(modeOption.id)}
                    className={`mobile-mode-button ${mode === modeOption.id ? 'active' : ''}`}
                  >
                    <div className="mobile-mode-header">
                      <span className="mode-icon">{modeOption.icon}</span>
                      <div className="mobile-mode-info">
                        <span className="mode-name">{modeOption.name}</span>
                        <p className="mode-description">{modeOption.description}</p>
                      </div>
                      {mode === modeOption.id && <span className="check-icon">✓</span>}
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

export default ModeSelector

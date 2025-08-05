import './ModeSelector.css'

function ModeSelector({ mode, onModeChange, language }) {
  const getTexts = () => {
    const texts = {
      en: {
        selectMode: 'Select Mode',
        flashcard: '🃏 Flashcards',
        multipleChoice: '📝 Multiple Choice',
        flashcardDesc: 'Self-paced learning with flip cards',
        multipleChoiceDesc: 'Quick quiz with multiple options'
      },
      es: {
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

  return (
    <div className="mode-selector">
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
  )
}

export default ModeSelector

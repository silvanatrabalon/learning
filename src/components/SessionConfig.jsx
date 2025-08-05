import { useState } from 'react'
import './SessionConfig.css'

function SessionConfig({ selectedTopics, topics, onConfigChange, language }) {
  const [questionsPerTopic, setQuestionsPerTopic] = useState(5)
  const [sessionMode, setSessionMode] = useState('mixed') // 'mixed' or 'sequential'
  const [questionTypes, setQuestionTypes] = useState('both') // 'flashcard', 'multiple-choice', 'both'

  const getTexts = () => {
    const texts = {
      en: {
        sessionConfig: 'Session Configuration',
        questionsPerTopic: 'Questions per Topic',
        sessionMode: 'Session Mode',
        mixed: 'Mixed Topics',
        sequential: 'Sequential by Topic',
        mixedDesc: 'Random questions from all selected topics',
        sequentialDesc: 'Complete one topic before moving to the next',
        questionTypes: 'Question Types',
        flashcard: 'Flashcards Only',
        multipleChoice: 'Multiple Choice Only',
        both: 'Both Types',
        flashcardDesc: 'Self-paced learning with flip cards',
        multipleChoiceDesc: 'Quick quiz with multiple options',
        bothDesc: 'Mix of flashcards and multiple choice',
        totalQuestions: 'Total Questions',
        estimatedTime: 'Estimated Time',
        minutes: 'minutes',
        startSession: 'Start Mixed Session'
      },
      es: {
        sessionConfig: 'Configuración de Sesión',
        questionsPerTopic: 'Preguntas por Tema',
        sessionMode: 'Modo de Sesión',
        mixed: 'Temas Mezclados',
        sequential: 'Secuencial por Tema',
        mixedDesc: 'Preguntas aleatorias de todos los temas seleccionados',
        sequentialDesc: 'Completar un tema antes de pasar al siguiente',
        questionTypes: 'Tipos de Preguntas',
        flashcard: 'Solo Flashcards',
        multipleChoice: 'Solo Opción Múltiple',
        both: 'Ambos Tipos',
        flashcardDesc: 'Aprendizaje auto-dirigido con tarjetas',
        multipleChoiceDesc: 'Quiz rápido con múltiples opciones',
        bothDesc: 'Mezcla de flashcards y opción múltiple',
        totalQuestions: 'Total de Preguntas',
        estimatedTime: 'Tiempo Estimado',
        minutes: 'minutos',
        startSession: 'Iniciar Sesión Mixta'
      }
    }
    
    return texts[language] || texts.en
  }

  const texts = getTexts()

  const handleConfigChange = (key, value) => {
    const newConfig = {
      questionsPerTopic,
      sessionMode,
      questionTypes,
      [key]: value
    }

    if (key === 'questionsPerTopic') setQuestionsPerTopic(value)
    if (key === 'sessionMode') setSessionMode(value)
    if (key === 'questionTypes') setQuestionTypes(value)

    onConfigChange(newConfig)
  }

  const totalQuestions = selectedTopics.length * questionsPerTopic
  const estimatedMinutes = Math.ceil(totalQuestions * (questionTypes === 'flashcard' ? 0.5 : questionTypes === 'multiple-choice' ? 0.75 : 0.6))

  const getSelectedTopicNames = () => {
    return selectedTopics.map(id => {
      const topic = topics.find(t => t.id === id)
      return topic ? topic.name : id
    }).join(', ')
  }

  return (
    <div className="session-config">
      <div className="config-header">
        <h3>{texts.sessionConfig}</h3>
        <div className="selected-topics-preview">
          <span className="topics-label">Topics:</span>
          <span className="topics-list">{getSelectedTopicNames()}</span>
        </div>
      </div>

      <div className="config-sections">
        {/* Questions per Topic */}
        <div className="config-section">
          <label className="config-label">{texts.questionsPerTopic}</label>
          <div className="number-selector">
            {[5, 10, 15, 20].map(num => (
              <button
                key={num}
                className={`number-btn ${questionsPerTopic === num ? 'active' : ''}`}
                onClick={() => handleConfigChange('questionsPerTopic', num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Session Mode */}
        <div className="config-section">
          <label className="config-label">{texts.sessionMode}</label>
          <div className="mode-options">
            <div 
              className={`mode-option ${sessionMode === 'mixed' ? 'selected' : ''}`}
              onClick={() => handleConfigChange('sessionMode', 'mixed')}
            >
              <div className="mode-header">
                <span className="mode-icon">🔀</span>
                <span className="mode-name">{texts.mixed}</span>
                <span className="radio-icon">{sessionMode === 'mixed' ? '🔘' : '⚪'}</span>
              </div>
              <p className="mode-description">{texts.mixedDesc}</p>
            </div>

            <div 
              className={`mode-option ${sessionMode === 'sequential' ? 'selected' : ''}`}
              onClick={() => handleConfigChange('sessionMode', 'sequential')}
            >
              <div className="mode-header">
                <span className="mode-icon">📋</span>
                <span className="mode-name">{texts.sequential}</span>
                <span className="radio-icon">{sessionMode === 'sequential' ? '🔘' : '⚪'}</span>
              </div>
              <p className="mode-description">{texts.sequentialDesc}</p>
            </div>
          </div>
        </div>

        {/* Question Types */}
        <div className="config-section">
          <label className="config-label">{texts.questionTypes}</label>
          <div className="type-options">
            <div 
              className={`type-option ${questionTypes === 'flashcard' ? 'selected' : ''}`}
              onClick={() => handleConfigChange('questionTypes', 'flashcard')}
            >
              <span className="type-icon">🃏</span>
              <div className="type-info">
                <span className="type-name">{texts.flashcard}</span>
                <span className="type-desc">{texts.flashcardDesc}</span>
              </div>
              <span className="radio-icon">{questionTypes === 'flashcard' ? '🔘' : '⚪'}</span>
            </div>

            <div 
              className={`type-option ${questionTypes === 'multiple-choice' ? 'selected' : ''}`}
              onClick={() => handleConfigChange('questionTypes', 'multiple-choice')}
            >
              <span className="type-icon">📝</span>
              <div className="type-info">
                <span className="type-name">{texts.multipleChoice}</span>
                <span className="type-desc">{texts.multipleChoiceDesc}</span>
              </div>
              <span className="radio-icon">{questionTypes === 'multiple-choice' ? '🔘' : '⚪'}</span>
            </div>

            <div 
              className={`type-option ${questionTypes === 'both' ? 'selected' : ''}`}
              onClick={() => handleConfigChange('questionTypes', 'both')}
            >
              <span className="type-icon">🎯</span>
              <div className="type-info">
                <span className="type-name">{texts.both}</span>
                <span className="type-desc">{texts.bothDesc}</span>
              </div>
              <span className="radio-icon">{questionTypes === 'both' ? '🔘' : '⚪'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Summary */}
      <div className="session-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">{texts.totalQuestions}</span>
            <span className="stat-value">{totalQuestions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{texts.estimatedTime}</span>
            <span className="stat-value">{estimatedMinutes} {texts.minutes}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionConfig

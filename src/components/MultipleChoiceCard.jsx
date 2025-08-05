import { useState } from 'react'
import './MultipleChoiceCard.css'

function MultipleChoiceCard({ question, onAnswer, language }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [answered, setAnswered] = useState(false)

  if (!question) return null

  const handleOptionSelect = (option) => {
    if (answered) return
    
    setSelectedOption(option)
    setShowResult(true)
    setAnswered(true)
    
    const isCorrect = option === question.correctAnswer
    
    // Wait a moment to show the result, then call onAnswer
    setTimeout(() => {
      onAnswer(isCorrect)
      // Reset for next question
      setSelectedOption(null)
      setShowResult(false)
      setAnswered(false)
    }, 2000)
  }

  const getTexts = () => {
    const texts = {
      en: {
        definition: '📝 Definition',
        comparison: '⚖️ Comparison',
        selectAnswer: 'Select the correct answer:',
        correct: '✅ Correct!',
        incorrect: '❌ Incorrect',
        correctAnswer: 'The correct answer was:',
        chooseOption: '🤔 Choose the option that best answers the question',
        movingNext: '⏳ Moving to next question...'
      },
      es: {
        definition: '📝 Definición',
        comparison: '⚖️ Comparación',
        selectAnswer: 'Selecciona la respuesta correcta:',
        correct: '✅ ¡Correcto!',
        incorrect: '❌ Incorrecto',
        correctAnswer: 'La respuesta correcta era:',
        chooseOption: '🤔 Elige la opción que mejor responda la pregunta',
        movingNext: '⏳ Pasando a la siguiente pregunta...'
      }
    }
    
    return texts[language] || texts.en
  }

  const texts = getTexts()

  const getOptionClass = (option) => {
    if (!showResult) {
      return selectedOption === option ? 'selected' : ''
    }
    
    if (option === question.correctAnswer) {
      return 'correct'
    }
    
    if (option === selectedOption && option !== question.correctAnswer) {
      return 'incorrect'
    }
    
    return showResult ? 'disabled' : ''
  }

  return (
    <div className="multiple-choice-container">
      <div className="multiple-choice-card">
        <div className="card-header">
          <span className="card-type">
            {question.type === 'definition' ? texts.definition : texts.comparison}
          </span>
          <span className="card-topic">{question.concept}</span>
        </div>
        
        <div className="card-content">
          <h3>{question.question}</h3>
          <p className="instruction">{texts.selectAnswer}</p>
          
          <div className="options-container">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`option-button ${getOptionClass(option)}`}
                disabled={answered}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        </div>
        
        {showResult && (
          <div className="result-container">
            <div className={`result-message ${selectedOption === question.correctAnswer ? 'success' : 'error'}`}>
              {selectedOption === question.correctAnswer ? (
                <span>{texts.correct}</span>
              ) : (
                <div>
                  <div>{texts.incorrect}</div>
                  <small>{texts.correctAnswer}</small>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="card-instructions">
        {!showResult ? (
          <p>🤔 Choose the option that best answers the question</p>
        ) : (
          <p>⏳ Moving to next question...</p>
        )}
      </div>
    </div>
  )
}

export default MultipleChoiceCard

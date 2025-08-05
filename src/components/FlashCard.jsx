import { useState } from 'react'
import './FlashCard.css'

function FlashCard({ card, showAnswer, onShowAnswer, onAnswer, language = 'en' }) {
  const [isFlipped, setIsFlipped] = useState(false)

  if (!card) return null

  const handleFlip = () => {
    if (!showAnswer) {
      setIsFlipped(true)
      onShowAnswer()
    }
  }

  const handleAnswer = (isCorrect) => {
    onAnswer(isCorrect)
    setIsFlipped(false)
  }

  const getQuestion = () => {
    const questions = {
      en: {
        description: `What is ${card.concept}?`,
        comparison: `How does ${card.concept} compare to other concepts?`
      },
      es: {
        description: `¿Qué es ${card.concept}?`,
        comparison: `¿Cómo se compara ${card.concept} con otros conceptos?`
      }
    }
    
    return questions[language][card.cardType || 'description'] || questions.en[card.cardType || 'description']
  }

  const getAnswer = () => {
    if (card.cardType === 'description') {
      return card.description
    } else if (card.cardType === 'comparison') {
      return card.comparison
    }
    return card.description
  }

  const getTexts = () => {
    const texts = {
      en: {
        definition: '📝 Definition',
        comparison: '⚖️ Comparison',
        question: 'Question:',
        answer: 'Answer:',
        reveal: '🔍 Reveal Answer',
        didntKnow: '❌ Didn\'t Know',
        gotRight: '✅ Got It Right',
        thinkFirst: '💡 Think about the answer, then click "Reveal Answer"',
        howDidYouDo: '⭐ How did you do? Be honest with yourself!'
      },
      es: {
        definition: '📝 Definición',
        comparison: '⚖️ Comparación',
        question: 'Pregunta:',
        answer: 'Respuesta:',
        reveal: '🔍 Mostrar Respuesta',
        didntKnow: '❌ No lo sabía',
        gotRight: '✅ Lo supe',
        thinkFirst: '💡 Piensa en la respuesta, luego haz clic en "Mostrar Respuesta"',
        howDidYouDo: '⭐ ¿Cómo te fue? ¡Sé honesto contigo mismo!'
      }
    }
    
    return texts[language] || texts.en
  }

  const texts = getTexts()

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
        <div className="flashcard-front">
          <div className="card-header">
            <span className="card-type">
              {card.cardType === 'description' ? texts.definition : texts.comparison}
            </span>
            <span className="card-topic">{card.concept}</span>
          </div>
          
          <div className="card-content">
            <h3>{texts.question}</h3>
            <p>{getQuestion()}</p>
          </div>
          
          <div className="card-actions">
            <button onClick={handleFlip} className="reveal-btn">
              {texts.reveal}
            </button>
          </div>
        </div>

        <div className="flashcard-back">
          <div className="card-header">
            <span className="card-type">
              {card.cardType === 'description' ? texts.definition : texts.comparison}
            </span>
            <span className="card-topic">{card.concept}</span>
          </div>
          
          <div className="card-content">
            <h3>{texts.answer}</h3>
            <p>{getAnswer()}</p>
          </div>
          
          <div className="card-actions">
            <div className="answer-buttons">
              <button 
                onClick={() => handleAnswer(false)} 
                className="answer-btn incorrect"
              >
                {texts.didntKnow}
              </button>
              <button 
                onClick={() => handleAnswer(true)} 
                className="answer-btn correct"
              >
                {texts.gotRight}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-instructions">
        {!showAnswer ? (
          <p>{texts.thinkFirst}</p>
        ) : (
          <p>{texts.howDidYouDo}</p>
        )}
      </div>
    </div>
  )
}

export default FlashCard

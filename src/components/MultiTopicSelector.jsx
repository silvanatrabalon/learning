import { useState, useEffect } from 'react'
import './MultiTopicSelector.css'

function MultiTopicSelector({ topics, selectedTopics, onSelectionChange, language }) {
  const [selectAll, setSelectAll] = useState(false)

  const getTexts = () => {
    const texts = {
      en: {
        selectTopics: 'Select Topics for Mixed Session',
        selectAll: 'Select All',
        deselectAll: 'Deselect All',
        topicsSelected: 'topics selected',
        minTopicsWarning: 'Select at least 2 topics for a mixed session'
      },
      es: {
        selectTopics: 'Seleccionar Temas para Sesión Mixta',
        selectAll: 'Seleccionar Todos',
        deselectAll: 'Deseleccionar Todos',
        topicsSelected: 'temas seleccionados',
        minTopicsWarning: 'Selecciona al menos 2 temas para una sesión mixta'
      }
    }
    
    return texts[language] || texts.en
  }

  const texts = getTexts()

  useEffect(() => {
    setSelectAll(selectedTopics.length === topics.length)
  }, [selectedTopics, topics])

  const handleTopicToggle = (topicId) => {
    const newSelection = selectedTopics.includes(topicId)
      ? selectedTopics.filter(id => id !== topicId)
      : [...selectedTopics, topicId]
    
    onSelectionChange(newSelection)
  }

  const handleSelectAllToggle = () => {
    if (selectAll) {
      onSelectionChange([])
    } else {
      onSelectionChange(topics.map(topic => topic.id))
    }
  }

  const selectedCount = selectedTopics.length

  return (
    <div className="multi-topic-selector">
      <div className="selector-header">
        <h3>{texts.selectTopics}</h3>
        <div className="selection-summary">
          <span className="count-badge">
            {selectedCount} {texts.topicsSelected}
          </span>
        </div>
      </div>

      <div className="select-all-container">
        <button 
          className={`select-all-btn ${selectAll ? 'active' : ''}`}
          onClick={handleSelectAllToggle}
        >
          <span className="checkbox-icon">
            {selectAll ? '☑️' : '☐'}
          </span>
          {selectAll ? texts.deselectAll : texts.selectAll}
        </button>
      </div>

      <div className="topics-grid">
        {topics.map(topic => (
          <div 
            key={topic.id}
            className={`topic-card ${selectedTopics.includes(topic.id) ? 'selected' : ''}`}
            onClick={() => handleTopicToggle(topic.id)}
          >
            <div className="topic-checkbox">
              <span className="checkbox-icon">
                {selectedTopics.includes(topic.id) ? '✅' : '⬜'}
              </span>
            </div>
            <div className="topic-info">
              <span className="topic-icon">{topic.icon}</span>
              <span className="topic-name">{topic.name}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedCount > 0 && selectedCount < 2 && (
        <div className="warning-message">
          <span className="warning-icon">⚠️</span>
          {texts.minTopicsWarning}
        </div>
      )}
    </div>
  )
}

export default MultiTopicSelector

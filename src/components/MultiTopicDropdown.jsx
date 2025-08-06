import { useState, useRef, useEffect } from 'react'
import './MultiTopicDropdown.css'

function MultiTopicDropdown({ topics, selectedTopics, onSelectionChange, language = 'en' }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const getTexts = () => {
    const texts = {
      en: {
        selectTopics: 'Select Topics',
        selectedCount: 'selected',
        allTopics: 'All Topics'
      },
      es: {
        selectTopics: 'Seleccionar Temas',
        selectedCount: 'seleccionados',
        allTopics: 'Todos los Temas'
      }
    }
    
    return texts[language] || texts.en
  }

  const texts = getTexts()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleTopicToggle = (topicId) => {
    const newSelection = selectedTopics.includes(topicId)
      ? selectedTopics.filter(id => id !== topicId)
      : [...selectedTopics, topicId]
    
    onSelectionChange(newSelection)
  }

  const getDropdownLabel = () => {
    if (selectedTopics.length === 0) {
      return texts.selectTopics
    }
    if (selectedTopics.length === topics.length) {
      return texts.allTopics
    }
    if (selectedTopics.length === 1) {
      const topic = topics.find(t => t.id === selectedTopics[0])
      return `${topic?.icon} ${topic?.name}`
    }
    return `${selectedTopics.length} ${texts.selectedCount}`
  }

  return (
    <div className="multi-topic-dropdown" ref={dropdownRef}>
      <button 
        className="dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="dropdown-label">{getDropdownLabel()}</span>
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {topics.map(topic => (
            <label key={topic.id} className="dropdown-item">
              <input
                type="checkbox"
                checked={selectedTopics.includes(topic.id)}
                onChange={() => handleTopicToggle(topic.id)}
              />
              <span className="topic-info">
                <span className="topic-icon">{topic.icon}</span>
                <span className="topic-name">{topic.name}</span>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default MultiTopicDropdown

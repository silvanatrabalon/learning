import './LanguageToggle.css'

function LanguageToggle({ language, onLanguageChange }) {
  return (
    <div className="language-toggle">
      <button
        onClick={() => onLanguageChange('en')}
        className={`lang-button ${language === 'en' ? 'active' : ''}`}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange('es')}
        className={`lang-button ${language === 'es' ? 'active' : ''}`}
      >
        ES
      </button>
    </div>
  )
}

export default LanguageToggle

import './LanguageToggle.css'

function LanguageToggle({ language, onLanguageChange }) {
  return (
    <div className="language-toggle">
      <div className="toggle-container">
        <button
          onClick={() => onLanguageChange('en')}
          className={`toggle-option ${language === 'en' ? 'active' : ''}`}
        >
          EN
        </button>
        <button
          onClick={() => onLanguageChange('es')}
          className={`toggle-option ${language === 'es' ? 'active' : ''}`}
        >
          ES
        </button>
        <div className={`toggle-slider ${language === 'es' ? 'slide-right' : 'slide-left'}`}></div>
      </div>
    </div>
  )
}

export default LanguageToggle

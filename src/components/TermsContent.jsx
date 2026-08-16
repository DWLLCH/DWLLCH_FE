import '../styles/TermsContent.css';

function TermsContent({ sections, footer }) {
  return (
    <div className="terms-content">
      {sections.map((section) => (
        <div className="terms-content-section" key={section.heading}>
          <p className="terms-content-heading">{section.heading}</p>
          {section.text && <p className="terms-content-text">{section.text}</p>}
          {section.bullets && (
            <ul className="terms-content-bullets">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {footer && <p className="terms-content-footer">{footer}</p>}
    </div>
  );
}

export default TermsContent;

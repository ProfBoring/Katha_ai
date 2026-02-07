export default function CharacterCard({ name, description, traits, arc, colorPalette }) {
    return (
        <div className="character-card" style={{ width: '280px' }}>
            <h4>{name}</h4>
            <p><strong>Description:</strong> {description}</p>

            {traits && (
                <div style={{ marginTop: '0.5rem' }}>
                    <strong>Traits:</strong> {Array.isArray(traits) ? traits.join(', ') : traits}
                </div>
            )}

            {arc && (
                <div style={{ marginTop: '0.5rem' }}>
                    <strong>Arc:</strong> {arc}
                </div>
            )}

            {colorPalette && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {colorPalette.map((color, i) => (
                        <div
                            key={i}
                            style={{
                                width: '30px',
                                height: '30px',
                                backgroundColor: color,
                                borderRadius: '50%',
                                border: '1px solid rgba(0,0,0,0.1)'
                            }}
                            title={color}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

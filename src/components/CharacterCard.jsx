export default function CharacterCard({ name, description }) {
    return (
        <div className="character-card">
            <h4>{name}</h4>
            <p>{description}</p>
        </div>
    );
}

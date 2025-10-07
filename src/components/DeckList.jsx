function DeckList({ deck }) {
    return (
        <div>
            <h2>Meu Deck ({deck.length})</h2>
            {deck.length === 0 ? (
                <p>Seu deck está vazio. Adicione cartas acima!</p>
            ) : (
                <ul>
                    {deck.map(card => (
                        <li key={card.id}>{card.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DeckList;
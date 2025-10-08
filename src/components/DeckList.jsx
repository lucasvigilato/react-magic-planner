import styles from './DeckList.module.css';

function DeckList({ deck, onRemoveCard }) {
    return (
        <div className={StyleSheet.deckContainer}>
            <h2>Meu Deck ({deck.length})</h2>
            {deck.length === 0 ? (
                <p>Seu deck está vazio. Adicione cartas acima!</p>
            ) : (
                <ul className={styles.deckList}>
                    {deck.map(card => (
                        <li key={card.id} className={styles.deckItem}>
                            <span className={styles.cardName}>{card.name}</span>
                            <button onClick={() => onRemoveCard(card.id)} className={styles.removeButton}>
                                X
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DeckList;
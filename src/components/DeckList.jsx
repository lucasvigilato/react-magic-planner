import styles from './DeckList.module.css';

function DeckList({ deck, onRemoveCard }) {
    return (
        <div className={StyleSheet.deckContainer}>
            <h2>Meu Deck ({deck.length})</h2>
            {deck.length === 0 ? (
                <p>Seu deck está vazio. Adicione cartas acima!</p>
            ) : (
                <ul className={styles.deckList}>
                    {deck.map(entry => (
                        <li key={entry.card.id} className={styles.deckItem}>
                            <span className={styles.cardName}>
                                {entry.quantity}x {entry.card.name}
                            </span>
                            <button onClick={() => onRemoveCard(entry.card.id)} className={styles.removeButton}>
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
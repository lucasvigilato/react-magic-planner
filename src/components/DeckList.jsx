import styles from './DeckList.module.css';

function DeckList({ deck, onRemoveCard, onUpdateQuantity }) {
    console.log('Deck recebido pelo componente DeckList:', deck);

    return (
        <div className={styles.deckContainer}>
            <h2>Meu Deck ({deck.length})</h2>
            {deck.length === 0 ? (
                <p>Seu deck está vazio. Adicione cartas acima!</p>
            ) : (
                <ul className={styles.deckList}>
                    {deck.map(entry => (
                        <li key={entry.card.id} className={styles.deckItem}>
                            <span className={styles.cardName}>{entry.card.name}</span>
                            <div className={styles.controls}>
                                <button
                                className={styles.quantityButton}
                                onClick={() => onUpdateQuantity(entry.card.id, 'decrement')}
                                >
                                    -
                                </button>
                                <span className={styles.quantityText}>{entry.quantity}</span>
                                <button
                                onClick={() => onUpdateQuantity(entry.card.id, 'increment')}
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => onRemoveCard(entry.card.id)}
                                    className={styles.removeButton}
                                >
                                    X
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DeckList;
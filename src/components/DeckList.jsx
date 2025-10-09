import styles from './DeckList.module.css';

function DeckList({ deck, onRemoveCard, onUpdateQuantity }) {
  return (
    <div>
      <h2>Meu Deck ({deck.length})</h2>
      {deck.length === 0 ? (
        <p>Seu deck está vazio. Adicione cartas acima!</p>
      ) : (
        <div className={styles.deckList}>
          {deck.map(entry => (
            <div key={entry.card.id} className={styles.cardItem}>
              <img
                src={entry.card.image_uris.small}
                alt={entry.card.name}
                className={styles.cardImage}
              />
              <div className={styles.cardInfo}>
                <div className={styles.controls}>
                  <button
                    className={styles.quantityButton}
                    onClick={() => onUpdateQuantity(entry.card.id, 'decrement')}
                  >-</button>
                  <span className={styles.quantityText}>{entry.quantity}</span>
                  <button
                    className={styles.quantityButton}
                    onClick={() => onUpdateQuantity(entry.card.id, 'increment')}
                  >+</button>
                  <button
                    onClick={() => onRemoveCard(entry.card.id)}
                    className={styles.removeButton}
                  >X</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeckList;
import { useState } from 'react';
import styles from './DeckList.module.css';

const TagInput = ({ cardId, onAddTag }) => {
  const [tagText, setTagText] = useState('');

  const handleKeyDown = (event) => {

    if (event.key === 'Enter' && tagText.trim() !== '') {
      event.preventDefault();
      onAddTag(cardId, tagText);
      setTagText('');
    }
  };

  return (
    <input
      type='text'
      className={styles.tagInput}
      value={tagText}
      onChange={(e) => setTagText(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder='Add tag + Enter'
    />
  );
};

function DeckList({ deck, onRemoveCard, onUpdateQuantity, onMouseEnterCard, onMouseLeaveCard, onAddTag, onRemoveTag }) {
  return (
    <div>
      <h2 className={styles.title}>Meu Deck ({deck.length})</h2>
      {deck.length === 0 ? (
        <p className={styles.emptyMessage}>Seu deck está vazio. Adicione cartas acima!</p>
      ) : (
        <div className={styles.deckList}>
          {deck.map(entry => {
            const imageUrl = entry.card.image_uris
              ? entry.card.image_uris.small
              : entry.card.card_faces[0].image_uris.small;

            return (
            <div key={entry.card.id}
            className={styles.cardItem}
            onMouseEnter={() => onMouseEnterCard(entry.card)}
            onMouseLeave={onMouseLeaveCard}>
              <img
                src={imageUrl}
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
                <div className={styles.tagList}>
                  {entry.tags.map(tag => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                      <button onClick={() => onRemoveTag(entry.card.id, tag)}>X</button>
                    </span>
                  ))}
                </div>
                <TagInput cardId={entry.card.id} onAddTag={onAddTag} />
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DeckList;
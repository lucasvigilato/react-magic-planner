import styles from './DeckManager.module.css';

function DeckManager({
    allDecks,
    activeDeckName,
    onCreateDeck,
    onSelectDeck,
    onDeleteDeck
}) {
    const deckNames = Object.keys(allDecks);

    return (
        <div className={styles.managerContainer}>
            <button onClick={onCreateDeck} className={styles.actionButton}>
                Criar Novo Deck
            </button>

            <div className={styles.selectorWrapper}>
                <label htmlFor='deck-selector'></label>
                <select
                id='deck-selector'
                value={activeDeckName}
                onChange={(e) => onSelectDeck(e.target.value)}
                className={styles.deckSelector}
            >
                {deckNames.map(name => (
                    <option key={name} value={name}>
                        {name}
                    </option>
                ))}
            </select>
            </div>

            {deckNames.length > 1 && (
                <button
                    onClick={() => onDeleteDeck(activeDeckName)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                >
                    Deletar Deck Atual
                </button>
            )}
        </div>
    );
};

export default DeckManager;
import { useState } from 'react';
import CardSearch from './components/CardSearch';
import DeckList from './components/DeckList';
import styles from './App.module.css';

function App() {
  const [deck, setDeck] = useState([]);

  // Função para adicionar uma carta ao deck
  const handleAddCard = (cardToAdd) => {
    const isBasicLand = cardToAdd.type_line.includes('Basic Land');
    const cardExists = !isBasicLand && deck.some(card => card.id === cardToAdd.id);

    if (cardExists) {
      alert(`${cardToAdd.name} ja está no deck!`);
      return;
    }

    setDeck(currentDeck => [...currentDeck, cardToAdd]);
  };

  // Função para remover uma carta do deck
  const handleRemoveCard = (cardIdToRemove) => {
    setDeck(currentDeck => currentDeck.filter(card => card.id !== cardIdToRemove));
  };
  

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.mainTitle}>Magic Planner</h1>
      
      <CardSearch onCardAdd={handleAddCard} />

      <hr className={styles.divider} />
      
      <DeckList deck={deck} onRemoveCard={handleRemoveCard}/>
    </div>
  );
}

export default App;
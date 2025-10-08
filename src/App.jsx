import { useState, useEffect } from 'react';
import CardSearch from './components/CardSearch';
import DeckList from './components/DeckList';
import styles from './App.module.css';

function App() {
  const getInitialDeck = () => {
    const savedDeck = localStorage.getItem('magicDeck');
    return savedDeck ? JSON.parse(savedDeck) : [];
  };

  const [deck, setDeck] = useState(getInitialDeck());

  useEffect(() => {
    localStorage.setItem('magicDeck', JSON.stringify(deck));
  }, [deck]);

  // Função para adicionar uma carta ao deck
  const handleAddCard = (cardToAdd) => {
    const isBasicLand = cardToAdd.type_line.includes('Basic Land');
    const existingCardEntry = deck.find(entry => entry.card.id === cardToAdd.id);

    if (existingCardEntry) {
      if (isBasicLand) {
        setDeck(
          deck.map(entry =>
            entry.card.id === cardToAdd.id
            ? { ...entry, quantity: entry.quantity + 1}
            : entry
          )
        );
      } else {
        alert(`${cardToAdd.name} ja está no seu deck.`);
      }
    } else {
      setDeck(currentDeck => [...currentDeck, {card: cardToAdd, quantity: 1}]);
    }
  };

  // Função para remover uma carta do deck
  const handleRemoveCard = (cardIdToRemove) => {
    setDeck(currentDeck => currentDeck.filter(entry => entry.card.id !== cardIdToRemove));
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
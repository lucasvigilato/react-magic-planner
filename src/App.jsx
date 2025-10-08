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
        handleUpdateQuantity(cardToAdd.id, 'increment');
      } else {
        alert(`${cardToAdd.name} ja está no seu deck (limite de 1 para não-básicos).`);
      }
    } else {
      setDeck(currentDeck => [...currentDeck, {card: cardToAdd, quantity: 1}]);
    }
  };

  // Função para remover uma carta do deck
  const handleRemoveCard = (cardIdToRemove) => {
    setDeck(currentDeck => currentDeck.filter(entry => entry.card.id !== cardIdToRemove));
  };
  
  const handleUpdateQuantity = (cardId, action) => {
    setDeck(currentDeck => {
      const updatedDeck = currentDeck.map(entry => {
        if (entry.card.id === cardId) {
          console.log('Carta encontrada para atualizar:', entry); // LOG 1

          const isBasicLand = entry.card.type_line.includes('Basic Land');

          if (!isBasicLand && action === 'increment') {
            alert(`Apenas 1 cópia de ${entry.card.name} é permitida.`);
            return entry;
          }
          const newQuantity = action === 'increment'
            ? entry.quantity + 1
            : entry.quantity - 1;

            console.log('Nova quantidade calculada:', newQuantity); // LOG 2
            
          return { ...entry, quantity: newQuantity };
        }

        return entry;

      });

      return updatedDeck.filter(entry => entry.quantity > 0);

    });
  };

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.mainTitle}>Magic Planner</h1>
      
      <CardSearch onCardAdd={handleAddCard} />

      <hr className={styles.divider} />
      
      <DeckList 
        deck={deck}
        onRemoveCard={handleRemoveCard}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}

export default App;
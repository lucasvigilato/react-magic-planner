import { useState } from 'react';
import CardSearch from './components/CardSearch';
import DeckList from './components/DeckList';

function App() {
  const [deck, setDeck] = useState([]);

  const handleAddCard = (cardToAdd) => {
    setDeck(currentDeck => [...currentDeck, cardToAdd]);
  };

  return (
    <div>
      <h1>Magic Planner</h1>
      {/* Passamos a função de adicionar como uma "prop" para o CardSearch */}
      <CardSearch onCardAdd={handleAddCard} />
      <hr />
      {/* Passamos a lista do deck como uma "prop" para o DeckList */}
      <DeckList deck={deck} />
    </div>
  );
}

export default App;
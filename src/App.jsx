import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import DeckStats from './components/DeckStats';
import CardSearch from './components/CardSearch';
import DeckList from './components/DeckList';
import DeckIO from './components/DeckIO';
import CardViewer from './components/CardViewer';
import styles from './App.module.css';

function App() {

  const getInitialDeck = () => {
    const savedDeck = localStorage.getItem('magicDeck');
    return savedDeck ? JSON.parse(savedDeck) : [];
  };

  const [deck, setDeck] = useState(getInitialDeck());

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  }

  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    localStorage.setItem('magicDeck', JSON.stringify(deck));
  }, [deck]);

  
  const manaCurve = deck
    .filter(entry => !entry.card.type_line.includes('Land'))
    .reduce((acc, entry) => {
      const cmc = Math.floor(entry.card.cmc);
      const quantity = entry.quantity;

      if (!acc[cmc]) {
        acc[cmc] = 0;
      }

      acc[cmc] += quantity;

      return acc;
    }, {});
    console.log('Curva de Mana Calculada (sem terrenos):', manaCurve);

  const typeCounts = deck.reduce((acc, entry) => {
    const typeLine = entry.card.type_line;
    const primaryType = typeLine.split(' - ')[0];
    const quantity = entry.quantity;

    if (!acc[primaryType]) {
      acc[primaryType] = 0;
    }
    acc[primaryType] += quantity;

    return acc;
  }, {});
  console.log('Contagem de Tipos Calculada:', typeCounts);

  const handleAddCard = (cardToAdd) => {
    const isBasicLand = cardToAdd.type_line.includes('Basic Land');

    if (isBasicLand) {
      const existingBasicLand = deck.find(entry =>
        entry.card.type_line.includes('Basic Land') && entry.card.name === cardToAdd.name
      );

      if (existingBasicLand) {
        handleUpdateQuantity(existingBasicLand.card.id, 'increment');
      } else {
        setDeck(currentDeck => [...currentDeck, { card: cardToAdd, quantity: 1, tags: []}]);
      }
    } else {
      const existingCardEntry = deck.find(entry => entry.card.id === cardToAdd.id);

      if (existingCardEntry) {
        toast.warn(`${cardToAdd.name} já está no seu deck (limite de 1 para não-básicos).`);
      } else {
        setDeck(currentDeck => [...currentDeck, { card: cardToAdd, quantity: 1, tags: []}]);
      }
    }
  };

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
            toast.warn(`Apenas 1 cópia de ${entry.card.name} é permitida.`);
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

  const handleSetDeck = (newDeck) => {
    setDeck(newDeck);
  };

  const handleMouseEnterCard = (card) => {
    setHoveredCard(card);
  };

  const handleMouseLeaveCard = () => {
    setHoveredCard(null);
  };

  const handleAddTagToCard = (cardId, tagName) => {
    if (!tagName.trim()) return;

    setDeck(currentDeck =>
      currentDeck.map(entry => {
        if (entry.card.id === cardId) {
          if (entry.tags.includes(tagName.trim())) {
            return entry;
          }

          return { ...entry, tags: [...entry.tags, tagName.trim()] };
        }
        return entry;
      })
    );
  };

  const handleRemoveTagFromCard = (cardId, tagName) => {
    setDeck(currentDeck =>
      currentDeck.map(entry => {
        if (entry.card.id === cardId) {
          return { ...entry, tags: entry.tags.filter(tag => tag !== tagName) };
        }
        return entry;
      })
    );
  };

  return (
    <div className={styles.appContainer} data-theme={theme}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Magic Planner</h1>
        <button onClick={toggleTheme} className={styles.themeToggle}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
    </div>

      <CardViewer card={hoveredCard} />

      <DeckIO deck={deck} onImportDeck={handleSetDeck} />
      
      <CardSearch onCardAdd={handleAddCard} />
      <hr className={styles.divider} />
      
      <DeckStats manaCurve={manaCurve} typeCounts={typeCounts}/>
      <hr className={styles.divider} />

      <DeckList 
        deck={deck}
        onRemoveCard={handleRemoveCard}
        onUpdateQuantity={handleUpdateQuantity}
        onAddTag={handleAddTagToCard}
        onRemoveTag={handleRemoveTagFromCard}
        onMouseEnterCard={handleMouseEnterCard}
        onMouseLeaveCard={handleMouseLeaveCard}
      />
      <ToastContainer autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
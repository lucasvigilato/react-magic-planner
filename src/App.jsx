import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import DeckStats from './components/DeckStats';
import CardSearch from './components/CardSearch';
import DeckList from './components/DeckList';
import DeckIO from './components/DeckIO';
import CardViewer from './components/CardViewer';
import styles from './App.module.css';
import DeckManager from './components/DeckManager';

function App() {


  const [allDecks, setAllDecks] = useState({});
  const [activeDeckName, setActiveDeckName] = useState(null);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [hoveredCard, setHoveredCard] = useState(null);

  const deck = allDecks[activeDeckName] || [];

  const manaCurve = deck.filter(entry => !entry.card.type_line.includes('Land')).reduce((acc, entry) => {
    const cmc = Math.floor(entry.card.cmc);
    const quantity = entry.quantity;
    if (!acc[cmc]) { acc[cmc] = 0; }
    acc[cmc] += quantity;
    return acc;
  }, {});

  const typeCounts = deck.reduce((acc, entry) => {
    const typeLine = entry.card.type_line;
    const primaryType = typeLine.split(' — ')[0];
    const quantity = entry.quantity;
    if (!acc[primaryType]) { acc[primaryType] = 0; }
    acc[primaryType] += quantity;
    return acc;
  }, {});

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('magicDecks', JSON.stringify(allDecks));
  }, [allDecks]);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await fetch('http://localhost:3001/decks');
        if (!response.ok) {
          throw new Error('Falha ao buscar decks do servidor.');
        }
        const decksFromDB = await response.json();

        const decksObject = decksFromDB.reduce((acc, deck) => {
          const cardsToFormat = deck.cards || [];
          
          const formattedCards = cardsToFormat.map(card => ({
            card: {
              id: card.scryfallId,
              name: card.name,
              type_line: card.type_line,
              cmc: card.cmc,
              image_uris: card.image_uris,
          },
        quantity: card.quantity,
        tags: []
        }));

          acc[deck.name] = formattedCards;
          return acc;
        }, {});

        setAllDecks(decksObject);
        if (decksFromDB.length > 0) {
          setActiveDeckName(decksFromDB[0].name);
        }
      } catch (error) {
        console.error('Erro ao carregar decks', error);
        toast.error('Não foi possível carregar os decks do servidor');
      }
    };

    fetchDecks();
  }, []);

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const handleMouseEnterCard = (card) => { setHoveredCard(card); };
  const handleMouseLeaveCard = () => { setHoveredCard(null); };

  const handleAddCard = (cardToAdd) => {
    const activeDeck = allDecks[activeDeckName] || [];
    const isBasicLand = cardToAdd.type_line.includes('Basic Land');
    const existingBasicLand = isBasicLand ? activeDeck.find(entry => entry.card.type_line.includes('Basic Land') && entry.card.name === cardToAdd.name) : null;
    const existingCardEntry = !isBasicLand ? activeDeck.find(entry => entry.card.id === cardToAdd.id) : null;

    if (existingBasicLand) {
      handleUpdateQuantity(existingBasicLand.card.id, 'increment');
    } else if (existingCardEntry) { 
      toast.warn(`${cardToAdd.name} já está no seu deck (limite de 1 para não-básicos).`);
    } else {
      const newActiveDeck = [...activeDeck, { card: cardToAdd, quantity: 1, tags: [] }];
      setAllDecks(currentAllDecks => ({
        ...currentAllDecks,
        [activeDeckName]: newActiveDeck
      }));
    }
  };

  const handleRemoveCard = (cardIdToRemove) => {
    setAllDecks(currentAllDecks => {
      const activeDeck = currentAllDecks[activeDeckName] || [];
      const newActiveDeck = activeDeck.filter(entry => entry.card.id !== cardIdToRemove);
      return { ...currentAllDecks, [activeDeckName]: newActiveDeck };
    });
  };

  const handleUpdateQuantity = (cardId, action) => {
    setAllDecks(currentAllDecks => {
      const activeDeck = currentAllDecks[activeDeckName] || [];
      const updatedDeck = activeDeck.map(entry => {
        if (entry.card.id === cardId) {
          const isBasicLand = entry.card.type_line.includes('Basic Land');
          if (!isBasicLand && action === 'increment' && entry.quantity >= 1) {
            toast.warn(`Apenas 1 cópia de ${entry.card.name} é permitida.`);
            return entry;
          }
          const newQuantity = action === 'increment' ? entry.quantity + 1 : entry.quantity - 1;
          return { ...entry, quantity: newQuantity };
        }
        return entry;
      }).filter(entry => entry.quantity > 0);
      return { ...currentAllDecks, [activeDeckName]: updatedDeck };
    });
  };

  const handleAddTagToCard = (cardId, tagName) => {
    if (!tagName.trim()) return;
    setAllDecks(currentAllDecks => {
      const activeDeck = currentAllDecks[activeDeckName] || [];
      const newActiveDeck = activeDeck.map(entry => {
        if (entry.card.id === cardId) {
          if (entry.tags.includes(tagName.trim())) return entry;
          return { ...entry, tags: [...entry.tags, tagName.trim()] };
        }
        return entry;
      });
      return { ...currentAllDecks, [activeDeckName]: newActiveDeck };
    });
  };
  
  const handleRemoveTagFromCard = (cardId, tagName) => {
    setAllDecks(currentAllDecks => {
      const activeDeck = currentAllDecks[activeDeckName] || [];
      const newActiveDeck = activeDeck.map(entry => {
        if (entry.card.id === cardId) {
          return { ...entry, tags: entry.tags.filter(tag => tag !== tagName) };
        }
        return entry;
      });
      return { ...currentAllDecks, [activeDeckName]: newActiveDeck };
    });
  };

  const handleSetDeck = (newDeck, deckName) => {
    const nameToUpdate = deckName || activeDeckName;
    setAllDecks(currentAllDecks => ({
      ...currentAllDecks,
      [nameToUpdate]: newDeck
    }));
    setActiveDeckName(nameToUpdate);
  };

  const handleCreateDeck = async () => {
    const newDeckName = prompt('Digite o nome do novo deck:');

    if (newDeckName && !allDecks[newDeckName]) {
      try {
        const response = await fetch('http://localhost:3001/decks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newDeckName,
            cards: []
          }),
        });

        if (!response.ok) {
          if (response.status === 409) {
            const errorData = await response.json();
            throw new Error(errorData.error);
          }
          throw new Error('Falha ao criar o deck no servidor.');
        }

        const savedDeck = await response.json();
        setAllDecks(currentAllDecks => ({
          ...currentAllDecks,
          [savedDeck.name]: []
        }));
        setActiveDeckName(savedDeck.name);
        toast.success(`Deck '${savedDeck.name}' criado com sucesso!`);

      } catch (error) {
        console.error('Erro ao criar deck', error.message);
        toast.error(error.message);
      }
    } else if (newDeckName) {
      toast.error(`Um deck com o nome '${newDeckName}' já existe.`);
    }
  };

  const handleSelectDeck = (deckName) => {
    setActiveDeckName(deckName);
  };

  const handleDeleteDeck = async (deckNameToDelete) => {
    if (window.confirm(`Tem certeza que deseja deletar o deck '${deckNameToDelete}'?`)) {
      try {
        const response = await fetch(`http://localhost:3001/decks/${encodeURIComponent(deckNameToDelete)}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Falha ao deletar o deck no servidor.');
        }

        setAllDecks(currentAllDecks => {
          const newAllDecks = { ...currentAllDecks };
          delete newAllDecks[deckNameToDelete];
          return newAllDecks;
        });

        if (activeDeckName === deckNameToDelete) {
          const remainingDecknames = Object.keys(allDecks).filter(name => name !== deckNameToDelete);
          setActiveDeckName(remainingDecknames[0] || null);
        }

        toast.info(`Deck '${deckNameToDelete}' deletado com sucesso!`);

      } catch (error) {
        console.error('Erro ao deletar o deck', error);
        toast.error('Não foi possível deletar o deck');
      }
    }
  };

  const handleImportDeck = (importedDeck) => {
    setAllDecks(currentAllDecks => ({
      ...currentAllDecks,
      [activeDeckName]: importedDeck
    }));
    toast.success(`Deck '${activeDeckName}' importado com sucesso!`);
  };

  return (
    <div className={styles.appContainer} data-theme={theme}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Magic Planner</h1>
        <button onClick={toggleTheme} className={styles.themeToggle}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <DeckManager
        allDecks={allDecks}
        activeDeckName={activeDeckName}
        onCreateDeck={handleCreateDeck}
        onSelectDeck={handleSelectDeck}
        onDeleteDeck={handleDeleteDeck}
      />

      <CardViewer card={hoveredCard} />
      <DeckIO deck={deck} onImportDeck={handleSetDeck} />
      <CardSearch onCardAdd={handleAddCard} />
      <hr className={styles.divider} />
      <DeckStats manaCurve={manaCurve} typeCounts={typeCounts} />
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
      <ToastContainer autoClose={3000} hideProgressBar theme={theme === 'dark' ? 'dark' : 'light'} />
    </div>
  );
}

export default App;
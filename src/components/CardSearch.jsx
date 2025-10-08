import { useState } from 'react';

import styles from './CardSearch.module.css';

function CardSearch({ onCardAdd }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [cardData, setCardData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (event) => {
        event.preventDefault(); // Impede o recarregamento da página
        setIsLoading(true); // Inicia o estado de carregamento
        setCardData(null); // Limpa dados anteriores
        setError(null); // Limpa erros anteriores

        try {
            const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${searchTerm}`);
            if (!response.ok) { // Scryfall vai dar erro 404 se não achar
                throw new Error('Carta não encontrada.');
            }
            const data = await response.json();
            setCardData(data); // Sucesso! Salva os dados da carta
        }   catch (err) {
            setError(err.message); // Falha! Salva a mensagem de erro
        }   finally {
            setIsLoading(false); // Termina o estado de carregamento (independente do sucesso ou falha)
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch} className={styles.searchContainer}>
                <input
                    type='text'
                    placeholder='Digite o nome da carta...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <button type='submit' disable={isLoading} className={styles.searchButton}>
                    {isLoading ? 'Buscando...' : 'Buscar Carta'}
                </button>
            </form>

            {/* Seção de Resultado */}
            {isLoading && <p>Carregando...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            {cardData && (
                <div className={styles.resultContainer}>
                    <h2>{cardData.name}</h2>
                    <img
                    src={cardData.image_uris.normal} 
                    alt={cardData.name} 
                    className={styles.cardImage}
                    />
                    <button
                    type='button'
                    onClick={() => onCardAdd(cardData)}
                    className={styles.addButton}
                    >
                        Adicionar ao Deck
                    </button>
                </div>
            )}
        </div>
    );
}

export default CardSearch;
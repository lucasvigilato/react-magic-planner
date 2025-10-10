import { toast } from 'react-toastify';
import { useState } from 'react';
import styles from './DeckIO.module.css';

function DeckIO({ deck, onImportDeck }) {

    const [importText, setImportText] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState(null);

    const handleExport = () => {
        if (deck.length ===0) {
            toast.info('O deck está vazio. Adicione cartas para exportar.');
            return;
        }

        const deckAsText = deck
            .map(entry => `${entry.quantity} ${entry.card.name}`)
            .join('\n');

        navigator.clipboard.writeText(deckAsText).then(() => {
            toast.success('Deck copiado para a área de transferência!');
        }).catch(err => {
            console.error('Erro ao copiar para a área de transferência:', err);
            toast.error('Não foi possível copiar o deck. Verifique as permissões do navegador.');
        });

    };

    const handleImport = async () => {
        if (!importText.trim()) {
            toast.info('Por favor, cole uma lista de deck na caixa de texto');
            return;
        }

        setIsImporting(true); 
        setError(null); 

        const lines = importText.trim().split('\n').filter(line => line.trim() !== '');

        try {
            const promises = lines.map(line => {
                const match = line.match(/^(\d+)\s+(.*)/);
                if (!match) throw new Error(`Linha mal formatada: "${line}"`);

                const cardName = match[2];
                return fetch(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`).then(res => {
                    if (!res.ok) throw new Error(`Carta não encontrada: "${cardName}"`);
                    return res.json();
                });
            });

            const resolvedCards = await Promise.all(promises);

            const consolidatedDeck = resolvedCards.reduce((acc, cardData, index) => {
                const quantity = parseInt(lines[index].match(/^(\d+)/)[0], 10);
                const isBasicLand = cardData.type_line.includes('Basic Land');
                let existingEntry;

                if (isBasicLand) {
                    existingEntry = acc.find(entry =>
                        entry.card.type_line.includes('Basic Land') && entry.card.name === cardData.name
                    );
                } else {
                    existingEntry = acc.find(entry => entry.card.id === cardData.id);
                }

                if (existingEntry) {
                    existingEntry.quantity += quantity;
                } else {
                    acc.push({ card: cardData, quantity: quantity});
                }

                return acc;
            }, []);

            onImportDeck(consolidatedDeck);
            setImportText('');
            setError(null);

        } catch (err) {
            setError(err.message);
            toast.error(`Erro na importação: ${err.message}`);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className={styles.ioContainer}>
            <button onClick={handleExport} className={styles.ioButton}>
                Exportar Deck
            </button>
            <div>
            <textarea
                className={styles.textArea}
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder="Cole sua lista de deck aqui...&#10;Ex:&#10;1 Sol Ring&#10;35 Mountain"
            />
            <button onClick={handleImport} className={styles.ioButton} disabled={isImporting}>
                {isImporting ? 'Importando...' : 'Importar Deck'}
            </button>
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
}

export default DeckIO;
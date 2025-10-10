import { useState } from 'react';
import styles from './DeckStats.module.css';

function DeckStats({ manaCurve, typeCounts }) {
  const [isDetailedView, setIsDetailedView] = useState(true);
  const sortedCosts = Object.keys(manaCurve).sort((a, b) => a - b);
  const simplifiedCounts = Object.entries(typeCounts).reduce((acc, [type, count]) => {
    let category;

    if (type.includes('Creature')) {
      category = 'Criaturas';
    } else if (type.includes('Land')) {
      category = 'Terrenos';
    } else if (type.includes('Instant')) {
      category = 'Instantâneas';
    } else if (type.includes('Sorcery')) {
      category = 'Feitiços';
    } else if (type.includes('Artifact')) {
      category = 'Artefatos';
    } else if (type.includes('Enchantment')) {
      category = 'Encantamentos';
    } else if (type.includes('Planeswalker')) {
      category = 'Planeswalker';
    } else {
      category = 'Outros';
    }

    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += count;
    return acc;
  }, {});

  if (sortedCosts.length === 0) {
    return null;
  }

  return (
    <div className={styles.statsContainer}>
      <h2>Curva de Mana</h2>
      <div className={styles.chartContainer}>
        {sortedCosts.map(cmc => (
          <div key={cmc} className={styles.barWrapper}>
            <span className={styles.countLabel}>{manaCurve[cmc]}</span>
            <div
              className={styles.bar}
              style={{ height: `${manaCurve[cmc] * 15}px` }}
              title={`Custo ${cmc}: ${manaCurve[cmc]} cartas`}
            ></div>
            <span className={styles.cmcLabel}>{cmc}</span>
          </div>
        ))}
      </div>
      
      <div className={styles.summaryContainer}>
        {sortedCosts.map(cmc => (
          <span key={`summary-${cmc}`} className={styles.summaryItem}>
            Custo {cmc}: <strong>{manaCurve[cmc]}</strong>
          </span>
        ))}
      </div>

      <div className={styles.typeCountsContainer}>
        <div className={styles.header}>
          <h3>Tipos de Carta</h3>
          <button
            className={styles.toggleButton}
            onClick={() => setIsDetailedView(!isDetailedView)}
          >
            {isDetailedView ? 'Ver Resumo' : 'Ver Detalhes'}
          </button>
        </div>
      </div>

      <div className={styles.typeList}>
        {isDetailedView ? (
          Object.keys(typeCounts).sort().map(type => (
            <div key={type} className={styles.typeItem}>
              <span>{type}:</span>
              <strong>{typeCounts[type]}</strong>
            </div>
          ))
        ) : (
          Object.keys(simplifiedCounts).sort().map(type => (
            <div key={type} className={styles.typeItem}>
              <span>{type}:</span>
              <strong>{simplifiedCounts[type]}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DeckStats;
import styles from './DeckStats.module.css';

function DeckStats({ manaCurve, typeCounts }) {
  const sortedCosts = Object.keys(manaCurve).sort((a, b) => a - b);

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
        <h3>Tipos de Carta</h3>
        <div className={styles.typeList}>
          {Object.keys(typeCounts).sort().map(type => (
            <div key={type} className={styles.typeItem}>
              <span>{type}:</span>
              <strong>{typeCounts[type]}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DeckStats;
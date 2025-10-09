import styles from './DeckStats.module.css';

function DeckStats({ manaCurve }) {
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
                        <div
                            className={styles.bar}
                            style={{ height: `${manaCurve[cmc] * 15}px`}}
                            title={`Custo ${cmc}: ${manaCurve[cmc]} cartas`}
                        ></div>
                        <span className={styles.cmcLabel}>{cmc}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DeckStats;
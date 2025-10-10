import styles from './CardViewer.module.css';

function CardViewer({ card }) {
    if (!card) {
        return null;
    }

    const imageUrl = card.image_uris?.large
                    || card.image_uris?.normal
                    || card.card_faces?.[0]?.image_uris?.large
                    || card.card_faces?.[0]?.image_uris?.normal;
    
    return (
        <div className={styles.viewerContainer}>
            <img src={imageUrl} alt={card.name} className={styles.viewerImage} />
        </div>
    );
}

export default CardViewer;
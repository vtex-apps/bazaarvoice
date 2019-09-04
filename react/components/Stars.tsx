import React, { FunctionComponent } from 'react'
import Star from './Star'

import styles from '../styles.css'

const getStarPercentage = (rating: number, i: number) => {
  let percentage
  if (rating >= i + 1) {
    percentage = '100%'
  } else if (i < rating && rating < i + 1) {
    percentage = `${(rating - i) * 100}%`
  } else {
    percentage = '0%'
  }
  return percentage
}

const generateStars = (rating: number) => {
  const stars = []
  for (let i = 0; i < 5; i++) {
    stars.push(
      <div className={`${styles.inactiveStarContainer} relative mr2`}>
        <Star
          key={i}
          fill="currentColor"
          className={styles.inactiveStar}
          size={20}
        />
        <div
          className={`${styles.ratingStarsActive} nowrap overflow-hidden absolute top-0-s left-0-s`}
          style={{ width: getStarPercentage(rating, i) }}
        >
          <span key={i} className={styles.activeStarContainer}>
            <Star fill="currentColor" className={styles.activeStar} size={20} />
          </span>
        </div>
      </div>
    )
  }
  return stars
}

const Stars: FunctionComponent<StarsProps> = ({ rating }) => {
  return (
    <div className={`${styles.ratingStars} dib relative v-mid mr2`}>
      <div className={`${styles.ratingStarsInactive} nowrap flex`}>
        {generateStars(rating)}
      </div>
    </div>
  )
}

interface StarsProps {
  rating: number
}

export default Stars

import React, { FunctionComponent } from 'react'

import Star from './Star'
import styles from '../styles.css'

const getStarPercentage = (rating: number, i: number) => {
  if (rating >= i + 1) {
    return '100%'
  }

  if (i < rating && rating < i + 1) {
    return `${(rating - i) * 100}%`
  }

  return '0%'
}

const fiveStars = [0, 1, 2, 3, 4]

const Stars: FunctionComponent<StarsProps> = ({ rating }) => {
  return (
    <div className={`${styles.ratingStars} dib relative v-mid mr2`}>
      <div className={`${styles.ratingStarsInactive} nowrap flex`}>
        {fiveStars.map((i) => {
          return (
            <div
              key={i}
              className={`${styles.inactiveStarContainer} relative mr2`}
            >
              <Star
                fill="currentColor"
                className={styles.inactiveStar}
                size={20}
              />
              <div
                className={`${styles.ratingStarsActive} nowrap overflow-hidden absolute top-0-s left-0-s`}
                style={{ width: getStarPercentage(rating, i) }}
              >
                <span className={styles.activeStarContainer}>
                  <Star
                    fill="currentColor"
                    className={styles.activeStar}
                    size={20}
                  />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface StarsProps {
  rating: number
}

export default Stars

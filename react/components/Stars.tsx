import React, { FunctionComponent } from 'react'
import Star from './Star'

import styles from '../styles.css'

const getStarPercentage = (rating:number, i:number) => {
  if(rating >= (i+1)) {
    return '100%'
  }
  return `${((rating - i) * 100)}%`
}

const Stars: FunctionComponent<StarsProps> = ({ rating }) => {
  return (
    <div className={`${styles.ratingStars} dib relative v-mid mr2`}>
      <div className={`${styles.ratingStarsInactive} nowrap flex`}>
        {[0, 1, 2, 3, 4].map((_, i) => {
          return (
            <div className="relative mr2">
              <Star
                key={i}
                fill="currentColor"
                className={''}
                size={20}
              />
              <div
                className={`${styles.ratingStarsActive} nowrap overflow-hidden absolute top-0-s left-0-s`}
                style={{ width: getStarPercentage(rating, i) }}
              >
                <span
                  key={i}
                  className={
                    rating > i ? styles.activeStarColor : styles.inactiveStarColor
                  }
                >
                  <Star
                    fill="currentColor"
                    className={i === 4 ? '' : ''}
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

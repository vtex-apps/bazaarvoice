import React, { FunctionComponent } from 'react'
import Star from './Star'

import styles from '../styles.css'

const Stars: FunctionComponent<StarsProps> = ({ rating }) => {
  return (
    <div className={`${styles.ratingStars} dib relative v-mid mr2`}>
      <div className={`${styles.ratingStarsInactive} nowrap`}>
        {[0, 1, 2, 3, 4].map((_, i) => {
          return (
            <Star key={i} fill={'#eee'} className={i === 4 ? '' : 'mr2'} size={20} />
          )
        })}
      </div>
      <div
        className={`${styles.ratingStarsActive} nowrap overflow-hidden absolute top-0-s left-0-s`}
        style={{ width: rating * 20 + '%' }}
      >
        {[0, 1, 2, 3, 4].map((_, i) => {
          return (
            <Star key={i} fill={rating > i ? '#fc0' : '#eee'} className={i === 4 ? '' : 'mr2'} size={20} />
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
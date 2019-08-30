import React, { FunctionComponent } from 'react'

import Star from './Star'
import styles from '../styles.css'

const Histogram: FunctionComponent<HistogramProps> = ({percentage, histogram, secondaryRatingsAverage}) => {
  return (
    <div className={styles.histogramOuterContainer}>
      <ul className={`${styles.histogramContainer} bg-muted-5 pa7 list flex br3 ba b--muted-4`}>
        <div className="flex flex-grow-1 flex-column">
          {percentage.map((percentage, i: number) => {
            return (
              <li key={i} className={`${styles.histogramLine} mv3`}>
                <span className={`${styles.histogramStarContainer} dib w-10 v-mid tr nowrap`}>
                  {5 - i}
                  <Star key={i} fill={'#000'} className={`${styles.histogramStar} mr2 pl2`} size={10} />
                </span>
                <span className={`${styles.histogramBar} bg-white dib h1 w-50 v-mid`}>
                  <div
                    className={`${styles.histogramBarValue} h1 bg-emphasis`}
                    style={{ width: percentage }}
                  ></div>
                </span>
                <span className={`${styles.histogramCount} pl3`}>{histogram[4-i].Count}</span>
              </li>
            )
          })}
        </div>
        {secondaryRatingsAverage &&
          <div className="flex flex-grow-1 flex-column">
            {secondaryRatingsAverage.map((rating, i:number) => {
              const percentage = rating.AverageRating * 100 / rating.ValueRange
              return (
                <li key={i} className={`${styles.secondaryHistogramLine} mv3`}>
                <span className={`${styles.secondaryHistogramLabel} dib w-50 v-mid tr nowrap pr2`}>
                  {rating.Id}
                </span>
                <span className={`${styles.secondaryHistogramBar} bg-white dib h1 w-30 v-mid`}>
                  <div
                    className={`${styles.secondaryHistogramBarValue} h1 bg-emphasis`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </span>
                <span className={`${styles.secondaryHistogramCount} pl3`}>{rating.AverageRating.toFixed(1)}</span>
              </li>
              )
            })}
          </div>
        }
      </ul>
    </div>
  )
}

interface HistogramProps {
  percentage: Array<string>
  histogram: Array<any>
  secondaryRatingsAverage: Array<any>
}

export default Histogram
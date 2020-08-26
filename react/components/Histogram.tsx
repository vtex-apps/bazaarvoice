import React, { FunctionComponent } from 'react'

import Star from './Star'
import HistogramBar from './HistogramBar'
import styles from '../styles.css'

const Histogram: FunctionComponent<HistogramProps> = ({
  percentages,
  histogram,
  secondaryRatingsAverage,
}) => {
  return (
    <div className={styles.histogramOuterContainer}>
      <ul
        className={`${styles.histogramContainer} bg-muted-5 pa7 list flex br3 ba b--muted-4 flex-column-s flex-row-l`}
      >
        <div className="flex flex-grow-1 flex-column pb8 pb0-ns">
          {percentages.map((percentage, i: number) => {
            return (
              <li key={i} className={`${styles.histogramLine} mv3`}>
                <span
                  className={`${styles.histogramStarContainer} dib w-10 v-mid tr nowrap`}
                >
                  {5 - i}
                  <Star
                    key={i}
                    fill="currentColor"
                    className={`${styles.histogramStar} mr2 pl2`}
                    size={10}
                  />
                </span>
                <HistogramBar
                  barClassName={`${styles.histogramBar} w-50 w-70-s`}
                  barValueClassName={styles.histogramBarValue}
                  percentage={percentage}
                  shouldShowDivisions={false}
                />
                <span className={`${styles.histogramCount} pl3`}>
                  {histogram[4 - i].Count}
                </span>
              </li>
            )
          })}
        </div>
        {secondaryRatingsAverage && (
          <div className="flex flex-grow-1 flex-column">
            {secondaryRatingsAverage.map((rating, i: number) => {
              const percentage =
                (rating.AverageRating * 100) / rating.ValueRange

              return (
                <li key={i} className={`${styles.secondaryHistogramLine} mv3`}>
                  <span
                    className={`${styles.secondaryHistogramLabel} dib w-50-ns w-100-s v-mid tr-ns tl-s nowrap-ns wrap-s pr3`}
                  >
                    {rating.Label}
                  </span>
                  <HistogramBar
                    barClassName={`${styles.secondaryHistogramBar} w-30-ns w-80-s`}
                    barValueClassName={styles.secondaryHistogramBarValue}
                    percentage={`${percentage}%`}
                    shouldShowDivisions
                  />
                  <span className={`${styles.secondaryHistogramCount} pl3`}>
                    {rating.AverageRating.toFixed(1)}
                  </span>
                </li>
              )
            })}
          </div>
        )}
      </ul>
    </div>
  )
}

interface HistogramProps {
  percentages: string[]
  histogram: any[]
  secondaryRatingsAverage: any[]
}

export default Histogram

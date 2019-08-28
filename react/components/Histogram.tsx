import React, { FunctionComponent } from 'react'

import Star from './Star'
import styles from '../styles.css'

const Histogram: FunctionComponent<HistogramProps> = ({percentage, histogram}) => {
  return (
    <div className={styles.histogramOuterContainer}>
      <ul className={`${styles.histogramContainer} bg-muted-5 pa7 list`}>
        {percentage.map((percentage, i: number) => {
          return (
            <li key={i} className={`${styles.histogramLine} mv3`}>
              <span className={`${styles.histogramStarContainer} dib w-10 v-mid tr nowrap`}>
                {5 - i}
                <Star key={i} fill={'#000'} className={`${styles.histogramStar} mr2 pl2`} size={10} />
              </span>
              <span className={`${styles.histogramBar} bg-white dib h1 w-50 v-mid`}>
                <div
                  className={`${styles.histogramBarValue} h1 bg-yellow`}
                  style={{ width: percentage }}
                ></div>
              </span>
              <span className={`${styles.histogramCount} pl3`}>{histogram[4-i].Count}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}



interface HistogramProps {
  percentage: Array<string>
  histogram: Array<any>
}

export default Histogram
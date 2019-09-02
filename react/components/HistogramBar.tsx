import React, { FunctionComponent } from 'react'
import styles from '../styles.css'

const createDivisions = () => {
  let divs = []
  for(let i = 0; i < 4; i++) {
    divs.push(<div className={`${styles.histogramDivisions} br b--muted-4 o-50 w-100`}/>)
  }
  divs.push(<div className="w-100" />)
  return divs
}

const HistogramBar: FunctionComponent<HistogramBarProps> = ({barClassName, barValueClassName, percentage, shouldShowDivisions}) => {
  return (
    <span className={`${styles.secondaryHistogramBar} ${barClassName} bg-white dib h1 relative v-mid ba b--muted-4 br3`}>
      <div
        className={`${styles.secondaryHistogramBarValue} ${barValueClassName} h1 bg-emphasis br3`}
        style={{ width: percentage }}
      ></div>
      {shouldShowDivisions &&
      <div className="absolute flex justify-between top-0 bottom-0 right-0 left-0">
        {createDivisions()}
      </div>
      }
    </span>
  )
}

interface HistogramBarProps {
  barClassName: string
  barValueClassName: string
  percentage: string
  shouldShowDivisions: boolean
}

export default HistogramBar
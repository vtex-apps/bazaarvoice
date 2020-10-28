import React, { FunctionComponent } from 'react'

import styles from '../styles.css'

const createDivisions = () => {
  const divs = []

  for (let i = 0; i < 4; i++) {
    divs.push(
      <div
        key={i}
        className={`${styles.histogramDivisions} br b--muted-4 o-50 w-100`}
      />
    )
  }

  divs.push(<div key={4} className="w-100" />)

  return divs
}

const HistogramBar: FunctionComponent<HistogramBarProps> = ({
  barClassName,
  barValueClassName,
  percentage,
  shouldShowDivisions,
}) => {
  return (
    <span
      className={` ${barClassName} bg-base dib h1 relative v-mid ba b--muted-4`}
    >
      <div
        className={` ${barValueClassName} h1 bg-emphasis`}
        style={{ width: percentage }}
      />
      {shouldShowDivisions && (
        <div className="absolute flex justify-between top-0 bottom-0 right-0 left-0">
          {createDivisions()}
        </div>
      )}
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

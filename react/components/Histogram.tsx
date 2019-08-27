import React, { FunctionComponent } from 'react'

import Star from './Star'

const Histogram: FunctionComponent<HistogramProps> = ({percentage}) => {
  return (
    <div className="review__histogram">
      <ul className="bg-muted-5 pa7 list">
        {percentage.map((percentage, i: number) => {
          return (
            <li key={i} className="mv3">
              <span className="dib w-10 v-mid">
                {5 - i}
                <Star key={i} fill={'#000'} className="mr2" size={10} />
              </span>
              <div className="review__histogram--bar bg-white dib h2 w-90 v-mid">
                <div
                  className="review__histogram--bar-value h2 bg-yellow"
                  style={{ width: percentage }}
                ></div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}



interface HistogramProps {
  percentage: Array<string>
}

export default Histogram
import React, { FunctionComponent } from 'react'
import styles from '../styles.css'

const Star: FunctionComponent<StarProps> = ({ fill }) => {
  return (
    <svg
      className={`${styles.star} ${fill ? styles['star--filled'] : ''}`}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill={fill ? '#fc0' : '#eee'}
      viewBox="0 0 14.737 14"
    >
      <path
        d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
        transform="translate(0)"
      />
    </svg>
  )
}

interface StarProps {
  fill: boolean
}

export default Star

import React, { FunctionComponent } from 'react'

const Stars: FunctionComponent<StarsProps> = ({ rating }) => {
  return (
    <div className="review__rating--stars dib relative v-mid mr2">
      <div className="review__rating--inactive nowrap">
        {[0, 1, 2, 3, 4].map((_, i) => {
          return i <= 3 ? (
            <svg
              className="mr2"
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill={'#eee'}
              viewBox="0 0 14.737 14"
            >
              <path
                d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                transform="translate(0)"
              />
            </svg> // se o review.metrics.rating for 4, preenche 4 estrelas
          ) : (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill={'#eee'}
              viewBox="0 0 14.737 14"
            >
              <path
                d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                transform="translate(0)"
              />
            </svg> // se o review.metrics.rating for 4, preenche 4 estrelas
          )
        })}
      </div>
      <div
        className="review__rating--active nowrap overflow-hidden absolute top-0-s left-0-s"
        style={{ width: rating * 20 + '%' }}
      >
        {[0, 1, 2, 3, 4].map((_, i) => {
          return i <= 3 ? (
            <svg
              className="mr2"
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill={rating > i ? '#fc0' : '#eee'}
              viewBox="0 0 14.737 14"
            >
              <path
                d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                transform="translate(0)"
              />
            </svg> // se o review.metrics.rating for 4, preenche 4 estrelas
          ) : (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill={rating > i ? '#fc0' : '#eee'}
              viewBox="0 0 14.737 14"
            >
              <path
                d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z"
                transform="translate(0)"
              />
            </svg> // se o review.metrics.rating for 4, preenche 4 estrelas
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
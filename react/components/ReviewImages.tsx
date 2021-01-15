import React, { FunctionComponent, useState } from 'react'
import { SliderLayout } from 'vtex.slider-layout'
import { Modal } from 'vtex.styleguide'

import Review from './Review'
import styles from '../styles.css'

const sliderLayoutConfig = {
  showNavigationArrows: 'desktopOnly',
  showPaginationDots: 'desktopOnly',
  infinite: true,
  itemsPerPage: 1,
}

const ReviewImages: FunctionComponent<{ review: Review }> = ({ review }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  if (!review.Photos.length) {
    return null
  }

  return (
    <div className={`${styles.reviewImagesContainer} mt6 flex items-start`}>
      {review.Photos.map((item, i) => {
        return (
          <div
            role="button"
            tabIndex={0}
            key={i}
            onKeyPress={() => setIsModalOpen(true)}
            onClick={() => setIsModalOpen(true)}
          >
            <img
              alt="Product"
              className={`${styles.reviewImage} db mr1 `}
              src={item.Sizes.thumbnail.Url}
            />
          </div>
        )
      })}
      <Modal
        centered
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(!isModalOpen)}
      >
        <SliderLayout {...sliderLayoutConfig}>
          {review.Photos.map((item, i) => (
            <div className="pb5" key={i}>
              <img src={item.Sizes.normal.Url} alt="Product" />
            </div>
          ))}
        </SliderLayout>
      </Modal>
    </div>
  )
}

export default ReviewImages

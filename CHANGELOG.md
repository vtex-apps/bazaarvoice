# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.9.1] - 2021-01-22

### Fixed

- Transaction pixel value formatting

## [1.9.0] - 2021-01-15

### Added

- Modal to display full sized review images

### Fixed

- Review image thumbnail sizing
- Use locale review count in Rating Summary

## [1.8.3] - 2021-01-08

### Added

- Product @id field to schema

### Fixed

- Bazaarvoice transaction pixel order values

## [1.8.2] - 2021-01-05

### Added

- Add metadata to app store

## [1.8.1] - 2020-12-02

### Changed

- Filter by current locale when querying for reviews

## [1.8.0] - 2020-10-28

### Added

- `locale` app setting

### Changed

- Updated CODEOWNERS

### Fixed

- Replaced hardcoded English strings with intl messages
- Updated tooling and linted code

## [1.7.0] - 2020-10-08

### Added

- Added Comments to Reviews request
- Added Client Response to Results

## [1.6.2] - 2020-10-01

### Fixed

- Continuous returnPage redirect on review submission

## [1.6.1] - 2020-09-17

### Fixed

- Product review link.

## [1.6.0] - 2020-08-27

### Added

- Reviews Structured Data

### Changed

- Change code structure to use app settings from runtime, instead of fetching.

## [1.5.10] - 2020-07-14

### Fixed

- GraphQL response when Bazaarvoice API returns two products.

## [1.5.9] - 2020-05-11

### Fixed

- "Write a review" button URL.
- Usage of Bazaarvoice JavaScript library.

## [1.5.8] - 2020-05-11

### Fixed

- Vary used product id based on the app `uniqueId` settings.

## [1.5.7] - 2019-12-12

### Fixed

- `total` field of the `Transaction` event.

### Added

- `discount` and `productId` to the `Transaction` event.

## [1.5.6] - 2019-11-18

### Fixed

- Product name encoding

## [1.5.5] - 2019-11-06

### Fixed

- Infinite pixel errors on workspaces that did not have bazaarvoice.

## [1.5.4] - 2019-10-23

### Changed

- `trackTransaction` total to be the subtotal

## [1.5.3] - 2019-10-17

### Added

- tax and shipping to `trackTransaction`

## [1.5.2] - 2019-10-17

### Added

- email and nickname to `trackTransaction`

## [1.5.1] - 2019-10-15

### Fixed

- pagination issue that caused the `previous page` button not to work

## [1.5.0] - 2019-10-11

### Added

- support to Bazaarvoice tracking events

## [1.4.0] - 2019-10-02

### Added

- support to the bazaarvoice pixel `trackTransaction` operation

## [1.3.1] - 2019-09-17

### Fixed

- Some loading issues

### Added

- Reviews to CMS

## [1.3.0] - 2019-09-09

### Added

- quantityPerPage and quantityFirstPage on Reviews
- `default ordination type` to the app's settings

## [1.2.2] - 2019-09-05

### Fixed

- No reviews page

### Added

- Clicking on RatingSummary stars now scrolls to reviews

## [1.2.1] - 2019-09-04

### Fixed

- Stars weren't being filled correctly

## [1.2.0] - 2019-09-04

### Fixed

- Bazaarvoice mobile layout
- RatingSummary

### Added

- Secondary Ratings review data and general histogram

## [1.1.4] - 2019-08-29

## [1.1.3] - 2019-08-28

### Fixed

- Bug that showed the `noReviews` page when there were reviews

## [1.1.2] - 2019-08-28

### Added

- Styling to the `Reviews` component

## [1.1.1] - 2019-08-27

### Fixed

- `Most Recent` ordination

### Added

- `scrollIntoView` when changing the reviews page

## [1.1.0] - 2019-08-19

### Fixed

- Show reviews

### Added

- The component isn't displayed anymore when it has errors
- Refactored the whole code to improve the code quality

## [1.0.6] - 2019-08-05

### Fixed

- Fixed typo in CSS

## [1.0.5] - 2019-07-22

### Fixed

- Removed denial attribute from product check

## [1.0.4] - 2019-06-21

### Fixed

- Add product-review-form to plugins.

### Added

- Cache to app settings query.

## [1.0.3] - 2019-06-19

### Fixed

- Publish script.

## [1.0.2] - 2019-06-19 [YANKED]

### Fixed

- Rating summary layout.
- Get Reviews product data from Context so it's possible to position in any place of the PDP.
- Add app title and description.

### Added

- Some initial CSS handles.

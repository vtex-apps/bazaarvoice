# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
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


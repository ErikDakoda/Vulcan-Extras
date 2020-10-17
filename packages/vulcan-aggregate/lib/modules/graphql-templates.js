import { multiInputType, multiOutputType } from 'meteor/vulcan:core';
const multiReturnProperty = 'results';


/**
 * A query for multiple documents as a result of an aggregate or custom resolver
 * @example
 * MoviesByRating(input: MultiMoviesByRatingInput) : MultiMoviesByRatingOutput
 */
export const aggregateQueryTemplate = ({ typeName }) =>
  `${typeName}(input: ${multiInputType(typeName, false)}): ${multiOutputType(typeName)}`;


/**
 * Aggregate query used on the client
 * @example
 * query MoviesByRatingQuery($input: MultiMovieInput) {
 *   MoviesByRating(input: $input) {
 *     results {
 *       _id
 *       name
 *       __typename
 *     }
 *     totalCount
 *     __typename
 *   }
 * }
 */
export const aggregateClientTemplate = ({ typeName, fragmentName, extraQueries }) =>
  `query ${typeName}Query($input: ${multiInputType(typeName, false)}) {
  ${typeName}(input: $input) {
    ${multiReturnProperty} {
      ...${fragmentName}
    }
    totalCount
    __typename
  }
  ${extraQueries ? extraQueries : ''}
}`;

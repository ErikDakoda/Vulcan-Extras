/*

### withAggregate

Paginated items container for a custom or aggregate query

Options:

  - resolverName: the name of the resolver previously registered using registerAggregateResolver
  - fragment: the fragment that defines which properties to fetch
  - fragmentName: the name of the fragment, passed to getFragment
  - limit: the number of documents to show initially
  - pollInterval: how often the data should be updated, in ms (set to 0 to disable polling)
  - input: the initial query input
    - filter
    - sort
    - search
    - offset
    - limit
    
*/

import React from 'react';
import {
  getFragment,
  getFragmentName,
  getInitialPaginationInput,
  buildMultiQueryOptions,
  buildMultiResult,
} from 'meteor/vulcan:core';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import gql from 'graphql-tag';
import get from 'lodash/get';
import { aggregateClientTemplate } from './graphql-templates';

export const buildAggregateQuery = ({ typeName, fragmentName, extraQueries, fragment }) => gql`
    ${aggregateClientTemplate({ typeName, fragmentName, extraQueries })}
    ${fragment}
`;

export const useAggregate = (options, props = {}) => {
  const initialPaginationInput = getInitialPaginationInput(options, props);
  const [paginationInput, setPaginationInput] = useState(initialPaginationInput);
  
  const { resolverName, extraQueries } = options;
  //const queryName = `${resolverName}Query`;
  const fragment = options.fragment || getFragment(options.fragmentName);
  const fragmentName = getFragmentName(fragment);
  
  // build graphql query from options
  const query = buildAggregateQuery({ typeName: resolverName, fragmentName, extraQueries, fragment });
  
  const queryOptions = buildMultiQueryOptions(options, paginationInput, props);
  const queryRes = useQuery(query, queryOptions);
  
  // workaround for https://github.com/apollographql/apollo-client/issues/2810
  queryRes.graphQLErrors = get(queryRes, 'error.networkError.result.errors');
  
  const result = buildMultiResult(
    options,
    { fragment, fragmentName, resolverName },
    { setPaginationInput, paginationInput, initialPaginationInput },
    queryRes,
  );
  
  return result;
};

export const withAggregate = options => C => {
  const Wrapped = props => {
    const res = useAggregate(options, props);
    return <C {...props} {...res}/>;
  };
  Wrapped.displayName = `withAggregate`;
  return Wrapped;
};

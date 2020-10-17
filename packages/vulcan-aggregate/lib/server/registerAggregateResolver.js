import {
  debug,
  debugGroup,
  debugGroupEnd,
  addGraphQLQuery,
  addGraphQLResolvers,
  GraphQLSchema,
  getSetting,
  multiInputType,
  multiInputTemplate,
  multiOutputType,
  multiOutputTemplate,
  fieldFilterInputTemplate,
  fieldSortInputTemplate,
} from 'meteor/vulcan:core';
import stringify from 'json-stringify-safe';


export const registerAggregateQuery = function (params) {
  const { name, description, aggregation, filterable, graphQLType } = params;

  const aggregate = {

    name,

    description,

    async resolver(root, { input = {} }, context, { cacheControl }) {
      const { enableCache = false } = input;

      debug('');
      debugGroup(`------------- start \x1b[35m${name}\x1b[0m resolver -------------`);
      debug(`Input: ${stringify(input)}`);

      if (cacheControl && enableCache) {
        const maxAge = getSetting('graphQL.cacheMaxAge');
        cacheControl.setCacheHint({ maxAge });
      }

      const { results, totalCount } = await aggregation(name, input, context);

      // prime the cache
      //results.forEach(doc => Suppliers.loader.prime(doc._id, doc));

      debug(`\x1b[33m=> ${results.length} of ${totalCount} documents returned\x1b[0m`);
      debugGroupEnd();
      debug(`------------- end \x1b[35m${name}\x1b[0m resolver -------------`);
      debug('');

      // return results
      return { results, totalCount };
    },

  };

  const typeName = aggregate.name;

  const schemas = [];

  schemas.push(graphQLType);
  schemas.push(fieldFilterInputTemplate({ typeName, fields: filterable }));
  schemas.push(fieldSortInputTemplate({ typeName, fields: filterable }));
  schemas.push(multiInputTemplate({ typeName }));
  schemas.push(multiOutputTemplate({ typeName }));

  const schema = schemas.join('\n');
  GraphQLSchema.addSchema(schema);

  addGraphQLQuery(`${typeName}(input: ${multiInputType(typeName)}): ${multiOutputType(typeName)}`);
  addGraphQLResolvers({ Query: {
      [typeName]: aggregate.resolver.bind(aggregate)
    }
  });

};

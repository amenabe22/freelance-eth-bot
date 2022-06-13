import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import { APOLLO_GRAPHQL_URL, HASURA_GRAPHQL_ADMIN_SECRET } from '../constants';
import fetch from 'cross-fetch';


export const client = new ApolloClient({
    link: new HttpLink({
        uri: APOLLO_GRAPHQL_URL, fetch,
        credentials: 'same-origin', 
        headers:{
            "x-hasura-admin-secret":HASURA_GRAPHQL_ADMIN_SECRET
        }
    }),
    cache:new InMemoryCache()
});
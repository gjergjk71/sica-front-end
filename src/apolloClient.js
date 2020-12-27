import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, Observable } from 'apollo-link';
import { RestLink } from 'apollo-link-rest';
import { API_ENDPOINT } from './configs';

const request = async (operation) => {
  const token = localStorage.getItem("auth:token");
  operation.setContext({
    headers: {
      
    }
  });
};

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle;
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
);

const restLink = ApolloLink.from([
  requestLink,
  new RestLink({ uri: API_ENDPOINT })
])

const client = new ApolloClient({
  link: restLink,
  cache: new InMemoryCache()
});

export default client;

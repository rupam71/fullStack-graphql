import Header from "./components/header";
import {ApolloProvider,ApolloClient, InMemoryCache} from '@apollo/client'
import Clients from "./components/clients";
import AddClientModal from "./components/AddClientModal";
import Projects from "./components/projects";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          // Here we are giving permission to reWrite cache
          // for this query via writeQuery
          merge(existing, incoming){
            return incoming;
          }
        },
        projects: {
          merge(existing, incoming){
            return incoming;
          }
        }
      }
    }
  }
})

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  //cache: new InMemoryCache(),
  cache
})

function App() {
  return (
    <>
    <ApolloProvider client={client}>
      <Header />
      <div className="container">
        <AddClientModal />
        <Projects />
        <Clients />
      </div>
    </ApolloProvider>
    </>
  );
}

export default App;

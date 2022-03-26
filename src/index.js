import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const getLibrary = (providers, connector) => {
  return new Web3Provider(providers);
};

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/sotatek-anhnguyen27/finalsubgraphweb3",
  cache: new InMemoryCache()
});

const Web3ProviderNetwork = createWeb3ReactRoot("NETWORK");
ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();

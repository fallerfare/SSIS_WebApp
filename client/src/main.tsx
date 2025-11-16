import React from "react"
import ReactDOM from "react-dom/client"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import App from "./App"
import "./style/index.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { AuthProvider } from "./contexts/authContext"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>
)

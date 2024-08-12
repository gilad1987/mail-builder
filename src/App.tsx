// core controllers are required for all packages
import "@mantine/core/styles.css";
import "./App.scss";
import MailBuilder from "./components/MailBuilder/MailBuilder.tsx";
import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  /** Your theme override here */
});
function App() {
  return (
    <MantineProvider theme={theme}>
      <MailBuilder />
    </MantineProvider>
  );
}

export default App;

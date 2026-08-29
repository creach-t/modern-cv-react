import React from "react";
import { ColorProvider } from "./contexts/ColorContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ContactModalProvider } from "./contexts/ContactModalContext";
import { OSProvider } from "./os/osContext";
import { DataProvider } from "./os/data/DataContext";
import OSRoot from "./os/OSRoot";

const App = () => {
  return (
    <LanguageProvider>
      <ColorProvider>
        <ContactModalProvider>
          <OSProvider>
            <DataProvider>
              <OSRoot />
            </DataProvider>
          </OSProvider>
        </ContactModalProvider>
      </ColorProvider>
    </LanguageProvider>
  );
};

export default App;

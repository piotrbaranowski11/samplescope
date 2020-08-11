import React, { Profiler } from 'react';

import SearchResultComponents from './components/SearchResultComponents';
import AppHeader from '@components/AppHeader';
import ErrorTracker from '~/components/Errors/ErrorTracker';
import { AppContextProvider } from './context/App.context';

import './styles/global.css';
import './styles/theme.css';
import './App.css';

const App = () => {
  return (
    <ErrorTracker>
      <AppContextProvider value={undefined}>
        <Profiler id="App" onRender={() => {}}>
          <div className="app-shell">
            <AppHeader />
            <SearchResultComponents />

            {/* <SettingsScreen /> */}

            {/* <Content /> */}
          </div>
        </Profiler>
      </AppContextProvider>
    </ErrorTracker>
  );
};

export default App;
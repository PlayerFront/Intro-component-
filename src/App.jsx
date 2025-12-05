import { useState } from 'react';
import './App.scss';
import LegacyComponent from './Versions/legacy/components/IntroComponent/IntroComponent';
import ModernComponent from './Versions/modern/components/IntroComponent/IntroComponent';

function App() {
  const [useLegacyVersion, setUseLegacyVersion] = useState(true);

  return (
    <div className='app-container'>
      {useLegacyVersion ? <LegacyComponent /> : <ModernComponent />}
      <div className='version-switcher'>
        <button
          className={useLegacyVersion ? 'active' : ''}
          onClick={() => setUseLegacyVersion(true)}
        >
          Legacy Version - Handmade
        </button>
        <button
          className={!useLegacyVersion ? 'active' : ''}
          onClick={() => setUseLegacyVersion(false)}
        >
          Modern Version - React Hook Form
        </button>
      </div>
    </div>
  );
}

export default App;

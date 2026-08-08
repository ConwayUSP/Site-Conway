import AppLayout from '@layouts/AppLayout'
import React, { useEffect } from 'react';
import { initializeProgressTracker, getPercentage } from '@utils/trailProgressFunctions.jsx'

function App() {
  useEffect(() => {
    if (localStorage.getItem('opengl') == null) {initializeProgressTracker();}
  }, []); 
  return (
    <AppLayout />
  )
}

export default App

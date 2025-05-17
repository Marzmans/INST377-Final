import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

// REQUIREMENT: Advanced CSS animations - Page transitions
function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    // If location has changed
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut");
      // Wait for animation to finish before updating the location
      setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 300); // Match the CSS animation duration
    }
  }, [location, displayLocation]);

  return (
    <div className={`page-transition ${transitionStage}`}>
      {children}
    </div>
  );
}

export default PageTransition;
import { useState, useEffect } from "react";
import { SunIcon } from "../assets/icons/SunIcon";
import { MoonIcon } from "../assets/icons/MoonIcon";

export function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // On component mount, check if user has a preference
  useEffect(() => {
    // Check if user has a preference in localStorage
    const savedPreference = localStorage.getItem("darkMode");
    
    // If they have a preference, use it
    if (savedPreference !== null) {
      setDarkMode(savedPreference === "true");
    } 
    // Otherwise check system preference
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Update the document when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2.5 rounded-md bg-[--bg-secondary] text-[--text-primary] hover:bg-[--bg-hover] transition-colors"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}

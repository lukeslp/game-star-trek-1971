import { useEffect, useState } from "react";
import { driver, type DriveStep, type Config } from "driver.js";
import "driver.js/dist/driver.css";

const TOUR_STORAGE_KEY = "star-trek-tour-completed";

/**
 * Custom hook to manage the intro tour for new users
 * Uses localStorage to track if user has seen the tour
 */
export function useTour() {
  const [hasSeenTour, setHasSeenTour] = useState(true); // Default to true to prevent flash

  useEffect(() => {
    // Check if user has seen the tour
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    setHasSeenTour(!!tourCompleted);
  }, []);

  const startTour = () => {
    const tourSteps: DriveStep[] = [
      {
        element: "header h1",
        popover: {
          title: "Welcome to Star Trek 1971",
          description: "This is a faithful recreation of the classic text-based Star Trek game. Your mission: eliminate all Klingon ships before time runs out!",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: "[data-tour='status-bar']",
        popover: {
          title: "Status Display",
          description: "Monitor critical ship information: Stardate (current time), Time Left (mission deadline), Condition (ship status), Energy, Shields, Torpedoes, and remaining Klingons.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='galaxy-map']",
        popover: {
          title: "Galaxy Map",
          description: "The 8x8 galaxy grid. ◆ marks your position, ! indicates Klingons, and · shows explored sectors. Navigate between quadrants to hunt down the enemy.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "[data-tour='sector-scan']",
        popover: {
          title: "Sector Scan",
          description: "Your current quadrant view. E = Enterprise (you), K = Klingon, B = Starbase (refuel here), * = Star (blocks torpedoes). Each quadrant is an 8x8 sector grid.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "[data-tour='console']",
        popover: {
          title: "Console Output",
          description: "All game messages, status reports, and combat results appear here. Keep an eye on this for mission updates and warnings.",
          side: "left",
          align: "start",
        },
      },
      {
        element: "[data-tour='command-panel']",
        popover: {
          title: "Command Panel",
          description: "Quick access to common commands. NAV (navigate), SRS (short range scan), LRS (long range scan), PHA (phasers), TOR (torpedoes), SHE (shields), DAM (damage report), COM (computer), HELP (command list).",
          side: "top",
          align: "start",
        },
      },
      {
        element: "[data-tour='command-input']",
        popover: {
          title: "Command Input",
          description: "Type commands manually here or use the buttons above. Try 'HELP' to see all available commands. Good luck, Captain!",
          side: "top",
          align: "start",
        },
      },
    ];

    const driverConfig: Config = {
      showProgress: true,
      steps: tourSteps,
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      doneBtnText: "Start Mission!",
      progressText: "{{current}} of {{total}}",
      animate: true,
      stagePadding: 12,
      stageRadius: 10,
      allowClose: true,
      onDestroyStarted: () => {
        // Mark tour as completed when user finishes or skips
        localStorage.setItem(TOUR_STORAGE_KEY, "true");
        setHasSeenTour(true);
        driverObj.destroy();
      },
    };

    const driverObj = driver(driverConfig);
    driverObj.drive();
  };

  const resetTour = () => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setHasSeenTour(false);
  };

  return {
    hasSeenTour,
    startTour,
    resetTour,
  };
}


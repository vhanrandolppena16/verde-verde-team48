// AlertContext.jsx

// React and Firebase imports
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { ref, onValue, push } from "firebase/database";
import { sensor_db } from "../../../../../../firebase_database/firebase"; // Firebase RTDB reference

// Create context to be accessed globally
const AlertContext = createContext();

// Safe thresholds for each parameter (used for alert logic)
const THRESHOLDS = {
  temperature: { min: 18, max: 30 },
  humidity: { min: 40, max: 80 },
  ph: { min: 5, max: 7.5 },
  tds: { min: 500, max: 1500 },
};

// AlertProvider wraps the app to monitor sensor data
export const AlertProvider = ({ children }) => {
  const [activeAlerts, setActiveAlerts] = useState({});
  const latestAlertsRef = useRef({}); // Ref to persist latest alerts across renders without re-subscribing

  // Function: checks live sensor data and determines alert/resolution status
  const checkLiveData = (entry) => {
    const now = new Date();
    const updatedActive = { ...latestAlertsRef.current }; // Work on latest snapshot
    const newIssues = [];
    const resolvedIssues = [];

    // Iterate over each parameter to evaluate thresholds
    Object.entries(THRESHOLDS).forEach(([param, range]) => {
      const val = parseFloat(entry[param]);
      if (isNaN(val)) return;

      const isOutOfRange = val < range.min || val > range.max;
      const wasAlerting = !!updatedActive[param];

      if (isOutOfRange && !wasAlerting) {
        // New ALERT
        updatedActive[param] = {
          timestamp: now.toISOString(),
          id: null,
          condition: val < range.min ? "LOW" : "HIGH",
        };
        newIssues.push({
          parameter: param,
          value: val,
          threshold: `${range.min}–${range.max}`,
          condition: val < range.min ? "LOW" : "HIGH",
        });
      } else if (!isOutOfRange && wasAlerting) {
        // RESOLVED
        const start = new Date(updatedActive[param].timestamp);
        resolvedIssues.push({
          parameter: param,
          value: val,
          resolved: true,
          resolvedAt: now.toISOString(),
          durationMinutes: Math.round((now - start) / 60000),
          range: `${range.min}–${range.max}`,
          condition: "NORMAL",
          triggeredId: updatedActive[param].id,
        });
        delete updatedActive[param];
      }
    });

    // Log alert to Firebase
    if (newIssues.length > 0) {
      const alertEntry = {
        timestamp: now.toISOString(),
        issues: newIssues,
        raw: entry,
        status: "alert",
      };
      const newRef = push(ref(sensor_db, "logs"), alertEntry);
      const newId = newRef.key;

      newIssues.forEach((issue) => {
        if (updatedActive[issue.parameter]) {
          updatedActive[issue.parameter].id = newId;
        }
      });
    }

    // Log resolution
    if (resolvedIssues.length > 0) {
      push(ref(sensor_db, "logs"), {
        timestamp: now.toISOString(),
        issues: resolvedIssues,
        raw: entry,
        status: "resolved",
      });
    }

    latestAlertsRef.current = updatedActive; // Update ref state
    setActiveAlerts(updatedActive);          // Update react state
  };

  // Live Firebase subscription (runs once)
  useEffect(() => {
    const sensorRef = ref(sensor_db, "sensor_logs");
// 
    // const sensorRef = ref(sensor_db, "control_logging");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const latest = Object.values(data).pop();
        if (latest) checkLiveData(latest);
      }
    });

    return () => unsubscribe();
  }, []);

  // Context value to be consumed
  return (
    <AlertContext.Provider value={{ activeAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};

// Hook to consume context
export const useAlert = () => useContext(AlertContext);

  // SensorLogs.jsx
  import React, { useEffect, useState } from "react";
  // import { useAlert } from "./logs_components/AlertContext";
  import { getDatabase, ref, onValue } from "firebase/database";

  const Logs = () => {
    // const { activeAlerts } = useAlert();
    // const [alertLogs, setAlertLogs] = useState([]);
    // const [showAlertHistory, setShowAlertHistory] = useState(true);
    // const [showDetailedIssues, setShowDetailedIssues] = useState(false);
    // const currentIssues = Object.keys(activeAlerts);

    // useEffect(() => {
    //   const db = getDatabase();
    //   const alertsRef = ref(db, "readings");

    //   const unsubscribe = onValue(alertsRef, (snapshot) => {
    //     const data = snapshot.val();
    //     if (data) {
    //       const parsedData = Object.entries(data)
    //         .map(([key, value]) => ({ id: key, ...value }))
    //         .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
    //       setAlertLogs(parsedData);
    //     } else {
    //       setAlertLogs([]);
    //     }
    //   });

    //   return () => unsubscribe();
    // }, []);

    // const findTimestampForParam = (param) => {
    //   const active = activeAlerts[param];
    //   if (!active || !active.id) return "Unknown time";
    //   return active.timestamp ? new Date(active.timestamp).toLocaleString() : "Unknown time";
    // };

    // const renderConditionIcon = (condition) => {
    //   if (condition === "HIGH") return "🔺"; // Arrow up for HIGH
    //   if (condition === "LOW") return "🔻"; // Arrow down for LOW
    //   if (condition === "NORMAL") return "✅"; // Checkmark for NORMAL
    //   return ""; // No icon otherwise
    // };

    return (
      <div className="w-full p-6 flex flex-col gap-8 mt-10 overflow-y-auto h-full">

        <p className = "text-lg bg-green-500">Sensor Logs</p>
        

      </div>
    );
  };

  export default Logs;

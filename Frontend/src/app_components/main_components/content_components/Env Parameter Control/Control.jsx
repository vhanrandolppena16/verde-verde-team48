import React, { useState, useEffect } from 'react';
// import { useAlert } from '../SensorLogs/logs_components/AlertContext';

const initialRelays = [
  { name: 'Pump 1 - pH Up', icon: '🧪⬆️', state: false },
  { name: 'Pump 2 - pH Down', icon: '🧪⬇️', state: false },
  { name: 'Nutrient Pump - TDS Up', icon: '🥬', state: false },
  { name: 'Water Pump', icon: '🚰', state: false },
  { name: 'Exhaust', icon: '🌬️', state: false },
  { name: 'Humidifier', icon: '💨', state: false },
  { name: 'Heater', icon: '🔥', state: false },
  { name: 'Cooler', icon: '❄️', state: false }
];

const Control = () => {
  // const [relays, setRelays] = useState(initialRelays);
  // const { activeAlerts } = useAlert();

  useEffect(() => {
    document.title = "Control | Verde";
  }, []);

  // useEffect(() => {
  //   setRelays((prevRelays) =>
  //     prevRelays.map((relay) => {
  //       const updatedRelay = { ...relay };

  //       const tempCondition = activeAlerts.temperature?.condition;
  //       const humidityCondition = activeAlerts.humidity?.condition;
  //       const tdsCondition = activeAlerts.tds?.condition;
  //       const phCondition = activeAlerts.ph?.condition;

  //       switch (relay.name) {
  //         case 'Cooler':
  //           updatedRelay.state = tempCondition === "HIGH";
  //           break;
  //         case 'Heater':
  //           updatedRelay.state = tempCondition === "LOW";
  //           break;
  //         case 'Humidifier':
  //           updatedRelay.state = humidityCondition === "LOW";
  //           break;
  //         case 'Exhaust':
  //           updatedRelay.state = humidityCondition === "HIGH";
  //           break;
  //         case 'Nutrient Pump - TDS Up':
  //           updatedRelay.state = tdsCondition === "LOW";
  //           break;
  //         case 'Pump 1 - pH Up':
  //           updatedRelay.state = phCondition === "LOW";
  //           break;
  //         case 'Pump 2 - pH Down':
  //           updatedRelay.state = phCondition === "HIGH";
  //           break;
  //         case 'Water Pump':
  //           updatedRelay.state = tdsCondition === "HIGH";
  //           break;
  //         default:
  //           break;
  //       }

  //       return updatedRelay;
  //     })
  //   );
  // }, [activeAlerts]);

  // const toggleRelay = (index) => {
  //   setRelays((prevRelays) => {
  //     const updatedRelays = [...prevRelays];
  //     updatedRelays[index].state = !updatedRelays[index].state;
  //     return updatedRelays;
  //   });
  // };

  return (
    <div className="bg-white border rounded-xl shadow p-6 mt-4 w-full h-full flex flex-col">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">🛠️ Device Control</h2>
      {/* */}
      {/* </div> */}
    </div>
  );
};

export default Control;

import React, { useState, useEffect } from 'react';
import { useAlert } from '../SensorLogs/log_components/AlertContext';

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
  const [relays, setRelays] = useState(initialRelays);
  const { activeAlerts } = useAlert();

  useEffect(() => {
    document.title = "Control | Verde";
  }, []);

  useEffect(() => {
    setRelays((prevRelays) =>
      prevRelays.map((relay) => {
        const updatedRelay = { ...relay };

        const tempCondition = activeAlerts.temperature?.condition;
        const humidityCondition = activeAlerts.humidity?.condition;
        const tdsCondition = activeAlerts.tds?.condition;
        const phCondition = activeAlerts.ph?.condition;

        switch (relay.name) {
          case 'Cooler':
            updatedRelay.state = tempCondition === "HIGH";
            break;
          case 'Heater':
            updatedRelay.state = tempCondition === "LOW";
            break;
          case 'Humidifier':
            updatedRelay.state = humidityCondition === "LOW";
            break;
          case 'Exhaust':
            updatedRelay.state = humidityCondition === "HIGH";
            break;
          case 'Nutrient Pump - TDS Up':
            updatedRelay.state = tdsCondition === "LOW";
            break;
          case 'Pump 1 - pH Up':
            updatedRelay.state = phCondition === "LOW";
            break;
          case 'Pump 2 - pH Down':
            updatedRelay.state = phCondition === "HIGH";
            break;
          case 'Water Pump':
            updatedRelay.state = tdsCondition === "HIGH";
            break;
          default:
            break;
        }

        return updatedRelay;
      })
    );
  }, [activeAlerts]);

  const toggleRelay = (index) => {
    setRelays((prevRelays) => {
      const updatedRelays = [...prevRelays];
      updatedRelays[index].state = !updatedRelays[index].state;
      return updatedRelays;
    });
  };

  return (
    <div className="bg-white border rounded-xl shadow p-6 mt-4 w-full h-full flex flex-col">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">🛠️ Device Control</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full h-full overflow-auto">
        {relays.map((relay, index) => (
          <div
            key={index}
            className={`flex flex-col sm:flex-row items-center justify-between shadow-md rounded-2xl p-6 w-full h-full transition-all duration-300 ${
              relay.state ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <div className="text-4xl">{relay.icon}</div>
              <div className="text-lg font-semibold">{relay.name}</div>
            </div>
            <div
              onClick={() => toggleRelay(index)}
              className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                relay.state ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  relay.state ? 'translate-x-8' : 'translate-x-0'
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Control;

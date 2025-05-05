import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { sensor_db } from "../../../../../firebase_database/firebase";
import getGrowthStage from "../Dashboard/dashboard_components/getGrowthStage";

const SensorTable = () => {
  const [sensorData, setSensorData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    document.title = "Dataset | Verde";

    const sensorRef = ref(sensor_db, 'predictions_3');
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const parsedData = Object.entries(rawData).map(([id, entry]) => ({
          id,
          ...entry,
          timestampObj: new Date(entry.timestamp),
          editedTemp: entry.temperature,
          editedHumidity: entry.humidity,
          editedPh: entry.ph,
          editedTds: entry.tds,
          editedDayNum: null,
          predicted_days: entry.predicted_days
        }));

        const sortedData = parsedData.sort((a, b) =>
          sortAsc ? a.timestampObj - b.timestampObj : b.timestampObj - a.timestampObj
        );

        if (!localStorage.getItem('plantStartDate') && sortedData.length > 0) {
          const firstTimestamp = new Date(sortedData[sortedData.length - 1].timestamp);
          localStorage.setItem('plantStartDate', firstTimestamp.toISOString());
          setStartDate(firstTimestamp);
        }

        setSensorData(sortedData);
      } else {
        setSensorData([]);
      }
    });

    return () => unsubscribe();
  }, [sortAsc]);

  useEffect(() => {
    if (!startDate) {
      const saved = localStorage.getItem('plantStartDate');
      if (saved) {
        setStartDate(new Date(saved));
      }
    }
  }, [startDate]);

  const handleResetStartDate = () => {
    const now = new Date();
    localStorage.setItem('plantStartDate', now.toISOString());
    setStartDate(now);
  };

  const toggleSort = () => setSortAsc((prev) => !prev);

  const handleEdit = (index, field, value) => {
    const updated = [...sensorData];
    updated[index][field] = parseFloat(value);
    setSensorData(updated);

    if (["editedTemp", "editedHumidity", "editedPh", "editedTds"].includes(field)) {
      triggerPrediction(index);
    }
  };

  const triggerPrediction = async (index) => {
    const entry = sensorData[index];
    const { editedTemp, editedHumidity, editedPh, editedTds } = entry;

    try {
      const res = await fetch("http://localhost:5001/predict_edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature: editedTemp,
          humidity: editedHumidity,
          ph: editedPh,
          tds: editedTds,
        }),
      });

      const result = await res.json();
      const updated = [...sensorData];
      updated[index].predicted_days = result.predicted_days;
      setSensorData(updated);
    } catch (err) {
      console.error("Prediction API failed:", err);
    }
  };

  const handleDayEdit = (index, newDay) => {
    const dayOffset = newDay - getDayNum(sensorData[index].timestampObj);
    const updated = [...sensorData];
    for (let i = index; i < updated.length; i++) {
      const currentDay = getDayNum(updated[i].timestampObj);
      updated[i].editedDayNum = currentDay + dayOffset;
    }
    setSensorData(updated);
  };

  const getDayNum = (timestamp) =>
    startDate ? Math.floor((timestamp - startDate) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="w-full h-[90%] p-6 bg-emerald-200 mt-15 rounded-[30px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sensor Readings Table</h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-[30px] shadow"
          onClick={handleResetStartDate}
        >
          Reset Growth Start
        </button>
      </div>

      <div className="relative overflow-scroll max-h-[90%] rounded-xl shadow bg-white scrollbar-hide">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="text-left py-2 px-4 w-[200px] cursor-pointer" onClick={toggleSort}>
                Timestamp {sortAsc ? "▲" : "▼"}
              </th>
              <th className="text-left py-2 px-4 w-[160px]">Temperature (°C)</th>
              <th className="text-left py-2 px-4 w-[140px]">Humidity (%)</th>
              <th className="text-left py-2 px-4 w-[100px]">pH</th>
              <th className="text-left py-2 px-4 w-[140px]">TDS (ppm)</th>
              <th className="text-left py-2 px-4 w-[100px]">Day #</th>
              <th className="text-left py-2 px-4 w-[140px]">Current Growth Stage</th>
              <th className="text-left py-2 px-4 w-[200px]">Predicted Maturity (Days)</th>
              <th className="text-left py-2 px-4 w-[140px]">Predicted Growth Stage</th>
            </tr>
          </thead>
          <tbody>
            {sensorData.map((entry, index) => {
              const dayNum = entry.editedDayNum !== null
                ? entry.editedDayNum
                : getDayNum(entry.timestampObj);

              return (
                <tr key={entry.id} className="border-t">
                  <td className="py-2 px-4">{entry.timestamp}</td>

                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={entry.editedTemp}
                      onChange={(e) => handleEdit(index, "editedTemp", e.target.value)}
                      className="w-full bg-transparent"
                    />
                  </td>

                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={entry.editedHumidity}
                      onChange={(e) => handleEdit(index, "editedHumidity", e.target.value)}
                      className="w-full bg-transparent"
                    />
                  </td>

                  <td className="py-2 px-4">
                    <input
                      type="number"
                      step="0.01"
                      value={entry.editedPh}
                      onChange={(e) => handleEdit(index, "editedPh", e.target.value)}
                      className="w-full bg-transparent"
                    />
                  </td>

                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={entry.editedTds}
                      onChange={(e) => handleEdit(index, "editedTds", e.target.value)}
                      className="w-full bg-transparent"
                    />
                  </td>

                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={dayNum}
                      onChange={(e) => handleDayEdit(index, parseInt(e.target.value))}
                      className="w-full bg-transparent"
                    />
                  </td>

                  <td className="py-2 px-4">{getGrowthStage(dayNum)}</td>
                  <td className="py-2 px-4">{entry.predicted_days}</td>
                  <td className="py-2 px-4">{getGrowthStage(entry.predicted_days)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorTable;

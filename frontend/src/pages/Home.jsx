// Home Page - Dashboard với realtime monitoring (theo thiết kế mockup)
import React, { useState, useEffect } from 'react';
import { connectSocket, onSensorData, offSensorData, onActionUpdate, offActionUpdate } from '../services/socket';
import { getLatestSensor, getLatestActions } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { controlDevice } from '../services/api';

const Home = () => {
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    light: 0
  });

  const [chartData, setChartData] = useState([]);
  const [deviceStates, setDeviceStates] = useState({
    led1: false,
    led2: false,
    led3: false
  });

  useEffect(() => {
    const socket = connectSocket();

    onSensorData((data) => {
      setSensorData({
        temperature: data.temperature,
        humidity: data.humidity,
        light: data.light
      });

      setChartData((prevData) => {
        const newData = [
          ...prevData,
          {
            time: new Date(data.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            temp: data.temperature,
            hum: data.humidity,
            light: data.light
          }
        ];
        return newData.slice(-20);
      });
    });

    onActionUpdate((data) => {
      const deviceMap = {
        'Light': 'led1',
        'Fan': 'led2',
        'Air condition': 'led3'
      };
      const deviceKey = deviceMap[data.device];
      if (deviceKey) {
        setDeviceStates(prev => ({
          ...prev,
          [deviceKey]: data.action === 'on'
        }));
      }
    });

    const loadInitialData = async () => {
      try {
        const sensorResponse = await getLatestSensor();
        if (sensorResponse.success && sensorResponse.data) {
          setSensorData({
            temperature: sensorResponse.data.temperature,
            humidity: sensorResponse.data.humidity,
            light: sensorResponse.data.light
          });
        }

        const actionsResponse = await getLatestActions();
        if (actionsResponse.success && actionsResponse.data) {
          const deviceMap = {
            'Light': 'led1',
            'Fan': 'led2',
            'Air condition': 'led3'
          };
          const states = { led1: false, led2: false, led3: false };
          actionsResponse.data.forEach(action => {
            const deviceKey = deviceMap[action.device];
            if (deviceKey) {
              states[deviceKey] = action.action === 'on';
            }
          });
          setDeviceStates(states);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();

    return () => {
      offSensorData();
      offActionUpdate();
    };
  }, []);

  const handleDeviceToggle = async (device, currentState) => {
    const action = currentState ? 'off' : 'on';
    try {
      const response = await controlDevice(device, action);
      if (response.success) {
        setDeviceStates(prev => ({
          ...prev,
          [device]: !currentState
        }));
      }
    } catch (error) {
      console.error('Error controlling device:', error);
      alert('Không thể điều khiển thiết bị. Vui lòng thử lại!');
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-3xl">🌡️</span>
            <span className="text-sm font-semibold text-gray-700">Nhiệt Độ:</span>
          </div>
          <p className="text-4xl font-bold text-gray-800">{Number(sensorData.temperature).toFixed(0)}°C</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-3xl">💧</span>
            <span className="text-sm font-semibold text-gray-700">Độ Ẩm:</span>
          </div>
          <p className="text-4xl font-bold text-gray-800">{Number(sensorData.humidity).toFixed(0)}%</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-3xl">☀️</span>
            <span className="text-sm font-semibold text-gray-700">Ánh Sáng:</span>
          </div>
          <p className="text-4xl font-bold text-gray-800">{sensorData.light} Lux</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{fontSize: 10}} stroke="#9ca3af" />
              <YAxis tick={{fontSize: 10}} stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#EF4444" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="hum" stroke="#3B82F6" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="light" stroke="#F59E0B" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">💡</span>
                <span className="font-bold text-gray-800">Đèn:</span>
              </div>
              <button
                onClick={() => handleDeviceToggle('led1', deviceStates.led1)}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${deviceStates.led1 ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform shadow-md ${deviceStates.led1 ? 'translate-x-11' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🌀</span>
                <span className="font-bold text-gray-800">Quạt:</span>
              </div>
              <button
                onClick={() => handleDeviceToggle('led2', deviceStates.led2)}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${deviceStates.led2 ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform shadow-md ${deviceStates.led2 ? 'translate-x-11' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">❄️</span>
                <span className="font-bold text-gray-800">Điều hòa:</span>
              </div>
              <button
                onClick={() => handleDeviceToggle('led3', deviceStates.led3)}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${deviceStates.led3 ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform shadow-md ${deviceStates.led3 ? 'translate-x-11' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

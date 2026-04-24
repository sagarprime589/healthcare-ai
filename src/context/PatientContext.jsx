import { createContext, useContext, useState, useEffect } from 'react';

const PatientContext = createContext();

export function PatientProvider({ children }) {
  const [patientData, setPatientData] = useState(null);
  const [aiResult, setAiResult] = useState(null);

  const getUser = () => JSON.parse(localStorage.getItem('healthai_user') || 'null');

  const getHistoryKey = () => {
    const user = getUser();
    return user ? `healthai_history_${user.id}` : 'healthai_history_guest';
  };

  const [history, setHistoryState] = useState(() => {
    const user = JSON.parse(localStorage.getItem('healthai_user') || 'null');
    const key = user ? `healthai_history_${user.id}` : 'healthai_history_guest';
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const key = getHistoryKey();
    const saved = localStorage.getItem(key);
    setHistoryState(saved ? JSON.parse(saved) : []);
  }, []);

  const setHistory = (updated) => {
    const key = getHistoryKey();
    setHistoryState(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const saveToHistory = (data, result) => {
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      patientData: data,
      aiResult: result,
    };
    const updated = [entry, ...history];
    setHistory(updated);
  };

  return (
    <PatientContext.Provider value={{
      patientData, setPatientData,
      aiResult, setAiResult,
      history, setHistory,
      saveToHistory,
      getUser,
    }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  return useContext(PatientContext);
}
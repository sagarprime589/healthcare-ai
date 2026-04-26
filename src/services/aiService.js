export async function getDiagnosis(patientData, lang = 'en') {
  const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...patientData, lang }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data.result;
}
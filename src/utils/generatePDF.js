/* eslint-disable */
import jsPDF from 'jspdf';

export function generatePDF(patientData, aiResult) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 0;

  // header bg
  doc.setFillColor(15, 110, 86);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // logo circle
  doc.setFillColor(255, 255, 255, 0.2);
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.circle(25, 22, 10, 'D');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('H+', 25, 25, { align: 'center' });

  // title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('HealthAI', 40, 18);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 240, 225);
  doc.text('AI-Powered Medical Assessment Report', 40, 26);

  // date on right
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setFontSize(9);
  doc.setTextColor(200, 240, 225);
  doc.text(`Date: ${date}`, pageWidth - 20, 18, { align: 'right' });
  doc.text(`Report ID: HA-${Date.now().toString().slice(-6)}`, pageWidth - 20, 26, { align: 'right' });

  y = 55;

  // patient info card bg
  doc.setFillColor(245, 250, 248);
  doc.setDrawColor(209, 236, 224);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, y - 6, pageWidth - 28, 48, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 110, 86);
  doc.text('PATIENT INFORMATION', 20, y + 2);

  y += 10;
  doc.setDrawColor(15, 110, 86);
  doc.setLineWidth(0.3);
  doc.line(20, y, pageWidth - 20, y);
  y += 7;

  // patient info grid
  const col1 = 20, col2 = 80, col3 = 140;
  doc.setFontSize(8.5);

  const fields = [
    ['Full Name', patientData.name, 'Age', patientData.age, 'Gender', patientData.gender],
    ['Blood Group', patientData.bloodGroup, 'Weight', `${patientData.weight} kg`, 'Duration', patientData.duration],
  ];

  for (const row of fields) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text(row[0] + ':', col1, y);
    doc.text(row[2] + ':', col2, y);
    doc.text(row[4] + ':', col3, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    doc.text(String(row[1] || '-'), col1, y + 5);
    doc.text(String(row[3] || '-'), col2, y + 5);
    doc.text(String(row[5] || '-'), col3, y + 5);
    y += 13;
  }

  y += 4;

  // symptoms full width
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Symptoms:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  const symLines = doc.splitTextToSize(patientData.symptoms || '-', pageWidth - 60);
  doc.text(symLines, 55, y);
  y += symLines.length * 5 + 4;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Pre-existing:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(patientData.existingConditions || 'None', 55, y);

  doc.text('Allergies:', col2, y);
  doc.setFont('helvetica', 'normal');
  doc.text(patientData.allergies || 'None', col2 + 20, y);
  y += 16;

  // AI result section
  const sections = parseAIResult(aiResult);

  // possible conditions
  y = drawSectionHeader(doc, 'POSSIBLE CONDITIONS', y, pageWidth);
  for (const c of sections.conditions) {
    if (y > pageHeight - 30) { doc.addPage(); y = 20; }
    const parts = c.split(' - ');
    const name = parts[0] || '';
    const pct = parseInt(parts[1]) || 0;
    const desc = parts[2] || '';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(20, 20, 20);
    doc.text(name, 20, y);

    // pct badge
    const badgeColor = pct > 60 ? [216, 90, 48] : pct > 30 ? [186, 117, 23] : [15, 110, 86];
    doc.setFillColor(...badgeColor);
    doc.roundedRect(pageWidth - 45, y - 5, 30, 7, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(`${pct}% likely`, pageWidth - 30, y - 0.5, { align: 'center' });

    // progress bar
    y += 4;
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(20, y, pageWidth - 65, 3, 1, 1, 'F');
    doc.setFillColor(...badgeColor);
    doc.roundedRect(20, y, (pageWidth - 65) * (pct / 100), 3, 1, 1, 'F');

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    const descLines = doc.splitTextToSize(desc, pageWidth - 40);
    doc.text(descLines, 20, y);
    y += descLines.length * 5 + 6;
  }

  // urgency
  if (sections.urgency) {
    if (y > pageHeight - 40) { doc.addPage(); y = 20; }
    y = drawSectionHeader(doc, 'URGENCY LEVEL', y, pageWidth);
    const lvl = sections.urgencyLevel?.toLowerCase();
    const urgBg = lvl === 'low' ? [225, 245, 238] : lvl === 'moderate' ? [250, 238, 218] : lvl === 'high' ? [250, 236, 231] : [252, 235, 235];
    const urgText = lvl === 'low' ? [15, 110, 86] : lvl === 'moderate' ? [133, 79, 11] : lvl === 'high' ? [153, 60, 29] : [163, 45, 45];
    doc.setFillColor(...urgBg);
    doc.setDrawColor(...urgText);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, y - 4, pageWidth - 28, 18, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...urgText);
    doc.text(sections.urgencyLevel || 'Unknown', 22, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...urgText);
    const urgLines = doc.splitTextToSize(sections.urgency, pageWidth - 80);
    doc.text(urgLines, 60, y + 4);
    y += 22;
  }

  // two column sections
  y = drawTwoCol(doc, 'RECOMMENDED MEDICINES', sections.medicines, 'RECOMMENDED TESTS', sections.tests, y, pageWidth, pageHeight);
  y = drawTwoCol(doc, 'HOME REMEDIES', sections.remedies, 'SEE A DOCTOR IF', sections.seeDoctor, y, pageWidth, pageHeight);

  // disclaimer
  if (y > pageHeight - 30) { doc.addPage(); y = 20; }
  y += 4;
  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, y, pageWidth - 28, 18, 3, 3, 'FD');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  const dis = doc.splitTextToSize('⚕ ' + (sections.disclaimer || 'This report is AI-generated and not a substitute for professional medical advice. Please consult a qualified doctor.'), pageWidth - 36);
  doc.text(dis, 20, y + 6);

  // footer
  doc.setFillColor(15, 110, 86);
  doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('HealthAI — AI Powered Healthcare Assistant', pageWidth / 2, pageHeight - 4, { align: 'center' });

  doc.save(`HealthAI_Report_${patientData.name}_${Date.now()}.pdf`);
}

function drawSectionHeader(doc, title, y, pageWidth) {
  doc.setFillColor(15, 110, 86);
  doc.rect(14, y, 3, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 110, 86);
  doc.text(title, 20, y + 6);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(20, y + 9, pageWidth - 20, y + 9);
  return y + 14;
}

function drawTwoCol(doc, title1, items1, title2, items2, y, pageWidth, pageHeight) {
  if (y > pageHeight - 60) { doc.addPage(); y = 20; }
  const mid = pageWidth / 2 - 4;

  // left header
  doc.setFillColor(15, 110, 86);
  doc.rect(14, y, 3, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 110, 86);
  doc.text(title1, 20, y + 5);

  // right header
  doc.rect(mid + 8, y, 3, 7, 'F');
  doc.text(title2, mid + 14, y + 5);

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(20, y + 8, mid, y + 8);
  doc.line(mid + 14, y + 8, pageWidth - 14, y + 8);

  y += 12;
  const startY = y;
  let leftY = y;
  let rightY = y;

  for (const item of (items1 || [])) {
    if (leftY > pageHeight - 20) break;
    const parts = item.split(' - ');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);
    doc.text('•', 18, leftY);
    const nameLines = doc.splitTextToSize(parts[0], mid - 28);
    doc.text(nameLines, 23, leftY);
    leftY += nameLines.length * 5;
    if (parts[1]) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const subLines = doc.splitTextToSize(parts.slice(1).join(' · '), mid - 28);
      doc.text(subLines, 23, leftY);
      leftY += subLines.length * 4.5 + 2;
    }
  }

  for (const item of (items2 || [])) {
    if (rightY > pageHeight - 20) break;
    const parts = item.split(' - ');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);
    doc.text('•', mid + 12, rightY);
    const nameLines = doc.splitTextToSize(parts[0], pageWidth - mid - 28);
    doc.text(nameLines, mid + 17, rightY);
    rightY += nameLines.length * 5;
    if (parts[1]) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const subLines = doc.splitTextToSize(parts.slice(1).join(' · '), pageWidth - mid - 28);
      doc.text(subLines, mid + 17, rightY);
      rightY += subLines.length * 4.5 + 2;
    }
  }

  return Math.max(leftY, rightY) + 10;
}

function parseAIResult(text) {
  const sections = { conditions: [], urgency: '', urgencyLevel: '', medicines: [], tests: [], remedies: [], seeDoctor: [], disclaimer: '' };
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let current = '';
  for (const line of lines) {
    if (line.startsWith('POSSIBLE CONDITIONS')) { current = 'conditions'; continue; }
    if (line.startsWith('URGENCY LEVEL')) { current = 'urgency'; continue; }
    if (line.startsWith('RECOMMENDED MEDICINES')) { current = 'medicines'; continue; }
    if (line.startsWith('RECOMMENDED TESTS')) { current = 'tests'; continue; }
    if (line.startsWith('HOME REMEDIES')) { current = 'remedies'; continue; }
    if (line.startsWith('SEE A DOCTOR IF')) { current = 'seeDoctor'; continue; }
    if (line.startsWith('DISCLAIMER')) { current = 'disclaimer'; continue; }
    if (current === 'conditions' && line.match(/^\d+\./)) sections.conditions.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'urgency' && line) { sections.urgency = line; sections.urgencyLevel = line.split(/[\s-]/)[0]; }
    if (current === 'medicines' && line.match(/^\d+\./)) sections.medicines.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'tests' && line.match(/^\d+\./)) sections.tests.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'remedies' && line.match(/^\d+\./)) sections.remedies.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'seeDoctor' && line.match(/^\d+\./)) sections.seeDoctor.push(line.replace(/^\d+\.\s*/, ''));
    if (current === 'disclaimer') sections.disclaimer += line + ' ';
  }
  return sections;
}
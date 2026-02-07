import { jsPDF } from 'jspdf';

export const exportToPDF = (title, content) => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(22);
    doc.text(title || 'Untitled Script', 20, 20);

    // Add Content
    doc.setFontSize(12);
    doc.setFont('courier', 'normal');

    const splitText = doc.splitTextToSize(content, 170);
    let y = 35;

    splitText.forEach(line => {
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
        doc.text(line, 20, y);
        y += 7;
    });

    doc.save(`${title || 'script'}.pdf`);
};

export const exportToWord = (title, content) => {
    // Basic HTML template for Word
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>${title}</title>
            <style>
                body { font-family: 'Courier New', Courier, monospace; }
                h1 { text-align: center; }
                p { white-space: pre-wrap; }
            </style>
            </head><body>`;
    const footer = "</body></html>";

    // Escape and format content
    const formattedContent = `<h1>${title || 'Untitled Script'}</h1><p>${content.replace(/\n/g, '<br/>')}</p>`;
    const sourceHTML = header + formattedContent + footer;

    const blob = new Blob(['\ufeff', sourceHTML], {
        type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'script'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

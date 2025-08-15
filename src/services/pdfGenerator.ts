import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Create HTML content for better Persian support
const createStoryHTML = (story: string, title: string) => {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Vazirmatn', Arial, sans-serif;
          direction: rtl;
          text-align: right;
          line-height: 1.8;
          color: #2d3748;
          background: white;
          margin: 0;
          padding: 40px;
          font-size: 14px;
        }
        
        .title {
          font-size: 24px;
          font-weight: 700;
          color: #1e40af;
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 15px;
        }
        
        .chapter {
          font-size: 16px;
          font-weight: 600;
          color: #1d4ed8;
          margin: 25px 0 15px 0;
          line-height: 1.6;
        }
        
        .paragraph {
          margin-bottom: 15px;
          text-align: justify;
          line-height: 2;
        }
        
        .footer {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          color: #6b7280;
        }
        
        @media print {
          body { margin: 0; padding: 30px; }
          .footer { position: fixed; bottom: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="title">${title}</div>
      ${story.split('\n\n').map(paragraph => {
        const cleanParagraph = paragraph.trim();
        if (cleanParagraph.includes('**')) {
          const chapterTitle = cleanParagraph.replace(/\*\*/g, '');
          return `<div class="chapter">${chapterTitle}</div>`;
        } else if (cleanParagraph) {
          return `<div class="paragraph">${cleanParagraph}</div>`;
        }
        return '';
      }).join('')}
      <div class="footer">تاریخ تولید: ${new Date().toLocaleDateString('fa-IR')}</div>
    </body>
    </html>
  `;
};

export const generateStoryPDF = async (story: string, title: string = "داستان خواب شما") => {
  try {
    // Create a temporary container for the HTML content
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '210mm'; // A4 width
    container.style.background = 'white';
    container.innerHTML = createStoryHTML(story, title);
    
    document.body.appendChild(container);
    
    // Wait for fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate canvas from HTML
    const canvas = await html2canvas(container, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: container.scrollHeight,
    });
    
    // Remove temporary container
    document.body.removeChild(container);
    
    // Create PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pageHeight = 297; // A4 height in mm
    const pageWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add first page
    doc.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Generate filename with Persian date
    const now = new Date();
    const persianDate = now.toLocaleDateString('fa-IR').replace(/\//g, '-');
    const filename = `داستان-خواب-${persianDate}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    return { success: true, filename };
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: 'خطا در تولید فایل PDF' };
  }
};
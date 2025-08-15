import jsPDF from 'jspdf';

// Function to add Persian/Farsi font support
const addFarsiFont = (doc: jsPDF) => {
  // We'll use a web-safe approach by splitting text into lines
  return doc;
};

export const generateStoryPDF = async (story: string, title: string = "داستان خواب شما") => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set right-to-left direction
    doc.setR2L(true);
    
    // Set font
    doc.setFont("helvetica");
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(66, 66, 66);
    
    // Calculate title position for RTL
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const titleX = pageWidth - titleWidth - 20;
    
    doc.text(title, titleX, 30);
    
    // Add decorative line
    doc.setLineWidth(0.5);
    doc.setDrawColor(100, 100, 100);
    doc.line(20, 35, pageWidth - 20, 35);
    
    // Process story content
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    
    // Split story into paragraphs and chapters
    const paragraphs = story.split('\n\n').filter(p => p.trim() !== '');
    let yPosition = 50;
    const lineHeight = 7;
    const marginLeft = 20;
    const marginRight = 20;
    const textWidth = pageWidth - marginLeft - marginRight;
    
    for (const paragraph of paragraphs) {
      // Check if it's a chapter title (contains **)
      if (paragraph.includes('**')) {
        const chapterTitle = paragraph.replace(/\*\*/g, '').trim();
        
        // Add some space before chapter
        yPosition += 10;
        
        // Chapter title formatting
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 64, 175); // Blue color for chapters
        
        // Split chapter title into lines for RTL
        const chapterLines = doc.splitTextToSize(chapterTitle, textWidth);
        for (const line of chapterLines) {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 30;
          }
          
          const lineWidth = doc.getTextWidth(line);
          const lineX = pageWidth - lineWidth - marginRight;
          doc.text(line, lineX, yPosition);
          yPosition += lineHeight + 2;
        }
        
        yPosition += 5;
        
        // Reset to normal text formatting
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40, 40, 40);
        
      } else {
        // Regular paragraph
        const cleanParagraph = paragraph.trim();
        if (cleanParagraph) {
          // Split paragraph into lines
          const lines = doc.splitTextToSize(cleanParagraph, textWidth);
          
          for (const line of lines) {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 30;
            }
            
            const lineWidth = doc.getTextWidth(line);
            const lineX = pageWidth - lineWidth - marginRight;
            doc.text(line, lineX, yPosition);
            yPosition += lineHeight;
          }
          
          yPosition += 4; // Space between paragraphs
        }
      }
    }
    
    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      
      // Page number in RTL style
      const pageText = `صفحه ${i} از ${pageCount}`;
      const pageTextWidth = doc.getTextWidth(pageText);
      doc.text(pageText, (pageWidth - pageTextWidth) / 2, 285);
      
      // Add creation date
      const date = new Date().toLocaleDateString('fa-IR');
      const dateText = `تاریخ تولید: ${date}`;
      const dateWidth = doc.getTextWidth(dateText);
      doc.text(dateText, pageWidth - dateWidth - 20, 290);
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
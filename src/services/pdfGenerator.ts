import jsPDF from 'jspdf';
import { GeneratedStory } from './openai';
import { GeneratedImage } from './imageGeneration';

export interface PDFGenerationParams {
  story: GeneratedStory;
  images: GeneratedImage[];
}

export class PDFGeneratorService {
  async generatePDF(params: PDFGenerationParams): Promise<void> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set up RTL and Persian font support
    doc.setR2L(true);
    
    // Add title page
    this.addTitlePage(doc, params.story.title);
    
    // Add chapters with images
    for (let i = 0; i < params.story.chapters.length; i++) {
      const chapter = params.story.chapters[i];
      const image = params.images.find(img => img.chapter === i + 1);
      
      doc.addPage();
      await this.addChapter(doc, chapter, image, i + 1);
    }

    // Save the PDF
    doc.save(`${params.story.title || 'داستان-رویا'}.pdf`);
  }

  private addTitlePage(doc: jsPDF, title: string): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add decorative background
    doc.setFillColor(240, 240, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add title
    doc.setFontSize(24);
    doc.setTextColor(60, 50, 150);
    
    // Center the title (approximate for RTL)
    const titleLines = doc.splitTextToSize(title, pageWidth - 40);
    const titleHeight = titleLines.length * 10;
    const startY = (pageHeight - titleHeight) / 2;
    
    doc.text(titleLines, pageWidth - 20, startY, { 
      align: 'right',
      maxWidth: pageWidth - 40 
    });
    
    // Add subtitle
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text('داستان رویای شما', pageWidth - 20, startY + titleHeight + 20, {
      align: 'right'
    });
    
    // Add decorative elements
    doc.setDrawColor(60, 50, 150);
    doc.setLineWidth(0.5);
    doc.line(20, startY + titleHeight + 40, pageWidth - 20, startY + titleHeight + 40);
  }

  private async addChapter(doc: jsPDF, chapter: any, image: GeneratedImage | undefined, chapterNumber: number): Promise<void> {
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;
    
    // Add chapter title
    doc.setFontSize(18);
    doc.setTextColor(60, 50, 150);
    doc.text(chapter.title, pageWidth - 20, currentY, { align: 'right' });
    currentY += 15;
    
    // Add image if available
    if (image && image.url) {
      try {
        // In a real implementation, you would load the actual image
        // For now, we'll add a placeholder
        doc.setFillColor(220, 220, 220);
        doc.rect(20, currentY, pageWidth - 40, 60, 'F');
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('تصویر فصل', pageWidth / 2, currentY + 35, { align: 'center' });
        
        currentY += 70;
      } catch (error) {
        console.warn('Could not add image to PDF:', error);
      }
    }
    
    // Add chapter content
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    
    const lines = doc.splitTextToSize(chapter.content, pageWidth - 40);
    
    for (const line of lines) {
      if (currentY > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.text(line, pageWidth - 20, currentY, { 
        align: 'right',
        maxWidth: pageWidth - 40 
      });
      currentY += 7;
    }
  }
}
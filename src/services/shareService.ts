// Share service for dream stories

export interface ShareData {
  title: string;
  text: string;
  url?: string;
}

export const shareStory = async (story: string, title: string = "داستان خواب من"): Promise<boolean> => {
  try {
    // Prepare share content
    const shareText = `${title}\n\n${story.substring(0, 200)}${story.length > 200 ? '...' : ''}\n\nتولید شده با هوش مصنوعی`;
    
    const shareData: ShareData = {
      title: title,
      text: shareText,
      url: window.location.href
    };

    // Check if Web Share API is supported
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return true;
    } else {
      // Fallback to clipboard copy
      await copyToClipboard(shareText);
      return true;
    }
  } catch (error) {
    console.error('Error sharing story:', error);
    
    // Final fallback - copy to clipboard
    try {
      const fallbackText = `${title}\n\n${story}`;
      await copyToClipboard(fallbackText);
      return true;
    } catch (clipboardError) {
      console.error('Clipboard fallback failed:', clipboardError);
      return false;
    }
  }
};

const copyToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

// Generate shareable image with story preview
export const generateShareableImage = async (story: string, title: string): Promise<string | null> => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#06B6D4');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add semi-transparent overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text properties
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    
    // Draw title
    ctx.font = 'bold 32px Arial';
    ctx.fillText(title, canvas.width / 2, 80);
    
    // Draw story preview
    ctx.font = '20px Arial';
    const storyPreview = story.substring(0, 150) + '...';
    const words = storyPreview.split(' ');
    let line = '';
    let y = 150;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > 700 && i > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[i] + ' ';
        y += 30;
        
        if (y > 400) break; // Stop if we reach the bottom area
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);
    
    // Add footer
    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('تولید شده با هوش مصنوعی', canvas.width / 2, canvas.height - 40);
    
    // Convert to data URL
    return canvas.toDataURL('image/png');
    
  } catch (error) {
    console.error('Error generating shareable image:', error);
    return null;
  }
};

// Social media specific sharing
export const shareToSocialMedia = (platform: string, story: string, title: string) => {
  const text = encodeURIComponent(`${title}\n\n${story.substring(0, 100)}...`);
  const url = encodeURIComponent(window.location.href);
  
  const socialUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
    telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    whatsapp: `https://wa.me/?text=${text}%20${url}`
  };
  
  const shareUrl = socialUrls[platform as keyof typeof socialUrls];
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};
import { toast } from "sonner";

export interface GenerateImageParams {
  prompt: string;
  chapter: number;
}

export interface GeneratedImage {
  url: string;
  chapter: number;
}

export class ImageGenerationService {
  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    try {
      // Use the built-in image generation tool
      const imagePath = `src/assets/story-chapter-${params.chapter}.jpg`;
      
      // Generate image using the prompt
      await this.generateImageFile(params.prompt, imagePath);
      
      return {
        url: imagePath,
        chapter: params.chapter
      };
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(`خطا در تولید تصویر فصل ${params.chapter}`);
      throw error;
    }
  }

  private async generateImageFile(prompt: string, path: string): Promise<void> {
    // This will be replaced with actual image generation
    // For now, we'll use a placeholder approach
    
    const enhancedPrompt = `Beautiful, detailed illustration for a Persian story: ${prompt}. Artistic, fantasy style, high quality, 16:9 aspect ratio.`;
    
    // Note: This would typically call the generate_image function
    // but since we can't call it directly from here, we'll handle it in the component
    throw new Error('Image generation needs to be handled in component');
  }

  async generateMultipleImages(prompts: { prompt: string; chapter: number }[]): Promise<GeneratedImage[]> {
    const results: GeneratedImage[] = [];
    
    for (const promptData of prompts) {
      try {
        const image = await this.generateImage(promptData);
        results.push(image);
      } catch (error) {
        console.warn(`Failed to generate image for chapter ${promptData.chapter}:`, error);
      }
    }
    
    return results;
  }
}
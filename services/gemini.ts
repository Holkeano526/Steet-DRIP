
import { GoogleGenAI } from "@google/genai";

const PROMPT_TEMPLATE = `
A gritty documentary-style street portrait photographed with direct on-camera flash at dusk. 
The person from the provided input image stands in a narrow urban alleyway, wearing an oversized black T-shirt, 
baggy blue jeans, heavy black sneakers, and a thick silver Cuban chain necklace. 
Their posture is relaxed but confrontational, arms hanging loosely, staring straight into the camera with a neutral, slightly hardened expression. 
At their side sits a muscular dark brown pit bull-type dog with amber eyes, wearing a thick chain collar and attached to a black leather leash held by the person. 
The dog is seated calmly, alert, facing the camera. 
The environment is raw and unpolished: cracked pavement, scattered debris, chain-link fencing on one side, red brick walls and corrugated metal fencing on the other, 
overgrown weeds and greenery creeping into the alley. 
Shot on a wide-angle lens (≈28-35mm), eye-level perspective, harsh flash lighting creating sharp shadows and high contrast, 
slightly desaturated colors with green undertones, subtle film grain, realistic skin texture, no glamour retouching. 
The image feels like early-2000s underground fashion photography candid, confrontational, and authentic. 
Photorealistic, high detail, natural imperfections, editorial street portrait.
`;

export const generateGritPortrait = async (base64Image: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Using gemini-2.5-flash-image as it is the default for general image generation/editing tasks.
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1] || base64Image,
            mimeType: 'image/jpeg',
          },
        },
        {
          text: PROMPT_TEMPLATE,
        },
      ],
    },
  });

  // Extract the generated image from parts
  let generatedUrl = '';
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        generatedUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!generatedUrl) {
    throw new Error("The model did not return an image part. Please try again.");
  }

  return generatedUrl;
};

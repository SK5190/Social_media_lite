const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});



async function generateContent(base64ImageFile){
    const contents = [
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64ImageFile,
    },
  },
  { text: "Caption this image." },
];

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
  config : {
    systemInstruction: `
    You are an expert in generating image captions for social media posts.
    You generate single line captions that are catchy, engaging, and relevant to the image content.
    Your captions should be concise, creative, and suitable for a wide audience.
    You use hashtags and emojis in the caption.`
  }
});
 return response.text;
}
module.exports = generateContent;
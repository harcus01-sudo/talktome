import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateChildResponse(scenario: string, chatHistory: { role: string, text: string }[]): Promise<string> {
  const systemInstruction = `你现在扮演一个青春期的孩子。场景是：${scenario}。你的家长正在尝试和你沟通。请根据你的年龄和场景设定，给出真实、简短的回复（每次不超过50字）。如果家长的话让你反感，你会表现出抵触；如果家长共情、倾听、情绪稳定，你会逐渐敞开心扉。请直接输出孩子说的话，不要包含任何其他动作描写或解释。`;
  
  const contents = chatHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text || '...';
}

export async function generateReport(chatHistory: { role: string, text: string }[]): Promise<any> {
  const systemInstruction = `你是一个专业的亲子沟通分析专家。请根据以下家长和孩子的对话记录，评估家长在5个维度上的表现。
5个维度：
1. 共情匹配度 (empathy)
2. 倾听匹配度 (listening)
3. 情绪稳定度 (emotion)
4. 边界匹配度 (boundary)
5. 需求捕捉匹配度 (needs)

每个维度的评价只能是以下三个之一："需注意", "一般", "较好"。`;

  const conversationText = chatHistory.map(msg => `${msg.role === 'user' ? '家长' : '孩子'}: ${msg.text}`).join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `对话记录如下：\n${conversationText}\n\n请生成评估报告。`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          empathy: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.STRING, description: '需注意, 一般, 或 较好' },
              reason: { type: Type.STRING, description: '简短的分析说明，50字以内' }
            },
            required: ['level', 'reason']
          },
          listening: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ['level', 'reason']
          },
          emotion: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ['level', 'reason']
          },
          boundary: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ['level', 'reason']
          },
          needs: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ['level', 'reason']
          }
        },
        required: ['empathy', 'listening', 'emotion', 'boundary', 'needs']
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse report JSON", e);
    return null;
  }
}

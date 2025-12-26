'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// CORRECCIÓN TÉCNICA:
// 1. "2.5" no existe. Usamos "gemini-1.5-flash" (La más rápida y con mayor cuota gratuita).
// 2. Si esta te llegara a fallar por región, cambia a "gemini-pro" (versión 1.0 legacy).
const MODEL_NAME = "gemini-2.0-flash"; 

export async function analyzeFileMetadata(fileName: string, fileType: string) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = `Analiza el archivo: "${fileName}" (${fileType}). Responde JSON: {"title": "string", "category": "Documentos|Finanzas|Legal|Otros", "tags": ["tag1"], "description": "string", "color": "#hex"}`;
    
    const result = await model.generateContent(prompt);
    return JSON.parse(cleanText(result.response.text()));
  } catch (error) {
    // El error 429 o 404 caerá aquí y permitirá el uso manual
    console.error(`⚠️ Gemini Falló (${MODEL_NAME}):`, error);
    return null; 
  }
}

export async function analyzeLinkMetadata(url: string) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = `Analiza URL: "${url}". Responde JSON: {"title": "string", "category": "Herramientas|Nube|Videos|Otros", "tags": ["web"], "description": "string", "color": "#hex"}`;
    
    const result = await model.generateContent(prompt);
    return JSON.parse(cleanText(result.response.text()));
  } catch (error) {
    console.error(`⚠️ Gemini Falló (${MODEL_NAME}):`, error);
    return null; 
  }
}

function cleanText(text: string) {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
}
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Validate environment variables on startup
if (!API_KEY) {
  console.error('Error: DEEPSEEK_API_KEY is not defined in environment variables');
  throw new Error('API key configuration error');
}

/**
 * Get AI response from DeepSeek API with enhanced error handling
 * @param {Array} messages - Array of message objects with role and content
 * @param {String} useCase - The use case for context
 * @returns {Promise<String>} - The AI response
 */
export const getAIResponse = async (messages, useCase = 'Default') => {
  // Validate input parameters
  if (!Array.isArray(messages)) {
    throw new Error('Messages must be an array');
  }

  // Create system message based on the use case with strict rules
  const systemMessages = {
    Healthcare: `
      You are a healthcare assistant. Respond only to questions about medical information, health advice, symptoms, treatments, medications, or healthcare services. 
      If the question is not related to healthcare, respond with: "I can only assist with healthcare questions. Please ask about symptoms, treatments, or medical advice."
      Do not provide answers to off-topic questions under any circumstances.
    `,
    Banking: `
      You are a banking assistant. Respond only to questions about banking services, accounts, loans, credit cards, investments, or financial transactions. 
      If the question is not related to banking, respond with: "I’m limited to banking topics. Please ask about accounts, loans, or financial services."
      Do not provide answers to off-topic questions under any circumstances.
    `,
    Education: `
      You are an education assistant. Respond only to questions about academic subjects, study tips, educational resources, courses, or teaching methods. 
      If the question is not related to education, respond with: "I can only help with education-related questions. Please ask about study tips or academic subjects."
      Do not provide answers to off-topic questions under any circumstances.
    `,
    'E-commerce': `
      You are an e-commerce assistant. Respond only to questions about online shopping, product details, orders, returns, or customer service for e-commerce platforms. 
      If the question is not related to e-commerce, respond with: "I’m restricted to e-commerce topics. Please ask about products, orders, or returns."
      Do not provide answers to off-topic questions under any circumstances.
    `,
    'Lead Generation': `
      You are a lead generation assistant. Respond only to questions about generating business leads, marketing strategies, customer acquisition, or CRM tools. 
      If the question is not related to lead generation, respond with: "I can only assist with lead generation. Please ask about marketing or customer acquisition."
      Do not provide answers to off-topic questions under any circumstances.
    `,
    Default: `
      You are a general assistant. Respond to general questions across various topics, but do not engage in harmful, unethical, or inappropriate queries (e.g., illegal activities or explicit content). 
      If the question is inappropriate, respond with: "I’m a general assistant, but I can’t assist with that. Please ask a different question."
    `
  };

  const systemMessage = systemMessages[useCase] || systemMessages.Default;

  try {
    console.log('Preparing request to DeepSeek API...');
    
    const requestPayload = {
      model: 'meta-llama/llama-4-maverick:free',
      messages: [
        { role: 'system', content: systemMessage },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    console.log('Sending request to DeepSeek API with payload:', JSON.stringify(requestPayload, null, 2));

    const response = await axios.post(API_URL, requestPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      },
      timeout: 30000 // 30 seconds timeout
    });

    console.log('Received response from DeepSeek API');

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response structure from API');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API Error Details:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Headers:', error.response?.headers);
    console.error('Request Config:', error.config);

    const errorMessage = error.response?.data?.error?.message || 
                        error.response?.statusText || 
                        error.message;

    throw new Error(`AI service error: ${errorMessage}`);
  }
};

export default getAIResponse;
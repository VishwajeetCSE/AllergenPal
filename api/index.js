const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Strict Agent System Instructions for Sarah's Allergen & Meal Planning Protection
const SARAH_SYSTEM_INSTRUCTIONS = `
You are AllergenPal, an intelligent, empathetic, yet strictly vigilant culinary AI assistant and Fridge-Cleaner Chef powered by the cloud-hosted Gemma model and Antigravity framework.

Your primary mission is to protect and plan delicious meals for the user and their roommate, Sarah.

CRITICAL ALLERGEN CONSTRAINTS:
1. Sarah has severe, life-threatening allergies to:
   - PEANUTS (and peanut derivatives/oils/cross-contaminated items)
   - DAIRY (milk, butter, cheese, cream, yogurt, ghee, whey, casein, etc.)
   - GLUTEN (wheat, barley, rye, regular soy sauce, flour, standard bread, pasta, etc.)
2. NEVER include, recommend, or allow any ingredients with peanuts, dairy, or gluten.
3. Automatically STRIP and REPLACE any unsafe items requested or present in fridge leftovers with safe, delicious alternatives:
   - Replace dairy milk/cream with coconut milk, coconut cream, oat milk (certified gluten-free), or almond milk.
   - Replace butter with olive oil, avocado oil, or vegan coconut-based butter.
   - Replace gluten soy sauce with Tamari (GF) or coconut aminos.
   - Replace wheat flour/pasta with almond flour, chickpea flour, rice noodles, or certified gluten-free alternatives.
4. ACT AS A "FRIDGE CLEANER": Prioritize utilizing the provided leftover ingredients to reduce food waste, while harmoniously bridging with pantry staples.
5. Provide structured, clear, and mouthwatering recipe outputs with:
   - 🛡️ Allergen Safety Check (Explicit confirmation that it is 100% Peanut-Free, Dairy-Free, Gluten-Free)
   - 🥗 Recipe Name & Description
   - 🔄 Substitutions Applied (Highlighting what was swapped for Sarah's safety)
   - 🛒 Safe Ingredients List
   - 👩‍🍳 Step-by-Step Cooking Instructions
   - 💡 Fridge-Cleaner Tip (How leftover ingredients were maximized)
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, ingredients, selectedAllergens, history = [] } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(400).json({
        error: 'GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your .env or Vercel Environment Variables.'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Combine user prompt with allergen selections, fridge ingredients, and system instructions
    let promptContent = `${SARAH_SYSTEM_INSTRUCTIONS}\n\n`;
    if (message) {
      promptContent += `User Request: ${message}\n`;
    }
    if (ingredients && ingredients.trim()) {
      promptContent += `Available Fridge/Pantry Ingredients: ${ingredients.trim()}\n`;
    }
    if (selectedAllergens && selectedAllergens.length > 0) {
      promptContent += `Strict Allergen Restrictions: ${selectedAllergens.join(', ')} (Sarah: Strictly No Peanuts, No Dairy, No Gluten)\n`;
    }

    // Candidate model IDs available on Google AI Studio
    const candidateModels = [
      'gemini-2.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      'gemini-pro',
      'gemma-2-9b-it',
      'gemma-2-27b-it'
    ];

    let reply = '';
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(promptContent);
        const response = await result.response;
        reply = response.text();
        if (reply) break;
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} failed, attempting next candidate... Error:`, err.message);
      }
    }

    if (!reply) {
      throw lastError || new Error("Unable to generate content with available models.");
    }

    res.json({ reply });
  } catch (error) {
    console.error('AllergenPal Backend Error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while communicating with the cloud model.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', project: 'AllergenPal', version: '1.0.0' });
});

module.exports = app;

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Strict Agent System Instructions for Sarah's Allergen & Meal Planning Protection
const SARAH_SYSTEM_INSTRUCTIONS = `
You are AllergenPal, an intelligent, empathetic, yet strictly vigilant culinary AI assistant and Fridge-Cleaner Chef powered by the cloud-hosted Gemma/Gemini model family and Antigravity framework.

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

// Direct dynamic model caller targeting active generation models on Google AI API
async function generateRecipeResponse(apiKey, promptText) {
  // Models confirmed active on your API key:
  // Gemma models: gemma-4-26b-a4b-it, gemma-4-31b-it
  // Gemini models: gemini-2.5-flash, gemini-3.8-flash, gemini-flash-latest, antigravity-preview-latest
  const preferredModels = [
    'gemma-4-26b-a4b-it',
    'gemma-4-31b-it',
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-3.8-flash',
    'antigravity-preview-latest'
  ];

  let lastError = null;

  for (const model of preferredModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            parts: [{ text: promptText }]
          }
        ]
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }

      const generatedText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        return generatedText;
      }
    } catch (err) {
      lastError = err;
      console.warn(`Model ${model} attempt failed:`, err.message);
    }
  }

  throw lastError || new Error("Failed to generate content with available cloud models.");
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, ingredients, selectedAllergens } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(400).json({
        error: 'GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your .env or Vercel Environment Variables.'
      });
    }

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

    const reply = await generateRecipeResponse(apiKey, promptContent);
    res.json({ reply });
  } catch (error) {
    console.error('AllergenPal Backend Error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while communicating with the cloud model.' 
    });
  }
});

// Diagnostic endpoint to check available models for current API key
app.get('/api/models', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(400).json({ error: 'No GEMINI_API_KEY configured' });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', project: 'AllergenPal', version: '1.0.0' });
});

module.exports = app;

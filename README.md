# AllergenPal 🍳

**AllergenPal** is an intelligent, privacy-focused, allergy-aware meal planner built for the **Hacktoberfest 2026 Weekend Challenge: Build for a Friend**. 

The project leverages Google's open-weight **Gemma** model running locally to create tailored, safe, and delicious recipes out of whatever ingredients are available in the fridge, entirely bypassing commercial recipe logs and ensuring health data privacy.

---

## 🎯 The Mission & Theme (Build for a Friend)
This project was built specifically for my roommate, Sarah, who manages multiple severe food allergies (peanuts, dairy, and gluten). Safely planning daily meals without running into cross-contamination risks or repetitive options is a stressful daily chore. 

**AllergenPal** removes that burden. By inputting an allergen profile alongside the ingredients currently available at home, it constructs fully balanced, safe, and creative meals dynamically.

---

## 🔥 Key Features
* **Allergen Isolation:** Evaluates and strips out potential allergens (peanuts, dairy, gluten) from meal suggestions automatically.
* **Smart Substitutions:** Intelligently recommends safe alternatives (e.g., swapping heavy cream for coconut cream or wheat pasta for chickpea variants).
* **Fridge Cleaner:** Generates menu structures based on current inventory to reduce domestic food waste.
* **100% Private & Local:** Health preferences and daily schedules are processed on the machine without ever touching external cloud systems.

---

## 🛠️ Technical Implementation
* **AI Engine:** Google **Gemma** (Open-weight LLM)
* **Local Inference:** Running seamlessly through **Ollama**
* **Deployment Platform:** **Vercel**
* **Core Application Logic:** Custom system prompts paired with zero-shot validation logic to ensure ingredient processing rules are strictly locked down.

---

## 💡 Why Open Innovation Matters
Using an open-source architecture instead of a locked commercial model was critical for this build:
1. **Health Privacy:** Dietary details and lifestyle habits are highly sensitive medical data points. Running a local model ensures zero tracking or remote telemetry logging.
2. **Infinite Iteration:** Meal brainstorming sessions require extensive chat history contexts. Utilizing an open-weight foundation model means zero paywalls, API limits, or operational token bills.
3. **Deterministic Control:** Allows custom formatting restrictions to guarantee safe output structures without closed-system fine-tuning or guardrails interfering with raw instructions.

---

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have **Ollama** installed on your system.

### Running the Model
```bash
# Pull the open-weight model
ollama pull gemma

# Run inference locally
ollama run gemma
```

---

## 🏆 Hacktoberfest 2026 Categories
* **Best Use of Gemma:** Core application layers run entirely on Google's foundational open-weight model framework.

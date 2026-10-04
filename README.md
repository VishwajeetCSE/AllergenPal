# 🛡️ AllergenPal - Safe Meal Planner & Fridge Cleaner

Built for the **Hacktoberfest 2026 Weekend Challenge**.

Live URL: [https://allergen-pal-kappa.vercel.app/](https://allergen-pal-kappa.vercel.app/)  
GitHub Repo: [https://github.com/VishwajeetCSE/AllergenPal.git](https://github.com/VishwajeetCSE/AllergenPal.git)

---

## 🌟 Overview

**AllergenPal** is an intelligent AI culinary assistant and fridge-cleaner chef engineered to guarantee absolute safety for roommates or family members with severe dietary allergies.

Specifically locked down for **Sarah's Protocol**:
- 🥜 **Peanut-Free**: Strict zero-tolerance for peanuts or peanut cross-contaminations.
- 🥛 **Dairy-Free**: Automatic replacement of dairy with coconut cream, oat milk, or avocado oil.
- 🌾 **Gluten-Free**: Replacement of wheat, regular flour, and standard soy sauce with Tamari and GF grains.
- ♻️ **Fridge-Cleaner Engine**: Dynamically turns leftover ingredients into balanced meals to minimize food waste.

---

## 🛠️ Architecture

- **Backend / Agent**: Express / Serverless Vercel function (`/api/chat`) calling the Google cloud-hosted model (`gemini-2.5-flash` / Gemma model family).
- **Frontend**: Responsive modern UI built with Tailwind CSS, Lucide Icons, and Markdown parser.
- **Hosting**: Optimized for instant zero-configuration deployment to [Vercel](https://vercel.com).

---

## 🚀 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VishwajeetCSE/AllergenPal.git
   cd AllergenPal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create or edit `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the local server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel

1. Push your code to GitHub.
2. Import the repository into your Vercel Dashboard.
3. In Project Settings > **Environment Variables**, add:
   - `GEMINI_API_KEY` = your API key
4. Deploy!

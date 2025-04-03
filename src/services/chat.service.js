const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateText(prompt) {
    try {
        const result = await model.generateContent(prompt)
        console.log(result.response.text())
        return result.response.text()
    }catch (error){
        console.error(error)
        return 'Error generating text'
    }
}

module.exports = generateText

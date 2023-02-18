import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.35,
      max_tokens: 230,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Answer questions about dental care. If the question is not about detal care or dentists, respond 'Not applicable".

  Q: How often should I visit the dentist?
  A: To keep your teeth and gums healthy, it is important to schedule regular checkups and dental cleanings. The American Dental Association (ADA) advises adult patients to visit the dentist at least once every six months. Regular dental cleanings remove stains and plaque buildup, preventing the risk of tooth decay and gum disease. If you experience a sudden onset of pain in your teeth or gums, immediately book an appointment with your local dentist. He or she will evaluate the problem and recommend the appropriate oral treatments for your case..
  
  Q: How can I prevent cavities?
  A: Cavities are permanent small holes that develop on the hard surface of your teeth. Tooth decay is associated with a variety of factors, including your dietary choices and dental hygiene routine. Brushing your teeth twice a day for two minutes and flossing once a day are the most effective ways to remove plaque buildup from between the teeth and below the gumline. Regular teeth cleanings and checkups at your local dentist also support proper oral and dental hygiene, especially when combined with fluoride treatment. To minimize acid-producing bacteria that attack your tooth enamel, drink fluoridated tap water and maintain a well-balanced diet that is low in sugary or starchy foods and acidic beverages.
  
  Q: Why does the dentist take X-rays?
  A: X-Rays allow your dentist to look for oral health issues that may be difficult to identify with a visual examination alone. Your dentist may recommend a full-set of X-rays to establish a baseline for your oral health, identify potential problems such as cavities, tooth decay, and impacted teeth, or prepare for a larger dental treatment. Today, the American Dental Association (ADA) recommends that patients receive dental X-rays at 6 to 18 month intervals, depending on their risk level for decay.
  
  
  Q: Why is flossing important?
  A: Flossing is essential to your smile’s health. Regular use of dental floss is important for plaque removal, maintaining healthy gums, and preventing periodontal disease. By removing food particles and bacteria that build up between teeth, flossing helps keep your smile healthy and beautiful for life.

  Q: ${capitalizedAnimal}
  A:`;
}

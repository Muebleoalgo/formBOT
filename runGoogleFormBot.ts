import GoogleFormBot from './googleFormBot';
import { randomBytes } from 'crypto';

const generateToken = (): string => randomBytes(75).toString('base64').slice(0, 100);

function generateRandomEmail(): string {
  const domains = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "live.com"];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  const emailPrefix = randomBytes(10).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
  return `${emailPrefix}@${randomDomain}`;
}


async function runGoogleFormBot() {
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfVI-HUcDeZkBdCqIGw08wPvOl7pXRPcEpPjfTWPedTZyMVVg/viewform';
  const bot = new GoogleFormBot(formUrl);

  try {
    await bot.init();

    const formResponses = {
      'Nombre y apellido': generateToken(),
      'DNI/ Pasaporte': generateToken(),
      'Lugar de residencia': generateToken(),
      'Número de teléfono': generateToken(),
      'Correo electrónico': generateRandomEmail(),
      'Nombre de tu organización': generateToken()
    };

    await bot.fillForm(formResponses);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.error('Error running bot:', error);
  } finally {
    await bot.close();
  }
}

runGoogleFormBot();

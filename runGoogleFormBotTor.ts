import GoogleFormBot from './googleFormBot';

async function runGoogleFormBot() {
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfVI-HUcDeZkBdCqIGw08wPvOl7pXRPcEpPjfTWPedTZyMVVg/viewform';
  const bot = new GoogleFormBot(formUrl);

  try {
    await bot.init();
    await bot.fillForm();
  } catch (error) {
    console.error('Error running bot:', error);
  } finally {
    await bot.close();
  }
}

runGoogleFormBot();

import puppeteer, { Browser, Page } from 'puppeteer';
import { randomBytes } from 'crypto';

interface GoogleFormData {
  [key: string]: string | boolean;
}

class GoogleFormBot {
  private page: Page | null = null;
  private browser: Browser | null = null;

  constructor(private formUrl: string) {
    if (!formUrl.includes('forms.gle') && 
        !formUrl.includes('forms.google.com') && 
        !formUrl.includes('docs.google.com/forms')) {
      throw new Error('URL provided is not a Google Form');
    }
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: [
        '--proxy-server=socks5://127.0.0.1:9050', // Conectar a Tor
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });
    this.page = await this.browser.newPage();
  }

  private generateToken(): string {
    return randomBytes(75).toString('base64').slice(0, 40);
  }

  private generateRandomEmail(): string {
    const domains = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "live.com"];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const emailPrefix = randomBytes(10).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 30);
    return `${emailPrefix}@${randomDomain}`;
  }

  async fillForm() {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      for (let i = 0; i < 5000; i++) {
        console.log(`Enviando respuesta número ${i + 1}`);
        await this.page.goto(this.formUrl, { waitUntil: 'load', timeout: 60000 });

        const formResponses = {
          'Por favor comprueba que eres un ser humano respondiendo la siguiente pregunta: ¿Cuanto es 5+10?': '15',
          'Nombre y apellido': this.generateToken(),
          'DNI/ Pasaporte': this.generateToken(),
          'Lugar de residencia': this.generateToken(),
          'Número de teléfono': this.generateToken(),
          'Correo electrónico': this.generateRandomEmail(),
          'Nombre de tu organización': this.generateToken()
        };

        await this.fillInput('Nombre y apellido', formResponses['Nombre y apellido']);
        await this.fillInput('DNI/ Pasaporte', formResponses['DNI/ Pasaporte']);
        await this.fillInput('Lugar de residencia', formResponses['Lugar de residencia']);
        await this.fillInput('Número de teléfono', formResponses['Número de teléfono']);
        await this.fillInput('Correo electrónico', formResponses['Correo electrónico']);
        await this.fillInput('Por favor comprueba que eres un ser humano respondiendo la siguiente pregunta:', '15');

        const submitButton = await this.page.$('div[role="button"][aria-label="Submit"]');
        if (submitButton) {
          await submitButton.click();
          console.log("Formulario enviado exitosamente");
        } else {
          console.error('Botón de enviar no encontrado');
        }

        const retryButton = await this.page.$('a:has-text("Enviar otra respuesta")');
        if (retryButton) {
          await retryButton.click();
          console.log("Clic en 'Enviar otra respuesta'");
          await this.page.waitForTimeout(3000);
        }
      }

    } catch (error) {
      console.error('Error filling form:', error);
    }
  }

  private async fillInput(label: string, value: string | boolean) {
    if (!this.page || typeof value !== 'string') return;
    const input = await this.page.$(`input[aria-label="${label}"]`);
    if (input) {
      await input.type(value);
      console.log(`Campo "${label}" rellenado con: "${value}"`);
    } else {
      console.error(`Campo no encontrado: ${label}`);
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export default GoogleFormBot;

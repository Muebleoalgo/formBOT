import { chromium, Page } from '@playwright/test';
import { randomBytes } from 'crypto';

interface GoogleFormData {
  [key: string]: string | boolean;
}

class GoogleFormBot {
  private page: Page | null = null;
  private browser: any = null;

  constructor(private formUrl: string) {
    if (!formUrl.includes('forms.gle') && 
        !formUrl.includes('forms.google.com') && 
        !formUrl.includes('docs.google.com/forms')) {
      throw new Error('URL provided is not a Google Form');
    }
  }

  async init() {
    this.browser = await chromium.launch({
      headless: false,
      args: ['--disable-features=IsolateOrigins,site-per-process']
    });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
  }

  // Generar token aleatorio
  private generateToken(): string {
    return randomBytes(75).toString('base64').slice(0, 40);
  }

  // Generar correo electrónico aleatorio
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
  
        // Generar nuevas respuestas para cada envío
        const formResponses = {
          'Por favor comprueba que eres un ser humano respondiendo la siguiente pregunta: ¿Cuanto es 5+10?': '15', // Respuesta correcta
          'Nombre y apellido': this.generateToken(),
          'DNI/ Pasaporte': this.generateToken(),
          'Lugar de residencia': this.generateToken(),
          'Número de teléfono': this.generateToken(),
          'Correo electrónico': this.generateRandomEmail(),
          'Nombre de tu organización': this.generateToken()
        };
  
        // Rellenar los campos del formulario
        await this.fillInput('Nombre y apellido', formResponses['Nombre y apellido']);
        await this.fillInput('DNI/ Pasaporte', formResponses['DNI/ Pasaporte']);
        await this.fillInput('Lugar de residencia', formResponses['Lugar de residencia']);
        await this.fillInput('Número de teléfono', formResponses['Número de teléfono']);
        await this.fillInput('Correo electrónico', formResponses['Correo electrónico']);
        await this.fillInput('Nombre de tu organización', formResponses['Nombre de tu organización']);
  
        // Manejar la pregunta de verificación (captcha)
        await this.fillInput('Por favor', '4'); // Ajusta la respuesta según la operación
  
        // Hacer clic en el botón de enviar
        const submitButton = this.page.locator('div[role="button"][aria-label="Submit"]');
        if (await submitButton.count() > 0) {
          await submitButton.click();
          console.log("Formulario enviado exitosamente");
        } else {
          console.error('Botón de enviar no encontrado');
          return;
        }
  
        // Esperar a que aparezca el enlace "Enviar otra respuesta"
        const retryButton = this.page.locator('a:has-text("Enviar otra respuesta")');
        await retryButton.waitFor({ timeout: 15000 });
  
        // Hacer clic en "Enviar otra respuesta"
        if (await retryButton.count() > 0) {
          await retryButton.click();
          console.log("Clic en 'Enviar otra respuesta'");
          await this.page.waitForTimeout(3000); // Pausa para que la página se recargue
        } else {
          console.error('Botón "Enviar otra respuesta" no encontrado');
          break;
        }
      }
  
    } catch (error) {
      console.error('Error filling form:', error);
      throw error;
    }
  }
  

  private async fillInput(label: string, value: string | boolean) {
    if (typeof value !== 'string' || !this.page) return;
  
    try {
      // Intentar encontrar el campo utilizando `getByLabel`
      let input = await this.page.getByLabel(label);
  
      // Si no se encuentra con `getByLabel`, buscar usando un selector alternativo
      if (!input || (await input.count() === 0)) {
        console.log(`Intentando encontrar el campo para: "${label}" usando un selector alternativo`);
  
        // Selector para preguntas que contienen "Por favor"
        const captchaDiv = await this.page.locator('div:has-text("Por favor")');
        
        // Verificar si encontramos el contenedor del captcha
        if (await captchaDiv.count() > 0) {
          // Buscar el campo de entrada dentro de ese contenedor
          input = await captchaDiv.locator('input[type="text"]');
          if (await input.count() > 0) {
            await input.fill(value);
            console.log(`Campo de captcha (que contiene "Por favor") rellenado con: "${value}"`);
            return;
          }
        }
      }
  
      // Si se encontró el campo por `getByLabel`, rellenarlo
      if (input) {
        await input.fill(value);
        console.log(`Campo "${label}" rellenado con: "${value}"`);
      } else {
        console.error(`Campo no encontrado para el label: ${label}`);
      }
    } catch (error) {
      console.error(`Error al rellenar el campo: ${label}`, error);
    }
  }
  
  
  

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export default GoogleFormBot;

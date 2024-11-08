import { chromium, Page } from '@playwright/test';

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

  async fillForm(formData: GoogleFormData) {
    if (!this.page) throw new Error('Browser not initialized');
  
    try {
      await this.page.goto(this.formUrl, { waitUntil: 'load', timeout: 60000 });
  
      // Llenar el formulario utilizando el método actualizado
      await this.fillInput('Nombre y apellido', formData['Nombre y apellido']);
      await this.fillInput('DNI/ Pasaporte', formData['DNI/ Pasaporte']);
      await this.fillInput('Lugar de residencia', formData['Lugar de residencia']);
      await this.fillInput('Número de teléfono', formData['Número de teléfono']);
      await this.fillInput('Correo electrónico', formData['Correo electrónico']);
      await this.fillInput('Nombre de tu organización', formData['Nombre de tu organización']);
  
      // Enviar el formulario
      await this.page.locator('//div[@role="button" and contains(text(), "Enviar")]').click();
      await this.page.waitForSelector('.freebirdFormviewerViewResponseConfirmationMessage', { timeout: 10000 });
  
      console.log("Formulario enviado exitosamente");
      return true;
  
    } catch (error) {
      console.error('Error filling form:', error);
      throw error;
    }
  }
  

  private async fillInput(label: string, value: string | boolean) {
    if (typeof value !== 'string' || !this.page) return;
  
    // Encontrar el input usando la clase y el atributo 'aria-labelledby'
    const inputSelector = `//div[contains(@class, 'rFrNMe')]//span[contains(text(), "${label}")]/ancestor::div[contains(@class, 'rFrNMe')]//input[@type="text"]`;
    
    const input = await this.page.locator(inputSelector);
  
    if (await input.count() > 0) {
      await input.fill(value);
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

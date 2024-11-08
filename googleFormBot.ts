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
      for (let i = 0; i < 300; i++) {
        console.log(`Enviando respuesta número ${i + 1}`);
  
        await this.page.goto(this.formUrl, { waitUntil: 'load', timeout: 60000 });
  
        // Llenar los campos del formulario
        await this.fillInput('Nombre y apellido', formData['Nombre y apellido']);
        await this.fillInput('DNI/ Pasaporte', formData['DNI/ Pasaporte']);
        await this.fillInput('Lugar de residencia', formData['Lugar de residencia']);
        await this.fillInput('Número de teléfono', formData['Número de teléfono']);
        await this.fillInput('Correo electrónico', formData['Correo electrónico']);
        await this.fillInput('Nombre de tu organización', formData['Nombre de tu organización']);
  
        // Hacer clic en el botón de enviar
        const submitButton = this.page.locator('div[role="button"][aria-label="Submit"]');
        if (await submitButton.count() > 0) {
          await submitButton.click();
          console.log("Formulario enviado exitosamente");
        } else {
          console.error('Botón de enviar no encontrado');
          return;
        }
  
        // Esperar a que aparezca el enlace "Enviar otra respuesta" en lugar del mensaje de confirmación
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
      const input = this.page.getByLabel(label);
      await input.fill(value);
      console.log(`Campo "${label}" rellenado con: "${value}"`);
    } catch (error) {
      console.error(`Campo no encontrado: ${label}`, error);
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export default GoogleFormBot;

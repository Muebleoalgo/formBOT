// formBot.ts
import { chromium, type Page } from '@playwright/test';

interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  message?: string;
  mensaje?: string;
  // Añade más campos según necesites
}

class FormBot {
  private page: Page | null = null;
  private browser: any = null;

  constructor(private formUrl: string) {}

  async init() {
    this.browser = await chromium.launch({
      headless: false // Cambia a true para modo sin interfaz
    });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
  }

  async fillForm(data: FormData) {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      // Navegar al formulario
      await this.page.goto(this.formUrl);

      // Esperar a que el formulario esté cargado
      await this.page.waitForSelector('form');

      // Llenar los campos
      if (data.firstName) {
        await this.page.fill('input[name="firstName"]', data.firstName);
      }
      if (data.lastName) {
        await this.page.fill('input[name="lastName"]', data.lastName);
      }
      if (data.email) {
        await this.page.fill('input[name="email"]', data.email);
      }
      if (data.phone) {
        await this.page.fill('input[name="phone"]', data.phone);
      }
      if (data.message) {
        await this.page.fill('textarea[name="message"]', data.message);
      }
      if (data.mensaje) {
        await this.page.fill('textarea[name="message"]', data.mensaje);
      }
      // Esperar un momento antes de enviar (opcional)
      await this.page.waitForTimeout(1000);

      // Enviar el formulario
      await this.page.click('button[type="submit"]');

      // Esperar la respuesta (ajusta según necesites)
      await this.page.waitForTimeout(2000);

    } catch (error) {
      console.error('Error filling form:', error);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export default FormBot;
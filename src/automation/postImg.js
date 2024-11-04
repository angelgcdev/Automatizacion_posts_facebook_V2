// automtion/postImg.js
import { chromium } from "playwright";

const selectorImg = 'img[data-visualcompletion="media-vc-image"]';

//****************FUNCIONES************************/

//Funcion para hacer click en un selector con espera
const clickOnSelector = async (page, selector) => {
  await page.waitForLoadState("networkidle");
  await page.waitForSelector(selector, { timeout: 10000 });
  await page.click(selector);
};

//Función principal para extraer la url del post
const postImg = async (url) => {
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      // slowMo: 0,
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    //Navegar al enlace del post de una página
    await page.goto(url);

    await clickOnSelector(page, "div[aria-label='Cerrar']");

    //extraer la url de la imagen
    const imageURL = await page.$eval(selectorImg, (el) => el.src);
    return imageURL;

    // const imageElement = await page.$(selectorImg);

    // if (imageElement) {
    //   const imageUrl = await imageElement.getAttribute("src");
    //   return imageUrl;
    // } else {
    //   console.log("No se encontró la imagen con el selector proporcionado.");
    //   return null;
    // }
  } catch (error) {
    console.log("Error al obtener la URL de la imagen:", error);
  } finally {
    if (browser) {
      await browser.close();
      console.log("Navegador cerrado.");
    }
  }
};

export { postImg };

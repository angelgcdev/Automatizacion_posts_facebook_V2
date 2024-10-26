// automtion/postImg.js
import { chromium } from "playwright";

//Variables
const URL = "https://www.facebook.com/";
// const selectorImg = "img.x1bwycvy.x193iq5w.x4fas0m.x19kjcj4";
const selectorImg = 'img[data-visualcompletion="media-vc-image"]';

//****************FUNCIONES************************/

//Funcion para hacer click en un selector con espera
const clickOnSelector = async (page, selector) => {
  await page.waitForLoadState("networkidle");
  await page.waitForSelector(selector, { timeout: 10000 });
  await page.click(selector);
};

//Funcion para llenar un campo de texto
const fillField = async (page, selector, value) => {
  await page.waitForLoadState("networkidle");
  await page.waitForSelector(selector, { timeout: 10000 });
  await page.fill(selector, value);
};

//Funcion para iniciar sesion en Facebook
const loginToFacebook = async (page, email, password) => {
  await page.goto(URL);
  await page.waitForLoadState("networkidle");
  await fillField(page, "#email", email);
  await fillField(page, "#pass", password);
  await clickOnSelector(page, "button[name='login']");
  await page.waitForNavigation({ timeout: 30000 });
};

//Función principal para extraer la url del post
const postImg = async ({email, password, url}) => {
  let browser;
  try {
    browser = await chromium.launch({
      headless: false,
      slowMo: 0,
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    //Iniciar sesión en Facebook
    await loginToFacebook(page, email, password);

    //Navegar al enlace del post de una página
    await page.goto(url);
    await page.waitForLoadState("networkidle");

    const imageElement = await page.$(selectorImg);

    if (imageElement) {
      const imageUrl = await imageElement.getAttribute("src");
      return imageUrl;
    } else {
      console.log("No se encontró la imagen con el selector proporcionado.");
      return null;
    }
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

// (async () => {
//   const urlobtenido = await postImg({
//     email: "angelgcdev@gmail.com",
//     password: "perro2023_.",
//     url: "https://www.facebook.com/photo/?fbid=1101855008606758&set=gm.1511364602874997&idorvanity=1008978109780318",
//   });

//   console.log("Aqui: ", urlobtenido);
// })();

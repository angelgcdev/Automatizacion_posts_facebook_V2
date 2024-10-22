// src/facebookAutomation.js
import { chromium } from "playwright";
import { pool } from "./db.js";

const MIN_DELAY = 5000; // Minimo tiempo de espera en milisegundos
const MAX_DELAY = 10000; // Máximo tiempo de espera en milisegundos

// Función para obtener un retraso aleatorio
const getRandomDelay = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

//Funcion para hacer click en un selector con espera
const clickOnSelector = async (page, selector) => {
  await page.waitForSelector(selector, { timeout: 10000 }); //Espera hasta 10 segundos
  await page.click(selector);
};

//Funcion para llenar un campo de texto
const fillField = async (page, selector, value) => {
  await page.waitForSelector(selector, { timeout: 10000 }); //Espera hasta 10 segundos
  await page.fill(selector, value);
};

//Funcion para iniciar sesion en Facebook
const loginToFacebook = async (page, post) => {
  await page.goto("https://www.facebook.com/");
  await fillField(page, "#email", post.email);
  await fillField(page, "#pass", post.password);
  await clickOnSelector(page, "button[name='login']");
  await page.waitForNavigation({ timeout: 30000 }); //Espera hasta 30 segundos
};

// Función Principal de automatización de Facebook
const automatizarFacebook = async (post) => {
  let browser;
  let postCount = 0; //acumulador
  let nombre_grupo = "";
  try {
    browser = await chromium.launch({
      headless: false,
      slowMo: 50,
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Iniciar sesión en Facebook
    await loginToFacebook(page, post);

    // Navegar al enlace del post de una página
    await page.goto(post.url);
    // await page.waitForTimeout(getRandomDelay(MIN_DELAY, MAX_DELAY));

    //Verificar si ya se dio me gusta
    const likeButtonSelector = 'div[aria-label="Me gusta"]';

    try {
      //Esperar a que el boton este presente
      await page.waitForSelector(likeButtonSelector, { timeout: 10000 });

      //Evalua el aria-label del boton
      const isLiked = await page.evaluate((selector) => {
        const button = document.querySelector(selector);
        if (button) {
          const ariaLabel = button.getAttribute("aria-label");
          //Compara el valor de aria-label
          return ariaLabel !== "Me gusta";
        }
        return false;
      }, likeButtonSelector);

      if (!isLiked) {
        // await page.waitForTimeout(getRandomDelay(MIN_DELAY, MAX_DELAY));
        await clickOnSelector(page, likeButtonSelector);
      } else {
        console.log("Me gusta esta activado");
      }
    } catch (error) {
      console.log(
        'El boton "Me gusta" no se encontro o se produjo un error:',
        error
      );
    }

    // Publicar en los grupos
    for (let i = 1; i <= post.numero_de_posts; i++) {
      await page.waitForTimeout(post.intervalo_tiempo * 60000); //intervalo de tiempo entre publicaciones

      //Botón Compartir
      const selector1 =
        'div[aria-label="Envía la publicación a amigos o publícala en tu perfil."]';
      const selector2 =
        'div[aria-label="Envía esto a tus amigos o publícalo en tu perfil."]';
      const selector3 = 'div[aria-label="Compartir"]';

      const firstSelector = await Promise.race([
        page.waitForSelector(selector1, { timeout: 10000 }),
        page.waitForSelector(selector2, { timeout: 10000 }),
        page.waitForSelector(selector3, { timeout: 10000 }),
      ]);

      if (firstSelector) {
        await firstSelector.click();
        console.log(
          "Se hizo clic en el primer selector(compartir) que se resolvió."
        );
      } else {
        throw new Error("Ningún selector se resolvió a tiempo.");
      }

      try {
        // await page.waitForTimeout(getRandomDelay(MIN_DELAY, MAX_DELAY));
        //Click en el boton 'Grupo'
        await clickOnSelector(
          page,
          'div[role="button"] span:has-text("Grupo")'
        );
      } catch (error) {
        console.error(error);
      }

      //-----------------Opcion auxiliar-------------------------------
      try {
        // await page.waitForTimeout(getRandomDelay(MIN_DELAY, MAX_DELAY));
        await clickOnSelector(
          page,
          'div[role="button"] span:has-text("Más opciones")'
        );

        // await page.waitForTimeout(getRandomDelay(MIN_DELAY, MAX_DELAY));
        await clickOnSelector(
          page,
          'div[role="button"] span:has-text("Compartir en un grupo")'
        );
      } catch (error) {
        console.error(error);
      }
      //--------------------------------------------------------------------

      // await page.waitForTimeout(getRandomDelay(MIN_DELAY, MAX_DELAY));
      await page.waitForSelector('div[role="list"]');

      const titleGroupPost = await page.locator(
        `div[role="listitem"][data-visualcompletion="ignore-dynamic"]:nth-of-type(${i})
  span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x676frb x1lkfr7t x1lbecb7 xk50ysn xzsf02u x1yc453h"]`
      );

      nombre_grupo = await titleGroupPost.textContent();
      console.log(nombre_grupo);

      await page.click(
        `div[role="list"] div[role="listitem"][data-visualcompletion="ignore-dynamic"]:nth-child(${i})`
      );

      // await page.waitForTimeout(getRandomDelay(MIN_DELAY, MAX_DELAY));
      await fillField(
        page,
        'div[aria-label="Crea una publicación pública..."]',
        post.mensaje
      );
      await page.keyboard.press("Space");

      // await page.waitForTimeout(getRandomDelay(MIN_DELAY, MAX_DELAY));
      await clickOnSelector(page, 'div[aria-label="Publicar"]');

      await page.waitForTimeout(getRandomDelay(MIN_DELAY, MAX_DELAY));

      postCount++;
    }

    //Actualizar el reporte de publicaciones en la base de datos
    const currentDate = new Date().toISOString();

    try {
      const { rows } = await pool.query(
        "INSERT INTO reportes (id_publicacion, id_usuario, email, url, mensaje, total_posts, nombre_grupo, fecha_publicacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [
          post.id_publicacion,
          post.id_usuario,
          post.email,
          post.url,
          post.mensaje,
          postCount,
          nombre_grupo,
          currentDate,
        ]
      );
      console.log(`Reporte insertado:`, rows[0]); //Imprime el reporte insertado
      // return res.json(rows[0]);
    } catch (error) {
      console.log(`Error al insertar el reporte:`, error);
      console.log(error);
      // return res.status(500).json({ message: "Interval server error" });
    }

    await browser.close();
  } catch (error) {
    console.log("Se ha producido un error:", error);
    if (browser) {
      await browser.close();
    }
    throw error; // Propagar el error para manejarlo en la ruta del servidor
  }
};

console.log("Exportando automatizarFacebook:", typeof automatizarFacebook);

export { automatizarFacebook };

// src/facebookAutomation.js
import { chromium } from "playwright";
import { pool } from "../db.js";

/*********VARIABLES***********/
let browser = null;
let page = null;

const MIN_DELAY = 5000; // Minimo tiempo de espera en milisegundos
const MAX_DELAY = 10000; // Máximo tiempo de espera en milisegundos
const URL = "https://www.facebook.com/";

/************FUNCIONES***********/
// Función para obtener un retraso aleatorio
const getRandomDelay = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

//Funcion para simular pausas y movimientos del mouse
const humanizeInteraction = async (page) => {
  //Movimientos aleatorios del raton en posiciones de la pagina
  await page.mouse.move(
    Math.floor(Math.random() * 800),
    Math.floor(Math.random() * 600),
    { steps: 10 }
  );
  await page.waitForTimeout(getRandomDelay(500, 1500)); //pausa breve
};

//Funcion para hacer click en un selector con espera
const clickOnSelector = async (page, selector) => {
  await page.waitForLoadState("networkidle");
  await page.waitForSelector(selector, { timeout: 10000 }); //Espera hasta 10 segundos
  await humanizeInteraction(page);
  await page.click(selector);
};

//Funcion para llenar un campo de texto con retrasos, simulados entre caracteres
const fillField = async (page, selector, value) => {
  await page.waitForLoadState("networkidle");
  await page.waitForSelector(selector, { timeout: 10000 }); //Espera hasta 10 segundos
  await humanizeInteraction(page);
  for (const char of value) {
    await page.type(selector, char, { delay: getRandomDelay(50, 150) });
  }
};

//Funcion para iniciar sesion en Facebook
const loginToFacebook = async (page, { email, password }) => {
  await page.goto(URL);
  await fillField(page, "#email", email);
  await fillField(page, "#pass", password);
  await clickOnSelector(page, "button[name='login']");
  await page.waitForNavigation({ timeout: 30000 });
};

// Función Principal de automatización de Facebook
const automatizarFacebook = async (post) => {
  // let postCount = 0; //acumulador
  let nombre_grupo = "";
  try {
    //Lanzar el navegador
    browser = await chromium.launch({
      headless: true,
      slowMo: 50,
    });

    //Crear un nuevo contexto
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
      bypassCSP: true,
    });

    //Crear una nueva pagina
    const page = await context.newPage();

    //Deshabilitar navigator.webdriver y modificar propiedades visibles
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en"],
      });
    });

    // Iniciar sesión en Facebook
    await loginToFacebook(page, post);

    // Navegar al enlace del post de una página
    await page.goto(post.url);
    await page.waitForLoadState("networkidle");

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
        await clickOnSelector(page, likeButtonSelector);
        await page.waitForLoadState("networkidle");
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
        await page.waitForLoadState("networkidle");

        console.log(
          "Se hizo clic en el primer selector(compartir) que se resolvió."
        );
      } else {
        throw new Error("Ningún selector se resolvió a tiempo.");
      }

      try {
        //Click en el boton 'Grupo'
        await clickOnSelector(
          page,
          'div[role="button"] span:has-text("Grupo")'
        );
        await page.waitForLoadState("networkidle");
      } catch (error) {
        console.error(
          "Error al intentar hacer click en el botón 'Grupo'",
          error
        );
      }

      //-----------------Opcion auxiliar-------------------------------
      try {
        await clickOnSelector(
          page,
          'div[role="button"] span:has-text("Más opciones")'
        );
        await page.waitForLoadState("networkidle");

        await clickOnSelector(
          page,
          'div[role="button"] span:has-text("Compartir en un grupo")'
        );
        await page.waitForLoadState("networkidle");
      } catch (error) {
        console.error(error);
      }

      await page.waitForSelector('div[role="list"]', { timeout: 10000 });

      const titleGroupPost = await page.locator(
        `div[role="listitem"][data-visualcompletion="ignore-dynamic"]:nth-of-type(${i})
  span[class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x676frb x1lkfr7t x1lbecb7 xk50ysn xzsf02u x1yc453h"]`
      );

      nombre_grupo = await titleGroupPost.textContent();
      console.log(nombre_grupo);

      await clickOnSelector(
        page,
        `div[role="list"] div[role="listitem"][data-visualcompletion="ignore-dynamic"]:nth-child(${i})`
      );
      await page.waitForLoadState("networkidle");

      await fillField(
        page,
        'div[aria-label="Crea una publicación pública..."]',
        post.mensaje
      );
      await page.keyboard.press("Space");

      await clickOnSelector(page, 'div[aria-label="Publicar"]');
      await page.waitForLoadState("networkidle");

      //Actualizar el reporte de publicaciones en la base de datos
      const currentDate = new Date().toLocaleString("es-ES", {
        timeZone: "America/La_Paz",
      });

      try {
        const { rows } = await pool.query(
          "INSERT INTO reportes (id_publicacion, id_usuario, email, url, url_img, mensaje, nombre_grupo, fecha_publicacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
          [
            post.id_publicacion,
            post.id_usuario,
            post.email,
            post.url,
            post.url_img,
            post.mensaje,
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

      // postCount++;
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

//Función para cerrar el navegador
const cancelAutomation = () => {
  if (browser) {
    browser.close();
    browser = null;
    page = null;
    console.log("Automatizacion cancelada, navegador cerrado.");
  }
};

export { automatizarFacebook, cancelAutomation };

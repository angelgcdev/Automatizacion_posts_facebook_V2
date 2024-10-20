//Funcion para limpiar el texto
const cleanText = (text) => {
  return text.replace(/\u200B/g, ""); // Remover Zero Width Space
};

export { cleanText };

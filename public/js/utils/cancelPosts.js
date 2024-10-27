// public/js/utils/cancelPosts.js
let controller = new AbortController();

//Funcion para obtener un nuevo signal y reiniciar el controller
const getNewSignal = () => {
  controller = new AbortController();
  return controller.signal;
};

//Funcion para cancelar la operacion
const cancelPosts = () => {
  if (controller) {
    controller.abort();
    console.log("Se ha solicitado cancelar las publicaciones");
  }
};

export { cancelPosts, getNewSignal };

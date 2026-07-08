const routes = {
  login: {
    view: "./views/login.html",
    controller: () => import("./controllers/loginController.js")
  },
  dashboard: {
    view: "./views/dashboard.html",
    controller: () => import("./controllers/dashboardController.js")
  },
  
  meal: {
    view: "./views/meal.html",
    controller: () => import("./controllers/mealController.js")
}

};

export async function navigateTo(routeName, params = {}) {
  const route = routes[routeName];

  if (!route) {
    console.error(`Rota não encontrada: ${routeName}`);
    return;
  }

  const app = document.getElementById("app");

  const response = await fetch(route.view);
  const html = await response.text();

  app.innerHTML = html;

  const controllerModule = await route.controller();

  if (controllerModule && typeof controllerModule.init === "function") {
    controllerModule.init(params);
  }
}
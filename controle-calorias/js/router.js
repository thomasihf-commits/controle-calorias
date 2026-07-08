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
  },
  history: {
    view: "./views/history.html",
    controller: () => import("./controllers/historyController.js")
  },
  profile: {
    view: "./views/profile.html",
    controller: () => import("./controllers/profileController.js")
  }
};

export async function navigateTo(routeName, params = {}) {
  const route = routes[routeName];

  if (!route) {
    console.error(`Rota não encontrada: ${routeName}`);
    return;
  }

  const app = document.getElementById("app");

  try {
    const response = await fetch(route.view);

    if (!response.ok) {
      throw new Error(`Erro ao carregar view: ${route.view}`);
    }

    app.innerHTML = await response.text();

    const controllerModule = await route.controller();

    if (controllerModule && typeof controllerModule.init === "function") {
      controllerModule.init(params);
    }
  } catch (error) {
    console.error(error);
    app.innerHTML = `<section class="app-shell"><div class="empty-state">Não foi possível carregar a tela.</div></section>`;
  }
}

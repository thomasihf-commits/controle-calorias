import { getSession, onAuthStateChange } from "./auth.js";
import { navigateTo } from "./router.js";

async function initApp() {
  const session = await getSession();

  if (session?.user) {
    await navigateTo("dashboard", { user: session.user });
  } else {
    await navigateTo("login");
  }

  onAuthStateChange(async (session) => {
    if (session?.user) {
      await navigateTo("dashboard", { user: session.user });
    } else {
      await navigateTo("login");
    }
  });
}

initApp();
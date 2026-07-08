import { navigateTo } from "../router.js";

export function init() {
    const btnBackDashboard = document.getElementById("btnBackDashboard");

    if (btnBackDashboard) {
        btnBackDashboard.addEventListener("click", () => {
            navigateTo("dashboard");
        });
    }
}
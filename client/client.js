const publicVapidKey =
  "BARuE7TAjgUvNzecIG9dv1w9L6_G_GO97474vA87neP16uSV7XmFK-Jec2NTQKhYONQatWaIgnIn1YLE_jS89-8";

const urlBase64ToUnit8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

// Register sw, Register Push, send Push
const send = async () => {
  console.log(" Registering service worker...");

  const register = await navigator.serviceWorker.register("/worker.js", {
    scope: "/",
  });

  console.log(" Service worker Registered....");

  // Register Push
  console.log("Registering Push....");

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUnit8Array(publicVapidKey),
  });

  console.log("Push Registered");

  //  Send push Notification
  console.log(" Sending push notification");

  fetch("/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json",
    },
  });

  console.log("Push sent ....");
};

// Check for service worker

if ("serviceWorker" in navigator) {
  send().catch((err) => {
    console.log(err);
  });
}

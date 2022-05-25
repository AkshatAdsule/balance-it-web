import "./style.css";

import { initializeApp } from "firebase/app";
import {
  DatabaseReference,
  get,
  getDatabase,
  ref,
  update,
} from "firebase/database";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const sessionId = urlParams.get("session");
const permsBtn: HTMLButtonElement = document.getElementById(
  "perms"
) as HTMLButtonElement;
permsBtn.addEventListener("click", getPerms);

async function checkIfDocumentExists(ref: DatabaseReference): Promise<boolean> {
  let data = await get(ref);
  return data.exists();
}

if (sessionId) {
  const firebaseConfig = {
    apiKey: "AIzaSyARpycPDErgpyxxJ3bR1cyGNm1Ix9KTemU",
    authDomain: "balance-it-hhs.firebaseapp.com",
    databaseURL: "https://balance-it-hhs-default-rtdb.firebaseio.com",
    projectId: "balance-it-hhs",
    storageBucket: "balance-it-hhs.appspot.com",
    messagingSenderId: "1034280146144",
    appId: "1:1034280146144:web:ef8d739c3fd60476132c85",
  };

  var app = initializeApp(firebaseConfig);
  var rtdb = getDatabase(app);

  var session = ref(rtdb, `sessions/${urlParams.get("session")}`);

  var alpha_p = document.getElementById("alpha")!;
  var beta_p = document.getElementById("beta")!;
  var gamma_p = document.getElementById("gamma")!;

  window.addEventListener(
    "deviceorientation",
    async (event: DeviceOrientationEvent) => {
      if (await checkIfDocumentExists(session)) {
        let alpha = Math.round(event.alpha!);
        let beta = Math.round(event.beta!);
        let gamma = Math.round(event.gamma!);
        alpha_p.innerText = `alpha: ${alpha}`;
        beta_p.innerText = `beta: ${beta}`;
        gamma_p.innerText = `gamma: ${gamma}`;
        await update(session, {
          orientation: beta,
          isClientConnected: true,
        });
      } else {
        alpha_p.innerText = "";
        beta_p.innerText = "";
        gamma_p.innerText = "";
        document.getElementById("log")!.innerText = "Session ended";
      }
    },
    true
  );
} else {
  document.getElementById("log")!.innerText = "Session ID not provided!";
}

function getPerms() {
  console.log("hello");
  // feature detect
  if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
    (DeviceOrientationEvent as any)
      .requestPermission()
      .then((permissionState: any) => {
        if (permissionState === "granted") {
          console.log("registered ios orientation listener")
          window.addEventListener(
            "deviceorientation",
            async (event: DeviceOrientationEvent) => {
              if (await checkIfDocumentExists(session)) {
                let alpha = Math.round(event.alpha!);
                let beta = Math.round(event.beta!);
                let gamma = Math.round(event.gamma!);
                alpha_p.innerText = `alpha: ${alpha}`;
                beta_p.innerText = `beta: ${beta}`;
                gamma_p.innerText = `gamma: ${gamma}`;
                await update(session, {
                  orientation: beta,
                  isClientConnected: true,
                });
              } else {
                alpha_p.innerText = "";
                beta_p.innerText = "";
                gamma_p.innerText = "";
                document.getElementById("log")!.innerText = "Session ended";
              }
            },
            true
          );
        }
      })
      .catch(console.error);
  } else {
    // handle regular non iOS 13+ devices
  }
}
import './style.css'

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);


const firebaseConfig = {
  apiKey: "AIzaSyARpycPDErgpyxxJ3bR1cyGNm1Ix9KTemU",
  authDomain: "balance-it-hhs.firebaseapp.com",
  databaseURL: "https://balance-it-hhs-default-rtdb.firebaseio.com",
  projectId: "balance-it-hhs",
  storageBucket: "balance-it-hhs.appspot.com",
  messagingSenderId: "1034280146144",
  appId: "1:1034280146144:web:ef8d739c3fd60476132c85"
}

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);

const session = ref(rtdb, `sessions/${urlParams.get('session')}`)
// const db = getFirestore(app);

// const querySnapshot = await getDocs(collection(db, 'sessions'));
// querySnapshot.forEach((doc) => {console.log(doc.data())});

let alpha_p = document.getElementById("alpha")!;
let beta_p = document.getElementById("beta")!;
let gamma_p = document.getElementById("gamma")!;

window.addEventListener("deviceorientation", async (event: any) => {
  let alpha = Math.round(event.alpha);
  let beta = Math.round(event.beta);
  let gamma = Math.round(event.gamma);
  alpha_p.innerText = `alpha: ${alpha}`;
  beta_p.innerText = `beta: ${beta}`;
  gamma_p.innerText = `gamma: ${gamma}`;

  await set(session, {
    // alpha: alpha,
    orientation: beta,
    // gamma: gamma,
    isClientConnected: true
  });
}, true);
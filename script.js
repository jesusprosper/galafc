import { initializeApp }
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
}
from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAVs8VRXITUxhWCDxZobU0Vz9g0CSVfmIQ",
  authDomain: "gala-fc-d44cc.firebaseapp.com",
  projectId: "gala-fc-d44cc",
  storageBucket: "gala-fc-d44cc.firebasestorage.app",
  messagingSenderId: "1070816636999",
  appId: "1:1070816636999:web:3309cc7055cffce691c162"
};



const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

window.mostrar = function(id){

  document.getElementById("inicio").style.display="none";
  document.getElementById("partidos").style.display="none";
  document.getElementById("equipo").style.display="none";

  document.getElementById(id).style.display="block";
}


async function cargarJugadores(){

  const contenedor =
    document.getElementById("listaJugadores");

  const snapshot =
    await getDocs(collection(db,"jugadores"));

  snapshot.forEach(doc => {

    const jugador = doc.data();

    contenedor.innerHTML += `
      <div class="card">
        <b>${jugador.nombre}</b>
        <br>
        Dorsal: ${jugador.dorsal}
        <br>
        Posición: ${jugador.posicion}
      </div>
    `;
  });
}


async function cargarPartidos(){

  const contenedor =
    document.getElementById("listaPartidos");

  const snapshot =
    await getDocs(
      collection(
        db,
        "partidos",
        "2025_26",
        "jornadas"
      )
    );

  snapshot.forEach(doc => {

    const partido = doc.data();

    contenedor.innerHTML += `
      <div class="card">
        Jornada ${partido.jornada}
        <br>
        Rival: ${partido.rivalId}
        <br>
        Resultado:
        ${partido.golesGala}
        -
        ${partido.golesRival}
      </div>
    `;
  });
}


async function cargarInicio(){

  const snapshot =
    await getDocs(
      collection(
        db,
        "partidos",
        "2025_26",
        "jornadas"
      )
    );

  let victorias=0;
  let empates=0;
  let derrotas=0;

  snapshot.forEach(doc => {

    const p = doc.data();

    if(p.golesGala > p.golesRival)
      victorias++;

    else if(p.golesGala < p.golesRival)
      derrotas++;

    else
      empates++;
  });

  document.getElementById("estadisticas")
  .innerHTML = `
    <div class="card">
      Victorias: ${victorias}
      <br>
      Empates: ${empates}
      <br>
      Derrotas: ${derrotas}
    </div>
  `;
}

cargarInicio();
cargarJugadores();
cargarPartidos();

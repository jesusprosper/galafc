import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


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

let jugadores = {};
let rivales = {};
let campos = {};
let partidos = [];

const GALA_LOGO = "assets/logos/gala_fc.webp";

function getRivalLogo(rivalId) {
  return rivales[rivalId]?.escudo || `assets/logos/${rivalId}.webp`;
}

function getLocalLogo(match) {
  return match.local ? GALA_LOGO : getRivalLogo(match.rivalId);
}

function getAwayLogo(match) {
  return match.local ? getRivalLogo(match.rivalId) : GALA_LOGO;
}

function renderTeamBadge(nombreEquipo, logoUrl, extraClass = "") {
  const inicial = getTeamInitial(nombreEquipo);

  return `
    <div class="team-badge ${extraClass}">
      <img 
        src="${logoUrl}" 
        alt="${nombreEquipo}"
        onerror="this.style.display='none'; this.parentElement.textContent='${inicial}'"
      >
    </div>
  `;
}

function renderSmallLogo(nombreEquipo, logoUrl) {
  const inicial = getTeamInitial(nombreEquipo);

  return `
    <div class="small-logo">
      <img 
        src="${logoUrl}" 
        alt="${nombreEquipo}"
        onerror="this.style.display='none'; this.parentElement.textContent='${inicial}'"
      >
    </div>
  `;
}

const demoStats = {
  farlo: { goles: 18, asistencias: 6, mvp: 4, pj: 19 },
  el_matador: { goles: 13, asistencias: 5, mvp: 3, pj: 17 },
  comandante: { goles: 10, asistencias: 14, mvp: 4, pj: 20 },
  pessi: { goles: 7, asistencias: 9, mvp: 2, pj: 16 },
  morci_jr: { goles: 4, asistencias: 2, mvp: 1, pj: 18 },
  morci: { goles: 3, asistencias: 3, mvp: 1, pj: 18 },
  tiki: { goles: 4, asistencias: 7, mvp: 2, pj: 20 },
  romanglobe: { goles: 5, asistencias: 6, mvp: 2, pj: 15 },
  jaradashvili: { goles: 0, asistencias: 1, mvp: 5, pj: 21 },
  chon: { goles: 1, asistencias: 1, mvp: 1, pj: 12 },
  yuus: { goles: 2, asistencias: 4, mvp: 1, pj: 18 },
  luis: { goles: 0, asistencias: 0, mvp: 1, pj: 5 },
  cliente_albino: { goles: 2, asistencias: 4, mvp: 1, pj: 9 },
  saga: { goles: 3, asistencias: 2, mvp: 1, pj: 8 },
  alfonso: { goles: 6, asistencias: 5, mvp: 2, pj: 11 },
  gonpege: { goles: 8, asistencias: 2, mvp: 2, pj: 10 }
};

const demoUpcoming = [
  {
    id: "amistoso_1",
    jornada: 23,
    fecha: "2026-09-20",
    hora: "17:00",
    rivalId: "donner_kebab_fc",
    campoId: "navalcarbon_2",
    local: true,
    estado: "pendiente"
  },
  {
    id: "amistoso_2",
    jornada: 24,
    fecha: "2026-09-27",
    hora: "18:15",
    rivalId: "west_jamon",
    campoId: "las_matas",
    local: false,
    estado: "pendiente"
  },
  {
    id: "amistoso_3",
    jornada: 25,
    fecha: "2026-10-04",
    hora: "15:45",
    rivalId: "real_club_fenta_de_vigo",
    campoId: "recinto_sur",
    local: true,
    estado: "pendiente"
  }
];

const otrosResultadosDemo = {
  22: [
    ["DonnerKebabFC", 4, 1, "La Lonja"],
    ["West Jamón", 3, 3, "REAL ORVIETO"]
  ],
  21: [
    ["HPL", 2, 5, "Chirimbamba CF"],
    ["Los Andes F.C", 1, 1, "ZENIT DE HASBULLA"]
  ],
  20: [
    ["Inafuma y Bebe 2", 2, 2, "West Jamón"],
    ["La Lonja", 4, 3, "RAYO MALAYO FC"]
  ],
  19: [
    ["REAL ORVIETO", 3, 1, "HPL"],
    ["Chirimbamba CF", 2, 2, "Los Andes F.C"]
  ]
};

const demoStandings = [
  { equipo: "GALA FC", pj: 22, pg: 15, pe: 3, pp: 4, gf: 119, gc: 67, pts: 48 },
  { equipo: "DonnerKebabFC", pj: 22, pg: 14, pe: 3, pp: 5, gf: 84, gc: 55, pts: 45 },
  { equipo: "West Jamón", pj: 22, pg: 13, pe: 4, pp: 5, gf: 78, gc: 61, pts: 43 },
  { equipo: "Real Club Fenta de Vigo", pj: 22, pg: 12, pe: 5, pp: 5, gf: 73, gc: 59, pts: 41 },
  { equipo: "REAL ORVIETO", pj: 22, pg: 11, pe: 2, pp: 9, gf: 69, gc: 68, pts: 35 },
  { equipo: "Inafuma y Bebe 2", pj: 22, pg: 10, pe: 4, pp: 8, gf: 66, gc: 65, pts: 34 },
  { equipo: "Los Andes F.C", pj: 22, pg: 8, pe: 4, pp: 10, gf: 59, gc: 65, pts: 28 },
  { equipo: "Chirimbamba CF", pj: 22, pg: 7, pe: 4, pp: 11, gf: 61, gc: 80, pts: 25 },
  { equipo: "RAYO MALAYO FC", pj: 22, pg: 6, pe: 3, pp: 13, gf: 55, gc: 76, pts: 21 },
  { equipo: "ZENIT DE HASBULLA", pj: 22, pg: 5, pe: 4, pp: 13, gf: 50, gc: 82, pts: 19 },
  { equipo: "HPL", pj: 22, pg: 4, pe: 4, pp: 14, gf: 48, gc: 91, pts: 16 },
  { equipo: "La Lonja", pj: 22, pg: 4, pe: 2, pp: 16, gf: 51, gc: 98, pts: 14 }
];

init();

async function init() {
  setupNavigation();

  try {
    await cargarFirebase();
  } catch (error) {
    console.error("Error cargando Firebase:", error);
  }

  renderPartidos();
  renderResultados();
  renderClasificacion();
  renderPlantilla();
  renderRankings();
}

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      showPage(btn.dataset.page);
    });
  });

  document.getElementById("back-from-match").addEventListener("click", () => {
    showPage("partidos");
  });

  document.getElementById("back-from-player").addEventListener("click", () => {
    showPage("plantilla");
  });
}

function showPage(pageName) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const target = document.getElementById(`page-${pageName}`);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === pageName);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function cargarFirebase() {
  jugadores = await cargarColeccion("jugadores");
  rivales = await cargarColeccion("rivales");
  campos = await cargarColeccion("campos");

  const jornadasSnapshot = await getDocs(
    collection(db, "partidos", "2025_26", "jornadas")
  );

  partidos = [];

  jornadasSnapshot.forEach(doc => {
    partidos.push({
      id: doc.id,
      ...doc.data()
    });
  });

  partidos.sort((a, b) => Number(a.jornada) - Number(b.jornada));
}

async function cargarColeccion(nombre) {
  const snapshot = await getDocs(collection(db, nombre));
  const data = {};

  snapshot.forEach(doc => {
    data[doc.id] = {
      id: doc.id,
      ...doc.data()
    };
  });

  return data;
}

function getRivalNombre(id) {
  return rivales[id]?.nombre || id || "Rival";
}

function getCampoNombre(id) {
  return campos[id]?.nombre || id || "Campo por confirmar";
}

function getJugadorNombre(id) {
  return jugadores[id]?.nombre || id || "Jugador";
}
function getJugadorFoto(id) {
  return jugadores[id]?.foto || `assets/players/${id}.webp`;
}

function renderPlayerPhoto(playerId, playerName, dorsal) {
  const foto = getJugadorFoto(playerId);

  if (!foto) {
    return `<div class="player-photo-fallback">${dorsal}</div>`;
  }

  return `
    <div class="player-photo">
      <img 
        src="${foto}" 
        alt="${playerName}" 
        onerror="this.remove(); this.parentElement.classList.add('player-photo-fallback'); this.parentElement.textContent='${dorsal}'"
      >
    </div>
  `;
}
function formatDate(dateString) {
  if (!dateString) return "Fecha por confirmar";

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function getTeamInitial(name) {
  return (name || "?").trim().charAt(0).toUpperCase();
}

function isPlayed(match) {
  return match.estado === "jugado" || match.golesGala !== null;
}

function getLocalTeam(match) {
  return match.local ? "GALA FC" : getRivalNombre(match.rivalId);
}

function getAwayTeam(match) {
  return match.local ? getRivalNombre(match.rivalId) : "GALA FC";
}

function getLocalGoals(match) {
  return match.local ? match.golesGala : match.golesRival;
}

function getAwayGoals(match) {
  return match.local ? match.golesRival : match.golesGala;
}

function renderPartidos() {
  const pending = partidos.filter(p => !isPlayed(p));
  const upcoming = pending.length ? pending : demoUpcoming;

  const next = upcoming[0];

  document.getElementById("next-match").innerHTML = renderNextMatchCard(next);

  document.getElementById("upcoming-matches").innerHTML = upcoming
    .slice(1, 4)
    .map(match => renderSmallMatch(match))
    .join("");

  document.querySelectorAll("[data-match-id]").forEach(el => {
    el.addEventListener("click", () => openMatchDetail(el.dataset.matchId));
  });
}

function renderNextMatchCard(match) {
  const localName = getLocalTeam(match);
  const awayName = getAwayTeam(match);

  const localLogo = getLocalLogo(match);
  const awayLogo = getAwayLogo(match);

  return `
    <div class="card next-card small-match" data-match-id="${match.id}">
      <span class="match-status">PRÓXIMO PARTIDO</span>

      <div class="match-teams">
        <div class="team">
          ${renderTeamBadge(localName, localLogo)}
          <span>${localName}</span>
        </div>

        <div class="vs-box">VS</div>

        <div class="team">
          ${renderTeamBadge(awayName, awayLogo, "rival")}
          <span>${awayName}</span>
        </div>
      </div>

      <div class="match-meta">
        <span>📅 ${formatDate(match.fecha)} · ${match.hora || "Hora por confirmar"}</span>
        <span>📍 ${getCampoNombre(match.campoId)}</span>
      </div>
    </div>
  `;
}

function renderSmallMatch(match) {
  const localName = getLocalTeam(match);
  const awayName = getAwayTeam(match);

  return `
    <div class="card small-match" data-match-id="${match.id}">
      <div class="small-match-row">
        <div class="round-badge">J${match.jornada}</div>

        <div>
          <div class="match-title with-logos">
            ${renderSmallLogo(localName, getLocalLogo(match))}
            <span>${localName}</span>
            <span class="mini-vs">vs</span>
            ${renderSmallLogo(awayName, getAwayLogo(match))}
            <span>${awayName}</span>
          </div>

          <div class="match-subtitle">
            ${formatDate(match.fecha)} · ${match.hora || ""} · ${getCampoNombre(match.campoId)}
          </div>
        </div>

        <div class="chevron">›</div>
      </div>
    </div>
  `;
}

function renderResultados() {
  const played = partidos
  .filter(isPlayed)
  .sort((a, b) => Number(b.jornada) - Number(a.jornada));
  
  const grouped = {};

  played.forEach(match => {
    if (!grouped[match.jornada]) grouped[match.jornada] = [];
    grouped[match.jornada].push(match);
  });

  let html = "";

  Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .forEach(jornada => {
      html += `<div class="result-round">Jornada ${jornada}</div>`;

      grouped[jornada].forEach(match => {
        html += renderResultCard(match, true);
      });

      const partidoGala = grouped[jornada][0];
const otros = partidoGala.otrosResultados || [];

otros.forEach(r => {
  html += renderOtherResult(r);
});
    });

  document.getElementById("results-list").innerHTML = html;

  document.querySelectorAll("[data-result-match-id]").forEach(el => {
    el.addEventListener("click", () => openMatchDetail(el.dataset.resultMatchId));
  });
}

function renderResultCard(match, gala) {
  const localName = getLocalTeam(match);
  const awayName = getAwayTeam(match);

  return `
    <div class="result-card ${gala ? "gala" : ""}" data-result-match-id="${match.id}">
      <div class="result-row">
        <div class="result-team result-team-logo">
          ${renderSmallLogo(localName, getLocalLogo(match))}
          <span>${localName}</span>
        </div>

        <div class="result-score">${getLocalGoals(match)} - ${getAwayGoals(match)}</div>

        <div class="result-team result-team-logo right">
          <span>${awayName}</span>
          ${renderSmallLogo(awayName, getAwayLogo(match))}
        </div>
      </div>

      <div class="result-meta">
        ${formatDate(match.fecha)} · ${getCampoNombre(match.campoId)}
      </div>
    </div>
  `;
}

function getEquipoNombre(equipoId) {
  if (equipoId === "gala_fc") return "GALA FC";
  return rivales[equipoId]?.nombre || equipoId || "Equipo";
}

function getEquipoLogo(equipoId) {
  if (equipoId === "gala_fc") return GALA_LOGO;
  return rivales[equipoId]?.escudo || `assets/logos/${equipoId}.webp`;
}

function renderOtherResult(result) {
  let localName;
  let visitanteName;
  let golesLocal;
  let golesVisitante;
  let localLogo;
  let visitanteLogo;

  // Formato nuevo desde Firebase
  if (!Array.isArray(result)) {
    localName = getEquipoNombre(result.localId);
    visitanteName = getEquipoNombre(result.visitanteId);
    golesLocal = result.golesLocal;
    golesVisitante = result.golesVisitante;
    localLogo = getEquipoLogo(result.localId);
    visitanteLogo = getEquipoLogo(result.visitanteId);
  }

  // Formato antiguo de prueba, por si todavía queda algo en GitHub
  else {
    const [home, hg, ag, away] = result;

    localName = home;
    visitanteName = away;
    golesLocal = hg;
    golesVisitante = ag;
    localLogo = "";
    visitanteLogo = "";
  }

  return `
    <div class="result-card">
      <div class="result-row">
        <div class="result-team result-team-logo">
          ${renderSmallLogo(localName, localLogo)}
          <span>${localName}</span>
        </div>

        <div class="result-score">
          ${golesLocal} - ${golesVisitante}
        </div>

        <div class="result-team result-team-logo right">
          <span>${visitanteName}</span>
          ${renderSmallLogo(visitanteName, visitanteLogo)}
        </div>
      </div>

      <div class="result-meta">Resultado de liga</div>
    </div>
  `;
}

function renderClasificacion() {
  const galaStats = calcularStatsGala();

  const table = demoStandings.map(row => {
    if (row.equipo === "GALA FC") {
      return {
        ...row,
        ...galaStats
      };
    }

    return row;
  }).sort((a, b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc));

  document.getElementById("standings-table").innerHTML = `
    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th class="team-name">Equipo</th>
            <th>Pts</th>
            <th>PJ</th>
            <th>DG</th>
          </tr>
        </thead>

        <tbody>
          ${table.map((row, index) => `
            <tr class="${row.equipo === "GALA FC" ? "gala-row" : ""}">
              <td>${index + 1}</td>
              <td class="team-name">${row.equipo}</td>
              <td><b>${row.pts}</b></td>
              <td>${row.pj}</td>
              <td>${row.gf - row.gc}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function calcularStatsGala() {
  let pj = 0;
  let pg = 0;
  let pe = 0;
  let pp = 0;
  let gf = 0;
  let gc = 0;

  partidos.filter(isPlayed).forEach(p => {
    pj++;
    gf += Number(p.golesGala || 0);
    gc += Number(p.golesRival || 0);

    if (p.golesGala > p.golesRival) pg++;
    else if (p.golesGala < p.golesRival) pp++;
    else pe++;
  });

  return {
    pj,
    pg,
    pe,
    pp,
    gf,
    gc,
    pts: pg * 3 + pe
  };
}

function renderPlantilla() {
  const order = ["Portero", "Defensa", "Mediocentro", "Medio", "Delantero"];

  const playersArray = Object.keys(jugadores).map(id => ({
    id,
    ...jugadores[id],
    stats: getPlayerStats(id)
  }));

  let html = "";

  order.forEach(pos => {
    const group = playersArray
      .filter(p => p.posicion === pos)
      .sort((a, b) => Number(a.dorsal) - Number(b.dorsal));

    if (!group.length) return;

    html += `
      <div class="position-group">
        <div class="position-title">${pos}</div>

        ${group.map(player => `
          <div class="player-row" data-player-id="${player.id}">
  ${renderPlayerPhoto(player.id, player.nombre, player.dorsal)}

  <div class="player-main">
    <strong>${player.nombre}</strong>
    <small>#${player.dorsal} · ${player.posicion}</small>
  </div>

            <div class="player-stat">
              <b>${player.stats.goles}</b>
              <small>G</small>
            </div>

            <div class="player-stat">
              <b>${player.stats.asistencias}</b>
              <small>A</small>
            </div>

            <div class="player-stat">
              <b>${player.stats.mvp}</b>
              <small>MVP</small>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  });

  document.getElementById("squad-table").innerHTML = html || `
    <div class="loading">No hay jugadores cargados.</div>
  `;

  document.querySelectorAll("[data-player-id]").forEach(el => {
    el.addEventListener("click", () => openPlayerDetail(el.dataset.playerId));
  });
}

function getPlayerStats(playerId) {
  let goles = 0;
  let asistencias = 0;
  let mvp = 0;
  let pj = demoStats[playerId]?.pj || 0;

  partidos.forEach(p => {
    goles += (p.goleadores || []).filter(id => id === playerId).length;
    asistencias += (p.asistentes || []).filter(id => id === playerId).length;
    if (p.mvp === playerId) mvp++;
  });

  if (goles === 0 && asistencias === 0 && mvp === 0 && demoStats[playerId]) {
    return demoStats[playerId];
  }

  return {
    goles,
    asistencias,
    mvp,
    pj
  };
}

function renderRankings() {
  const rankingPlayers = Object.keys(jugadores).map(id => ({
    id,
    nombre: jugadores[id].nombre,
    ...getPlayerStats(id)
  }));

  document.getElementById("rankings-content").innerHTML = `
    ${renderRankingBlock("Goleadores", rankingPlayers, "goles", "goles")}
    ${renderRankingBlock("Asistencias", rankingPlayers, "asistencias", "asist.")}
    ${renderRankingBlock("MVPs", rankingPlayers, "mvp", "MVP")}
  `;
}

function renderRankingBlock(title, players, key, label) {
  const sorted = [...players]
    .sort((a, b) => b[key] - a[key])
    .slice(0, 5);

  return `
    <div class="card ranking-card">
      <h3>${title}</h3>

      ${sorted.map((p, index) => `
        <div class="ranking-item" data-player-id="${p.id}">
          <div class="rank-number">${index + 1}</div>
          <div>${p.nombre}</div>
          <div class="rank-value">${p[key]} ${label}</div>
        </div>
      `).join("")}
    </div>
  `;
}
function contarRepetidos(lista = []) {
  const contador = {};

  lista.forEach(id => {
    contador[id] = (contador[id] || 0) + 1;
  });

  return contador;
}

function renderJugadorEvento(jugadorId, cantidad, icono) {
  const nombre = getJugadorNombre(jugadorId);
  const foto = getJugadorFoto(jugadorId);
  const simbolos = icono.repeat(cantidad);

  return `
    <div class="event-player-row">
      <div class="event-player-photo">
        <img 
          src="${foto}" 
          alt="${nombre}"
          onerror="this.remove(); this.parentElement.textContent='${getTeamInitial(nombre)}'"
        >
      </div>

      <div class="event-player-name">${nombre}</div>

      <div class="event-icons">${simbolos}</div>
    </div>
  `;
}

function renderEventosPartido(match) {
  const goleadores = contarRepetidos(match.goleadores || []);
  const asistentes = contarRepetidos(match.asistentes || []);

  const htmlGoles = Object.keys(goleadores).length
    ? Object.entries(goleadores)
        .map(([jugadorId, cantidad]) => renderJugadorEvento(jugadorId, cantidad, "⚽"))
        .join("")
    : `<p class="empty-text">Goleadores todavía no cargados.</p>`;

  const htmlAsistencias = Object.keys(asistentes).length
    ? Object.entries(asistentes)
        .map(([jugadorId, cantidad]) => renderJugadorEvento(jugadorId, cantidad, "🥾"))
        .join("")
    : `<p class="empty-text">Asistencias todavía no cargadas.</p>`;

  return `
    <div class="detail-box match-events-box">
      <h3>Goles</h3>
      ${htmlGoles}

      <h3 class="assists-title">Asistencias</h3>
      ${htmlAsistencias}
    </div>
  `;
}

function getFotoPartido(match) {
  return match.fotoPartido || match.foto || `assets/matches/${match.id}.webp`;
}
function openMatchDetail(matchId) {
  const match =
    partidos.find(p => p.id === matchId) ||
    demoUpcoming.find(p => p.id === matchId);

  if (!match) return;

  const played = isPlayed(match);

  document.getElementById("match-detail-content").innerHTML = `
    <div class="detail-hero match-detail-hero">
      <span class="match-status">${played ? "PARTIDO JUGADO" : "PRÓXIMO PARTIDO"}</span>

      <div class="match-teams">
        <div class="team">
          ${renderTeamBadge(getLocalTeam(match), getLocalLogo(match))}
          <span>${getLocalTeam(match)}</span>
        </div>

        <div class="${played ? "score-box detail-score" : "vs-box"}">
          ${played ? `${getLocalGoals(match)} - ${getAwayGoals(match)}` : "VS"}
        </div>

        <div class="team">
          ${renderTeamBadge(getAwayTeam(match), getAwayLogo(match), "rival")}
          <span>${getAwayTeam(match)}</span>
        </div>
      </div>

      <div class="match-meta detail-meta">
        <span>Jornada ${match.jornada}</span>
        <span>${formatDate(match.fecha)} · ${match.hora || ""}</span>
        <span>${getCampoNombre(match.campoId)}</span>
      </div>
    </div>

    ${renderEventosPartido(match)}

    <div class="detail-box">
      <h3>Crónica</h3>
      <p>${match.cronica || "Crónica pendiente de añadir."}</p>
    </div>

    <div class="detail-box">
      <h3>Foto de partido</h3>

      <div class="match-photo-box">
        <img 
          src="${getFotoPartido(match)}" 
          alt="Foto del partido"
          onerror="this.parentElement.innerHTML='<p class=&quot;empty-text&quot;>Foto de partido todavía no subida.</p>'"
        >
      </div>
    </div>
  `;

  showPage("match-detail");
}

function openPlayerDetail(playerId) {
  const player = jugadores[playerId];
  if (!player) return;

  const stats = getPlayerStats(playerId);

  document.getElementById("player-detail-content").innerHTML = `
    <div class="detail-hero">
      <div style="display:flex; align-items:center; gap:14px;">
        <div class="player-profile-photo">
  <img 
    src="${getJugadorFoto(playerId)}" 
    alt="${player.nombre}"
    onerror="this.remove(); this.parentElement.textContent='${player.dorsal}'"
  >
</div>
        <div>
          <p class="eyebrow">${player.posicion}</p>
          <h2 style="margin:0;">${player.nombre}</h2>
        </div>
      </div>
    </div>

    <div class="detail-box">
      <h3>Estadísticas</h3>

      <p><b>Partidos jugados:</b> ${stats.pj}</p>
      <p><b>Goles:</b> ${stats.goles}</p>
      <p><b>Asistencias:</b> ${stats.asistencias}</p>
      <p><b>MVPs:</b> ${stats.mvp}</p>
    </div>

    <div class="detail-box">
      <h3>Ficha</h3>

      <p><b>Dorsal:</b> ${player.dorsal}</p>
      <p><b>Posición:</b> ${player.posicion}</p>
      <p><b>Estado:</b> ${player.activo ? "Activo" : "No activo"}</p>
    </div>
  `;

  showPage("player-detail");
}

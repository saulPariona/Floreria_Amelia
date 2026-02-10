/* ====== NAV: abrir submenu en mobile ====== */
document.addEventListener("click", (e) => {
  const ddBtn = e.target.closest(".dropdown-btn");
  if (ddBtn) {
    const dd = ddBtn.parentElement;
    dd.classList.toggle("open");
    ddBtn.setAttribute("aria-expanded", dd.classList.contains("open"));
  }
});

/* ====== DATA ====== */
const PRODUCTS = [
  {
    id: "r1",
    nombre: "Rosa y Margarita",
    desc: "Rosa eterna central tejida en rojo pasión, acompañada de margaritas blancas con centros amarillos. Estilo artesanal con limpiapipas.",
    precio: 79,
    categoria: "Ramos Florales",
    tipo: "Rosas",
    etiquetas: ["Eterno", "Rojo"],
    oferta: false,
    img: "Imágenes/catalogo/Rosa_Margarita.jpeg"
  },
  {
    id: "g1",
    nombre: "Girasol y Margarita",
    desc: "Girasol artesanal radiante con pétalos amarillos y margaritas de relleno. Envoltorio estilo periódico vintage y lazo dorado.",
    precio: 69,
    categoria: "Ramos Florales",
    tipo: "Girasoles",
    etiquetas: ["Popular", "Amarillo"],
    oferta: true,
    precioAntes: 89,
    img: "Imágenes/catalogo/Girasol.jpeg"
  },
  {
    id: "t1",
    nombre: "Rosa y Margarita Especial",
    desc: "Gran Lirio central en tono borgoña aterciopelado con margaritas blancas a crochet. Presentación premium con papel coreano blanco.",
    precio: 79,
    categoria: "Ramos Florales",
    tipo: "Mixto",
    etiquetas: ["Elegante"],
    oferta: false,
    img: "Imágenes/catalogo/Rosa_rojo.jpg"
  },
  {
    id: "s1",
    nombre: "Rosa azul y Margarita",
    desc: "Bouquet temático con tulipanes azules y lirio central. Simboliza lealtad y serenidad. Acabado en papel azul y blanco.",
    precio: 69,
    categoria: "San Valentín",
    tipo: "Azul",
    etiquetas: ["Romántico", "Exclusivo"],
    oferta: true,
    precioAntes: 99,
    img: "Imágenes/catalogo/Tulipanes_azules.jpg"
  },
  {
    id: "s2",
    nombre: "Lirios y Rosa Morada",
    desc: "Combinación de lirios blancos y rosa morada profunda, tejidos totalmente a mano (crochet). Incluye lazo de encaje y papel morado.",
    precio: 79,
    categoria: "San Valentín",
    tipo: "Crochet",
    etiquetas: ["Handmade", "Lavanda"],
    oferta: false,
    img: "Imágenes/catalogo/Tulipanes_Mordas.jpg"
  },
  {
    id: "s3",
    nombre: "Lirios y Rosa Rosado",
    desc: "Ramo romántico con lirios blancos y rosa central rosada tejida. Envoltorio vintage premium. Un detalle delicado que no se marchita.",
    precio: 69,
    categoria: "San Valentín",
    tipo: "Premium",
    etiquetas: ["Tierno", "Regalo"],
    oferta: false,
    img: "Imágenes/catalogo/Tulipanes_rosadas.jpg"
  }
];


/* ====== ELEMENTOS ====== */
const $grid = document.getElementById("productGrid");
const $search = document.getElementById("searchInput");
const $count = document.getElementById("countLabel");
const tpl = document.getElementById("tplCard");

/* ====== STATE Y SECCIONES ====== */
const state = { texto: "" };
const SECCIONES = [
  "Ramos Florales",
  "San Valentín"
];

/* ====== BUSCADOR ====== */
$search?.addEventListener("input", (e) => {
  state.texto = e.target.value.toLowerCase().trim();
  render();
});

/* ====== RENDER POR SECCIONES ====== */
function render() {
  $grid.setAttribute("aria-busy", "true");
  $grid.innerHTML = "";

  const filtrados = state.texto
    ? PRODUCTS.filter(p => (p.nombre + " " + (p.desc || "")).toLowerCase().includes(state.texto))
    : PRODUCTS.slice();

  let totalMostrados = 0;

  SECCIONES.forEach(cat => {
    let items = filtrados.filter(p => p.categoria === cat);
    if (!state.texto) items = items.slice(0, 4); // limitar si no hay búsqueda
    if (items.length === 0) return;

    const section = document.createElement("section");
    section.className = "cat-section";
    section.id = idFromTitle(cat);

    const h2 = document.createElement("h2");
    h2.textContent = cat;
    section.appendChild(h2);

    const grid = document.createElement("div");
    grid.className = "catalogo-grid";

    items.forEach(p => grid.appendChild(buildCard(p)));

    section.appendChild(grid);
    $grid.appendChild(section);

    totalMostrados += items.length;
  });

  if (totalMostrados === 0) {
    const p = document.createElement("p");
    p.style.fontSize = "1.6rem";
    p.style.color = "#666";
    p.textContent = "No se encontraron productos.";
    $grid.appendChild(p);
  }

  if ($count) $count.textContent = `${totalMostrados} producto${totalMostrados !== 1 ? "s" : ""}`;

  $grid.setAttribute("aria-busy", "false");
}

/* ====== CREA TARJETA Y CONEXIÓN AL CARRITO ====== */
function buildCard(p) {
  const $card = tpl.content.cloneNode(true);
  const img = $card.querySelector(".card-img");
  img.src = p.img || "https://placehold.co/600x450?text=Flores";
  img.alt = p.nombre;

  $card.querySelector(".card-title").textContent = p.nombre;
  $card.querySelector(".card-desc").textContent = p.desc || "";
  $card.querySelector(".card-price").textContent = `S/${p.precio}.99 SOLES`;

  if (p.oferta) {
    $card.querySelector(".badge-oferta").hidden = false;
    if (p.precioAntes) {
      const old = $card.querySelector(".card-price-old");
      old.hidden = false;
      old.textContent = `$${p.precioAntes}.99`;
    }
  }

  // ✅ Abrir WhatsApp con información del producto
  $card.querySelector(".btn-add").addEventListener("click", (ev) => {
    ev.preventDefault();
    
    // Crear mensaje para WhatsApp
    const mensaje = `Hola! Me interesa el siguiente producto:%0A%0A` +
                   `*${p.nombre}*%0A` +
                   `Precio: S/${p.precio}.99 SOLES%0A%0A` +
                   `¿Está disponible?`;
    
    // Número de WhatsApp (sin espacios ni signos +)
    const numeroWhatsApp = "51915995014";
    
    // Abrir WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
  });

  return $card;
}

/* ====== UTILIDADES ====== */
function idFromTitle(t) {
  return t
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

/* ====== ARRANQUE ====== */
render();

// Scroll suave si entra con hash
if (location.hash) {
  const tgt = document.querySelector(location.hash);
  if (tgt) tgt.scrollIntoView({ behavior: "smooth" });
}

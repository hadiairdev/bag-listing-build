const BAGS = [
  { id:1,  brand:"Celine",   model:"Mini Belt Bag",    price:1450, cond:"Like New",     auth:true  },
  { id:2,  brand:"Celine",   model:"Nano Belt Bag",    price:1180, cond:"Gently Used",  auth:false },
  { id:3,  brand:"Celine",   model:"Triomphe",         price:1920, cond:"Like New",     auth:true  },
  { id:4,  brand:"Loewe",    model:"Puzzle Small",     price:1250, cond:"Gently Used",  auth:true  },
  { id:5,  brand:"Loewe",    model:"Gate Bucket",      price:890,  cond:"Worn",         auth:false },
  { id:6,  brand:"Polene",   model:"Number One",       price:380,  cond:"Like New",     auth:false },
  { id:7,  brand:"Polene",   model:"Beri",             price:340,  cond:"New",          auth:false },
  { id:8,  brand:"Hermes",   model:"Evelyne PM",       price:3200, cond:"Gently Used",  auth:true  },
  { id:9,  brand:"Hermes",   model:"Garden Party 30",  price:2750, cond:"Worn",         auth:true  },
  { id:10, brand:"Mansur",   model:"Bucket Bag",       price:520,  cond:"Like New",     auth:false },
  { id:11, brand:"Mansur",   model:"Sun Tote",         price:445,  cond:"New",          auth:false },
  { id:12, brand:"Loewe",    model:"Flamenco Clutch",  price:1390, cond:"Like New",     auth:true  },
];
const KEY = "bag-listing-build:wishlist";
const money = n => "$" + n.toLocaleString("en-US");

function loadSaved() {
  // localStorage throws in some embedded/private contexts; an unreadable
  // wishlist must render as an empty one, never as a broken page.
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || "[]")); }
  catch { return new Set(); }
}
function persist(set) {
  try { localStorage.setItem(KEY, JSON.stringify([...set])); } catch { /* read-only storage */ }
}

const saved = loadSaved();
const $ = s => document.querySelector(s);

function activeFilters() {
  return {
    q:     $("#q").value.trim().toLowerCase(),
    brand: $("#brand").value,
    cond:  $("#cond").value,
    max:   $("#max").value,
    only:  $("#only").checked,
  };
}

function matches(bag, f) {
  if (f.only && !saved.has(bag.id)) return false;
  if (f.brand && bag.brand !== f.brand) return false;
  if (f.cond  && bag.cond  !== f.cond)  return false;
  if (f.max   && bag.price > Number(f.max)) return false;
  if (f.q && !(bag.brand + " " + bag.model).toLowerCase().includes(f.q)) return false;
  return true;
}

function render() {
  const f = activeFilters();
  const rows = BAGS.filter(b => matches(b, f));

  // chips: one per active filter, each individually removable
  const chips = [];
  if (f.q)     chips.push(["q",     `"${$("#q").value.trim()}"`]);
  if (f.brand) chips.push(["brand", f.brand]);
  if (f.cond)  chips.push(["cond",  f.cond]);
  if (f.max)   chips.push(["max",   "under " + money(Number(f.max))]);
  if (f.only)  chips.push(["only",  "saved only"]);
  $("#chips").innerHTML = chips.length
    ? chips.map(([k, label]) => `<button class="chip" data-clear="${k}">${label} ×</button>`).join("") +
      `<button class="chip" data-clear="all">Clear all</button>`
    : "";

  $("#count").textContent =
    `${rows.length} ${rows.length === 1 ? "bag" : "bags"} · ${saved.size} saved`;

  $("#grid").innerHTML = rows.length ? rows.map(b => `
    <article class="card">
      <div class="ph"></div>
      <div class="body">
        <h3>${b.brand} ${b.model}</h3>
        <div class="price">${money(b.price)}</div>
        <div class="tags">
          <span class="tag${b.cond === "New" || b.cond === "Like New" ? " ok" : ""}">${b.cond}</span>
          ${b.auth ? '<span class="tag ok">Authenticated</span>' : ""}
        </div>
        <button class="save" data-save="${b.id}" aria-pressed="${saved.has(b.id)}">
          ${saved.has(b.id) ? "Saved" : "Save for later"}
        </button>
      </div>
    </article>`).join("") : "";

  $("#empty").hidden = rows.length > 0;
  $("#empty").textContent = chips.length
    ? "No bags match these filters. Remove one above to widen the search."
    : "No bags listed yet.";
}

document.addEventListener("input", e => {
  if (e.target.closest("#controls")) render();
});
document.addEventListener("click", e => {
  const save = e.target.closest("[data-save]");
  if (save) {
    const id = Number(save.dataset.save);
    saved.has(id) ? saved.delete(id) : saved.add(id);
    persist(saved);
    return render();
  }
  const clear = e.target.closest("[data-clear]");
  if (clear) {
    const k = clear.dataset.clear;
    if (k === "all") {
      $("#q").value = ""; $("#brand").value = ""; $("#cond").value = ""; $("#max").value = ""; $("#only").checked = false;
    }
    else if (k === "only") $("#only").checked = false;
    else $("#" + k).value = "";
    render();
  }
});

// brands, derived rather than hardcoded, so the list cannot drift from the data
const brands = [...new Set(BAGS.map(b => b.brand))].sort();
$("#brand").insertAdjacentHTML("beforeend",
  brands.map(b => `<option>${b}</option>`).join(""));
render();

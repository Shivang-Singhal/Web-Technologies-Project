// Fork & Film — Main JavaScript

// ===== CHANGED SECTION: Firebase Imports & Initialization =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// REPLACE THESE PLACEHOLDERS WITH YOUR FIREBASE CONSOLE CONFIG KEYS
const firebaseConfig = {
    apiKey: "AIzaSyCzPFub8qvbteH24mZCVc56Xn9HmQMlQP0",
    authDomain: "trial-48d80.firebaseapp.com",
    projectId: "trial-48d80",
    storageBucket: "trial-48d80.firebasestorage.app",
    messagingSenderId: "210173220561",
    appId: "1:210173220561:web:dafb9e18d5dfd2c0fc57f0",
    measurementId: "G-F9DQDFC9J6"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// ===============================================================


// --------------- DATA ---------------

var restaurants = [
  { id: 1, name: "Spice Garden",    emoji: "🍛", cuisine: "North Indian",  rating: 4.6, time: "35-45 min", type: "both",   tags: ["Biryani","Curry","Naan"],  color: "#fff4e8" },
  { id: 2, name: "Dosa Palace",     emoji: "🫓", cuisine: "South Indian",  rating: 4.4, time: "25-35 min", type: "veg",    tags: ["Dosa","Idli","Coffee"],    color: "#e8fff4" },
  { id: 3, name: "Mughal Darbar",   emoji: "🍖", cuisine: "Mughlai",       rating: 4.7, time: "40-50 min", type: "nonveg", tags: ["Kebab","Biryani","Roti"],  color: "#fff0f4" },
  { id: 4, name: "Chaat Corner",    emoji: "🥗", cuisine: "Street Food",   rating: 4.3, time: "15-20 min", type: "veg",    tags: ["Pani Puri","Aloo Tikki"],  color: "#f0f4ff" },
];

var menuData = {
  1: [
    { id: "a1", name: "Butter Chicken",  emoji: "🍛", desc: "Creamy tomato gravy with tender chicken", price: 320, veg: false, taste: ["rich","mild"],   moods: ["comfort","romantic"],      cat: "Main"    },
    { id: "a2", name: "Dal Makhani",     emoji: "🫕", desc: "Slow-cooked black lentils in butter",     price: 240, veg: true,  taste: ["rich","mild"],   moods: ["comfort","relaxed"],       cat: "Main"    },
    { id: "a3", name: "Paneer Tikka",    emoji: "🧀", desc: "Cottage cheese grilled in tandoor",        price: 260, veg: true,  taste: ["spicy","tangy"], moods: ["adventurous"],             cat: "Starter" },
    { id: "a4", name: "Chicken Biryani", emoji: "🍚", desc: "Fragrant rice layered with spiced chicken",price: 360, veg: false, taste: ["spicy","rich"],   moods: ["celebration","energetic"], cat: "Biryani" },
    { id: "a5", name: "Garlic Naan",     emoji: "🫓", desc: "Soft bread with garlic and butter",       price:  60, veg: true,  taste: ["mild"],          moods: ["comfort"],                 cat: "Bread"   },
    { id: "a6", name: "Gulab Jamun",     emoji: "🍮", desc: "Milk balls soaked in rose sugar syrup",   price: 110, veg: true,  taste: ["sweet"],         moods: ["indulgent"],               cat: "Dessert" },
  ],
  2: [
    { id: "b1", name: "Masala Dosa",   emoji: "🫓", desc: "Crispy crepe filled with spiced potato",   price: 170, veg: true, taste: ["spicy","tangy"], moods: ["energetic","healthy"],  cat: "Dosa"    },
    { id: "b2", name: "Idli Sambar",   emoji: "🍙", desc: "Steamed rice cakes with lentil soup",      price: 110, veg: true, taste: ["mild"],          moods: ["healthy","relaxed"],    cat: "Idli"    },
    { id: "b3", name: "Medu Vada",     emoji: "🍩", desc: "Crispy lentil fritters with chutney",      price: 130, veg: true, taste: ["mild","tangy"],  moods: ["comfort"],               cat: "Vada"    },
    { id: "b4", name: "Rava Uttapam",  emoji: "🥞", desc: "Semolina pancake with onion and tomato",   price: 150, veg: true, taste: ["mild"],          moods: ["healthy","comfort"],    cat: "Uttapam" },
    { id: "b5", name: "Filter Coffee", emoji: "☕",  desc: "Strong south Indian drip coffee",          price:  75, veg: true, taste: ["rich"],          moods: ["relaxed","energetic"],  cat: "Drink"   },
    { id: "b6", name: "Payasam",       emoji: "🍮", desc: "Sweet rice pudding with cardamom",         price: 110, veg: true, taste: ["sweet","mild"],  moods: ["indulgent"],            cat: "Dessert" },
  ],
  3: [
    { id: "c1", name: "Seekh Kebab",   emoji: "🍢", desc: "Minced meat kebab grilled on charcoal",   price: 340, veg: false, taste: ["spicy","rich"], moods: ["celebration","adventurous"], cat: "Kebab"  },
    { id: "c2", name: "Mutton Biryani",emoji: "🍚", desc: "Dum-cooked mutton with fragrant rice",    price: 420, veg: false, taste: ["spicy","rich"], moods: ["celebration","indulgent"],   cat: "Biryani"},
    { id: "c3", name: "Shahi Paneer",  emoji: "🧀", desc: "Paneer in a cashew-cream gravy",          price: 280, veg: true,  taste: ["rich","mild"],  moods: ["romantic","indulgent"],      cat: "Main"   },
    { id: "c4", name: "Roomali Roti",  emoji: "🫓", desc: "Paper-thin folded flatbread",             price:  45, veg: true,  taste: ["mild"],          moods: ["comfort"],                   cat: "Bread"  },
    { id: "c5", name: "Chicken Korma", emoji: "🍛", desc: "Mild chicken in yogurt and nut gravy",    price: 340, veg: false, taste: ["mild","rich"],  moods: ["romantic","comfort"],         cat: "Main"   },
    { id: "c6", name: "Shahi Tukda",   emoji: "🍞", desc: "Fried bread in thickened milk and saffron",price:150, veg: true,  taste: ["sweet","rich"], moods: ["indulgent"],                  cat: "Dessert"},
  ],
  4: [
    { id: "d1", name: "Pani Puri",       emoji: "🫧", desc: "Crispy shells with spiced tamarind water", price: 70,  veg: true, taste: ["tangy","spicy"], moods: ["adventurous","energetic"], cat: "Chaat" },
    { id: "d2", name: "Aloo Tikki",      emoji: "🥔", desc: "Crispy potato patties with chutneys",      price: 90,  veg: true, taste: ["spicy","tangy"], moods: ["comfort","energetic"],     cat: "Chaat" },
    { id: "d3", name: "Bhel Puri",       emoji: "🥗", desc: "Puffed rice with onion and chutneys",      price: 80,  veg: true, taste: ["tangy","spicy"], moods: ["adventurous"],             cat: "Chaat" },
    { id: "d4", name: "Dahi Vada",       emoji: "🍥", desc: "Lentil fritters dipped in spiced yogurt",  price: 110, veg: true, taste: ["tangy","mild"],  moods: ["relaxed","comfort"],       cat: "Chaat" },
    { id: "d5", name: "Raj Kachori",     emoji: "🥣", desc: "Giant shell with potato, yogurt, chutneys",price: 130, veg: true, taste: ["tangy","spicy"], moods: ["indulgent"],               cat: "Chaat" },
    { id: "d6", name: "Sugarcane Juice", emoji: "🥤", desc: "Fresh pressed sugarcane with ginger",      price:  55, veg: true, taste: ["sweet"],         moods: ["healthy","relaxed"],       cat: "Drink" },
  ],
};

var movies = [
  { id: 1, title: "Dhurandhar",   image: "images/pushpa3.jpg",   emoji: "🔥", genre: "Action / Drama",    lang: "Telugu",  cert: "U/A", price: 240, premiumPrice: 340, color: "#fff4e8" },
  { id: 2, title: "Bhool Bhulaiya",    image: "images/pushpa3.jpg",   emoji: "👻", genre: "Horror Comedy",     lang: "Hindi",   cert: "U/A", price: 200, premiumPrice: 300, color: "#f0eeff" },
  { id: 3, title: "Spider Man - No way home",  image: "images/pushpa3.jpg",   emoji: "✈️", genre: "Action Thriller",   lang: "Hindi",   cert: "A",   price: 210, premiumPrice: 310, color: "#e8f4ff" },
  { id: 4, title: "Dune 2",  image: "dune2", genre: "Sci-Fi Epic",        lang: "Telugu",  cert: "U/A", price: 260, premiumPrice: 380, color: "#e8fff0" },
  { id: 5, title: "The Shawshank Redumption",image: "images/pushpa3.jpg", emoji: "💥", genre: "Historical Drama",   lang: "English", cert: "A",   price: 290, premiumPrice: 420, color: "#fff0f4" },
];

var theaters = [
  { id: 1, name: "PVR Ansal Plaza",  address: "Ansal Plaza Mall, Alpha 1, Greater Noida",  features: ["IMAX","Dolby","4K"], emoji: "🎭" },
  { id: 2, name: "Inox Omaxe",        address: "Omaxe Connaught Place, Beta 2, Gr. Noida",  features: ["4K","Standard"],     emoji: "🎬" },
  { id: 3, name: "Carnival Cinemas", address: "Gaur City Mall, Greater Noida West",         features: ["Standard","4K"],     emoji: "🎪" },
];

var showtimes = ["10:00 AM", "1:00 PM", "4:30 PM", "8:00 PM"];

var moodMatchMap = {
  celebration: ["spicy","sweet","rich"],
  comfort:     ["rich","mild"],
  energetic:   ["spicy","tangy"],
  romantic:    ["mild","rich"],
  adventurous: ["spicy","tangy"],
  relaxed:     ["mild","sweet"],
  healthy:     ["mild","tangy"],
  indulgent:   ["sweet","rich"],
};


// --------------- STATE ---------------

var cart           = [];
var currentRest    = null;
var selectedSeats  = [];
var currentMovie   = null;
var currentTheater = null;
var currentShow    = showtimes[0];
var payMode        = null;


// --------------- NAV ---------------

function showHome() {
  document.getElementById("home-section").classList.remove("hidden");
  document.getElementById("app-section").classList.add("hidden");
  // ===== CHANGED LINE Below =====
  document.getElementById('login-section').classList.add('hidden');
  setNavActive("home");
}

function openApp(tab) {
  document.getElementById("home-section").classList.add("hidden");
  document.getElementById("app-section").classList.remove("hidden");
  // ===== CHANGED LINE Below =====
  document.getElementById('login-section').classList.add('hidden');
  switchTab(tab);
  setNavActive(tab);
}

function setNavActive(tab) {
  var btns = document.querySelectorAll(".nav-btn");
  btns.forEach(function(b) { b.classList.remove("active"); });
  if (tab === "home") {
    document.getElementById("nav-home").classList.add("active");
  } else if (tab === "food") {
    document.getElementById("nav-food").classList.add("active");
  } else if (tab === "movies") {
    document.getElementById("nav-movies").classList.add("active");
  // ===== CHANGED LINE Below =====
  } else if (tab === "profile") {
    document.getElementById("nav-profile").classList.add("active");
  }
}

function switchTab(tab) {
  document.getElementById("tab-food").classList.toggle("hidden", tab !== "food");
  document.getElementById("tab-movies").classList.toggle("hidden", tab !== "movies");

  document.getElementById("tbtn-food").classList.toggle("active", tab === "food");
  document.getElementById("tbtn-movies").classList.toggle("active", tab === "movies");
}


// --------------- RESTAURANTS ---------------

function renderRestaurants(list) {
  var html = "";
  for (var i = 0; i < list.length; i++) {
    var r = list[i];
    var badgeClass = r.type === "veg" ? "veg" : r.type === "nonveg" ? "nonveg" : "both";
    var badgeText  = r.type === "veg" ? "Pure Veg" : r.type === "nonveg" ? "Non-Veg" : "Veg & Non-Veg";
    html += '<div class="rest-card" onclick="openMenu(' + r.id + ')">';
    html += '  <div class="rest-banner" style="background:' + r.color + '">' + r.emoji;
    html += '    <span class="veg-badge ' + badgeClass + '">' + badgeText + '</span>';
    html += '  </div>';
    html += '  <div class="rest-body">';
    html += '    <div class="rest-name">' + r.name + '</div>';
    html += '    <div class="rest-meta"><span class="rest-rating">★ ' + r.rating + '</span><span>' + r.cuisine + '</span><span>🕐 ' + r.time + '</span></div>';
    html += '    <div class="tag-list">';
    for (var t = 0; t < r.tags.length; t++) {
      html += '<span class="tag">' + r.tags[t] + '</span>';
    }
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
  }
  document.getElementById("rest-grid").innerHTML = html;
}

function searchRestaurants(query) {
  var q = query.toLowerCase();
  var filtered = restaurants.filter(function(r) {
    return r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q);
  });
  renderRestaurants(filtered);
}

function openMenu(restId) {
  currentRest = null;
  for (var i = 0; i < restaurants.length; i++) {
    if (restaurants[i].id === restId) {
      currentRest = restaurants[i];
      break;
    }
  }
  if (!currentRest) return;

  document.getElementById("rest-list-view").classList.add("hidden");
  document.getElementById("menu-view").classList.remove("hidden");
  document.getElementById("menu-rest-name").textContent = currentRest.emoji + " " + currentRest.name;
  document.getElementById("menu-rest-sub").textContent  = currentRest.cuisine + " · ★ " + currentRest.rating + " · 🕐 " + currentRest.time;

  buildCategoryFilters(menuData[restId]);
  renderMenuItems(menuData[restId]);
}

function buildCategoryFilters(items) {
  var cats = [];
  for (var i = 0; i < items.length; i++) {
    if (cats.indexOf(items[i].cat) === -1) cats.push(items[i].cat);
  }
  var html = '<button class="filter-btn active" onclick="filterByCategory(\'all\', this)">All</button>';
  for (var c = 0; c < cats.length; c++) {
    html += '<button class="filter-btn" onclick="filterByCategory(\'' + cats[c] + '\', this)">' + cats[c] + '</button>';
  }
  document.getElementById("category-filters").innerHTML = html;
}

function filterByCategory(cat, btn) {
  document.querySelectorAll(".filter-btn").forEach(function(b) { b.classList.remove("active"); });
  btn.classList.add("active");
  var items = cat === "all" ? menuData[currentRest.id] : menuData[currentRest.id].filter(function(i) { return i.cat === cat; });
  renderMenuItems(items);
}

function renderMenuItems(items) {
  var html = "";
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var dotClass = item.veg ? "v" : "nv";
    var dotTitle = item.veg ? "Veg" : "Non-Veg";

    html += '<div class="menu-card">';
    html += '  <span class="food-emoji">' + item.emoji + '</span>';
    html += '  <div class="food-name"><span class="veg-dot ' + dotClass + '"></span>' + item.name + '</div>';
    html += '  <div class="food-desc">' + item.desc + '</div>';
    html += '  <div class="taste-row">';
    for (var t = 0; t < item.taste.length; t++) {
      html += '<span class="taste-chip ' + item.taste[t] + '">' + item.taste[t] + '</span>';
    }
    for (var m = 0; m < item.moods.length; m++) {
      html += '<span class="mood-chip">' + item.moods[m] + '</span>';
    }
    html += '  </div>';
    html += '  <div class="food-price">₹' + item.price + '</div>';
    html += '  <button class="add-btn" onclick="addToCart(\'' + item.id + '\',\'' + item.name + '\',\'' + item.emoji + '\',' + item.price + ')">+ Add</button>';
    html += '</div>';
  }
  document.getElementById("menu-items-grid").innerHTML = html;
}

function goBackToRestaurants() {
  document.getElementById("rest-list-view").classList.remove("hidden");
  document.getElementById("menu-view").classList.add("hidden");
}


// --------------- CART ---------------

function addToCart(id, name, emoji, price) {
  var found = null;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) { found = cart[i]; break; }
  }
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ id: id, name: name, emoji: emoji, price: price, qty: 1 });
  }
  refreshCart();
  showToast(emoji + " " + name + " added!");
}

function changeQty(id, delta) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart[i].qty += delta;
      if (cart[i].qty <= 0) cart.splice(i, 1);
      break;
    }
  }
  refreshCart();
}

function refreshCart() {
  var total = 0;
  var count = 0;
  for (var i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].qty;
    count += cart[i].qty;
  }

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total-amount").textContent = "₹" + total;
  document.getElementById("cart-fab").style.display = count > 0 ? "flex" : "none";

  if (cart.length === 0) {
    document.getElementById("cart-items-list").innerHTML = '<div class="empty-cart"><span class="cart-icon">🛒</span>Your cart is empty</div>';
    return;
  }

  var html = "";
  for (var i = 0; i < cart.length; i++) {
    var c = cart[i];
    html += '<div class="cart-item">';
    html += '  <span class="cart-item-emoji">' + c.emoji + '</span>';
    html += '  <div class="cart-item-info"><div class="cart-item-name">' + c.name + '</div><div class="cart-item-price">₹' + c.price + '</div></div>';
    html += '  <div class="qty-controls">';
    html += '    <button class="qty-btn" onclick="changeQty(\'' + c.id + '\',-1)">−</button>';
    html += '    <span class="qty-num">' + c.qty + '</span>';
    html += '    <button class="qty-btn" onclick="changeQty(\'' + c.id + '\',1)">+</button>';
    html += '  </div>';
    html += '</div>';
  }
  document.getElementById("cart-items-list").innerHTML = html;
}

function toggleCart() {
  document.getElementById("cart-panel").classList.toggle("open");
}


// --------------- MOOD RECOMMENDER ---------------

function selectMood(el) {
  document.querySelectorAll(".mood-btn").forEach(function(b) { b.classList.remove("selected"); });
  el.classList.add("selected");
  var mood = el.getAttribute("data-mood");
  showMoodResults(mood);
}

function showMoodResults(mood) {
  var tasteList = moodMatchMap[mood] || [];
  var allItems  = [];
  var keys = Object.keys(menuData);
  for (var k = 0; k < keys.length; k++) {
    allItems = allItems.concat(menuData[keys[k]]);
  }

  var matched = allItems.filter(function(item) {
    if (item.moods.indexOf(mood) !== -1) return true;
    for (var t = 0; t < item.taste.length; t++) {
      if (tasteList.indexOf(item.taste[t]) !== -1) return true;
    }
    return false;
  }).slice(0, 6);

  var html = "";
  for (var i = 0; i < matched.length; i++) {
    var item = matched[i];
    html += '<div class="rec-card" onclick="addToCart(\'' + item.id + '\',\'' + item.name + '\',\'' + item.emoji + '\',' + item.price + ')">';
    html += '  <span class="rec-emoji">' + item.emoji + '</span>';
    html += '  <div><div class="rec-name">' + item.name + '</div><div class="rec-mood">✓ ' + mood + ' mood</div><div class="rec-price">₹' + item.price + '</div></div>';
    html += '</div>';
  }
  var container = document.getElementById("rec-results-grid");
  container.innerHTML = html;
  container.classList.remove("hidden");
}


// --------------- MOVIES ---------------

function renderMovies(list) {
  var html = "";
  for (var i = 0; i < list.length; i++) {
    var m = list[i];
    html += '<div class="movie-card">';
    html += '  <div class="movie-poster" style="background:' + m.color + '">' + m.emoji;
    html += '    <span class="movie-cert">' + m.cert + '</span>';
    html += '    <span class="movie-lang-tag">' + m.lang + '</span>';
    html += '  </div>';
    html += '  <div class="movie-info">';
    html += '    <div class="movie-title">' + m.title + '</div>';
    html += '    <div class="movie-genre">' + m.genre + '</div>';
    html += '    <button class="book-btn" onclick="openSeatSelector(' + m.id + ')">Book Tickets</button>';
    html += '  </div>';
    html += '</div>';
  }
  document.getElementById("movie-grid").innerHTML = html;
}

function filterByLang(lang, btn) {
  document.querySelectorAll(".lang-tab").forEach(function(b) { b.classList.remove("active"); });
  btn.classList.add("active");
  var filtered = lang === "all" ? movies : movies.filter(function(m) { return m.lang === lang; });
  renderMovies(filtered);
}

function renderTheaters() {
  var html = "";
  for (var i = 0; i < theaters.length; i++) {
    var t = theaters[i];
    html += '<div class="theater-card" onclick="openSeatFromTheater(' + t.id + ')">';
    html += '  <div class="theater-preview">';
    html += '    <div class="screen-line"></div>';
    html += '    <div class="screen-text">Screen</div>';
    html += '    <div class="mini-seats">';
    for (var s = 0; s < 9; s++) {
      html += '<div class="mini-seat ' + (s < 3 ? "taken" : "free") + '"></div>';
    }
    html += '    </div>';
    html += '  </div>';
    html += '  <div class="theater-info">';
    html += '    <div class="theater-name">' + t.emoji + ' ' + t.name + '</div>';
    html += '    <div class="theater-address">📍 ' + t.address + '</div>';
    html += '    <div class="feature-tags">';
    for (var f = 0; f < t.features.length; f++) {
      var feat = t.features[f];
      var cls = feat === "IMAX" ? "imax" : feat === "Dolby" ? "dolby" : feat === "4K" ? "fourk" : "std";
      html += '<span class="ft ' + cls + '">' + feat + '</span>';
    }
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
  }
  document.getElementById("theater-grid").innerHTML = html;
}


// --------------- SEAT SELECTOR ---------------

function openSeatSelector(movieId, theaterId) {
  currentMovie = null;
  for (var i = 0; i < movies.length; i++) {
    if (movies[i].id === movieId) { currentMovie = movies[i]; break; }
  }
  if (!currentMovie) return;

  currentTheater = theaters[theaterId ? (theaterId - 1) : 0];
  selectedSeats  = [];

  var ss = document.getElementById("seat-section");
  ss.classList.add("visible");
  ss.scrollIntoView({ behavior: "smooth", block: "start" });

  document.getElementById("sel-movie-emoji").textContent  = currentMovie.emoji;
  document.getElementById("sel-movie-title").textContent  = currentMovie.title;
  document.getElementById("sel-theater-name").textContent = currentTheater.name;
  document.getElementById("sel-std-price").textContent    = currentMovie.price;
  document.getElementById("sel-prem-price").textContent   = currentMovie.premiumPrice;

  buildShowtimeTabs();
  buildSeatGrid();
}

function openSeatFromTheater(theaterId) {
  currentTheater = null;
  for (var i = 0; i < theaters.length; i++) {
    if (theaters[i].id === theaterId) { currentTheater = theaters[i]; break; }
  }
  openSeatSelector(currentMovie ? currentMovie.id : movies[0].id, theaterId);
  document.getElementById("sel-theater-name").textContent = currentTheater.name;
}

function buildShowtimeTabs() {
  var html = "";
  for (var i = 0; i < showtimes.length; i++) {
    var active = (i === 0) ? " active" : "";
    html += '<button class="showtime-btn' + active + '" onclick="selectShowtime(this,\'' + showtimes[i] + '\')">' + showtimes[i] + '</button>';
  }
  document.getElementById("showtime-tabs").innerHTML = html;
  currentShow = showtimes[0];
}

function selectShowtime(btn, time) {
  document.querySelectorAll(".showtime-btn").forEach(function(b) { b.classList.remove("active"); });
  btn.classList.add("active");
  currentShow   = time;
  selectedSeats = [];
  buildSeatGrid();
}

function buildSeatGrid() {
  var rows  = ["A","B","C","D","E","F","G","H"];
  var cols  = 12;
  var seed  = currentShow.charCodeAt(0) + (currentMovie ? currentMovie.id : 0);
  var html  = "";

  for (var r = 0; r < rows.length; r++) {
    var isPremium = (r < 2);
    html += '<div class="seat-row"><span class="row-label">' + rows[r] + '</span>';
    for (var c = 0; c < cols; c++) {
      var seatId = rows[r] + (c + 1);
      var taken  = ((r * cols + c + seed) % 4 === 0);
      var cls    = isPremium ? "seat premium " : "seat ";
      cls       += taken ? "taken" : "free";
      var onclick = taken ? "" : ' onclick="toggleSeat(this,\'' + seatId + '\',' + isPremium + ')"';
      html += '<div class="' + cls + '"' + onclick + '>' + (c + 1) + '</div>';
      if (c === 5) html += '<div class="seat-gap"></div>';
    }
    html += '</div>';
  }
  document.getElementById("seat-grid").innerHTML = html;
  updateSeatSummary();
}

function toggleSeat(el, seatId, isPremium) {
  if (el.classList.contains("taken")) return;

  if (el.classList.contains("chosen")) {
    el.classList.remove("chosen");
    el.classList.add("free");
    selectedSeats = selectedSeats.filter(function(s) { return s !== seatId; });
  } else {
    el.classList.remove("free");
    el.classList.add("chosen");
    selectedSeats.push(seatId);
  }
  updateSeatSummary();
}

function updateSeatSummary() {
  var premCount = 0;
  var stdCount  = 0;
  for (var i = 0; i < selectedSeats.length; i++) {
    var row = selectedSeats[i][0];
    if (row === "A" || row === "B") premCount++;
    else stdCount++;
  }

  var total = (premCount * (currentMovie ? currentMovie.premiumPrice : 300)) +
              (stdCount  * (currentMovie ? currentMovie.price : 200));

  var seatsText = selectedSeats.length > 0 ? selectedSeats.join(", ") : "None";
  document.getElementById("summary-seats").textContent = seatsText;
  document.getElementById("summary-total").textContent = "₹" + total;
}


// --------------- PAYMENT ---------------

function openPayment(type) {
  payMode = type;

  if (type === "food" && cart.length === 0) {
    showToast("Please add items to cart first");
    return;
  }
  if (type === "movie" && selectedSeats.length === 0) {
    showToast("Please select seats first");
    return;
  }

  document.getElementById("pay-form-section").style.display = "block";
  document.getElementById("success-section").classList.remove("visible");
  document.getElementById("payment-modal").classList.add("open");

  if (type === "food") {
    var sub = cart.reduce(function(sum, c) { return sum + c.price * c.qty; }, 0);
    var gst = Math.round(sub * 0.05);
    document.getElementById("modal-subtitle").textContent = "Confirm your food order";
    var html = cart.map(function(c) {
      return '<div class="summary-line"><span>' + c.emoji + ' ' + c.name + ' ×' + c.qty + '</span><span>₹' + (c.price * c.qty) + '</span></div>';
    }).join("");
    html += '<div class="summary-line"><span>GST (5%)</span><span>₹' + gst + '</span></div>';
    html += '<div class="summary-line"><span>Delivery fee</span><span>₹30</span></div>';
    html += '<div class="summary-line total"><span>Total</span><span>₹' + (sub + gst + 30) + '</span></div>';
    document.getElementById("order-summary-content").innerHTML = html;

  } else {
    var premCount = selectedSeats.filter(function(s) { return s[0] === "A" || s[0] === "B"; }).length;
    var stdCount  = selectedSeats.length - premCount;
    var sub = (premCount * currentMovie.premiumPrice) + (stdCount * currentMovie.price);
    var fee = Math.round(sub * 0.02);
    document.getElementById("modal-subtitle").textContent = currentMovie.title + " · " + currentShow;
    var html = '<div class="summary-line"><span>Theater</span><span>' + currentTheater.name + '</span></div>';
    html += '<div class="summary-line"><span>Seats</span><span>' + selectedSeats.join(", ") + '</span></div>';
    html += '<div class="summary-line"><span>' + selectedSeats.length + ' ticket(s)</span><span>₹' + sub + '</span></div>';
    html += '<div class="summary-line"><span>Convenience fee</span><span>₹' + fee + '</span></div>';
    html += '<div class="summary-line total"><span>Total</span><span>₹' + (sub + fee) + '</span></div>';
    document.getElementById("order-summary-content").innerHTML = html;
  }
}

function closePayment() {
  document.getElementById("payment-modal").classList.remove("open");
}

function selectPayMethod(el) {
  document.querySelectorAll(".pay-method-btn").forEach(function(b) { b.classList.remove("active"); });
  el.classList.add("active");

  var method = el.getAttribute("data-method");
  var fields = document.getElementById("payment-fields");

  if (method === "card") {
    fields.innerHTML =
      '<div class="form-field"><label class="form-label">Name on Card</label><input class="form-input" placeholder="Your name"></div>' +
      '<div class="form-field"><label class="form-label">Card Number</label><input class="form-input" placeholder="1234 5678 9012 3456" maxlength="19" oninput="formatCard(this)"></div>' +
      '<div class="form-row">' +
        '<div class="form-field"><label class="form-label">Expiry</label><input class="form-input" placeholder="MM/YY" maxlength="5"></div>' +
        '<div class="form-field"><label class="form-label">CVV</label><input class="form-input" placeholder="•••" type="password" maxlength="3"></div>' +
      '</div>';
  } else if (method === "upi") {
    fields.innerHTML = '<div class="form-field"><label class="form-label">UPI ID</label><input class="form-input" placeholder="yourname@upi"></div>';
  } else if (method === "netbanking") {
    fields.innerHTML = '<div class="form-field"><label class="form-label">Select Bank</label><select class="form-input"><option>SBI</option><option>HDFC</option><option>ICICI</option><option>Axis Bank</option><option>Punjab National Bank</option></select></div>';
  } else if (method === "cod") {
    fields.innerHTML = '<div style="background:#e8f8f0;border:1px solid #2db67d;border-radius:8px;padding:14px;font-size:14px;color:#1a6b45;font-weight:600;">💵 Pay cash on delivery. Our agent will collect payment at your door.</div>';
  }
}

function formatCard(input) {
  var val = input.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
  input.value = val.substring(0, 19);
}

// ===== CHANGED SECTION: Firebase Dynamic Booking Submissions =====
async function submitPayment() {
  var btn = document.querySelector(".pay-now-btn");
  btn.textContent = "Processing...";
  btn.disabled = true;

  var orderTotal = 0;
  var summaryText = document.getElementById("order-summary-content").innerText;

  try {
    // Generate an order reference key
    var bookingId = "FF-" + Math.random().toString(36).toUpperCase().slice(2, 10);
    
    // Construct database snapshot structural payload
    var transactionData = {
      bookingRef: bookingId,
      type: payMode,
      userId: auth.currentUser ? auth.currentUser.uid : "guest_account",
      userEmail: auth.currentUser ? auth.currentUser.email : "anonymous",
      summary: summaryText,
      timestamp: new Date()
    };

    if (payMode === "food") {
      transactionData.items = cart;
    } else {
      transactionData.movieTitle = currentMovie.title;
      transactionData.theaterName = currentTheater.name;
      transactionData.showtime = currentShow;
      transactionData.seatsBooked = selectedSeats;
    }

    // Push transaction structure up to Firestore 'bookings' collection
    await addDoc(collection(db, "bookings"), transactionData);

    // Update frontend view states matching the original logic
    document.getElementById("pay-form-section").style.display = "none";
    document.getElementById("success-section").classList.add("visible");
    document.getElementById("booking-ref").textContent = "Booking Ref: " + bookingId;

    if (payMode === "food") {
      document.getElementById("success-title").textContent = "Order Confirmed! 🎉";
      document.getElementById("success-msg").textContent   = "Your food is being prepared. Estimated delivery: 35–45 min.";
      cart = [];
      refreshCart();
    } else {
      document.getElementById("success-title").textContent = "Tickets Booked! 🎬";
      document.getElementById("success-msg").textContent   = "Enjoy " + currentMovie.title + "! Your seats: " + selectedSeats.join(", ");
      selectedSeats = [];
      buildSeatGrid();
    }
  } catch (error) {
    console.error("Firestore database submission failed: ", error);
    alert("Transaction processing failed, but your UI context has been kept steady.");
  } finally {
    btn.textContent = "Pay Now";
    btn.disabled = false;
  }
}
// ===============================================================

// ===== CHANGED SECTION: Firebase Real-time Authentication State Listener =====
// ===== CHANGED SECTION: Updated Auth State Listener with Profile Toggle =====
onAuthStateChanged(auth, (user) => {
  var profileBtn = document.getElementById('nav-profile');
  var loggedOutView = document.getElementById('auth-logged-out');
  var loggedInView = document.getElementById('auth-logged-in');
  var emailDisplay = document.getElementById('profile-email-display');

  if (user) {
    // 1. Update Navigation text to user handle
    if (profileBtn) profileBtn.innerHTML = `👤 ${user.email.split('@')[0]}`;
    
    // 2. Toggle Account view panels
    if (loggedOutView) loggedOutView.classList.add('hidden');
    if (loggedInView) {
      loggedInView.classList.remove('hidden');
      if (emailDisplay) emailDisplay.textContent = user.email;
    }
  } else {
    // 1. Reset Navigation text to default
    if (profileBtn) profileBtn.innerHTML = "👤 Profile";
    
    // 2. Reset back to the Login form panel
    if (loggedOutView) loggedOutView.classList.remove('hidden');
    if (loggedInView) {
      loggedInView.classList.add('hidden');
      if (emailDisplay) emailDisplay.textContent = "";
    }
  }
});
// ============================================================================
// ===============================================================

// Function to display the Login Section
function showLogin() {
  document.getElementById('home-section').classList.add('hidden');
  document.getElementById('app-section').classList.add('hidden');
  document.getElementById('login-section').classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  // ===== CHANGED LINE Below =====
  setNavActive("profile");
}

// ===== CHANGED SECTION: Firebase Dynamic Email/Password Authentication Validation =====
async function handleLogin(event) {
  event.preventDefault();
  var email = event.target.querySelector('input[type="email"]').value;
  var password = event.target.querySelector('input[type="password"]').value;

  try {
    var userCredential = await signInWithEmailAndPassword(auth, email, password);
    showToast(`Welcome ${userCredential.user.email}!`);
    showHome();
  } catch (error) {
    // If user record doesn't exist, try creating a new account instantly (Sign Up Fallback)
    if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
      try {
        var newCredential = await createUserWithEmailAndPassword(auth, email, password);
        showToast("New Account Provisioned Successfully!");
        showHome();
      } catch (signUpError) {
        alert("Authentication interface error: " + signUpError.message);
      }
    } else {
      alert("Authentication failed: " + error.message);
    }
  }
}
// ===== CHANGED SECTION: Logout Handler =====
async function handleLogout() {
  try {
    await signOut(auth);
    showToast("Logged out successfully!");
    showHome(); // Send them back to the welcome landing board safely
  } catch (error) {
    console.error("Authentication separation failed: ", error);
    alert("Could not process user log out context safely.");
  }
}
// ===========================================
// ===============================================================


// --------------- TOAST ---------------

function showToast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function() { t.classList.remove("show"); }, 2200);
}


// ===== CHANGED SECTION: Firestore Remote Database Collection Initializers =====
async function loadFirestoreCollections() {
  try {
    // 1. Fetch remote restaurants collection
    const restSnapshot = await getDocs(collection(db, "restaurants"));
    if (!restSnapshot.empty) {
      var loadedRestaurants = [];
      restSnapshot.forEach(doc => {
        loadedRestaurants.push({ id: doc.id, ...doc.data() });
      });
      restaurants = loadedRestaurants;
      renderRestaurants(restaurants);
    }

    // 2. Fetch remote movies collection
    const movieSnapshot = await getDocs(collection(db, "movies"));
    if (!movieSnapshot.empty) {
      var loadedMovies = [];
      movieSnapshot.forEach(doc => {
        loadedMovies.push({ id: doc.id, ...doc.data() });
      });
      movies = loadedMovies;
      renderMovies(movies);
    }
  } catch (err) {
    console.warn("Firestore data initialization dropped, operating on local data constants instead.", err);
  }
}
// ===============================================================

// ===== CHANGED SECTION: Advanced User Footprint Tracker (with IP & Geo) =====
// ===== REINFORCED USER FOOTPRINT TRACKER =====
async function recordUserFootprint(actionType, extraData = {}) {
  // 1. Setup fallback placeholders so we always have a payload to send
  let ipData = {
    ip: "blocked_or_restricted",
    country: "unknown",
    region: "unknown",
    city: "unknown",
    isp: "unknown"
  };

  try {
    // 2. Fetching IP with a short timeout so we don't stall the thread
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second limit

    const response = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      ipData = {
        ip: data.ip || "unknown",
        country: data.country_name || "unknown",
        region: data.region || "unknown",
        city: data.city || "unknown",
        isp: data.org || "unknown"
      };
    }
  } catch (e) {
    // If the API fails or is blocked, we note it but KEEP GOING!
    console.warn("IP tracking blocked/timeout. Proceeding with hardware capture.", e.message);
    ipData.ip = "API_blocked_by_client_shields";
  }

  // 3. Collect GPU fingerprint safely
  let gpuInfo = "unknown";
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const debugInfo = gl ? gl.getExtension('WEBGL_debug_renderer_info') : null;
    if (debugInfo) {
      gpuInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }
  } catch (e) { /* Fail silently */ }

  // 4. Build the final payload (this is guaranteed to fire)
  try {
    const footprint = {
      action: actionType,
      timestamp: new Date(),
      
      // Network & Geolocation Data (Safe Fallback applied)
      ipAddress: ipData.ip,
      country: ipData.country,
      region: ipData.region,
      city: ipData.city,
      isp: ipData.isp,
      
      // Basic Browser & Architecture Identification
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages ? navigator.languages.join(",") : navigator.language,
      
      // Hardware Metrics
      cpuCores: navigator.hardwareConcurrency || "unknown",
      deviceRamGb: navigator.deviceMemory || "unknown",
      gpuRenderer: gpuInfo,
      
      // Display & Viewport Geometry
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      availableScreen: `${window.screen.availWidth}x${window.screen.availHeight}`,
      colorDepth: window.screen.colorDepth,
      devicePixelRatio: window.devicePixelRatio || 1,
      
      // Time & Connection State
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      connectionSpeed: navigator.connection ? navigator.connection.effectiveType : "unknown",
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrackFlag: navigator.doNotTrack || window.doNotTrack || "unspecified",
      
      // Navigation History Origin tracking
      arrivalReferrer: document.referrer || "direct_entry",
      sessionHistoryDepth: window.history.length,
      
      // Application Session State
      userId: auth.currentUser ? auth.currentUser.uid : "anonymous_visitor",
      userEmail: auth.currentUser ? auth.currentUser.email : "anonymous",
      ...extraData
    };

    // 5. Fire directly to Firestore
    await addDoc(collection(db, "user_footprints"), footprint);
    console.log("Footprint recorded successfully.");
  } catch (error) {
    console.error("Critical Footprint error: ", error);
  }
}
window.recordUserFootprint = recordUserFootprint;
// ===========================================
// ===================================================================

// --------------- INIT ---------------

function init() {
  renderRestaurants(restaurants);
  renderMovies(movies);
  renderTheaters();
  // ===== CHANGED LINE Below =====
  loadFirestoreCollections();
}

init();


// ===== CHANGED SECTION: Global Module Window Scoping Declarations =====
// Required to prevent DOM onclick bindings from throwing undefined references
window.showHome = showHome;
window.openApp = openApp;
window.switchTab = switchTab;
window.showLogin = showLogin;
window.handleLogin = handleLogin;
window.selectMood = selectMood;
window.searchRestaurants = searchRestaurants;
window.openMenu = openMenu;
window.filterByCategory = filterByCategory;
window.goBackToRestaurants = goBackToRestaurants;
window.addToCart = addToCart;
window.changeQty = changeQty;
window.toggleCart = toggleCart;
window.filterByLang = filterByLang;
window.openSeatSelector = openSeatSelector;
window.openSeatFromTheater = openSeatFromTheater;
window.selectShowtime = selectShowtime;
window.toggleSeat = toggleSeat;
window.openPayment = openPayment;
window.closePayment = closePayment;
window.selectPayMethod = selectPayMethod;
window.formatCard = formatCard;
window.submitPayment = submitPayment;
// Add this line to the bottom array mapping block of window setups inside app.js
window.handleLogout = handleLogout;
// ===============================================================

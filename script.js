/* FoodHub – front-end logic. Data lives in the browser (localStorage) for now;
   later these functions will call Flask REST APIs (restaurants, orders, users services). */
const $ = id => document.getElementById(id);
const get = (k, d) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const money = n => '₹' + n;
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- Sample data ---------- */
const CATS = [['🍕','Pizza'],['🍔','Burgers'],['🍛','Biryani'],['🥞','South Indian'],['🥡','Chinese'],['🍰','Desserts'],['🥤','Beverages']];
const R = [
 {id:1,name:'Spice Garden',cuisine:'North Indian',cat:'Biryani',e:'🍛',bg:'#ffe8d6',rating:4.5,rev:1240,time:30,fee:30,price:2,veg:false,offer:'20% OFF',desc:'Rich curries and tandoori classics cooked the traditional way.',hours:'11:00 AM – 11:00 PM'},
 {id:2,name:'Urban Bites',cuisine:'Chinese',cat:'Chinese',e:'🥡',bg:'#e0f2fe',rating:4.2,rev:860,time:35,fee:40,price:2,veg:false,offer:'',desc:'Indo-Chinese street favourites with a modern twist.',hours:'12:00 PM – 11:30 PM'},
 {id:3,name:'Chennai Kitchen',cuisine:'South Indian',cat:'South Indian',e:'🥞',bg:'#fef3c7',rating:4.7,rev:2100,time:25,fee:20,price:1,veg:true,offer:'Free Delivery',desc:'Authentic dosas, idlis and filter coffee made fresh all day.',hours:'7:00 AM – 10:00 PM'},
 {id:4,name:'Burger House',cuisine:'Burgers & Fast Food',cat:'Burgers',e:'🍔',bg:'#fee2e2',rating:4.1,rev:970,time:20,fee:25,price:2,veg:false,offer:'Buy 1 Get 1',desc:'Juicy burgers, crispy fries and thick shakes.',hours:'10:00 AM – 12:00 AM'},
 {id:5,name:'Royal Biryani',cuisine:'Biryani',cat:'Biryani',e:'🍗',bg:'#ffedd5',rating:4.6,rev:1850,time:40,fee:35,price:2,veg:false,offer:'15% OFF',desc:'Dum-cooked biryani with fragrant basmati and secret spices.',hours:'11:00 AM – 11:00 PM'},
 {id:6,name:'Green Bowl',cuisine:'Healthy & Salads',cat:'Desserts',e:'🥗',bg:'#dcfce7',rating:4.3,rev:540,time:25,fee:30,price:3,veg:true,offer:'',desc:'Fresh salads, smoothie bowls and guilt-free desserts.',hours:'9:00 AM – 9:00 PM'},
 {id:7,name:'Pizza Corner',cuisine:'Pizza & Italian',cat:'Pizza',e:'🍕',bg:'#fde2e4',rating:4.4,rev:1320,time:30,fee:40,price:3,veg:false,offer:'30% OFF',desc:'Wood-fired style pizzas, pastas and garlic bread.',hours:'11:00 AM – 11:30 PM'}];
const M = {  // menu: [name, description, price, veg, rating, section, emoji]
 1:[['Paneer Butter Masala','Creamy tomato gravy with soft paneer cubes.',240,1,4.5,'Main Course','🧀'],['Butter Chicken','Tender chicken in rich buttery gravy.',280,0,4.6,'Main Course','🍗'],['Veg Samosa','Crispy pastry with spiced potato filling.',60,1,4.2,'Starters','🥟'],['Tandoori Chicken','Smoky charred chicken marinated in yogurt.',260,0,4.4,'Starters','🍢'],['Chicken Biryani','Fragrant basmati rice cooked with aromatic spices and tender chicken.',220,0,4.7,'Rice & Biryani','🍛'],['Gulab Jamun','Warm syrup-soaked milk dumplings.',70,1,4.5,'Desserts','🍮'],['Sweet Lassi','Chilled thick yogurt drink.',60,1,4.3,'Beverages','🥛']],
 2:[['Veg Manchurian','Crispy veggie balls in tangy sauce.',150,1,4.1,'Starters','🥬'],['Chilli Chicken','Spicy wok-tossed chicken with peppers.',200,0,4.4,'Starters','🌶️'],['Veg Hakka Noodles','Stir-fried noodles with fresh vegetables.',140,1,4.2,'Main Course','🍜'],['Chicken Fried Rice','Wok-fried rice with egg and chicken.',180,0,4.3,'Rice & Biryani','🍚'],['Iced Lemon Tea','Refreshing chilled tea.',70,1,4.0,'Beverages','🍹']],
 3:[['Masala Dosa','Crispy dosa with spiced potato masala.',90,1,4.8,'Recommended','🥞'],['Idli Sambar (3)','Soft steamed idlis with sambar and chutney.',60,1,4.6,'Recommended','🍚'],['Medu Vada','Crunchy lentil doughnuts.',50,1,4.4,'Starters','🍩'],['Veg Meals','Rice, sambar, rasam, poriyal, curd.',130,1,4.5,'Main Course','🍱'],['Pongal','Comforting rice and lentil dish with ghee.',80,1,4.3,'Main Course','🥣'],['Filter Coffee','Strong South Indian coffee.',35,1,4.9,'Beverages','☕'],['Payasam','Sweet vermicelli milk pudding.',60,1,4.4,'Desserts','🍮']],
 4:[['Classic Veg Burger','Crispy patty, lettuce, tomato, mayo.',120,1,4.0,'Fast Food','🍔'],['Chicken Zinger Burger','Spicy fried chicken fillet burger.',170,0,4.4,'Fast Food','🍔'],['French Fries','Golden salted fries.',80,1,4.2,'Starters','🍟'],['Chicken Wings','Smoky BBQ wings (6 pcs).',190,0,4.3,'Starters','🍗'],['Chocolate Shake','Thick creamy chocolate shake.',110,1,4.5,'Beverages','🥤'],['Brownie Sundae','Warm brownie with vanilla ice cream.',130,1,4.6,'Desserts','🍨']],
 5:[['Mutton Biryani','Slow-cooked mutton with long-grain rice.',320,0,4.7,'Rice & Biryani','🍖'],['Chicken Biryani','Fragrant basmati rice cooked with aromatic spices and tender chicken.',220,0,4.8,'Recommended','🍛'],['Veg Biryani','Aromatic rice with seasonal vegetables.',180,1,4.2,'Rice & Biryani','🥘'],['Chicken 65','Spicy deep-fried chicken bites.',190,0,4.5,'Starters','🍗'],['Raita','Cool yogurt with cucumber.',40,1,4.0,'Starters','🥣'],['Double Ka Meetha','Hyderabadi bread pudding.',90,1,4.4,'Desserts','🍞'],['Soft Drink','Chilled 300ml.',40,1,4.0,'Beverages','🥤']],
 6:[['Caesar Salad','Romaine, croutons, parmesan, light dressing.',210,1,4.3,'Recommended','🥗'],['Quinoa Power Bowl','Quinoa, roasted veg, hummus, seeds.',260,1,4.5,'Main Course','🥙'],['Berry Smoothie Bowl','Mixed berries, granola, honey.',230,1,4.4,'Desserts','🫐'],['Cold Pressed Juice','Orange, carrot and ginger.',120,1,4.2,'Beverages','🧃']],
 7:[['Margherita Pizza','Classic tomato, mozzarella and basil.',250,1,4.5,'Recommended','🍕'],['Pepperoni Pizza','Loaded with pepperoni and cheese.',330,0,4.6,'Main Course','🍕'],['Farmhouse Pizza','Mushroom, capsicum, onion, olives.',300,1,4.3,'Main Course','🍕'],['Garlic Bread','Toasted with herb butter.',110,1,4.4,'Starters','🥖'],['White Sauce Pasta','Creamy penne with herbs.',200,1,4.2,'Main Course','🍝'],['Tiramisu','Coffee-soaked Italian dessert.',150,1,4.5,'Desserts','🍰'],['Cola','Chilled 500ml.',50,1,4.0,'Beverages','🥤']]};
const DISHES = []; Object.entries(M).forEach(([rid, items]) => items.forEach((d, i) => DISHES.push({id: rid + '-' + i, rid: +rid, name: d[0], desc: d[1], price: d[2], veg: d[3], rating: d[4], sec: d[5], e: d[6], bg: R[rid-1].bg})));
const SECTIONS = ['Recommended','Starters','Main Course','Rice & Biryani','Fast Food','Desserts','Beverages'];
const OPTS = ['Extra cheese','Extra spicy','No onion','No garlic'];
const REVIEWS = [['Priya S.','Chennai','Delivery was super quick and the biryani was still piping hot!',5],['Arjun K.','Coimbatore','Great variety and easy tracking. The dosas from Chennai Kitchen are amazing.',5],['Meera R.','Tiruppur','Clean app, fair prices, and the offers are actually useful.',4]];
const resto = id => R.find(r => r.id === +id);

/* ---------- State ---------- */
let cart = get('fh_cart', []), filt = {q:'',cuisine:'all',rating:0,time:0,price:0,veg:false,offer:false,sort:'rec'}, fav = get('fh_fav', []);
const users = () => get('fh_users', []);
const me = () => users().find(u => u.id === localStorage.getItem('fh_session'));
const saveCart = () => { set('fh_cart', cart); drawCart(); };
function toast(m){const t=$('toast');t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2200)}

/* ---------- Reusable HTML pieces ---------- */
const stars = r => `<span class="star">★ ${r}</span>`;
const rcard = r => `<article class="card rcard fade" data-go="restaurant/${r.id}">
  <div class="img" style="background:${r.bg}">${r.e}</div>${r.offer ? `<span class="offer">${r.offer}</span>` : ''}
  <button class="fav" data-fav="${r.id}" aria-label="Favourite">${fav.includes(r.id) ? '❤️' : '🤍'}</button>
  <div class="rb"><h3>${r.name}</h3><p class="muted">${r.cuisine}</p>
  <div class="meta">${stars(r.rating)}<span>(${r.rev})</span><span>⏱ ${r.time} min</span><span>🛵 ${r.fee ? money(r.fee) : 'Free'}</span></div></div></article>`;
const dish = d => `<div class="card dish fade" data-dish="${d.id}">
  <div class="dimg" style="background:${d.bg}">${d.e}</div>
  <div><h4><span class="veg ${d.veg ? '' : 'nv'}"></span>${d.name}</h4><p>${d.desc}</p><span class="price">${money(d.price)}</span> <span class="star">★ ${d.rating}</span></div>
  <div><button class="btn sm out" data-quick="${d.id}">+ Add</button></div></div>`;

/* ---------- Pages ---------- */
const pages = {
home(){ return `
 <section class="hero"><div class="wrap hero-in"><div>
  <h1>Delicious Food, <em>Delivered</em> to Your Door.</h1>
  <p>Discover your favorite meals from local restaurants and get them delivered quickly and conveniently.</p>
  <div class="row"><a class="btn" href="#/restaurants">Order Now</a><a class="btn out" href="#/restaurants">Explore Restaurants</a></div></div>
  <div class="visual">🍔<span class="a">🍕</span><span class="b">🍛</span><span class="c">🥤</span></div></div></section>
 <section class="sec"><div class="wrap"><h2>Popular Categories</h2><p class="sec-sub">What are you craving today?</p>
  <div class="cats">${CATS.map(c => `<div class="card cat" data-cat="${c[1]}"><i>${c[0]}</i>${c[1]}</div>`).join('')}</div></div></section>
 <section class="sec"><div class="wrap"><div class="between"><h2>Popular Restaurants</h2><a class="btn sm out" href="#/restaurants">View all</a></div><p class="sec-sub">Top-rated places near you</p>
  <div class="grid">${[...R].sort((a,b)=>b.rating-a.rating).slice(0,4).map(rcard).join('')}</div></div></section>
 <section class="sec"><div class="wrap"><h2 class="center">Why FoodHub?</h2><p class="sec-sub center">Built around speed, freshness and trust</p>
  <div class="grid">${[['⚡','Fast Delivery','Hot meals at your door in under 40 minutes.'],['🥬','Fresh Food','Prepared fresh by trusted local restaurants.'],['🔒','Secure Ordering','Your details are safe with us.'],['📍','Easy Tracking','Follow your order from kitchen to doorstep.']].map(f => `<div class="card feat"><i>${f[0]}</i><h3>${f[1]}</h3><p>${f[2]}</p></div>`).join('')}</div></div></section>
 <section class="sec"><div class="wrap"><h2 class="center">How It Works</h2><p class="sec-sub center">Four simple steps</p>
  <div class="grid">${['Choose a restaurant','Select your food','Place your order','Track delivery'].map((s,i) => `<div class="step"><b>${i+1}</b><h3>${s}</h3></div>`).join('')}</div></div></section>
 <section class="sec"><div class="wrap"><h2>Customer Reviews</h2><p class="sec-sub">Loved by thousands of food lovers</p>
  <div class="grid">${REVIEWS.map(r => `<div class="card review"><span class="star">${'★'.repeat(r[3])}</span><p>“${r[2]}”</p><b>${r[0]}</b> <span class="muted">· ${r[1]}</span></div>`).join('')}</div></div></section>
 <div class="wrap"><div class="cta"><h2>Ready to satisfy your cravings?</h2><a class="btn white" href="#/restaurants">Start Ordering</a></div></div>`; },

restaurants(){ return `
 <div class="pagehead"><div class="wrap"><h1>Discover Great Food Near You</h1>
  <div class="filters">
   <input id="fQ" type="search" placeholder="Search restaurants or dishes..." value="${esc(filt.q)}" aria-label="Search">
   <select id="fCuisine"><option value="all">All cuisines</option>${[...new Set(R.map(r => r.cat))].map(c => `<option ${filt.cuisine===c?'selected':''}>${c}</option>`).join('')}</select>
   <select id="fRating"><option value="0">Any rating</option>${[4.5,4,3.5].map(v => `<option value="${v}" ${filt.rating==v?'selected':''}>${v}+ ★</option>`).join('')}</select>
   <select id="fTime"><option value="0">Any delivery time</option>${[25,30,40].map(v => `<option value="${v}" ${filt.time==v?'selected':''}>Under ${v} min</option>`).join('')}</select>
   <select id="fPrice"><option value="0">Any price</option><option value="1" ${filt.price==1?'selected':''}>₹ Budget</option><option value="2" ${filt.price==2?'selected':''}>₹₹ Mid</option><option value="3" ${filt.price==3?'selected':''}>₹₹₹ Premium</option></select>
  </div>
  <div class="toggles"><button class="tog ${filt.veg?'on':''}" id="tVeg">🥬 Vegetarian</button><button class="tog ${filt.offer?'on':''}" id="tOffer">🏷️ Offers</button>
   <select id="fSort" style="width:auto;margin:0;min-height:40px;border-radius:99px"><option value="rec">Recommended</option><option value="rating" ${filt.sort=='rating'?'selected':''}>Rating</option><option value="time" ${filt.sort=='time'?'selected':''}>Delivery time</option><option value="price" ${filt.sort=='price'?'selected':''}>Price (low to high)</option></select></div>
 </div></div><div class="wrap sec"><div class="grid" id="rGrid"></div></div>`; },

menu(){ return `<div class="pagehead"><div class="wrap"><h1>Full Menu</h1><input id="mQ" type="search" placeholder="Search dishes..." aria-label="Search dishes"></div></div>
 <div class="wrap sec"><div class="dlist" id="mList"></div></div>`; },

restaurant(id){ const r = resto(id); if (!r) return pages.restaurants();
  const items = DISHES.filter(d => d.rid === r.id);
  const secs = SECTIONS.filter(s => items.some(d => d.sec === s));
  return `<div class="cover" style="background:${r.bg}">${r.e}</div><div class="wrap">
  <div class="card rhead"><div class="between"><h1 style="font-size:2rem">${r.name}</h1><button class="ibtn" data-fav="${r.id}" aria-label="Favourite">${fav.includes(r.id)?'❤️':'🤍'}</button></div>
   <p class="muted">${r.cuisine}</p><p style="margin:8px 0">${r.desc}</p>
   <div class="meta">${stars(r.rating)}<span>(${r.rev} reviews)</span><span>⏱ ${r.time} min</span><span>🛵 ${r.fee ? money(r.fee) : 'Free delivery'}</span><span>🕒 ${r.hours}</span>${r.offer ? `<span class="chip">${r.offer}</span>` : ''}</div></div>
  <a class="back" href="#/restaurants">← All restaurants</a>
  <div class="mtabs">${secs.map(s => `<button class="tog" data-sec="${s}">${s}</button>`).join('')}</div>
  ${secs.map(s => `<section id="sec-${s.replace(/\W/g,'')}" style="margin-bottom:26px;scroll-margin-top:130px"><h2 style="margin-bottom:14px">${s}</h2><div class="dlist">${items.filter(d => d.sec === s).map(dish).join('')}</div></section>`).join('')}</div>`; },

offers(){ return `<div class="pagehead"><div class="wrap"><h1>Today's Offers</h1></div></div><div class="wrap sec"><div class="grid">${R.filter(r => r.offer).map(rcard).join('')}</div></div>`; },

about(){ return `<div class="pagehead"><div class="wrap"><h1>About FoodHub</h1></div></div><div class="wrap sec"><div class="card pad"><p>FoodHub connects hungry people with the best local restaurants. This college DevOps project starts as a monolith and will later be split into microservices (users, restaurants, orders).</p>
 <h3 style="margin-top:18px">Contact &amp; Help</h3><p class="muted">📧 support@foodhub.example · 📞 +91 98765 43210</p><h3 style="margin-top:18px">Privacy &amp; Terms</h3><p class="muted">This is a demo project. No real payments are processed and data stays in your browser.</p></div></div>`; },

login(){ return `<div class="wrap"><form class="card pad narrow" id="authForm" novalidate><h2 id="aTitle">Welcome back</h2><p class="muted" style="margin-bottom:16px">Login to order and track food.</p>
  <label id="nameL" hidden>Full Name<input id="aName"></label>
  <label>Email<input type="email" id="aEmail" placeholder="you@example.com"></label>
  <label>Password<input type="password" id="aPass" placeholder="Min 6 characters"></label>
  <p class="err" id="aErr"></p><button class="btn block" id="aBtn">Login</button>
  <p class="center muted" style="margin-top:14px"><a href="#" id="aSwitch" style="color:var(--primary);font-weight:600">New here? Create an account</a></p></form></div>`; },

orders(){ const u = me(); if (!u) return needLogin();
  const os = get('fh_orders', []).filter(o => o.uid === u.id).reverse();
  return `<div class="pagehead"><div class="wrap"><h1>My Orders</h1></div></div><div class="wrap sec">${os.length ? os.map(orderHTML).join('') : '<div class="empty">No orders yet. <a href="#/restaurants" style="color:var(--primary)">Order something tasty!</a></div>'}</div>`; },

profile(){ const u = me(); if (!u) return needLogin();
  const os = get('fh_orders', []).filter(o => o.uid === u.id), spent = os.reduce((s, o) => s + o.total, 0);
  return `<div class="pagehead"><div class="wrap"><h1>Hi, ${esc(u.name.split(' ')[0])} 👋</h1></div></div><div class="wrap sec">
  <div class="stats"><div class="card stat"><b>${os.length}</b>Orders placed</div><div class="card stat"><b>${money(spent)}</b>Total spent</div><div class="card stat"><b>${os.length ? money(Math.round(spent/os.length)) : '₹0'}</b>Avg. order</div><div class="card stat"><b>${fav.length}</b>Favourites</div></div>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
   <form class="card pad" id="profForm"><h3 style="margin-bottom:12px">Profile</h3><label>Name<input id="pName" value="${esc(u.name)}"></label><label>Email<input value="${esc(u.email)}" disabled></label><label>Phone<input id="pPhone" value="${esc(u.phone||'')}" placeholder="10-digit number"></label><button class="btn">Save</button> <button type="button" class="btn out" id="logout">Log out</button></form>
   <div class="card pad"><h3 style="margin-bottom:12px">Delivery addresses</h3>${(u.addrs||[]).map((a,i) => `<div class="addr"><span>📍 ${esc(a)}</span><button class="rm" data-deladdr="${i}">Remove</button></div>`).join('') || '<p class="muted">No saved addresses.</p>'}
   <label style="margin-top:14px">Add address<input id="newAddr" placeholder="House no, street, city"></label><button class="btn sm" id="addAddr">Add address</button></div></div></div>`; },

checkout(){ const u = me(); if (!cart.length) return '<div class="wrap"><div class="empty">Your cart is empty.</div></div>'; if (!u) return needLogin();
  const t = totals();
  return `<div class="wrap"><form class="card pad narrow" id="coForm" novalidate><h2>Checkout</h2>
  <label style="margin-top:14px">Delivery address<input id="coAddr" list="addrList" placeholder="Enter or choose address" value="${esc((u.addrs||[])[0]||'')}"><datalist id="addrList">${(u.addrs||[]).map(a => `<option value="${esc(a)}">`).join('')}</datalist></label>
  <label>Payment<select id="coPay"><option>Cash on Delivery</option><option>UPI</option><option>Card</option></select></label>
  <div class="sum"><span>Items</span><span>${money(t.sub)}</span></div><div class="sum"><span>Delivery</span><span>${money(t.fee)}</span></div><div class="sum t"><span>Total</span><span>${money(t.total)}</span></div>
  <p class="err" id="coErr"></p><button class="btn block">Place Order</button></form></div>`; }
};
const needLogin = () => `<div class="wrap"><div class="card pad narrow center"><h2>Please log in</h2><p class="muted" style="margin:8px 0 16px">You need an account to continue.</p><a class="btn" href="#/login">Login / Register</a></div></div>`;

/* ---------- Cart ---------- */
const totals = () => { const sub = cart.reduce((s, c) => s + c.price * c.qty, 0); const fee = cart.length ? resto(cart[0].rid).fee : 0; return {sub, fee, total: sub + fee}; };
function addToCart(d, qty = 1, opts = []){
  if (cart.length && cart[0].rid !== d.rid && !confirm('Your cart has items from another restaurant. Start a new cart?')) return;
  if (cart.length && cart[0].rid !== d.rid) cart = [];
  const key = d.id + opts.join(); const ex = cart.find(c => c.key === key);
  ex ? ex.qty += qty : cart.push({key, id: d.id, rid: d.rid, name: d.name, e: d.e, bg: d.bg, price: d.price, qty, opts});
  saveCart(); toast(d.name + ' added to cart');
}
function drawCart(){
  $('cartCount').textContent = cart.reduce((s, c) => s + c.qty, 0);
  $('cartBody').innerHTML = cart.length ? cart.map(c => `<div class="citem"><div class="dimg" style="background:${c.bg}">${c.e}</div><div><b>${c.name}</b><small>${c.opts.join(', ') || money(c.price) + ' each'}</small>
    <div class="qty" style="margin-top:6px"><button data-q="${c.key}|-1">−</button><span>${c.qty}</span><button data-q="${c.key}|1">+</button></div></div>
    <div style="text-align:right"><b>${money(c.price * c.qty)}</b><br><button class="rm" data-rm="${c.key}">Remove</button></div></div>`).join('') : '<div class="empty">🛒<br>Your cart is empty</div>';
  const t = totals();
  $('cartFoot').innerHTML = cart.length ? `<div class="sum"><span>Subtotal</span><span>${money(t.sub)}</span></div><div class="sum"><span>Delivery</span><span>${money(t.fee)}</span></div><div class="sum t"><span>Total</span><span>${money(t.total)}</span></div><button class="btn block" id="goCheckout">Checkout</button>` : '';
}
const openCart = on => { $('cart').classList.toggle('open', on); $('scrim').classList.toggle('show', on); };
$('cartBtn').onclick = () => openCart(true); $('cartClose').onclick = $('scrim').onclick = () => openCart(false);
$('cartBody').onclick = e => {
  const q = e.target.dataset.q, rm = e.target.dataset.rm;
  if (q) { const [k, n] = q.split('|'); const c = cart.find(x => x.key === k); c.qty += +n; if (c.qty < 1) cart = cart.filter(x => x !== c); saveCart(); }
  if (rm) { cart = cart.filter(x => x.key !== rm); saveCart(); }
};
$('cartFoot').onclick = e => { if (e.target.id === 'goCheckout') { openCart(false); location.hash = '#/checkout'; } };

/* ---------- Orders ---------- */
const STEPS = ['Placed','Preparing','On the way','Delivered'];
function orderStage(o){ return Math.min(3, Math.floor((Date.now() - o.at) / 20000)); } // demo: each stage = 20 seconds
function orderHTML(o){ const s = orderStage(o);
  return `<div class="card pad fade" style="margin-bottom:16px"><div class="between"><div><h3>${esc(o.rname)} <span class="chip ${s===3?'g':''}">${STEPS[s]}</span></h3><p class="muted">Order #${o.id.slice(-6)} · ${new Date(o.at).toLocaleString()} · ${esc(o.pay)}</p></div><b>${money(o.total)}</b></div>
  <p style="margin:10px 0" class="muted">${o.items.map(i => `${i.qty}× ${esc(i.name)}`).join(', ')}</p>
  <div class="track">${STEPS.map((n, i) => `<div class="tstep ${i <= s ? 'done' : ''}"><i>${i <= s ? '✓' : i + 1}</i>${n}</div>`).join('')}</div>
  <p class="muted">📍 ${esc(o.addr)}</p></div>`; }
setInterval(() => { if (location.hash === '#/orders') $('app').innerHTML = pages.orders(); }, 10000);

/* ---------- Dish modal ---------- */
function openDish(id){
  const d = DISHES.find(x => x.id === id); let qty = 1;
  $('mbox').innerHTML = `<div class="mimg" style="background:${d.bg}">${d.e}</div><div class="mbody">
   <div class="between"><h2><span class="veg ${d.veg ? '' : 'nv'}"></span>${d.name}</h2><span class="price" style="font-size:1.2rem">${money(d.price)}</span></div>
   <p class="muted" style="margin:6px 0">${d.desc}</p><p class="muted"><b>Ingredients:</b> ${d.veg ? 'Fresh vegetables, herbs, spices' : 'Fresh meat, herbs, spices'}, house sauce</p>
   <h4 style="margin-top:14px">Customize</h4><div class="opts">${OPTS.map(o => `<label class="opt"><input type="checkbox" value="${o}">${o}</label>`).join('')}</div>
   <div class="between"><div class="qty"><button id="qm">−</button><span id="qv">1</span><button id="qp">+</button></div><span class="price" id="qt">${money(d.price)}</span></div>
   <div class="row" style="margin-top:18px"><button class="btn out" id="mc" style="flex:1">Cancel</button><button class="btn" id="ma" style="flex:2">Add to Cart</button></div></div>`;
  $('modal').hidden = false;
  const upd = () => { $('qv').textContent = qty; $('qt').textContent = money(d.price * qty); };
  $('qm').onclick = () => { qty = Math.max(1, qty - 1); upd(); }; $('qp').onclick = () => { qty++; upd(); };
  $('mc').onclick = () => $('modal').hidden = true;
  $('ma').onclick = () => { addToCart(d, qty, [...$('mbox').querySelectorAll('.opts input:checked')].map(i => i.value)); $('modal').hidden = true; };
}
$('modal').onclick = e => { if (e.target === $('modal')) $('modal').hidden = true; };
document.addEventListener('keydown', e => { if (e.key === 'Escape') { $('modal').hidden = true; openCart(false); } });

/* ---------- Filtering ---------- */
function drawRestaurants(){
  const q = filt.q.toLowerCase();
  let list = R.filter(r => (!q || (r.name + r.cuisine + r.cat).toLowerCase().includes(q) || DISHES.some(d => d.rid === r.id && d.name.toLowerCase().includes(q)))
    && (filt.cuisine === 'all' || r.cat === filt.cuisine) && r.rating >= filt.rating && (!filt.time || r.time <= filt.time)
    && (!filt.price || r.price === +filt.price) && (!filt.veg || r.veg) && (!filt.offer || r.offer));
  const s = {rating:(a,b)=>b.rating-a.rating, time:(a,b)=>a.time-b.time, price:(a,b)=>a.price-b.price, rec:(a,b)=>b.rev-a.rev}[filt.sort];
  $('rGrid').innerHTML = list.sort(s).map(rcard).join('') || '<div class="empty">No restaurants match your filters.</div>';
}
function bindFilters(){
  const m = {fQ:'q', fCuisine:'cuisine', fRating:'rating', fTime:'time', fPrice:'price', fSort:'sort'};
  Object.entries(m).forEach(([id, k]) => $(id).oninput = e => { filt[k] = e.target.value; drawRestaurants(); });
  $('tVeg').onclick = e => { filt.veg = !filt.veg; e.target.classList.toggle('on'); drawRestaurants(); };
  $('tOffer').onclick = e => { filt.offer = !filt.offer; e.target.classList.toggle('on'); drawRestaurants(); };
  drawRestaurants();
}

/* ---------- Router ---------- */
function route(){
  const [name, arg] = (location.hash.replace('#/', '') || 'home').split('/');
  const key = pages[name] ? name : 'home';
  $('app').innerHTML = pages[key](arg);
  document.querySelectorAll('.links a').forEach(a => a.classList.toggle('on', a.dataset.r === (key === 'home' ? '' : key)));
  $('links').classList.remove('open');
  const u = me(); $('authLink').textContent = u ? 'Log out' : 'Login'; $('authLink').href = u ? '#' : '#/login';
  window.scrollTo(0, 0);
  if (key === 'restaurants') bindFilters();
  if (key === 'menu') { const draw = () => { const q = $('mQ').value.toLowerCase(); $('mList').innerHTML = DISHES.filter(d => (d.name + d.desc).toLowerCase().includes(q)).map(dish).join('') || '<div class="empty">No dishes found.</div>'; }; $('mQ').oninput = draw; draw(); }
  if (key === 'login') bindAuth();
  if (key === 'profile' && u) bindProfile();
  if (key === 'checkout' && u && cart.length) bindCheckout();
}
window.addEventListener('hashchange', route);
$('burger').onclick = () => $('links').classList.toggle('open');
$('navSearch').onclick = () => { filt.q = ''; location.hash = '#/restaurants'; setTimeout(() => $('fQ') && $('fQ').focus(), 50); };
$('authLink').onclick = e => { if (me()) { e.preventDefault(); logout(); } };
function logout(){ localStorage.removeItem('fh_session'); toast('Logged out'); location.hash = '#/'; route(); }

/* ---------- Global click handling ---------- */
$('app').addEventListener('click', e => {
  const t = e.target;
  const fv = t.closest('[data-fav]'); if (fv) { e.stopPropagation(); const id = +fv.dataset.fav; fav = fav.includes(id) ? fav.filter(x => x !== id) : [...fav, id]; set('fh_fav', fav); fv.textContent = fav.includes(id) ? '❤️' : '🤍'; return; }
  const q = t.closest('[data-quick]'); if (q) { e.stopPropagation(); addToCart(DISHES.find(d => d.id === q.dataset.quick)); return; }
  const dd = t.closest('[data-dish]'); if (dd) return openDish(dd.dataset.dish);
  const go = t.closest('[data-go]'); if (go) return location.hash = '#/' + go.dataset.go;
  const cat = t.closest('[data-cat]'); if (cat) { filt = {...filt, q: '', cuisine: cat.dataset.cat}; return location.hash = '#/restaurants'; }
  const sec = t.closest('[data-sec]'); if (sec) { const el = $('sec-' + sec.dataset.sec.replace(/\W/g, '')); el && el.scrollIntoView({behavior: 'smooth'}); }
});

/* ---------- Auth, profile, checkout ---------- */
function bindAuth(){
  let reg = false;
  $('aSwitch').onclick = e => { e.preventDefault(); reg = !reg; $('nameL').hidden = !reg; $('aTitle').textContent = reg ? 'Create your account' : 'Welcome back'; $('aBtn').textContent = reg ? 'Register' : 'Login'; $('aSwitch').textContent = reg ? 'Already registered? Login' : 'New here? Create an account'; $('aErr').textContent = ''; };
  $('authForm').onsubmit = e => {
    e.preventDefault();
    const name = $('aName').value.trim(), email = $('aEmail').value.trim().toLowerCase(), pass = $('aPass').value, all = users();
    const fail = m => $('aErr').textContent = m;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please enter a valid email address.');
    if (pass.length < 6) return fail('Password must be at least 6 characters.');
    let u;
    if (reg) {
      if (name.length < 2) return fail('Please enter your name.');
      if (all.some(x => x.email === email)) return fail('Email already registered.');
      u = {id: 'u' + Date.now(), name, email, pass: btoa(pass), addrs: []}; all.push(u); set('fh_users', all);
    } else { u = all.find(x => x.email === email && x.pass === btoa(pass)); if (!u) return fail('Incorrect email or password.'); }
    localStorage.setItem('fh_session', u.id); toast('Welcome, ' + u.name.split(' ')[0] + '!'); location.hash = cart.length ? '#/checkout' : '#/restaurants';
  };
}
function bindProfile(){
  const save = fn => { const all = users(), u = all.find(x => x.id === me().id); fn(u); set('fh_users', all); route(); };
  $('profForm').onsubmit = e => { e.preventDefault(); save(u => { u.name = $('pName').value.trim() || u.name; u.phone = $('pPhone').value.trim(); }); toast('Profile saved'); };
  $('logout').onclick = logout;
  $('addAddr').onclick = () => { const a = $('newAddr').value.trim(); if (a) save(u => u.addrs.push(a)); };
  $('app').querySelectorAll('[data-deladdr]').forEach(b => b.onclick = () => save(u => u.addrs.splice(+b.dataset.deladdr, 1)));
}
function bindCheckout(){
  $('coForm').onsubmit = e => {
    e.preventDefault(); const addr = $('coAddr').value.trim();
    if (addr.length < 8) return $('coErr').textContent = 'Please enter a complete delivery address.';
    const u = me(), t = totals(), os = get('fh_orders', []);
    os.push({id: 'FH' + Date.now(), uid: u.id, rname: resto(cart[0].rid).name, items: cart.map(c => ({name: c.name, qty: c.qty})), total: t.total, addr, pay: $('coPay').value, at: Date.now()});
    set('fh_orders', os);
    const all = users(), uu = all.find(x => x.id === u.id); if (!uu.addrs.includes(addr)) { uu.addrs.push(addr); set('fh_users', all); }
    cart = []; saveCart(); toast('Order placed! 🎉'); location.hash = '#/orders';
  };
}

drawCart(); route();

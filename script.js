// ===== EDIT THESE =====
const WHATSAPP = "2347045670173";   // your WhatsApp number, country code first, no + or spaces
const PHONE_DISPLAY = "0704 567 0173";
const JUICES = ["Orange Juice","Apple Juice","Tigernut Drink","Watermelon Juice","Pineapple Juice","Zobo"];
const CHICKEN = ["Grilled chicken","Fried chicken"];
// img = photo file inside the "images" folder. Remove or leave out img to show the emoji instead.
const MENU = [
  {id:16,n:"Small Chops Package",e:"🎉",img:"Images/smallchops.jpeg",p:12000,c:"Packages",d:"10 puff puff, 1 chicken piece, 7 samosa, 7 spring roll + any juice of your choice.",
    ch:[{l:"Chicken piece",o:CHICKEN},{l:"Choose your juice",o:JUICES}]},

  {id:18,n:"Burger & chips Package",e:"🍔",img:"Images/burgerandchips.jpeg",p:6000,c:"Packages",d:"Large burger, Large chips + any juice of your choice.",
    ch:[{l:"Choose your juice",o:JUICES}]},

  {id:17,n:"Chips & Chicken Combo",e:"🍟",img:"Images/chickenandchips.jpeg",p:7000,c:"Packages",d:"Hot crispy chips + chicken + any drink of your choice.",
    ch:[{l:"Chicken",o:CHICKEN},{l:"Choose your drink",o:JUICES}]},
  {id:1,n:"Chicken",e:"🍗",img:"Images/roastedchicken.webp",p:3500,c:"Fast Food",d:"Juicy chicken, your way: grilled or fried.",
    ch:[{l:"Choose your chicken",o:CHICKEN}]},
  {id:2,n:"Puff Puff",e:"🍩",img:"Images/puff.jpeg",p:1000,c:"Small Chops",d:"Soft, golden and sweet. Pack of 10."},
  {id:3,n:"Samosa",e:"🥟",img:"Images/samosa.jpeg",p:1500,c:"Small Chops",d:"Crispy pastry with seasoned filling. Pack of 5."},
  {id:4,n:"Spring Roll",e:"🌯",img:"Images/springroll.jpg",p:1500,c:"Small Chops",d:"Crunchy rolls with veggie &amp; meat filling. Pack of 5."},
  {id:5,n:"Burger",e:"🍔",img:"Images/burger.jpg",p:3000,c:"Fast Food",d:"Beef patty, cheese, veggies &amp; special sauce."},
  {id:6,n:"Shawarma",e:"🥙",img:"Images/shawarma.jpg",p:3500,c:"Fast Food",d:"Loaded chicken shawarma with creamy sauce."},
  {id:7,n:"Corn Dog",e:"🌭",img:"Images/corndog.png",p:1500,c:"Fast Food",d:"Sausage in golden cornmeal batter."},
  {id:8,n:"Hot Dog",e:"🌭",img:"Images/hotdog.jpg",p:2000,c:"Fast Food",d:"Grilled sausage in a soft bun."},
  {id:9,n:"Chips",e:"🍟",img:"Images/chips.jpg",p:2000,c:"Sides",d:"Hot, crispy fries with pepper sauce."},
  {id:10,n:"Orange Juice",e:"🍊",img:"Images/orangejuice.jpeg",p:1200,c:"Juices",d:"Freshly squeezed and chilled."},
  {id:11,n:"Apple Juice",e:"🍎",img:"Images/applejuice.jpeg",p:1200,c:"Juices",d:"Crisp, sweet and refreshing."},
  {id:12,n:"Tigernut Drink",e:"🥛",img:"Images/tigernut.jpeg",p:1200,c:"Juices",d:"Creamy, naturally sweet tigernut (kunun aya)."},
  {id:13,n:"Watermelon Juice",e:"🍉",img:"Images/watermelon.jpeg",p:1200,c:"Juices",d:"Cool, fresh watermelon blend."},
  {id:14,n:"Pineapple Juice",e:"🍍",img:"Images/pineapple.jpeg",p:1200,c:"Juices",d:"Sweet and tangy pineapple."},
  {id:15,n:"Zobo",e:"🍹",img:"Images/zobo.jpeg",p:1000,c:"Juices",d:"Chilled hibiscus drink with ginger &amp; spice."}
];
// ======================
const $=id=>document.getElementById(id);
const fmt=n=>"₦"+n.toLocaleString("en-NG");

// ===== Cart (saved in the browser so it survives refreshes) =====
const CART_KEY="peckchow_cart";
let cat="All",order=null;
let cart=loadCart();

function loadCart(){
  try{
    const saved=JSON.parse(localStorage.getItem(CART_KEY)||"[]");
    // keep only items still on the menu, and refresh name/price in case you changed them
    return saved.flatMap(c=>{
      const m=MENU.find(x=>x.id===parseInt(c.key,10));
      return m&&c.q>0?[{key:c.key,name:m.n,v:c.v,p:m.p,q:c.q}]:[];
    });
  }catch(e){return []}
}
function saveCart(){
  try{localStorage.setItem(CART_KEY,JSON.stringify(cart))}catch(e){}
}

$("ph").textContent=PHONE_DISPLAY;

function openM(k){if(k==="cart")renderCart();$("m-"+k).classList.add("open")}
function closeM(k){$("m-"+k).classList.remove("open")}
function bg(e,k){if(e.target.classList.contains("modal"))closeM(k)}
document.addEventListener("keydown",e=>{
  if(e.key==="Escape")document.querySelectorAll(".modal.open").forEach(m=>m.classList.remove("open"));
});

function renderTabs(){
  const cats=["All",...new Set(MENU.map(m=>m.c))];
  $("tabs").innerHTML=cats.map(c=>`<button class="tab ${c===cat?"on":""}" onclick="cat='${c}';renderTabs();renderMenu()">${c}</button>`).join("");
}
function renderMenu(){
  $("grid").innerHTML=MENU.filter(m=>cat==="All"||m.c===cat).map(m=>`
  <div class="card">
    <div class="emo">${m.img?`<img src="${m.img}" alt="${m.n}" loading="lazy" onerror="this.replaceWith('${m.e}')">`:m.e}</div>
    <h3>${m.n}</h3><p>${m.d}</p>
    <div class="row"><span class="price">${fmt(m.p)}</span><button class="btn" onclick="add(${m.id})">${m.ch?"Choose +":"Add +"}</button></div>
  </div>`).join("");
}
let pickId=null;
function add(id){
  const m=MENU.find(x=>x.id===id);
  if(m.ch){
    pickId=id;
    $("pk-title").textContent=m.n;
    $("pk-body").innerHTML=m.ch.map((g,i)=>`<label for="pk${i}">${g.l}</label><select id="pk${i}">${g.o.map(o=>`<option>${o}</option>`).join("")}</select>`).join("");
    openM("pick");
  } else addItem(id,"");
}
function confirmPick(){
  const m=MENU.find(x=>x.id===pickId);
  const v=m.ch.map((g,i)=>$("pk"+i).value).join(", ");
  addItem(pickId,v);closeM("pick");
}
function addItem(id,v){
  const m=MENU.find(x=>x.id===id);
  const key=id+"|"+v,ex=cart.find(c=>c.key===key);
  ex?ex.q++:cart.push({key,name:m.n,v,p:m.p,q:1});
  upd();
}
function chg(key,d){
  const c=cart.find(x=>x.key===key);
  if(!c)return;
  c.q=Math.max(1,c.q+d);          // never goes below 1
  upd();renderCart();
}
function removeItem(key){
  cart=cart.filter(x=>x.key!==key);
  upd();renderCart();
}
const total=()=>cart.reduce((a,c)=>a+c.p*c.q,0);
function upd(){
  const n=cart.reduce((a,c)=>a+c.q,0);
  $("cc").textContent=n;$("ft").textContent=fmt(total());
  $("fab").style.display=n?"block":"none";
  saveCart();
}
function renderCart(){
  if(!cart.length){$("cartBody").innerHTML=`<div class="empty">Your cart is empty 🍽️<br><br><button class="btn" onclick="closeM('cart')">Browse menu</button></div>`;return}
  $("cartBody").innerHTML=cart.map(c=>`
  <div class="item"><div class="nm">${c.name}${c.v?` <small>(${c.v})</small>`:""}<br><small>${fmt(c.p)} each</small></div>
  <div class="qty"><button onclick="chg('${c.key}',-1)" ${c.q<=1?"disabled":""} aria-label="Decrease">−</button><b>${c.q}</b><button onclick="chg('${c.key}',1)" aria-label="Increase">+</button></div>
  <button class="rm" onclick="removeItem('${c.key}')" aria-label="Remove ${c.name}">×</button></div>`).join("")+
  `<div class="total"><span>Total</span><span>${fmt(total())}</span></div>
   <button class="btn" style="width:100%" onclick="closeM('cart');$('ck-total').textContent=fmt(total());openM('checkout')">Checkout</button>`;
}
function placeOrder(){
  const name=$("f-name").value.trim(),phone=$("f-phone").value.trim(),addr=$("f-addr").value.trim(),note=$("f-note").value.trim();
  if(!name||!phone||!addr){$("err").style.display="block";return}
  $("err").style.display="none";
  const id="SC"+Math.floor(1000+Math.random()*9000);
  const lines=cart.map(c=>`• ${c.q} x ${c.name}${c.v?" ("+c.v+")":""} - ${fmt(c.p*c.q)}`);
  const msg=`*New Order ${id}*\n\n${lines.join("\n")}\n\n*Total: ${fmt(total())}*\nPayment: On delivery\n\nName: ${name}\nPhone: ${phone}\nAddress: ${addr}${note?"\nNote: "+note:""}`;
  $("oid").textContent="#"+id;
  $("sum").innerHTML=lines.join("<br>")+`<br><b>Total: ${fmt(total())} (pay on delivery)</b>`;
  $("wa").href=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  closeM("checkout");openM("done");
}
function finish(){
  cart=[];upd();closeM("done");
  ["f-name","f-phone","f-addr","f-note"].forEach(i=>$(i).value="");
  window.scrollTo({top:0,behavior:"smooth"});
}
renderTabs();renderMenu();upd();

// ===== Hero slideshow =====
// Put your photos in an "images" folder next to index.html and list them here.
const HERO_SLIDES = ["images/samosa.jpeg","images/puff.jpeg","images/shawarma.jpg","images/roastedchicken.webp"];
const HERO_SECONDS = 5;
(function(){
  const hero=$("hero"),box=$("heroBg");
  let loaded=0,list=[];
  HERO_SLIDES.forEach(src=>{
    const img=new Image();
    img.onload=()=>{list.push(src);if(++loaded===HERO_SLIDES.length)start()};
    img.onerror=()=>{if(++loaded===HERO_SLIDES.length)start()};
    img.src=src;
  });
  function start(){
    if(!list.length)return;                 // no photos found: keep the plain hero
    box.innerHTML=list.map(s=>`<div class="slide" style="background-image:url('${s}')"></div>`).join("");
    const slides=[...box.children];let i=0;
    slides[0].classList.add("on");hero.classList.add("has-slides");
    if(slides.length<2)return;
    setInterval(()=>{slides[i].classList.remove("on");i=(i+1)%slides.length;slides[i].classList.add("on")},HERO_SECONDS*1000);
  }
})();

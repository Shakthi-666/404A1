(function(){
  const YEAR = new Date().getFullYear();
  const yearEls = ["year","year2","year3","year4","year5","year6","year7"];
  yearEls.forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=YEAR});
  const mobileToggle=document.getElementById("mobile-toggle");
  mobileToggle?.addEventListener("click",()=>{const nav=document.querySelector(".main-nav");if(nav){nav.classList.toggle("open")}});

  const STORE_ITEMS = [
    {id:'s1',title:'Hybrid Maize Seed - 1kg',price:250,img:'https://source.unsplash.com/400x300/?seeds'},
    {id:'s2',title:'Rice Seed - 2kg',price:300,img:'https://source.unsplash.com/400x300/?rice-seed'},
    {id:'f1',title:'NPK Fertilizer - 50kg',price:1200,img:'https://source.unsplash.com/400x300/?fertilizer'},
    {id:'k1',title:'Soil Testing Kit',price:450,img:'https://source.unsplash.com/400x300/?soil-testing'}
  ];

  function qs(id){return document.getElementById(id)}
  function storageGet(key,def){try{return JSON.parse(localStorage.getItem(key))||def}catch(e){return def}}
  function storageSet(key,val){localStorage.setItem(key,JSON.stringify(val))}

  let consumerCart = storageGet('farm404_consumer_cart',[]);
  let farmerCart = storageGet('farm404_farmer_cart',[]);
  let users = storageGet('farm404_users',[]);
  let currentUser = storageGet('farm404_current_user',null);

  function initShop(){
    const grid = qs('shopGrid');
    if(!grid) return;
    grid.innerHTML='';
    STORE_ITEMS.forEach(it=>{
      const div=document.createElement('div');div.className='item';
      div.innerHTML=`<img src="${it.img}" alt="${it.title}"><h4>${it.title}</h4><p>₹ ${it.price}</p><div style="display:flex;gap:0.5rem;justify-content:center"><button class="btn small" data-id="${it.id}">Add</button></div>`;
      grid.appendChild(div);
    });
    grid.querySelectorAll('button[data-id]').forEach(btn=>btn.addEventListener('click',e=>{
      const id=e.currentTarget.getAttribute('data-id');
      const item = STORE_ITEMS.find(s=>s.id===id);
      if(item){consumerCart.push(item); storageSet('farm404_consumer_cart',consumerCart); renderConsumerCart();}
    }));
    renderConsumerCart();
  }

  function renderConsumerCart(){
    const el=qs('consumerCart'); if(!el) return;
    if(consumerCart.length===0){el.textContent='Your cart is empty.'; return;}
    const ul=document.createElement('ul'); let total=0;
    consumerCart.forEach(ci=>{const li=document.createElement('li');li.textContent=`${ci.title} - ₹${ci.price}`; ul.appendChild(li); total+=ci.price});
    el.innerHTML=''; el.appendChild(ul);
    const p=document.createElement('p');p.innerHTML=`<strong>Total: ₹${total}</strong>`; el.appendChild(p);
  }

  function clearConsumerCart(){consumerCart=[]; storageSet('farm404_consumer_cart',consumerCart); renderConsumerCart()}

  function renderFarmerCart(){const el=qs('farmerCart'); if(!el) return; if(farmerCart.length===0){el.textContent='No items yet.'; return;} const ul=document.createElement('ul'); let total=0; farmerCart.forEach(ci=>{const li=document.createElement('li');li.textContent=`${ci.title} - Qty: ${ci.qty||1} - ₹${ci.price*(ci.qty||1)}`; ul.appendChild(li); total+=ci.price*(ci.qty||1)}); el.innerHTML=''; el.appendChild(ul); const p=document.createElement('p');p.innerHTML=`<strong>Total: ₹${total}</strong>`; el.appendChild(p)}

  function addToFarmerCart(title,price){const found=farmerCart.find(f=>f.title===title); if(found){found.qty=(found.qty||1)+1}else{farmerCart.push({title,price,qty:1})} storageSet('farm404_farmer_cart',farmerCart); renderFarmerCart()}

  qs('clearCartBtn')?.addEventListener('click',()=>{clearConsumerCart()})
  qs('checkoutBtn')?.addEventListener('click',()=>{if(consumerCart.length===0){alert('Cart empty')} else {alert('Checkout simulated. Thank you!'); clearConsumerCart()}})

  qs('onsiteForm')?.addEventListener('submit',e=>{e.preventDefault(); const name=qs('onsiteName').value.trim(); const phone=qs('onsitePhone').value.trim(); const location=qs('onsiteLocation').value.trim(); const date=qs('onsiteDate').value; const out=qs('onsiteResult'); out.style.display='block'; out.textContent=`Thanks ${name}. Onsite visit requested at ${location} on ${date}. We'll call ${phone} to confirm.`; e.target.reset()})

  qs('scheduleForm')?.addEventListener('submit',e=>{e.preventDefault(); const name=qs('farmerName').value.trim(); const phone=qs('farmerPhone').value.trim(); const date=qs('visitDate').value; const out=qs('scheduleResult'); out.style.display='block'; out.textContent=`Thanks ${name}. Visit requested on ${date}. We'll contact ${phone}.`; e.target.reset()})

  qs('helpForm')?.addEventListener('submit',e=>{e.preventDefault(); const name=qs('fbName').value.trim(); const email=qs('fbEmail').value.trim(); const msg=qs('fbMessage').value.trim(); qs('fbResult').style.display='block'; qs('fbResult').textContent='Thanks '+(name||'user')+'. Your message has been submitted.'; e.target.reset()})

  qs('cropForm')?.addEventListener('submit',e=>{e.preventDefault(); const soil=qs('soil').value; const season=qs('season').value; const area=parseFloat(qs('area')?.value)||0; const out=qs('recommendResult'); out.style.display='block'; const recs = getCropSuggestions(soil,season,area); out.innerHTML=''; recs.forEach(r=>{const d=document.createElement('div'); d.innerHTML=`<h4>${r.crop}</h4><p>${r.note}</p>`; out.appendChild(d)}); e.target.reset()})

  function getCropSuggestions(soil,season,area){
    const res=[];
    if(season==='kharif'){res.push({crop:'Maize',note:'Good in Kharif with moderate rainfall.'}); if(soil==='sandy')res.push({crop:'Groundnut',note:'Sandy soils with nutrients suit groundnut.'})}
    if(season==='rabi'){res.push({crop:'Wheat',note:'Rabi season crop for cooler months.'}); if(soil==='clay')res.push({crop:'Mustard',note:'Clay soils retain moisture good for mustard.'})}
    if(season==='zaid'){res.push({crop:'Pearl Millet',note:'Short-duration millet for hot season.'})}
    if(area>2)res.push({crop:'Commercial Vegetables',note:'Consider high-value cash crops with drip irrigation.'});
    if(res.length===0)res.push({crop:'Mixed Vegetables',note:'General-purpose option depending on market demand.'});
    return res;
  }

  qs('registerForm')?.addEventListener('submit',e=>{e.preventDefault(); const name=qs('regName').value.trim(); const email=qs('regEmail').value.trim().toLowerCase(); const pw=qs('regPassword').value; if(!email||!pw){displayAuth('Please fill all fields');return;} if(users.find(u=>u.email===email)){displayAuth('User already exists. Please login.'); return;} users.push({name,email,password:pw}); storageSet('farm404_users',users); displayAuth('Registration successful. You can now login.'); e.target.reset()})

  qs('loginForm')?.addEventListener('submit',e=>{e.preventDefault(); const email=qs('loginEmail').value.trim().toLowerCase(); const pw=qs('loginPassword').value; const user=users.find(u=>u.email===email && u.password===pw); if(user){currentUser={name:user.name,email:user.email}; storageSet('farm404_current_user',currentUser); displayAuth('Welcome back, '+user.name); setTimeout(()=>{window.location.href='index.html'},800)} else displayAuth('Invalid credentials')})

  function displayAuth(msg){const out=qs('authMessage'); if(!out)return; out.style.display='block'; out.textContent=msg; setTimeout(()=>{out.style.display='none'},4000)}

  function initAuthDisplay(){ const out=qs('authMessage'); if(!out) return; const u = storageGet('farm404_current_user',null); if(u) out.style.display='block'; else out.style.display='none'}

  function initShopUI(){ initShop(); renderFarmerCart(); initAuthDisplay() }

  function hydrateExampleFarmerCart(){ if(farmerCart.length===0){farmerCart=[{title:'Bulk Fertilizer - 50kg',price:1100,qty:2}]; storageSet('farm404_farmer_cart',farmerCart)} renderFarmerCart() }

  // ----------------- NEW DYNAMIC CROP RECOMMENDATION CODE -----------------
  const cropMapping = {
    loamy: {
      summer: ["Tomato","Maize","Chili"],
      winter: ["Wheat","Barley","Carrot"],
      monsoon: ["Rice","Sugarcane","Cotton"]
    },
    clay: {
      summer: ["Okra","Millet","Pea"],
      winter: ["Cabbage","Spinach","Mustard"],
      monsoon: ["Paddy","Taro","Soybean"]
    },
    sandy: {
      summer: ["Groundnut","Watermelon","Cotton"],
      winter: ["Radish","Lettuce","Pea"],
      monsoon: ["Maize","Sesame","Sunflower"]
    }
  };

  qs('recommendBtn')?.addEventListener('click',()=>{
    const soil = qs('soil')?.value;
    const season = qs('season')?.value;
    const result = qs('result');
    if(!soil || !season){result.innerHTML="<p class='error'>Please select soil and season</p>"; return;}
    const crops = (cropMapping[soil] && cropMapping[soil][season]) || ["Mixed Vegetables"];
    result.innerHTML = `<h3>Recommended Crops:</h3><ul>${crops.map(c=>`<li>${c}</li>`).join('')}</ul>`;
  });
  // -----------------------------------------------------------------------

  document.addEventListener('DOMContentLoaded',()=>{ initShopUI(); hydrateExampleFarmerCart(); renderConsumerCart() })
})();

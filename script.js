document.getElementById("year").textContent = new Date().getFullYear();

function getRecommendation() {
  const soil = document.getElementById("soil").value;
  const season = document.getElementById("season").value;
  let result = "";
  if (soil && season) {
    if (soil === "loamy" && season === "summer") result = "Best crop: Groundnut, Sunflower.";
    else if (soil === "clay" && season === "winter") result = "Best crop: Wheat, Mustard.";
    else if (soil === "sandy" && season === "monsoon") result = "Best crop: Maize, Bajra.";
    else result = "Try Rice, Pulses as general crops.";
  } else {
    result = "Please select both soil type and season.";
  }
  document.getElementById("result").textContent = result;
}

let consumerCart = [];

function addToCart(item, price) {
  consumerCart.push({ item, price });
  displayCart();
}

function displayCart() {
  const cartDiv = document.getElementById("consumerCart");
  if (!cartDiv) return;
  if (consumerCart.length === 0) {
    cartDiv.textContent = "Your cart is empty.";
    return;
  }
  let html = "<ul>";
  let total = 0;
  consumerCart.forEach(c => {
    html += `<li>${c.item} - ₹${c.price}</li>`;
    total += c.price;
  });
  html += `</ul><p><strong>Total: ₹${total}</strong></p>`;
  cartDiv.innerHTML = html;
}

document.getElementById("scheduleForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  document.getElementById("scheduleResult").textContent = `Schedule booked on ${date} at ${time}.`;
});

document.getElementById("onsiteForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const location = document.getElementById("location").value;
  const date = document.getElementById("date").value;
  document.getElementById("onsiteResult").textContent = `Thanks ${name}, onsite visit booked at ${location} on ${date}.`;
});

document.getElementById("helpForm")?.addEventListener("submit", e => {
  e.preventDefault();
  alert("Your message has been submitted. We'll get back to you soon!");
});

document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (email && password) {
    alert(`Welcome back, ${email}!`);
  } else {
    alert("Please fill in all fields.");
  }
});

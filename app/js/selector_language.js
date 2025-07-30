// List of countries with flag emojis
const countries = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
];

// Populate the options
const optionsDiv = document.getElementById("country-options");
optionsDiv.innerHTML = countries
  .map(
    (c) =>
      `<label><input type="checkbox" value="${c.code}"> ${c.flag} ${c.name}</label>`
  )
  .join("");

// Toggle dropdown
function toggleMultiselect() {
  document.getElementById("country-multiselect").classList.toggle("open");
}

// Close dropdown if clicked outside
document.addEventListener("click", function (e) {
  const multiselect = document.getElementById("country-multiselect");
  if (!multiselect.contains(e.target)) {
    multiselect.classList.remove("open");
  }
});

// Update selected text
optionsDiv.addEventListener("change", function () {
  const checked = optionsDiv.querySelectorAll('input[type="checkbox"]:checked');
  const selected = Array.from(checked).map((cb) => {
    const label = cb.parentNode.textContent.trim();
    return "✔️ " + label;
  });
  document.querySelector(
    "#country-multiselect .multiselect-selected"
  ).textContent = selected.length
    ? selected.join(", ")
    : "🌍 Select country/countries";
});

// Helper to get selected country codes in JS
function getSelectedCountries() {
  const checked = document.querySelectorAll(
    '#country-multiselect .multiselect-options input[type="checkbox"]:checked'
  );
  return Array.from(checked).map((cb) => cb.value);
}
// Example: log selected countries on change
optionsDiv.addEventListener("change", function () {
  console.log(getSelectedCountries());
});

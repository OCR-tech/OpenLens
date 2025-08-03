// ================================= //
const languages = [
  { value: "eng", label: "English" },
  { value: "tha", label: "Thai" },
  { value: "ara", label: "Arabic" },
  { value: "mya", label: "Burmese" },
  { value: "chi_sim", label: "Chinese (Simplified)" },
  { value: "chi_tra", label: "Chinese (Traditional)" },
  { value: "ces", label: "Czech" },
  { value: "dan", label: "Danish" },
  { value: "nld", label: "Dutch" },
  { value: "deu", label: "German" },
  { value: "ell", label: "Greek" },
  { value: "fin", label: "Finnish" },
  { value: "fra", label: "French" },
  { value: "heb", label: "Hebrew" },
  { value: "hin", label: "Hindi" },
  { value: "hun", label: "Hungarian" },
  { value: "ind", label: "Indonesian" },
  { value: "ita", label: "Italian" },
  { value: "jpn", label: "Japanese" },
  { value: "jpn_vert", label: "Japanese (Vertical)" },
  { value: "khm", label: "Khmer" },
  { value: "kor", label: "Korean" },
  { value: "kor_vert", label: "Korean (Vertical)" },
  { value: "lao", label: "Lao" },
  { value: "lat", label: "Latin" },
  { value: "msa", label: "Malay" },
  { value: "pol", label: "Polish" },
  { value: "por", label: "Portuguese" },
  { value: "ron", label: "Romanian" },
  { value: "rus", label: "Russian" },
  { value: "spa", label: "Spanish" },
  { value: "swe", label: "Swedish" },
  { value: "tur", label: "Turkish" },
  { value: "ukr", label: "Ukrainian" },
  { value: "vie", label: "Vietnamese" },
  // Add more as needed
];

// ================================= //
function populateLanguageDropdown() {
  // alert("PopulateLanguageDropdown");

  const optionsBox = document.querySelector(
    "#language-dropdown .multi-options-box"
  );
  optionsBox.innerHTML = "";
  languages.forEach((lang) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${lang.value}"> ${lang.label}`;
    optionsBox.appendChild(label);
  });
}

// ================================= //
function toggleDropdownLanguages() {
  // alert("ToggleDropdownLanguages");

  document.getElementById("language-dropdown").classList.toggle("open");
}

// ================================= //
// Optional: Close dropdown when clicking outside
document.addEventListener("click", function (e) {
  const dropdown = document.getElementById("language-dropdown");
  if (dropdown && !dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});

// ================================= //
// Function to get selected languages from the dropdown
function getSelectedLanguages() {
  // alert("GetSelectedLanguages");

  const checkboxes = document.querySelectorAll(
    "#language-dropdown input[type='checkbox']"
  );
  const selected = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selected.push(checkbox.value);
    }
  });

  if (selected.length === 0) {
    return ["eng"];
  }

  if (selected.length > 1) {
    selected.sort();
    // alert("Multiple " + selected);
  }

  return selected;
}

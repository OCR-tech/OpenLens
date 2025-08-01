// ================================= //
const languages = [
  { value: "eng", label: "English" },
  { value: "tha", label: "Thai" },
  { value: "spa", label: "Spanish" },
  { value: "fra", label: "French" },
  { value: "deu", label: "German" },
  { value: "chi_sim", label: "Chinese (Simplified)" },
  { value: "jpn", label: "Japanese" },
  { value: "rus", label: "Russian" },
  { value: "ara", label: "Arabic" },
  { value: "por", label: "Portuguese" },
  { value: "hin", label: "Hindi" },
  { value: "ita", label: "Italian" },
  { value: "kor", label: "Korean" },
  { value: "tur", label: "Turkish" },
  { value: "vie", label: "Vietnamese" },
  { value: "nld", label: "Dutch" },
  { value: "ell", label: "Greek" },
  { value: "heb", label: "Hebrew" },
  { value: "pol", label: "Polish" },
  { value: "ces", label: "Czech" },
  { value: "ron", label: "Romanian" },
  { value: "swe", label: "Swedish" },
  { value: "fin", label: "Finnish" },
  { value: "hun", label: "Hungarian" },
  // Add more as needed
];

// ================================= //
function populateLanguageDropdown() {
  // alert("PopulateLanguageDropdown");

  const optionsBox = document.querySelector(
    "#languageDropdown .multi-options-box"
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

  document.getElementById("languageDropdown").classList.toggle("open");
}

// ================================= //
// Optional: Close dropdown when clicking outside
document.addEventListener("click", function (e) {
  const dropdown = document.getElementById("languageDropdown");
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});

// ================================= //
// Function to get selected languages from the dropdown
function getSelectedLanguages() {
  // alert("GetSelectedLanguages");

  const checkboxes = document.querySelectorAll(
    "#languageDropdown input[type='checkbox']"
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
    alert("Multiple " + selected);
  }

  return selected;
}

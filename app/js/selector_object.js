// ================================= //
const objects = [
  { value: "person", label: "Person" },
  { value: "car", label: "Car" },
  { value: "bicycle", label: "Bicycle" },
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "tree", label: "Tree" },
  { value: "building", label: "Building" },
  { value: "traffic light", label: "Traffic Light" },
  { value: "stop sign", label: "Stop Sign" },
  { value: "bus", label: "Bus" },
  { value: "train", label: "Train" },
  { value: "airplane", label: "Airplane" },
  { value: "boat", label: "Boat" },
  { value: "motorcycle", label: "Motorcycle" },
  { value: "truck", label: "Truck" },
];
// ================================= //
function populateObjectDropdown() {
  const optionsBox = document.querySelector(
    "#object-dropdown .multi-options-box"
  );
  optionsBox.innerHTML = "";

  objects.forEach((obj) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" id="${obj.label}" value="${obj.value}"> ${obj.label}`;
    optionsBox.appendChild(label);
  });
}

// ================================= //
function toggleDropdownObjects() {
  // alert("ToggleDropdownObjects");

  document.getElementById("object-dropdown").classList.toggle("open");
}

// ================================= //
// Optional: Close dropdown when clicking outside
document.addEventListener("click", function (e) {
  const dropdown = document.getElementById("object-dropdown");
  if (dropdown && !dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});

// ================================= //
// Function to get selected objects from the dropdown
function getSelectedObjects() {
  const checkboxes = document.querySelectorAll(
    "#object-dropdown input[type='checkbox']"
  );
  const selected = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selected.push(checkbox.value);
    }
  });

  if (selected.length === 0) {
    return ["person"];
  }

  if (selected.length > 1) {
    selected.sort();
  }

  return selected;
}

// ================================= //
const objects = [
  { value: "all", label: "All" },
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
  { value: "couch", label: "Couch" },
  { value: "chair", label: "Chair" },
  { value: "table", label: "Table" },
  { value: "lamp", label: "Lamp" },
  { value: "phone", label: "Phone" },
  { value: "laptop", label: "Laptop" },
  { value: "book", label: "Book" },
  { value: "bottle", label: "Bottle" },
  { value: "cup", label: "Cup" },
  { value: "plate", label: "Plate" },
  { value: "fork", label: "Fork" },
  { value: "knife", label: "Knife" },
  { value: "spoon", label: "Spoon" },
  { value: "potted plant", label: "Potted Plant" },
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

selectedObjects = [];
// ================================= //
// Optional: Close dropdown when clicking outside
document.addEventListener("click", function (e) {
  const dropdown = document.getElementById("object-dropdown");
  if (dropdown && !dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
    selectedObjects = getSelectedObjects();
  }
});

// ================================= //
// Function to get selected objects from the dropdown
function getSelectedObjects() {
  // alert("GetSelectedObjects");

  const checkboxes = document.querySelectorAll(
    "#object-dropdown input[type='checkbox']"
  );
  const selected = [];

  // Set all checkboxes as default checked
  // checkboxes.forEach((checkbox) => {
  //   checkbox.checked = true;
  // });

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selected.push(checkbox.value);
    }
  });

  // If "all" is selected, check all checkboxes and return all object values except "all"
  if (selected.includes("all")) {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
    return objects.filter((obj) => obj.value !== "all").map((obj) => obj.value);
  }

  if (selected.length === 0) {
    return ["person"];
  } else if (selected.length === 1 && selected[0] === "all") {
    return objects.map((obj) => obj.value).filter((value) => value !== "all");
  } else if (selected.length > 1) {
    selected.sort();
  }

  // convert selected.value to objects.value
  // selected.forEach((value, index) => {
  //   const obj = objects.find((o) => o.value === value);
  //   if (obj) {
  //     selected[index] = obj.value;
  //   }
  // });

  // alert(`Selected: ${selected.join(", ")}`);

  return selected;
}

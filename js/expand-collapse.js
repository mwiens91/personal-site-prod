// Update class on the container of the buttons depending whether any
// sections are collapsed
function updateButtons() {
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  const someCollapsed = Array.from(checkboxes).some((cb) => !cb.checked);
  document.getElementById("toggle-all").textContent = someCollapsed
    ? "[expand all]"
    : "[collapse all]";
}

// Check checkbox if hash fragment of section ID is present in URL
if (window.location.hash.length > 1) {
  const checkbox = document.querySelector(
    "#checkbox_" + window.location.hash.slice(1),
  );
  if (checkbox) {
    checkbox.checked = true;
  }
}

// Set initial state of the buttons
updateButtons();

// Action for toggling all buttons
document.getElementById("toggle-all").addEventListener("click", () => {
  // NOTE: this duplicates a lot of logic from updateButtons; consider
  // refactoring
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  const someCollapsed = Array.from(checkboxes).some((cb) => !cb.checked);
  checkboxes.forEach((cb) => (cb.checked = someCollapsed));
  updateButtons();
});

// Update state of buttons and scroll position when a checkbox is
// changed
document.body.addEventListener("change", (event) => {
  const checkbox = event.target;
  if (checkbox.matches("input[type=checkbox]")) {
    updateButtons();
    if (checkbox.checked) {
      checkbox.closest("section")?.scrollIntoView({ block: "nearest" });
    }
  }
});

// Allow toggling sections with keyboard
document.querySelectorAll("label[for]").forEach((label) => {
  label.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const checkbox = document.getElementById(label.getAttribute("for"));
      if (checkbox) {
        checkbox.checked = !checkbox.checked;

        // Manually trigger the change event so the handler runs
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  });
});

// Handle clicks on page anchors pointing to section fragments
document.body.addEventListener("click", (event) => {
  const anchor = event.target.closest("a[href^='#']");

  if (!anchor) {
    return;
  }

  const fragmentId = anchor.hash.slice(1);
  const section = document.getElementById(fragmentId)?.closest("section");

  if (!section) {
    return;
  }

  const checkbox = document.querySelector("#checkbox_" + section.id);

  if (!checkbox) {
    return;
  }

  checkbox.checked = true;
  updateButtons();
});

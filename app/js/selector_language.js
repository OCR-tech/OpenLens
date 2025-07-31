// function to check if the language is set for input type="checkbox" from id="languageDropdown"
function isLanguageSelected(language) {
  const checkbox = document.querySelector(
    `#languageDropdown input[type="checkbox"][value="${language}"]`
  );
  return checkbox ? checkbox.checked : false;
}

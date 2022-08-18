import hexRgb from "hex-rgb";

export function setThemeMode(theme = "dark") {
  const documentElement = document.documentElement;
  if (theme === "light") {
    documentElement.classList.add("dark");
  } else {
    documentElement.classList.remove("dark");
  }
}

export function setCssVariables() {
  const documentElement = document.documentElement;
  ["--bg-color", "--primary-color", "--bg-yellow-700"].forEach((name) => {
    const value = getComputedStyle(documentElement)
      .getPropertyValue(name)
      .trim();
    const rgbValue = hexRgb(value);

    documentElement.style.setProperty(
      `${name}-rgb`,
      `${rgbValue.red}, ${rgbValue.green}, ${rgbValue.blue}`
    );
  });
}

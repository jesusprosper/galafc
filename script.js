const buttons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const targetSection = button.dataset.section;

    sections.forEach(section => {
      section.classList.remove("active");
    });

    buttons.forEach(btn => {
      btn.classList.remove("active");
    });

    document.getElementById(targetSection).classList.add("active");
    button.classList.add("active");
  });
});
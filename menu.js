// menu.js

// Seleciona o botão do menu e a lista de navegação
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector("#navbar");

// Adiciona um evento de clique no botão do menu
menuToggle.addEventListener("click", function () {
  // Adiciona ou remove a classe 'active' para mostrar ou esconder o menu
  navbar.classList.toggle("active");
});

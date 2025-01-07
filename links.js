document.addEventListener("DOMContentLoaded", function () {
  // Seleciona todos os links do menu
  const menuLinks = document.querySelectorAll(".menu-link");

  // Obtém o caminho da URL atual
  const currentPath = window.location.pathname.split("/").pop(); // Pega apenas o nome do arquivo

  // Adiciona a classe 'active' ao link correspondente
  menuLinks.forEach((link) => {
    const linkPath = link.getAttribute("href"); // Caminho do link

    // Compara o caminho atual com o href do link
    if (currentPath === linkPath) {
      link.classList.add("active");
    }
  });
});

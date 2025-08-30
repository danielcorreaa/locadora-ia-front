document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
  
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const errorMessage = document.getElementById("errorMessage");
  
    errorMessage.textContent = "";
  
    if (!email || !senha) {
      errorMessage.textContent = "Por favor, preencha todos os campos.";
      return;
    }
  
    try {
      // Exemplo de chamada à API de login
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });
  
      if (true) {
        const data = await response.json();
  
        // Exemplo: salvar token ou usuário no localStorage
        localStorage.setItem("usuario", JSON.stringify(data));
  
        // Redireciona para menu principal
        window.location.href = "index.html";
      } else {
        errorMessage.textContent = "E-mail ou senha inválidos!";
      }
    } catch (error) {
      console.error("Erro no login:", error);
      errorMessage.textContent = "Erro ao conectar com o servidor.";
    }
  });
  
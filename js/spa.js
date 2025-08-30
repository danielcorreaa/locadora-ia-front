// APIs
const API_CLIENTE = "http://localhost:8080/clientes";
const API_FILME = "http://localhost:8080/filmes";
const API_LOCACAO = "http://localhost:8080/locacoes";
const API_MULTA = "http://localhost:8080/multas";


// Toast
function showToast(msg,type="success"){
    const toast=document.createElement("div");
    toast.classList.add("toast",type);
    toast.textContent=msg;
    document.getElementById("toastContainer").appendChild(toast);
    setTimeout(()=>toast.remove(),3500);
}

// Menu SPA
document.querySelectorAll(".menu-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelectorAll(".section").forEach(s=>s.style.display="none");
        document.querySelectorAll(".menu-btn").forEach(b=>b.classList.remove("active"));
        document.getElementById(btn.dataset.section).style.display="block";
        btn.classList.add("active");
    });
});

// Botão Sair
document.getElementById("logoutBtn").addEventListener("click", function() {
          localStorage.removeItem("usuario"); // remove o usuário logado
          window.location.href = "login.html"; // redireciona para login 
});


document.querySelectorAll('.cpf-input').forEach(input => {
    input.addEventListener('input', e => {
        let value = e.target.value.replace(/\D/g, ''); // remove tudo que não é número
        if (value.length > 11) value = value.slice(0, 11); // limita a 11 dígitos

        // aplica máscara XXX.XXX.XXX-XX
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        e.target.value = value;
    });
});


// =================== Inicialização ===================
window.onload=()=>{
    listarClientes();
    listarFilmes();
    //carregarClientesFilmes();
};

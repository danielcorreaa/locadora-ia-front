const API_URL = "http://localhost:8080/clientes"; // Ajuste conforme sua API

// Função para mostrar toast de notificação
function showToast(message, type="success") {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;

    const container = document.getElementById("toastContainer");
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3500);
}

// Validação simples de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,'');
    if(cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0, rest;
    for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
    rest = (sum * 10) % 11; if(rest === 10 || rest === 11) rest = 0;
    if(rest !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for(let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
    rest = (sum * 10) % 11; if(rest === 10 || rest === 11) rest = 0;
    return rest === parseInt(cpf.substring(10, 11));
}

// Cadastro de cliente
document.getElementById("formCliente").addEventListener("submit", async (e) => {
    e.preventDefault();

    const cliente = {
        id: document.getElementById("id").value.trim(),
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value.trim(),
        email: document.getElementById("email").value.trim()
    };

    if (!cliente.id || !cliente.nome || !cliente.cpf || !cliente.email) {
        showToast("Preencha todos os campos!", "error");
        return;
    }

    if (!validarCPF(cliente.cpf)) {
        showToast("CPF inválido!", "error");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente)
        });

        if (!response.ok) throw new Error("Erro ao cadastrar cliente");

        showToast("Cliente cadastrado com sucesso!");
        document.getElementById("formCliente").reset();
        listarClientes();

    } catch (error) {
        showToast(error.message, "error");
    }
});

// Função para criar cards de cliente com botões editar/excluir
function criarCardCliente(cliente) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <p><strong>ID:</strong> ${cliente.id}</p>
        <p><strong>Nome:</strong> ${cliente.nome}</p>
        <p><strong>CPF:</strong> ${cliente.cpf}</p>
        <p><strong>Email:</strong> ${cliente.email}</p>
        <button class="btnEdit">Editar</button>
        <button class="btnDelete">Excluir</button>
    `;

    // Editar cliente
    card.querySelector(".btnEdit").addEventListener("click", () => abrirModal(cliente));

    // Excluir cliente
    card.querySelector(".btnDelete").addEventListener("click", async () => {
        if (confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) {
            try {
                const response = await fetch(`${API_URL}/${cliente.id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Erro ao excluir cliente");
                showToast("Cliente excluído com sucesso!");
                listarClientes();
            } catch (error) {
                showToast(error.message, "error");
            }
        }
    });

    return card;
}

// Listar clientes
async function listarClientes() {
    const container = document.getElementById("listaClientes");
    container.innerHTML = "";

    try {
        const response = await fetch(API_URL);
        const clientes = await response.json();

        clientes.forEach(c => {
            container.appendChild(criarCardCliente(c));
        });

    } catch (error) {
        showToast("Erro ao listar clientes", "error");
    }
}

// Modal de edição
const modal = document.getElementById("modalEdit");
const spanClose = modal.querySelector(".close");

function abrirModal(cliente) {
    document.getElementById("editId").value = cliente.id;
    document.getElementById("editNome").value = cliente.nome;
    document.getElementById("editCpf").value = cliente.cpf;
    document.getElementById("editEmail").value = cliente.email;
    modal.style.display = "block";
}

spanClose.onclick = () => modal.style.display = "none";
window.onclick = event => { if (event.target == modal) modal.style.display = "none"; };

// Salvar alterações no modal
document.getElementById("formEditCliente").addEventListener("submit", async (e) => {
    e.preventDefault();

    const clienteAtualizado = {
        id: document.getElementById("editId").value,
        nome: document.getElementById("editNome").value.trim(),
        cpf: document.getElementById("editCpf").value.trim(),
        email: document.getElementById("editEmail").value.trim()
    };

    if (!validarCPF(clienteAtualizado.cpf)) {
        showToast("CPF inválido!", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${clienteAtualizado.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clienteAtualizado)
        });

        if (!response.ok) throw new Error("Erro ao atualizar cliente");
        modal.style.display = "none";
        showToast("Cliente atualizado com sucesso!");
        listarClientes();

    } catch (error) {
        showToast(error.message, "error");
    }
});

// Buscar cliente por ID com toast
document.getElementById("btnBuscar").addEventListener("click", async () => {
    const id = document.getElementById("searchId").value.trim();

    if (!id) {
        showToast("Digite um ID para buscar!", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Cliente não encontrado");

        const cliente = await response.json();
        showToast(`Cliente encontrado: ${cliente.nome}`);
        listarClientes();

    } catch (error) {
        showToast(error.message, "error");
    }
});

// Inicializa lista ao carregar a página
window.onload = listarClientes;

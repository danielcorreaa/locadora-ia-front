const API_URL_FILME = "http://localhost:8080/filmes"; // Ajuste conforme a API

// Função para mostrar toast (pode reaproveitar a do cliente.js)
function showToast(message, type="success") {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;

    const container = document.getElementById("toastContainer");
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3500);
}

// Cadastro de filme
document.getElementById("formFilme").addEventListener("submit", async (e) => {
    e.preventDefault();

    const filme = {
        id: document.getElementById("filmeId").value.trim(),
        titulo: document.getElementById("titulo").value.trim(),
        genero: document.getElementById("genero").value.trim(),
        anoLancamento: parseInt(document.getElementById("anoLancamento").value),
        disponivel: document.getElementById("disponivel").checked
    };

    if (!filme.id || !filme.titulo || !filme.genero || !filme.anoLancamento) {
        showToast("Preencha todos os campos!", "error");
        return;
    }

    try {
        const response = await fetch(API_URL_FILME, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filme)
        });

        if (!response.ok) throw new Error("Erro ao cadastrar filme");

        showToast("Filme cadastrado com sucesso!");
        document.getElementById("formFilme").reset();
        listarFilmes();

    } catch (error) {
        showToast(error.message, "error");
    }
});

// Criar card de filme
function criarCardFilme(filme) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <p><strong>ID:</strong> ${filme.id}</p>
        <p><strong>Título:</strong> ${filme.titulo}</p>
        <p><strong>Gênero:</strong> ${filme.genero}</p>
        <p><strong>Ano:</strong> ${filme.anoLancamento}</p>
        <p><strong>Disponível:</strong> ${filme.disponivel ? 'Sim' : 'Não'}</p>
        <button class="btnEdit">Editar</button>
        <button class="btnDelete">Excluir</button>
    `;

    // Editar
    card.querySelector(".btnEdit").addEventListener("click", () => abrirModalFilme(filme));

    // Excluir
    card.querySelector(".btnDelete").addEventListener("click", async () => {
        if (confirm(`Deseja realmente excluir o filme ${filme.titulo}?`)) {
            try {
                const response = await fetch(`${API_URL_FILME}/${filme.id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Erro ao excluir filme");
                showToast("Filme excluído com sucesso!");
                listarFilmes();
            } catch (error) {
                showToast(error.message, "error");
            }
        }
    });

    return card;
}

// Listar filmes
async function listarFilmes() {
    const container = document.getElementById("listaFilmes");
    container.innerHTML = "";

    try {
        const response = await fetch(API_URL_FILME);
        const filmes = await response.json();

        filmes.forEach(f => container.appendChild(criarCardFilme(f)));
    } catch (error) {
        showToast("Erro ao listar filmes", "error");
    }
}

// Modal para edição de filme
function abrirModalFilme(filme) {
    const modal = document.getElementById("modalEdit");
    const formEdit = document.getElementById("formEdit");

    formEdit.innerHTML = `
        <input type="hidden" id="editId" value="${filme.id}">
        <input type="text" id="editTitulo" placeholder="Título" value="${filme.titulo}" required>
        <input type="text" id="editGenero" placeholder="Gênero" value="${filme.genero}" required>
        <input type="number" id="editAnoLancamento" placeholder="Ano de Lançamento" value="${filme.anoLancamento}" required>
        <label>
            <input type="checkbox" id="editDisponivel" ${filme.disponivel ? 'checked' : ''}> Disponível
        </label>
        <button type="submit">Salvar Alterações</button>
    `;

    formEdit.onsubmit = async (e) => {
        e.preventDefault();

        const filmeAtualizado = {
            id: document.getElementById("editId").value,
            titulo: document.getElementById("editTitulo").value.trim(),
            genero: document.getElementById("editGenero").value.trim(),
            anoLancamento: parseInt(document.getElementById("editAnoLancamento").value),
            disponivel: document.getElementById("editDisponivel").checked
        };

        try {
            const response = await fetch(`${API_URL_FILME}/${filmeAtualizado.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filmeAtualizado)
            });

            if (!response.ok) throw new Error("Erro ao atualizar filme");
            modal.style.display = "none";
            showToast("Filme atualizado com sucesso!");
            listarFilmes();

        } catch (error) {
            showToast(error.message, "error");
        }
    };

    modal.style.display = "block";

    const spanClose = modal.querySelector(".close");
    spanClose.onclick = () => modal.style.display = "none";
    window.onclick = event => { if (event.target == modal) modal.style.display = "none"; };
}

// Buscar filme por ID
document.getElementById("btnBuscarFilme").addEventListener("click", async () => {
    const id = document.getElementById("searchFilmeId").value.trim();

    if (!id) {
        showToast("Digite um ID para buscar!", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL_FILME}/${id}`);
        if (!response.ok) throw new Error("Filme não encontrado");

        const filme = await response.json();
        showToast(`Filme encontrado: ${filme.titulo}`);
        listarFilmes();

    } catch (error) {
        showToast(error.message, "error");
    }
});

// Inicializa lista de filmes ao carregar
window.onload = listarFilmes;

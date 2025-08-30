
// =================== CLIENTES ===================

const pageSize = 2;

async function listarClientes(page = 0) {
    const response = await fetch(`http://localhost:8080/clientes?page=${page}&size=${pageSize}`);
    const data = await response.json();
    
    const lista = document.getElementById("listaClientes");
    lista.innerHTML = "";

    data.content.forEach(cliente => {       
        lista.appendChild(criarCardCliente(cliente));
    });

    atualizarPaginacao(data);
}

function atualizarPaginacao(data) {
    const paginacao = document.getElementById("paginacao");
    paginacao.innerHTML = "";

    if (!data.first) {
        const prev = document.createElement("button");
        prev.textContent = "Anterior";
        prev.onclick = () => listarClientes(data.number - 1);
        paginacao.appendChild(prev);
    }

    if (!data.last) {
        const next = document.createElement("button");
        next.textContent = "Próximo";
        next.onclick = () => listarClientes(data.number + 1);
        paginacao.appendChild(next);
    }
}

function criarCardCliente(c) {
    const card = document.createElement("div");
    card.classList.add("card", "p-3", "mb-3", "shadow-sm");

    // se o cliente estiver bloqueado → card vermelho
    if (c.bloqueado) {
        card.classList.add("bloqueado");
    }

    card.innerHTML = `
        <p><strong>Nome:</strong> ${c.nome}</p>
        <p><strong>CPF:</strong> ${c.cpf}</p>
        <p><strong>Email:</strong> ${c.email}</p>
        <p><strong>Status:</strong> ${c.bloqueado ? "🚫 Bloqueado" : "✅ Ativo"}</p>
        <div class="actions">
            <button class="btnEdit">✏️ Editar</button>
            <button class="btnDelete">🗑️ Excluir</button>
        </div>
    `;

    // Botão Editar
    card.querySelector(".btnEdit").addEventListener("click", () => abrirModalCliente(c));

    // Botão Excluir
    card.querySelector(".btnDelete").addEventListener("click", async (e) => {
        if (confirm("Deseja excluir este cliente?")) {
            const btnDelete = e.target;
            btnDelete.disabled = true;
            btnDelete.textContent = "Excluindo...";

            try {
                const res = await fetch(`${API_CLIENTE}/${c.cpf}`, { method: "DELETE" });
                if (!res.ok) throw new Error("Erro ao excluir cliente");

                showToast("Cliente excluído!");
                listarClientes();
                carregarClientesFilmes();
            } catch (err) {
                showToast(err.message, "error");
                btnDelete.disabled = false;
                btnDelete.textContent = "🗑️ Excluir";
            }
        }
    });

    return card;
}


document.getElementById("formCliente").addEventListener("submit",async e=>{
    e.preventDefault();
    const cliente={
        nome:document.getElementById("clienteNome").value.trim(),
        cpf:document.getElementById("clienteCpf").value.trim(),
        email:document.getElementById("clienteEmail").value.trim()
    };
    try{
        const res=await fetch(API_CLIENTE,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(cliente)
        });
        if(!res.ok) throw new Error("Erro ao cadastrar cliente");
        showToast("Cliente cadastrado!");
        document.getElementById("formCliente").reset();
        listarClientes();
        carregarClientesFilmes();
    }catch(err){showToast(err.message,"error");}
});

// Modal Cliente
function abrirModalCliente(c){
    const modal=document.getElementById("modalEdit");
    const formEdit=document.getElementById("formEdit");
    formEdit.innerHTML=`       
        <input type="text" id="editClienteNome" value="${c.nome}" required>
        <input type="text" id="editClienteCpf" value="${c.cpf}" required>
        <input type="email" id="editClienteEmail" value="${c.email}" required>
        <button type="submit">Salvar Alterações</button>
    `;
    formEdit.onsubmit=async e=>{
        e.preventDefault();
        const atualizado={
          
            nome:document.getElementById("editClienteNome").value.trim(),
            cpf:document.getElementById("editClienteCpf").value.trim(),
            email:document.getElementById("editClienteEmail").value.trim()
        };
        try{
            const res=await fetch(`${API_CLIENTE}/${atualizado.cpf}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(atualizado)
            });
            if(!res.ok) throw new Error("Erro ao atualizar cliente");
            modal.style.display="none";
            showToast("Cliente atualizado!");
            listarClientes();
        }catch(err){showToast(err.message,"error");}
    };
    modal.style.display="block";
    modal.querySelector(".close").onclick=()=>modal.style.display="none";
    window.onclick=e=>{if(e.target==modal) modal.style.display="none";}
}

document.getElementById("btnBuscar").addEventListener("click", async () => {
    const cpf = document.getElementById("searchCpf").value.trim();
    const resultadoDiv = document.getElementById("resultadoBusca");

    if (!cpf) {
        resultadoDiv.textContent = "Digite um CPF para buscar.";
        return;
    }

    try {
        const response = await fetch(`${API_CLIENTE}/${cpf}`);
        if (!response.ok) throw new Error("Cliente não encontrado");

        const cliente = await response.json();
        const lista = document.getElementById("listaClientes");
        lista.innerHTML = "";
        lista.appendChild(criarCardCliente(cliente));
        atualizarPaginacao(cliente)
    } catch (error) {
        resultadoDiv.textContent = "Cliente não encontrado ou erro na busca.";
    }
});
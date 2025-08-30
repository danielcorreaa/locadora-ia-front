// URLs das APIs
const API_CLIENTE = "http://localhost:8080/clientes";
const API_FILME = "http://localhost:8080/filmes";
const API_LOCACAO = "http://localhost:8080/locacoes";

// === Função Toast ===
function showToast(message, type="success") {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;
    document.getElementById("toastContainer").appendChild(toast);
    setTimeout(()=>toast.remove(), 3500);
}

// === Menu SPA ===
document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".section").forEach(s => s.style.display="none");
        document.querySelectorAll(".menu-btn").forEach(b=>b.classList.remove("active"));

        const sectionId = btn.dataset.section;
        document.getElementById(sectionId).style.display = "block";
        btn.classList.add("active");
    });
});

// =================== CLIENTES ===================

// Cadastro cliente
document.getElementById("formCliente").addEventListener("submit", async (e)=>{
    e.preventDefault();
    const cliente = {
        id: document.getElementById("clienteId").value.trim(),
        nome: document.getElementById("clienteNome").value.trim(),
        cpf: document.getElementById("clienteCpf").value.trim(),
        email: document.getElementById("clienteEmail").value.trim()
    };
    try{
        const res = await fetch(API_CLIENTE,{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(cliente)
        });
        if(!res.ok) throw new Error("Erro ao cadastrar cliente");
        showToast("Cliente cadastrado com sucesso!");
        document.getElementById("formCliente").reset();
        listarClientes();
    } catch(err){ showToast(err.message,"error"); }
});

// Criar card cliente
function criarCardCliente(c){
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <p><strong>ID:</strong> ${c.id}</p>
        <p><strong>Nome:</strong> ${c.nome}</p>
        <p><strong>CPF:</strong> ${c.cpf}</p>
        <p><strong>Email:</strong> ${c.email}</p>
        <button class="btnEdit">Editar</button>
        <button class="btnDelete">Excluir</button>
    `;
    card.querySelector(".btnEdit").addEventListener("click",()=>abrirModalCliente(c));
    card.querySelector(".btnDelete").addEventListener("click", async ()=>{
        if(confirm("Deseja excluir este cliente?")){
            const res = await fetch(`${API_CLIENTE}/${c.id}`,{method:"DELETE"});
            if(!res.ok) return showToast("Erro ao excluir","error");
            showToast("Cliente excluído!");
            listarClientes();
            carregarClientesFilmes();
        }
    });
    return card;
}

// Listar clientes
async function listarClientes(){
    const container = document.getElementById("listaClientes");
    container.innerHTML="";
    try{
        const clientes = await (await fetch(API_CLIENTE)).json();
        clientes.forEach(c=>container.appendChild(criarCardCliente(c)));
    }catch{ showToast("Erro ao listar clientes","error"); }
}

// Modal edição cliente
function abrirModalCliente(c){
    const modal = document.getElementById("modalEdit");
    const formEdit = document.getElementById("formEdit");
    formEdit.innerHTML=`
        <input type="hidden" id="editClienteId" value="${c.id}">
        <input type="text" id="editClienteNome" value="${c.nome}" required>
        <input type="text" id="editClienteCpf" value="${c.cpf}" required>
        <input type="email" id="editClienteEmail" value="${c.email}" required>
        <button type="submit">Salvar Alterações</button>
    `;
    formEdit.onsubmit=async e=>{
        e.preventDefault();
        const atualizado = {
            id: document.getElementById("editClienteId").value,
            nome: document.getElementById("editClienteNome").value.trim(),
            cpf: document.getElementById("editClienteCpf").value.trim(),
            email: document.getElementById("editClienteEmail").value.trim()
        };
        try{
            const res = await fetch(`${API_CLIENTE}/${atualizado.id}`,{
                method:"PUT",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(atualizado)
            });
            if(!res.ok) throw new Error("Erro ao atualizar cliente");
            modal.style.display="none";
            showToast("Cliente atualizado!");
            listarClientes();
            carregarClientesFilmes();
        }catch(err){ showToast(err.message,"error"); }
    };
    modal.style.display="block";
    modal.querySelector(".close").onclick=()=>modal.style.display="none";
    window.onclick = e=>{ if(e.target==modal) modal.style.display="none"; };
}

// =================== FILMES ===================

// Cadastro filme
document.getElementById("formFilme").addEventListener("submit", async e=>{
    e.preventDefault();
    const filme = {
        id: document.getElementById("filmeId").value.trim(),
        titulo: document.getElementById("filmeTitulo").value.trim(),
        genero: document.getElementById("filmeGenero").value.trim(),
        anoLancamento: parseInt(document.getElementById("filmeAno").value),
        disponivel: document.getElementById("filmeDisponivel").checked
    };
    try{
        const res = await fetch(API_FILME,{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(filme)
        });
        if(!res.ok) throw new Error("Erro ao cadastrar filme");
        showToast("Filme cadastrado!");
        document.getElementById("formFilme").reset();
        listarFilmes();
        carregarClientesFilmes();
    }catch(err){ showToast(err.message,"error"); }
});

// Criar card filme
function criarCardFilme(f){
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML=`
        <p><strong>ID:</strong> ${f.id}</p>
        <p><strong>Título:</strong> ${f.titulo}</p>
        <p><strong>Gênero:</strong> ${f.genero}</p>
        <p><strong>Ano:</strong> ${f.anoLancamento}</p>
        <p><strong>Disponível:</strong> ${f.disponivel ? 'Sim':'Não'}</p>
        <button class="btnEdit">Editar</button>
        <button class="btnDelete">Excluir</button>
    `;
    card.querySelector(".btnEdit").addEventListener("click",()=>abrirModalFilme(f));
    card.querySelector(".btnDelete").addEventListener("click", async ()=>{
        if(confirm("Deseja excluir este filme?")){
            const res = await fetch(`${API_FILME}/${f.id}`,{method:"DELETE"});
            if(!res.ok) return showToast("Erro ao excluir","error");
            showToast("Filme excluído!");
            listarFilmes();
            carregarClientesFilmes();
        }
    });
    return card;
}

// Listar filmes
async function listarFilmes(){
    const container = document.getElementById("listaFilmes");
    container.innerHTML="";
    try{
        const filmes = await (await fetch(API_FILME)).json();
        filmes.forEach(f=>container.appendChild(criarCardFilme(f)));
    }catch{ showToast("Erro ao listar filmes","error"); }
}

// Modal edição filme
function abrirModalFilme(f){
    const modal = document.getElementById("modalEdit");
    const formEdit = document.getElementById("formEdit");
    formEdit.innerHTML=`
        <input type="hidden" id="editFilmeId" value="${f.id}">
        <input type="text" id="editFilmeTitulo" value="${f.titulo}" required>
        <input type="text" id="editFilmeGenero" value="${f.genero}" required>
        <input type="number" id="editFilmeAno" value="${f.anoLancamento}" required>
        <label>
            <input type="checkbox" id="editFilmeDisponivel" ${f.disponivel ? 'checked':''}> Disponível
        </label>
        <button type="submit">Salvar Alterações</button>
    `;
    formEdit.onsubmit=async e=>{
        e.preventDefault();
        const atualizado = {
            id: document.getElementById("editFilmeId").value,
            titulo: document.getElementById("editFilmeTitulo").value.trim(),
            genero: document.getElementById("editFilmeGenero").value.trim(),
            anoLancamento: parseInt(document.getElementById("editFilmeAno").value),
            disponivel: document.getElementById("editFilmeDisponivel").checked
        };
        try{
            const res = await fetch(`${API_FILME}/${atualizado.id}`,{
                method:"PUT",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(atualizado)
            });
            if(!res.ok) throw new Error("Erro ao atualizar filme");
            modal.style.display="none";
            showToast("Filme atualizado!");
            listarFilmes();
            carregarClientesFilmes();
        }catch(err){ showToast(err.message,"error"); }
    };
    modal.style.display="block";
    modal.querySelector(".close").onclick=()=>modal.style.display="none";
    window.onclick = e=>{ if(e.target==modal) modal.style.display="none"; };
}

// =================== LOCAÇÕES ===================

async function carregarClientesFilmes(){
    try{
        const clientes = await (await fetch(API_CLIENTE)).json();
        const filmes = await (await fetch(API_FILME)).json();

        const selectCliente = document.getElementById("selectCliente");
        const selectFilme = document.getElementById("selectFilme");
        if(selectCliente) { selectCliente.innerHTML=""; clientes.forEach(c=>{
            const opt = document.createElement("option");
            opt.value=c.id;
            opt.textContent=`${c.nome} (${c.cpf})`;
            selectCliente.appendChild(opt);
        });}
        if(selectFilme){ selectFilme.innerHTML=""; filmes.forEach(f=>{
            if(f.disponivel){
                const opt = document.createElement("option");
                opt.value=f.id;
                opt.textContent=`${f.titulo} (${f.genero})`;
                selectFilme.appendChild(opt);
            }
        });}
    }catch{ showToast("Erro ao carregar clientes/filmes","error"); }
}

// Cadastro locação
document.getElementById("formLocacao").addEventListener("submit", async e=>{
    e.preventDefault();
    const locacao = {
        clienteId: document.getElementById("selectCliente").value,
        filmeId: document.getElementById("selectFilme").value,
        dataLocacao: document.getElementById("dataLocacao").value,
        dataDevolucao: document.getElementById("dataDevolucao").value
    };
    try{
        const res = await fetch(API_LOCACAO,{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(locacao)
        });
        if(!res.ok) throw new Error("Erro ao cadastrar locação");
        showToast("Locação cadastrada!");
        document.getElementById("formLocacao").reset();
        listarLocacoes();
        carregarClientesFilmes();
    }catch(err){ showToast(err.message,"error"); }
});

// Criar card locação
function criarCardLocacao(l){
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML=`
        <p><strong>ID:</strong> ${l.id}</p>
        <p><strong>Cliente:</strong> ${l.cliente.nome}</p>
        <p><strong>Filme:</strong> ${l.filme.titulo}</p>
        <p><strong>Data Locação:</strong> ${l.dataLocacao}</p>
        <p><strong>Data Devolução:</strong> ${l.dataDevolucao}</p>
        <p><strong>Situação:</strong> ${l.finalizada}</p>

        <button class="btnEdit">Editar</button>
        <button class="btnDelete">Excluir</button>
    `;
    card.querySelector(".btnDelete").addEventListener("click", async ()=>{
        if(confirm("Deseja excluir esta locação?")){
            const res = await fetch(`${API_LOCACAO}/${l.id}`,{method:"DELETE"});
            if(!res.ok) return showToast("Erro ao excluir locação","error");
            showToast("Locação excluída!");
            listarLocacoes();
            carregarClientesFilmes();
        }
    });
    card.querySelector(".btnEdit").addEventListener("click",()=>abrirModalLocacao(l));
    return card;
}

// Listar locações
async function listarLocacoes(){
    const container = document.getElementById("listaLocacoes");
    container.innerHTML="";
    try{
        const locacoes = await (await fetch(API_LOCACAO)).json();
        locacoes.forEach(l=>container.appendChild(criarCardLocacao(l)));
    }catch{ showToast("Erro ao listar locações","error"); }
}

// Modal edição locação
function abrirModalLocacao(l){
    const modal = document.getElementById("modalEdit");
    const formEdit = document.getElementById("formEdit");
    formEdit.innerHTML=`
        <label>Cliente:</label>
        <select id="editCliente" required></select>
        <label>Filme:</label>
        <select id="editFilme" required></select>
        <label>Data Locação:</label>
        <input type="date" id="editDataLocacao" value="${l.dataLocacao}" required>
        <label>Data Devolução:</label>
        <input type="date" id="editDataDevolucao" value="${l.dataDevolucao}" required>
        <button type="submit">Salvar Alterações</button>
    `;
    async function preencher(){
        try{
            const clientes = await (await fetch(API_CLIENTE)).json();
            const filmes = await (await fetch(API_FILME)).json();

            const selectC = document.getElementById("editCliente");
            clientes.forEach(c=>{
                const opt = document.createElement("option");
                opt.value=c.id; opt.textContent=`${c.nome} (${c.cpf})`;
                if(c.id===l.clienteId) opt.selected=true;
                selectC.appendChild(opt);
            });

            const selectF = document.getElementById("editFilme");
            filmes.forEach(f=>{
                if(f.disponivel || f.id===l.filmeId){
                    const opt = document.createElement("option");
                    opt.value=f.id; opt.textContent=`${f.titulo} (${f.genero})`;
                    if(f.id===l.filmeId) opt.selected=true;
                    selectF.appendChild(opt);
                }
            });
        }catch{ showToast("Erro ao carregar clientes/filmes","error"); }
    }
    preencher();

    formEdit.onsubmit=async e=>{
        e.preventDefault();
        const atualizado = {
            clienteId: document.getElementById("editCliente").value,
            filmeId: document.getElementById("editFilme").value,
            dataLocacao: document.getElementById("editDataLocacao").value,
            dataDevolucao: document.getElementById("editDataDevolucao").value
        };
        try{
            const res = await fetch(`${API_LOCACAO}/${l.id}`,{
                method:"PUT",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(atualizado)
            });
            if(!res.ok) throw new Error("Erro ao atualizar locação");
            modal.style.display="none";
            showToast("Locação atualizada!");
            listarLocacoes();
            carregarClientesFilmes();
        }catch(err){ showToast(err.message,"error"); }
    };

    modal.style.display="block";
    modal.querySelector(".close").onclick=()=>modal.style.display="none";
    window.onclick = e=>{ if(e.target==modal) modal.style.display="none"; };
}

// === Inicialização ===
window.onload = ()=>{
    listarClientes();
    listarFilmes();
    listarLocacoes();
    carregarClientesFilmes();
};

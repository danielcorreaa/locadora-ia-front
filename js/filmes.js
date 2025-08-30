
// =================== FILMES ===================

const pageSizeFilme = 2;
async function listarFilmes(page = 0){
    const container=document.getElementById("listaFilmes");
    container.innerHTML="";
    showLoader()
    try{
        const response = await fetch(`${API_FILME}?page=${page}&size=${pageSizeFilme}`);
        const filmes = await response.json();

        filmes.content.forEach(f=>container.appendChild(criarCardFilme(f)));
        atualizarPaginacaoFilmes(filmes);
    }catch{showToast("Erro ao listar filmes","error");}
    finally{hideLoader()}    
}

function atualizarPaginacaoFilmes(data) {
    const paginacaoFilme = document.getElementById("paginacaoFilme");
    paginacaoFilme.innerHTML = "";

    if (!data.first) {
        const prev = document.createElement("button");
        prev.textContent = "Anterior";
        prev.onclick = () => listarFilmes(data.number - 1);
        paginacaoFilme.appendChild(prev);
    }

    if (!data.last) {
        const next = document.createElement("button");
        next.textContent = "Próximo";
        next.onclick = () => listarFilmes(data.number + 1);
        paginacaoFilme.appendChild(next);
    }
}

function criarCardFilme(f) {
    const card = document.createElement("div");
    card.classList.add("card", "p-3", "mb-3", "shadow-sm");

    // Se o filme não estiver disponível → card vermelho
    if (!f.disponivel) {
        card.classList.add("indisponivel");
    }

    card.innerHTML = `
        <p><strong>ID:</strong> ${f.id}</p>
        <p><strong>Título:</strong> ${f.titulo}</p>
        <p><strong>Gênero:</strong> ${f.genero}</p>
        <p><strong>Ano:</strong> ${f.anoLancamento}</p>
        <p><strong>Disponível:</strong> ${f.disponivel ? "✅ Sim" : "❌ Não"}</p>
        <div class="actions">
            <button class="btnEdit">✏️ Editar</button>
            <button class="btnDelete">🗑️ Excluir</button>
        </div>
    `;

    // Botão Editar
    card.querySelector(".btnEdit").addEventListener("click", () => abrirModalFilme(f));

    // Botão Excluir
    card.querySelector(".btnDelete").addEventListener("click", async (e) => {
        if (confirm("Deseja excluir este filme?")) {
             const btnDelete = e.target;
             btnDelete.disabled = true;
             btnDelete.textContent = "Excluindo...";

            try{
                const res = await fetch(`${API_FILME}/${f.id}`, { method: "DELETE" });
            if (!res.ok) return showToast("Erro ao excluir", "error");
                showToast("Filme excluído!");
                listarFilmes();
            } catch (err) {
                showToast(err.message, "error");
                btnDelete.disabled = false;
                btnDelete.textContent = "🗑️ Excluir";
            } finally{
                hideLoader();
            }
        }
    });

    return card;
}


document.getElementById("formFilme").addEventListener("submit",async e=>{
    e.preventDefault();
    const filme={
        id:document.getElementById("filmeId").value.trim(),
        titulo:document.getElementById("filmeTitulo").value.trim(),
        genero:document.getElementById("filmeGenero").value.trim(),
        anoLancamento:parseInt(document.getElementById("filmeAno").value),
        disponivel:document.getElementById("filmeDisponivel").checked
    };
    try{
        const res=await fetch(API_FILME,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(filme)
        });
        if(!res.ok) throw new Error("Erro ao cadastrar filme");
        showToast("Filme cadastrado!");
        document.getElementById("formFilme").reset();
        listarFilmes();
    }catch(err){showToast(err.message,"error");}
});


// Modal Filme
function abrirModalFilme(f){
    const modal=document.getElementById("modalEdit");
    const formEdit=document.getElementById("formEdit");
    formEdit.innerHTML=`
        <input type="hidden" id="editFilmeId" value="${f.id}">
        <input type="text" id="editFilmeTitulo" value="${f.titulo}" required>
        <input type="text" id="editFilmeGenero" value="${f.genero}" required>
        <input type="number" id="editFilmeAno" value="${f.anoLancamento}" required>
        <label><input type="checkbox" id="editFilmeDisponivel" ${f.disponivel?'checked':''}> Disponível</label>
        <button type="submit">Salvar Alterações</button>
    `;
    formEdit.onsubmit=async e=>{
        e.preventDefault();
        const atualizado={
            id:document.getElementById("editFilmeId").value,
            titulo:document.getElementById("editFilmeTitulo").value.trim(),
            genero:document.getElementById("editFilmeGenero").value.trim(),
            anoLancamento:parseInt(document.getElementById("editFilmeAno").value),
            disponivel:document.getElementById("editFilmeDisponivel").checked
        };
        try{
            const res=await fetch(`${API_FILME}/${atualizado.id}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(atualizado)
            });
            if(!res.ok) throw new Error("Erro ao atualizar filme");
            modal.style.display="none";
            showToast("Filme atualizado!");
            listarFilmes();
            carregarClientesFilmes();
        }catch(err){showToast(err.message,"error");}
    };
    modal.style.display="block";
    modal.querySelector(".close").onclick=()=>modal.style.display="none";
    window.onclick=e=>{if(e.target==modal) modal.style.display="none";}
}

document.getElementById("btnBuscarFilme").addEventListener("click", async () => {
    const id = document.getElementById("searchId").value.trim();

    if (!id) {
        showToast("Digite um código para buscar.");
        return;
    }
    showLoader();
    try {
        const response = await fetch(`${API_FILME}/${id}`);
        if (!response.ok) throw new Error("Filme não encontrado");

        const filmes = await response.json();
        const container = document.getElementById("listaFilmes");
        container.innerHTML = "";
        filmes.content.forEach(f=>container.appendChild(criarCardFilme(f)));
        atualizarPaginacao(filmes)
    } catch (error) {
        showToast( "Filme não encontrado ou erro na busca.");
    } finally{hideLoader()}
});
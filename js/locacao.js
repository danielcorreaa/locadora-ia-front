// =================== Locações ===================



// CRUD Locação
async function listarLocacoes(locacoes = []){
    const container=document.getElementById("listaLocacoes");
    container.innerHTML="";
    try{
        if(locacoes.length === 0){
          console.log(locacoes)
          locacoes=await(await fetch(API_LOCACAO)).json();
          console.log(locacoes)
        }
        locacoes.content.forEach(l=>{
            const card=document.createElement("div");
            card.classList.add("card");
            card.innerHTML=`
                <p><strong>ID:</strong> ${l.id}</p>
                <p><strong>Cliente:</strong> ${l.cliente.nome}</p>
                <p><strong>Filme:</strong> ${l.filme.titulo}</p>
                <p><strong>Data Locação:</strong> ${l.dataLocacao}</p>
                <p><strong>Data Prec Devolução:</strong> ${l.dataPrevDevolucao}</p>
                <button class="btnEdit">Editar</button>
                <button class="btnDelete">Excluir</button>
            `;
            card.querySelector(".btnDelete").addEventListener("click",async()=>{
                if(confirm("Deseja excluir esta locação?")){
                    const res=await fetch(`${API_LOCACAO}/${l.id}`,{method:"DELETE"});
                    if(!res.ok) return showToast("Erro ao excluir","error");
                    showToast("Locação excluída!");
                    listarLocacoes();
                }
            });
            card.querySelector(".btnEdit").addEventListener("click",()=>abrirModalLocacao(l));
            container.appendChild(card);
        });
    }catch{showToast("Erro ao listar locações","error");}
}

// Cadastro de locação
document.getElementById("formLocacao")?.addEventListener("submit",async e=>{
    e.preventDefault();
    const locacao={
        clienteId:document.getElementById("clienteCpf").value,
        filmeId:getFilmesSelecionadosIds(),
        dataLocacao:document.getElementById("dataLocacao").value,
        dataPrevDevolucao:document.getElementById("dataDevolucao").value
    
    };
    try{
        const res=await fetch(API_LOCACAO,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(locacao)
        });

        if(!res.ok) 
          throw new Error("Erro ao cadastrar locação");

        showToast("Locação cadastrada!");
        document.getElementById("formLocacao").reset();    
    }catch(err){showToast(err.message,"error");}
});

// Modal Locação
function abrirModalLocacao(l){
    const modal=document.getElementById("modalEdit");
    const formEdit=document.getElementById("formEdit");
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
            const clientes=await(await fetch(API_CLIENTE)).json();
            const filmes=await(await fetch(API_FILME)).json();
            const selectC=document.getElementById("editCliente");
            clientes.forEach(c=>{
                const opt=document.createElement("option");
                opt.value=c.id; opt.textContent=`${c.nome} (${c.cpf})`;
                if(c.id===l.clienteId) opt.selected=true;
                selectC.appendChild(opt);
            });
            const selectF=document.getElementById("editFilme");
            filmes.forEach(f=>{
                if(f.disponivel || f.id===l.filmeId){
                    const opt=document.createElement("option");
                    opt.value=f.id; opt.textContent=`${f.titulo} (${f.genero})`;
                    if(f.id===l.filmeId) opt.selected=true;
                    selectF.appendChild(opt);
                }
            });
        }catch{showToast("Erro ao carregar clientes/filmes","error");}
    }
    preencher();

    formEdit.onsubmit=async e=>{
        e.preventDefault();
        const atualizado={
            clienteId:document.getElementById("editCliente").value,
            filmeId:document.getElementById("editFilme").value,
            dataLocacao:document.getElementById("editDataLocacao").value,
            dataDevolucao:document.getElementById("editDataDevolucao").value
        };
        try{
            const res=await fetch(`${API_LOCACAO}/${l.id}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(atualizado)
            });
            if(!res.ok) throw new Error("Erro ao atualizar locação");
            modal.style.display="none";
            showToast("Locação atualizada!");
            listarLocacoes();
            carregarClientesFilmes();
        }catch(err){showToast(err.message,"error");}
    };

    modal.style.display="block";
    modal.querySelector(".close").onclick=()=>modal.style.display="none";
    window.onclick=e=>{if(e.target==modal) modal.style.display="none";}
}

// Cliente
document.getElementById("btnSelecionarCliente").addEventListener("click", () => {
  document.getElementById("modalCliente").style.display = "block";
});

document.getElementById("btnFecharCliente").addEventListener("click", () => {
  document.getElementById("modalCliente").style.display = "none";
});

document.getElementById("btnBuscarCliente").addEventListener("click", async () => {
  const cpf = document.getElementById("cpfBusca").value;
  const res = await fetch(`${API_CLIENTE}/${cpf}`);
  if(res.ok){
    const cliente = await res.json();
    document.getElementById("resultadoCliente").innerHTML = `
      <p><strong>${cliente.nome}</strong> - ${cliente.cpf}</p>
      <button onclick="selecionarCliente('${cliente.cpf}','${cliente.nome}')">Selecionar</button>
    `;
  } else {
    document.getElementById("resultadoCliente").innerHTML = `<p style="color:red">Cliente não encontrado</p>`;
  }
});

function selecionarCliente(cpf,nome){
  document.getElementById("inputCliente").value = nome;
  document.getElementById("clienteCpf").value = cpf;
  document.getElementById("modalCliente").style.display = "none";
}

// Abrir e fechar modal
function abrirModalFilmes(){
  document.getElementById("modalFilmes").classList.add("show");
  document.body.classList.add("modal-open");
}

function fecharModalFilmes(){
  document.getElementById("modalFilmes").classList.remove("show");
  document.body.classList.remove("modal-open");
  document.getElementById("resultadoFilmes").innerHTML = "";
  document.getElementById("inputBuscarFilme").value = "";
}


// Abrir e fechar modal
function abrirModalFilmes(){
  document.getElementById("modalFilmes").classList.add("show");
  document.body.classList.add("modal-open");
}

function fecharModalFilmes(){
  document.getElementById("modalFilmes").classList.remove("show");
  document.body.classList.remove("modal-open");
  document.getElementById("resultadoFilmes").innerHTML = "";
  document.getElementById("inputBuscarFilme").value = "";
}
let filmesSelecionados = [];
let filmes = [];

// Buscar filme por ID
// buscar filme na API
async function buscarFilmes() {
  const id = document.getElementById("inputBuscarFilme").value.trim();
  if (!id) return showToast("Digite um id para buscar", "error");
  console.log(id)
  try {
    const res = await fetch(`${API_FILME}/${id}?disponivel=true`);
   
    if (!res.ok) throw new Error("Erro na busca de filmes");
      const resJson = await res.json();
      const filme = resJson.content[0]
      const container = document.getElementById("resultadoFilmes");
      container.innerHTML = "";

    if (!filme || !filme.id) {
      container.innerHTML = "<p>Nenhum filme encontrado.</p>";
      return;
    }

    // Renderiza apenas o último resultado
    const div = document.createElement("div");
    div.classList.add("resultado-item");
    div.innerHTML = `
      <p><strong>${filme.titulo}</strong> (${filme.anoLancamento}) - ${filme.genero}</p>
      <button type="button">Selecionar</button>
    `;
    div.querySelector("button").addEventListener("click", () => selecionarFilme(filme));
    container.appendChild(div);

  } catch (err) {
    showToast(err.message, "error");
  }
}

// abrir e fechar modal
function abrirModalFilme() {
  document.getElementById("modalFilme").style.display = "block";
}
function fecharModalFilme() {
  document.getElementById("modalFilme").style.display = "none";
}




// adicionar filme selecionado
function selecionarFilme(filme) {
    console.log(filme)
  // impedir duplicados
  if (filmesSelecionados.some(f => f.id === filme.id)) {
    showToast("Esse filme já foi selecionado!","warning");
    return;
  }

  filmesSelecionados.push(filme);
  atualizarListaFilmesSelecionados();
  fecharModalFilme();
}

// atualizar lista na tela
function atualizarListaFilmesSelecionados() {
  const container = document.getElementById("filmesSelecionadosContainer");
  container.innerHTML = "";

  filmesSelecionados.forEach(f => {
    const item = document.createElement("div");
    item.classList.add("filme-item");
    item.innerHTML = `
      <span>${f.titulo} (${f.anoLancamento})</span>
      <button type="button" onclick="removerFilme('${f.id}')">Remover</button>
    `;
    container.appendChild(item);
  });
}

// remover filme da lista
function removerFilme(id) {
  filmesSelecionados = filmesSelecionados.filter(f => f.id !== id);
  atualizarListaFilmesSelecionados();
}




// Obter IDs dos filmes antes de salvar a locação
function getFilmesSelecionadosIds(){
  return filmesSelecionados.map(f => f.id);
}

document.getElementById("btnBuscarLocacao").addEventListener("click", async () => {
    const cpf = document.getElementById("searchLocacao").value.trim();

    if (!cpf) {
        resultadoDiv.textContent = "Digite um CPF para buscar.";
        return;
    }

    try {
        const response = await fetch(`${API_LOCACAO}?cpfCliente=${cpf}`);
        if (!response.ok) throw new Error("Cliente não encontrado");

        const locacoes = await response.json();
        listarLocacoes(locacoes)
    } catch (error) {
        resultadoDiv.textContent = "Locação não encontrado para o cliente informado, ou erro na busca.";
    }
});

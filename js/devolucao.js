// =================== Finalizar Locação ===================

document.getElementById("formFinalizarLocacao")?.addEventListener("submit", async e => {
    e.preventDefault();

    const locacaoRequest ={
        locacaoId:document.getElementById("locacaoIdFinalizar").value,
        dataDevolucao:document.getElementById("dataDevolucaoFinal").value
    };
    
    try {
        // chamada para o endpoint devolução
        const res = await fetch(`${API_LOCACAO}/devolver`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(locacaoRequest)
           
        });

        if (!res.ok) throw new Error("Erro ao devolver locação");

        // fechar modal
        document.getElementById("modalFinalizar").style.display = "none";

        showToast("Locação finalizada!");

        buscarDevolucoes();
    
    } catch (err) {
        showToast(err.message, "error");
    }
});

document.addEventListener("click", e => {
    if (e.target.classList.contains("btnFinalizar")) {
        const id = e.target.getAttribute("data-id");
        document.getElementById("locacaoIdFinalizar").value = id;
        document.getElementById("modalFinalizar").style.display = "flex"; // abre modal
    }
});

async function buscarDevolucoes(){
    const cpf = document.getElementById("searchDevolucao").value.trim();

    if (!cpf) {
        resultadoDiv.textContent = "Digite um CPF para buscar.";
        return;
    }

    try {
        const response = await fetch(`${API_LOCACAO}?finalizado=false&cpfCliente=${cpf}`);
        if (!response.ok) throw new Error("Cliente não encontrado");

        const locacoes = await response.json();
        listarLocacoesParaFinalizar(locacoes)
    } catch (error) {
        resultadoDiv.textContent = "Locação não encontrado para o cliente informado, ou erro na busca.";
    }
}



async function listarLocacoesParaFinalizar(locacoes = []){
    const container=document.getElementById("listaLocacoesAtivas");
    container.innerHTML="";
    try{
       
        locacoes.content.forEach(l=>{
            const card=document.createElement("div");
            card.classList.add("card");
            card.innerHTML=`
                <p><strong>ID:</strong> ${l.id}</p>
                <p><strong>Cliente:</strong> ${l.cliente.nome}</p>
                <p><strong>Filme:</strong> ${l.filme.titulo}</p>
                <p><strong>Data Locação:</strong> ${l.dataLocacao}</p>
                <p><strong>Data Prec Devolução:</strong> ${l.dataPrevDevolucao}</p>
                <button class="btnFinalizar"  data-id=${l.id}>Finalizar</button>
            `;
            container.appendChild(card);
          

        });
    }catch{showToast("Erro ao listar locações","error");}
}
// botão fechar modal
document.getElementById("closeModalFinalizar")?.addEventListener("click", () => {
  document.getElementById("modalFinalizar").style.display = "none";
});

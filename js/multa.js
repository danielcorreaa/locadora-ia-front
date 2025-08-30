const searchInput = document.getElementById("searchMulta");
const btnBuscar = document.getElementById("btnBuscarMulta");

const multasSection = document.getElementById("multas");

// Função para renderizar lista de multas e total
const criarListaMultas = (multas) => {
    // remove lista antiga
    let listaExistente = document.getElementById("listaMultas");
    if (listaExistente) listaExistente.remove();

    let container = document.createElement("div");
    container.id = "listaMultas";

    let total = 0;

    if (multas.length === 0) {
        container.innerHTML = "<p>Cliente não possui multas.</p>";
    } else {
        multas.forEach(m => {
            total += m.valor;
            const card = document.createElement("div");
            card.classList.add("card");
            card.style.border = "1px solid #ccc";
            card.style.borderRadius = "8px";
            card.style.padding = "12px";
            card.style.marginBottom = "8px";

            card.innerHTML = `
                <p><strong>ID Multa:</strong> ${m.id}</p>
                <p><strong>ID Locação:</strong> ${m.locacaoId}</p>
                <p><strong>Valor:</strong> R$ ${m.valor.toFixed(2)}</p>
                <p><strong>Paga:</strong> ${m.paga ? "Sim" : "Não"}</p>
                <p><strong>Data de Geração:</strong> ${m.dataGeracao}</p>
            `;

            // botão "Marcar como paga" apenas se não estiver paga
            if (!m.paga) {
                const btnPagar = document.createElement("button");
                btnPagar.textContent = "Marcar como paga";
                btnPagar.style.marginTop = "8px";
                btnPagar.addEventListener("click", async () => {
                    try {
                        const res = await fetch(`${API_MULTA}/${m.id}/pagar`, {
                            method: "PUT"
                        });
                        if (!res.ok) throw new Error("Erro ao marcar multa como paga");
                        alert("Multa marcada como paga!");
                        // atualizar lista após pagamento
                        btnBuscar.click();
                    } catch (err) {
                        alert(err.message);
                    }
                });
                card.appendChild(btnPagar);
            }

            container.appendChild(card);
        });

        // total das multas
        const totalDiv = document.createElement("div");
        totalDiv.style.marginTop = "12px";
        totalDiv.style.fontWeight = "bold";
        const totalNaoPago = multas.filter(m => !m.paga).reduce((acc, m) => acc + m.valor, 0);
        totalDiv.textContent = `Total das multas não pagas: R$ ${totalNaoPago.toFixed(2)}`;
        container.appendChild(totalDiv);
    }

    multasSection.appendChild(container);
}

// evento de busca
btnBuscar.addEventListener("click", async () => {
    const cpf = searchInput.value.trim();
    if (!cpf) {
        alert("Digite o CPF do cliente!");
        return;
    }

    try {
        // busca o cliente pelo CPF
        const resCliente = await fetch(`${API_CLIENTE}/${cpf}`);
        if (!resCliente.ok) throw new Error("Cliente não encontrado");
        const cliente = await resCliente.json();
        console.log(cliente)
        // busca multas do cliente
        const resMultas = await fetch(`${API_MULTA}/cliente/${cliente.cpf}`);
        if (!resMultas.ok) throw new Error("Erro ao buscar multas");
        const multas = await resMultas.json();
        console.log(multas)
        criarListaMultas(multas);

    } catch (err) {
        alert(err.message);
        criarListaMultas([]); // limpa lista
    }
});

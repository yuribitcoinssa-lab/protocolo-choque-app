/**
 * Lógica do Protocolo de Manejo do Choque - VERSÃO CORRIGIDA (RIGOROSA)
 */

// =========================================================================
// 1. QUADRO DE REFERÊNCIA (VISÍVEL EM TODAS AS ETAPAS)
// =========================================================================

const criteriosMelhoraHTML = `
    <div style="background-color: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 6px; margin-bottom: 20px; font-size: 0.9em; color: #856404;">
        <h4 style="margin-top: 0; margin-bottom: 10px; border-bottom: 1px solid #f5c6cb; padding-bottom: 5px;">📋 Parâmetros de Melhora / Resposta</h4>
        <ul style="padding-left: 20px; margin-bottom: 0; line-height: 1.4;">
            <li><strong>Clínica:</strong> Melhora dos critérios diagnósticos do Item 1 (Status Mental, TEC, Diurese, Mottling, SI, etc).</li>
            <li><strong>Débito Cardíaco:</strong> Aumento de VTI (>10-15%) ou DC.</li>
            <li><strong>SvcO2:</strong> Alvo 65-75% OU aumento ≥ 5%.</li>
            <li><strong>GapCO2:</strong> Redução ≥ 2 pontos (Alvo < 6.0 mmHg).</li>
            <li><strong>Lactato:</strong> Redução 30% em 4h ou < 2.0 mmol/L.</li>
            <li><strong>PVC:</strong> Redução para < 10 mmHg ou VCI < 2.0 cm.</li>
            <li><strong>ECOTT:</strong> Redução de linhas B pulmonares.</li>
            <li><strong>Gradiente Resp.:</strong> Redução da razão GapCO2 / (CaO2-CvO2).</li>
        </ul>
    </div>
`;

const footerCitationHTML = `
    <div style="text-align: center; font-size: 0.75em; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px;">
        <p>Referência: Monnet X et al. ESICM guidelines on circulatory shock and hemodynamic monitoring 2025.</p>
    </div>
`;

// Função utilitária para gerar o botão Voltar com segurança
function gerarBotaoVoltar(funcaoDestino) {
    return `<button style="background-color: #6c757d;" onclick="${funcaoDestino}">⬅️ Voltar</button>`;
}

const metasButtonHTML = (targetFunction) => 
    `<button onclick="${targetFunction}" style="background-color: #00a000;">Metas Hemodinâmicas</button>`;

function voltarParaPasso1() {
    window.location.reload(); 
}

// =========================================================================
// METAS (TELA INFORMATIVA)
// =========================================================================

function exibirMetasHemodinamicas() {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = `
        <div id="metas-finais" class="passo">
            <h2>🎯 Metas Hemodinâmicas e Monitorização</h2>
            <hr>
            <h3>1. Pressão Arterial Média (PAM)</h3>
            <ul style="padding-left: 20px;">
                <li>**Choque Séptico:** 65–70 mmHg. Individualizar em hipertensos.</li>
                <li>**Choque Cardiogênico:** ≥ 65 mmHg.</li>
                <li>**Hemorrágico:** 50–60 mmHg (até hemostasia).</li>
            </ul>
            <h3>2. Perfusão e Metabolismo</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr style="background-color: #f0f0f0;"><th>Parâmetro</th><th>Meta</th></tr>
                <tr><td>Lactato</td><td>< 2.0 mmol/L</td></tr>
                <tr><td>TEC</td><td>< 3 segundos</td></tr>
                <tr><td>SvcO₂</td><td>65% a 75%</td></tr>
                <tr><td>GapCO₂</td><td>≤ 6.0 mmHg</td></tr>
                <tr><td>PVC</td><td>< 10 mmHg (monitorar tendência)</td></tr>
                <tr><td>Diurese</td><td>≥ 0.5 mL/kg/h</td></tr>
            </table>
            <hr>
            ${gerarBotaoVoltar('window.location.reload()')}
            ${footerCitationHTML}
        </div>
    `;
}

// =========================================================================
// PASSO 1: AVALIAÇÃO INICIAL
// =========================================================================
function avaliarCriterios() {
    const statusMental = document.getElementById('mentalStatus').checked;
    const tec = document.getElementById('tec').checked;
    const diurese = document.getElementById('diurese').checked;
    const si = document.getElementById('si').checked;
    const mottling = document.getElementById('mottling').checked;
    const hipotensao = document.getElementById('hipotensao').checked;
    const lactato = document.getElementById('lactato').checked;

    const criteriosPerfusao = [statusMental, tec, diurese, si, mottling].filter(c => c).length;
    
    const clausula1 = (statusMental && tec) && diurese;
    const clausula2 = tec && si && mottling;
    const condicaoMetabolica = hipotensao || lactato;
    const clausula3 = (criteriosPerfusao >= 2) && condicaoMetabolica;
    const clausula4 = (hipotensao && lactato) && (criteriosPerfusao >= 1);

    const choqueConfirmado = clausula1 || clausula2 || clausula3 || clausula4;
    const resultadoDiv = document.getElementById('resultado');
    const container = document.getElementById('passo1');

    container.style.display = 'none';
    resultadoDiv.style.display = 'block';

    if (choqueConfirmado) {
        resultadoDiv.innerHTML = `
            <h2>✅ CHOQUE CONFIRMADO</h2>
            <p>O paciente atende aos critérios de inclusão.</p>
            <hr>
            <h3>2.1 Ação Imediata (Ressuscitação Volêmica):</h3>
            <p><strong>Infunda 30ml/kg em 30-60 min e reavalie os critérios do Item 1.</strong></p>
            ${gerarBotaoVoltar('voltarParaPasso1()')}
            <button onclick="iniciarDesafioVolumico()">Avançar para Reavaliação (2.2)</button>
            ${footerCitationHTML}
        `;
    } else {
        resultadoDiv.innerHTML = `
            <h2>❌ CHOQUE EXCLUÍDO</h2>
            <p>Não preenche critérios no momento. Reavalie em 30 min.</p>
            ${gerarBotaoVoltar('voltarParaPasso1()')}
            ${metasButtonHTML('exibirMetasHemodinamicas()')}
            ${footerCitationHTML}
        `;
    }
}

// =========================================================================
// PASSO 2: REAVALIAÇÃO PÓS-RESSUSCITAÇÃO
// =========================================================================

function iniciarDesafioVolumico() {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = `
        <div id="passo2-reavaliacao" class="passo">
            <h2>2.2 Reavaliação Pós-Ressuscitação Volêmica</h2>
            ${criteriosMelhoraHTML}
            <p>A ressuscitação de 30ml/kg foi concluída.</p>
            <p><strong>Houve melhora</strong> baseada nos parâmetros acima?</p>
            
            ${gerarBotaoVoltar('voltarParaPasso1()')}
            <button onclick="logicaPasso2('sim')">Sim</button>
            <button onclick="logicaPasso2('nao')">Não</button>
            ${footerCitationHTML}
        </div>
    `;
}

function logicaPasso2(resposta) {
    const container = document.getElementById('protocolo-container');
    
    if (resposta === 'sim') {
        container.innerHTML = `
            <div id="passo2-1" class="passo">
                <h2>2.2.1 Internamento e Acompanhamento</h2>
                ${criteriosMelhoraHTML}
                <p>✅ <strong>Ação:</strong> Internar. Monitorar por 6h.</p>
                <hr>
                <p>O paciente <strong>voltou a piorar</strong> nas últimas 6h?</p>
                ${gerarBotaoVoltar('iniciarDesafioVolumico()')}
                <button onclick="logicaPasso2_1_1('sim')">Sim (Piorou)</button>
                <button onclick="logicaPasso2_1_1('nao')">Não (Estável)</button>
                <hr>
                <button onclick="logicaPasso3_4('sim')">Paciente já na UTI (Pular)</button>
                ${footerCitationHTML}
            </div>
        `;
    } else {
        // Se não melhorou, vai direto para monitorização
        logicaPasso3_4('nao'); 
    }
}

function logicaPasso2_1_1(resposta) {
    const container = document.getElementById('protocolo-container');
    
    if (resposta === 'sim') {
        container.innerHTML = `
            <div id="passo2-1-1" class="passo">
                <h2>2.2.1.1 Piora Clínica</h2>
                ${criteriosMelhoraHTML}
                <p>🚨 <strong>Ação:</strong> Considere Desafio Volêmico (500 ml em 5-10 min) e <strong>Internação em UTI</strong>.</p>
                ${gerarBotaoVoltar("logicaPasso2('sim')")}
                <button onclick="logicaPasso3_4('sim')">Avançar Monitorização Avançada</button>
                ${footerCitationHTML}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div id="passo2-1-2" class="passo">
                <h2>2.2.1.2 Estabilidade</h2>
                <p>✅ Manter Enfermaria/Observação.</p>
                ${gerarBotaoVoltar("logicaPasso2('sim')")}
                <button onclick="voltarParaPasso1()">Reiniciar</button>
                ${footerCitationHTML}
            </div>
        `;
    }
}

// =========================================================================
// PASSO 3 e 4: MONITORIZAÇÃO E CÁLCULOS
// =========================================================================
function logicaPasso3_4(origem) {
    const container = document.getElementById('protocolo-container');
    const backFunc = (origem === 'sim') ? "logicaPasso2('sim')" : "iniciarDesafioVolumico()";

    container.innerHTML = `
        <div id="passo3-e-4" class="passo">
            <h2>3. Monitorização UTI e 4. Cálculos</h2>
            <p>🚨 <strong>Ação:</strong> Acesso Central + PAMi + Gasometria Pareada.</p>
            <hr>
            <h3>4. Inserir Dados (Gasometria/Monitor)</h3>
            <label>PaCO2 (Arterial): <input type="number" id="co2-art"></label>
            <label>PvCO2 (Venoso): <input type="number" id="co2-ven"></label>
            <label>SvcO2 (%): <input type="number" id="svco2"></label>
            <label>CaO2: <input type="number" id="cao2"></label>
            <label>CvO2: <input type="number" id="cvo2"></label>
            <label>PVC (mmHg): <input type="number" id="pvc"></label>
            
            ${gerarBotaoVoltar(backFunc)}
            <button onclick="avaliarGapEsvco2('${origem}')">Calcular e Avaliar (Item 4.1)</button>
            ${footerCitationHTML}
        </div>
    `;
}

function avaliarGapEsvco2(origemAnterior) {
    const pco2Art = parseFloat(document.getElementById('co2-art').value);
    const pco2Ven = parseFloat(document.getElementById('co2-ven').value);
    const svco2 = parseFloat(document.getElementById('svco2').value);
    const cao2 = parseFloat(document.getElementById('cao2').value);
    const cvo2 = parseFloat(document.getElementById('cvo2').value);
    const pvc = parseFloat(document.getElementById('pvc').value);

    if (isNaN(pco2Art) || isNaN(pco2Ven) || isNaN(svco2) || isNaN(cao2) || isNaN(cvo2) || isNaN(pvc)) {
        alert("Por favor, preencha todos os campos numéricos (incluindo PVC)."); return;
    }

    const gapCO2 = pco2Ven - pco2Art;
    const diferencaAVO2 = cao2 - cvo2;
    const razao = diferencaAVO2 !== 0 ? gapCO2 / diferencaAVO2 : Infinity;
    
    // Lógica: Gap > 6, SvcO2 < 65 ou Razão > 1.2
    const hipoperfusao = (gapCO2 > 6.0) || (svco2 < 65) || (razao > 1.2);

    const container = document.getElementById('protocolo-container');
    const backFunc = `logicaPasso3_4('${origemAnterior}')`;

    if (hipoperfusao) {
        container.innerHTML = `
            <div id="passo4-1-2" class="passo">
                <h2>4.1.2 Hipoperfusão Persistente Confirmada</h2>
                <p>⚠️ <strong>Resultados:</strong> Gap: ${gapCO2.toFixed(1)} | SvcO2: ${svco2}% | Razão: ${razao.toFixed(2)}</p>
                <hr>
                <h3>4.1.3 Fluidorresponsividade</h3>
                <p>O paciente pode fazer <strong>PLR</strong> (Elevação Passiva das Pernas)?</p>
                ${gerarBotaoVoltar(backFunc)}
                <button onclick="avaliarPreditores('plr')">Sim</button>
                <button onclick="avaliarPreditores('sem_plr')">Não</button>
                ${footerCitationHTML}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div id="passo-reavaliacao" class="passo">
                <h2>4.1.1 Choque Controlado</h2>
                <p>✅ <strong>Resultados:</strong> Gap: ${gapCO2.toFixed(1)} | SvcO2: ${svco2}% | Razão: ${razao.toFixed(2)}</p>
                <p>Parâmetros de perfusão controlados.</p>
                ${gerarBotaoVoltar(backFunc)}
                <button onclick="logicaPasso5('sim')">Avançar para Causa Base</button>
                ${footerCitationHTML}
            </div>
        `;
    }
}

// =========================================================================
// FLUIDORRESPONSIVIDADE (PLR / DPP)
// =========================================================================

function avaliarPreditores(tipo) {
    const container = document.getElementById('protocolo-container');
    if (tipo === 'plr') {
        container.innerHTML = `
            <div id="passo4-1-3" class="passo">
                <h2>4.1.3 Preditores</h2>
                <p>O paciente está em <strong>Ventilação Mecânica Invasiva</strong>?</p>
                ${gerarBotaoVoltar("avaliarGapEsvco2('sim')")}
                <button onclick="avaliarVM('sim')">Sim</button>
                <button onclick="avaliarVM('nao')">Não</button>
                ${footerCitationHTML}
            </div>
        `;
    } else { avaliarAlternativas(); }
}

function avaliarVM(resposta) {
    const container = document.getElementById('protocolo-container');
    if (resposta === 'sim') {
        container.innerHTML = `
            <div id="passo4-1-3-2" class="passo">
                <h2>4.1.3.2 VM Invasiva</h2>
                <p>Escolha a técnica:</p>
                ${gerarBotaoVoltar("avaliarPreditores('plr')")}
                <button onclick="avaliarPausaDPP('sim')">DPP / Oclusão Expiratória</button>
                <button onclick="avaliarPausaDPP('nao')">Elevação Passiva das Pernas (PLR)</button>
                ${footerCitationHTML}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div id="passo4-1-3-1" class="passo">
                <h2>4.1.3.1 PLR em Espontânea</h2>
                ${criteriosMelhoraHTML}
                <p>✅ <strong>Ação:</strong> Realize o PLR.</p>
                <p>Houve aumento do DC > 10% (ou equivalente clínico/ECOTT)?</p>
                ${gerarBotaoVoltar("avaliarPreditores('plr')")}
                <button onclick="logicaPasso4_2('sim')">Sim</button>
                <button onclick="logicaPasso4_2('nao')">Não</button>
                ${footerCitationHTML}
            </div>
        `;
    }
}

function avaliarAlternativas() {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = `
        <div class="passo">
            <h2>4.1.3 Alternativas (Sem PLR)</h2>
            <p>Está em VM Invasiva?</p>
            ${gerarBotaoVoltar("avaliarGapEsvco2('sim')")}
            <button onclick="avaliarAlternativaVM('sim')">Sim</button>
            <button onclick="avaliarAlternativaVM('nao')">Não</button>
            ${footerCitationHTML}
        </div>
    `;
}

function avaliarAlternativaVM(resposta) {
    const container = document.getElementById('protocolo-container');
    if (resposta === 'sim') {
        container.innerHTML = `
            <div class="passo">
                <h2>4.1.3.2 Ação Alternativa (VM) - Tentativa de DPP</h2>
                <p>Prioridade é DPP ou Oclusão Expiratória.</p>
                <h3>Critérios Necessários:</h3>
                <ul>
                    <li>Sem arritmia?</li>
                    <li>Sem interação no ventilador (respiração espontânea)?</li>
                    <li>Volume Corrente (VT) 10-12ml/kg predito?</li>
                </ul>
                <p>O paciente atende a <strong>TODOS</strong> os critérios?</p>
                ${gerarBotaoVoltar("avaliarAlternativas()")}
                <button onclick="aplicarPausa('sim')">Sim</button>
                <button onclick="aplicarPausa('nao')">Não</button>
                ${footerCitationHTML}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="passo">
                <h2>4.1.3.1 Ação Alternativa (Espontânea)</h2>
                <p>❌ <strong>Ação:</strong> Paciente sem janela segura para testes dinâmicos.</p>
                <p>Inicie <strong>Vasopressor</strong> (Noradrenalina) OU Vasopressor + <strong>Inotrópico</strong> (Dobutamina).</p>
                ${gerarBotaoVoltar("avaliarAlternativas()")}
                <button onclick="reavaliar30Min()">Próxima Ação</button>
                ${footerCitationHTML}
            </div>
        `;
    }
}

function avaliarPausaDPP(resposta) {
    const container = document.getElementById('protocolo-container');
    if (resposta === 'sim') {
        container.innerHTML = `
            <div class="passo">
                <h2>Critérios DPP/Oclusão Expiratória</h2>
                <p>Confirma que o paciente atende a <strong>TODOS</strong> os critérios?</p>
                <ul>
                    <li>Sem arritmia?</li>
                    <li>Sem interação no ventilador?</li>
                    <li>VT 10-12ml/kg?</li>
                </ul>
                ${gerarBotaoVoltar("avaliarVM('sim')")}
                <button onclick="aplicarPausa('sim')">Sim</button>
                <button onclick="aplicarPausa('nao')">Não</button>
                ${footerCitationHTML}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="passo">
                <h2>PLR em VM Invasiva</h2>
                ${criteriosMelhoraHTML}
                <p>Houve resposta positiva ao PLR?</p>
                ${gerarBotaoVoltar("avaliarVM('sim')")}
                <button onclick="logicaPasso4_2('sim')">Sim</button>
                <button onclick="logicaPasso4_2('nao')">Não</button>
                ${footerCitationHTML}
            </div>
        `;
    }
}

function aplicarPausa(resposta) {
    const container = document.getElementById('protocolo-container');
    if (resposta === 'sim') {
        container.innerHTML = `
            <div class="passo">
                <h2>Execução DPP/Oclusão</h2>
                ${criteriosMelhoraHTML}
                <p>Houve resposta positiva?</p>
                ${gerarBotaoVoltar("avaliarPausaDPP('sim')")}
                <button onclick="logicaPasso4_2('sim')">Sim</button>
                <button onclick="logicaPasso4_2('nao')">Não</button>
                ${footerCitationHTML}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="passo">
                <h2>Critérios Não Atendidos</h2>
                <p>❌ <strong>Ação:</strong> Inicie <strong>Vasopressor</strong> (Noradrenalina) OU Vasopressor + <strong>Inotrópico</strong> (Dobutamina).</p>
                ${gerarBotaoVoltar("avaliarPausaDPP('sim')")}
                <button onclick="reavaliar30Min()">Reavaliar em 30 min (Item 4.3)</button>
                ${footerCitationHTML}
            </div>
        `;
    }
}

// =========================================================================
// INTERVENÇÃO (STEP 4.2)
// =========================================================================

function logicaPasso4_2(resposta) {
    const container = document.getElementById('protocolo-container');
    const backFunc = "avaliarPreditores('plr')"; 

    if (resposta === 'sim') {
        container.innerHTML = `
            <div id="passo4-2-1" class="passo">
                <h2>4.2.1 Preditor POSITIVO (Fluidorresponsivo)</h2>
                ${criteriosMelhoraHTML}
                <p>✅ <strong>Ação:</strong> Fazer <strong>expansão volêmica</strong> (500 ml em 5-10 min).</p>
                <hr>
                <p>Paciente é <strong>Neurocrítico</strong>?</p>
                ${gerarBotaoVoltar(backFunc)}
                <button onclick="logicaPasso4_2_neuro('sim')">Sim</button>
                <button onclick="logicaPasso4_2_neuro('nao')">Não</button>
                ${footerCitationHTML}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div id="passo4-2-2" class="passo">
                <h2>4.2.2 Preditor NEGATIVO (Não Fluidorresponsivo)</h2>
                <p>❌ <strong>Ação:</strong> Iniciar <strong>Vasopressor</strong> (Noradrenalina) OU Vasopressor + <strong>Inotrópico</strong> (Dobutamina).</p>
                ${gerarBotaoVoltar(backFunc)}
                <button onclick="reavaliar30Min()">Próxima Ação</button>
                ${footerCitationHTML}
            </div>
        `;
    }
}

function logicaPasso4_2_neuro(resposta) {
    const container = document.getElementById('protocolo-container');
    let fluido = (resposta === 'sim') ? 'SF 0.9%' : 'Ringer Lactato';
    
    container.innerHTML = `
        <div class="passo">
            <h2>Fluido Definido</h2>
            <p>✅ <strong>Ação:</strong> Expansão com <strong>${fluido}</strong> (500 ml).</p>
            ${gerarBotaoVoltar("logicaPasso4_2('sim')")}
            <button onclick="reavaliar30Min()">Próxima Ação</button>
            ${footerCitationHTML}
        </div>
    `;
}

// =========================================================================
// REAVALIAÇÃO FINAL (30 MIN) - STEP 4.3
// =========================================================================

function reavaliar30Min() {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = `
        <div id="passo4-3" class="passo">
            <h2>4.3 Reavaliação em 30 Minutos</h2>
            ${criteriosMelhoraHTML}
            <p>Houve melhora nos parâmetros acima após a intervenção?</p>
            ${gerarBotaoVoltar("logicaPasso4_2('nao')")}
            <button onclick="logicaPasso5('sim')">Sim</button>
            <button onclick="logicaPasso4_3_1('nao')">Não</button>
            ${footerCitationHTML}
        </div>
    `;
}

function logicaPasso4_3_1(resposta) {
    const container = document.getElementById('protocolo-container');
    if (resposta === 'nao') {
        container.innerHTML = `
            <div class="passo">
                <h2>Falha Terapêutica</h2>
                <p>Tem monitor de DC (Swan-Ganz/Termodiluição)?</p>
                ${gerarBotaoVoltar("reavaliar30Min()")}
                <button onclick="logicaPasso4_3_1_2_1('sim')">Sim</button>
                <button onclick="logicaPasso4_3_1_2_1('nao')">Não</button>
                ${footerCitationHTML}
            </div>
        `;
    }
}

function logicaPasso4_3_1_2_1(resposta) {
    const container = document.getElementById('protocolo-container');
    if (resposta === 'sim') {
        container.innerHTML = `
            <div class="passo">
                <h2>Monitor DC (Termodiluição/PAC)</h2>
                <p>✅ <strong>Ação:</strong> Iniciar monitorização de DC (DC, PAP, PCP, PVC, RVS, EVLW).</p>
                <p>Discuta com intensivista: Busca de causa, ajustes finos de vasopressor/inotrópico.</p>
                ${gerarBotaoVoltar("logicaPasso4_3_1('nao')")}
                <button onclick="logicaPasso5('nao')">Avançar</button>
                ${footerCitationHTML}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="passo">
                <h2>Sem Monitor DC</h2>
                <p>Tem <strong>ECOTT</strong> disponível?</p>
                ${gerarBotaoVoltar("logicaPasso4_3_1('nao')")}
                <button onclick="logicaPasso4_3_1_2_2_1('sim')">Sim</button>
                <button onclick="logicaPasso4_3_1_2_2_1('nao')">Não</button>
                ${footerCitationHTML}
            </div>
        `;
    }
}

function logicaPasso4_3_1_2_2_1(resposta) {
    const container = document.getElementById('protocolo-container');
    if (resposta === 'sim') {
        container.innerHTML = `
            <div class="passo">
                <h2>Avaliação por ECOTT</h2>
                ${criteriosMelhoraHTML}
                <p>Selecione o achado principal:</p>
                ${gerarBotaoVoltar("logicaPasso4_3_1_2_1('nao')")}
                <button onclick="ecottConduta('disfuncao')">Disfunção Sistólica de Câmaras</button>
                <button onclick="ecottConduta('normal_congestionado')">Função Normal + VCI ≥ 2.0 OU Padrão B</button>
                <button onclick="ecottConduta('normal_hipovolemico')">Função Normal + VCI < 2.0 cm E Padrão A</button>
                ${footerCitationHTML}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="passo">
                <h2>Sem Recursos (ECOTT/Monitor)</h2>
                <p>❌ <strong>Ação:</strong> Fazer novo <strong>Desafio Volêmico</strong> (250 ml) <strong>E</strong> aumentar vasopressor <strong>E/OU</strong> associar <strong>Vasopressina</strong>.</p>
                ${gerarBotaoVoltar("logicaPasso4_3_1_2_1('nao')")}
                <button onclick="logicaPasso5('nao')">Avançar</button>
                ${footerCitationHTML}
            </div>
        `;
    }
}

function ecottConduta(conduta) {
    const container = document.getElementById('protocolo-container');
    let acao = '';
    if (conduta === 'disfuncao') {
        acao = 'Associe <strong>inotrópico</strong> ou aumente a vazão (até 20mcg/kg/min se já em uso).';
    } else if (conduta === 'normal_congestionado') {
        acao = 'Associe <strong>Vasopressina</strong> (inicie com 0.06UI/min) como 2º vasopressor <strong>E/OU</strong> aumente <strong>Noradrenalina</strong>. (Não fazer volume!)';
    } else if (conduta === 'normal_hipovolemico') {
        acao = 'Associe <strong>Vasopressina</strong> (0.06UI/min) <strong>E/OU</strong> aumente <strong>Noradrenalina</strong> <strong>E</strong> faça novo <strong>Desafio Volêmico</strong> (250ml em 5 a 10 min).';
    }

    container.innerHTML = `
        <div class="passo">
            <h2>Conduta Baseada no ECOTT</h2>
            <p>🚨 <strong>Ação:</strong> ${acao}</p>
            ${gerarBotaoVoltar("logicaPasso4_3_1_2_2_1('sim')")}
            <button onclick="logicaPasso5('nao')">Avançar</button>
            ${footerCitationHTML}
        </div>
    `;
}

function logicaPasso5(melhora) {
    const container = document.getElementById('protocolo-container');
    if (melhora === 'sim') {
        container.innerHTML = `
            <div id="passo5-sim" class="passo">
                <h2 style="color:green">5.1 Melhora Confirmada!</h2>
                <p>✅ <strong>Ação:</strong> Mantenha os suportes e busque tratar a <strong>causa base</strong> (Sepse, IAM, TEP, Pneumotórax, Tamponamento).</p>
                <p>Considere descalonar as medidas somente após <strong>6-12h</strong>.</p>
                ${gerarBotaoVoltar("reavaliar30Min()")}
                ${metasButtonHTML('exibirMetasHemodinamicas()')}
                <button onclick="voltarParaPasso1()">Reiniciar Protocolo</button>
                ${footerCitationHTML}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div id="passo5-nao" class="passo">
                <h2 style="color:red">5.2 Ausência de Melhora</h2>
                <p>❌ <strong>Ação:</strong> <strong>Reconsidere os diagnósticos</strong> e discuta imediatamente com o intensivista.</p>
                <p>Verifique ativamente a presença de Pneumotórax ou Tamponamento.</p>
                ${gerarBotaoVoltar("reavaliar30Min()")}
                ${metasButtonHTML('exibirMetasHemodinamicas()')}
                <button onclick="voltarParaPasso1()">Reiniciar Protocolo</button>
                ${footerCitationHTML}
            </div>
        `;
    }
}

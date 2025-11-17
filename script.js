/**
 * Lógica do Protocolo de Manejo do Choque (VERSÃO FINAL, COMPLETA E FUNCIONAL)
 * Correção: Critérios para DPP/Oclusão incluídos na rota alternativa (PLR Impossível).
 */

// =========================================================================
// CRITÉRIOS DE MELHORA (PARA REVISITAÇÃO CONSTANTE)
// =========================================================================
const criteriosMelhoraHTML = `
    <div style="background-color: #e9f5ff; border: 1px solid #b3d9ff; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
        <h4 style="margin-top: 0; color: #0056b3;">Critérios de Melhora (Checklist)</h4>
        <ul style="list-style-type: disc; padding-left: 20px; font-size: 0.9em;">
            <li>Melhora de parâmetros clínicos (Item 1).</li>
            <li>Melhora de Débito Cardíaco (aumento de VTI).</li>
            <li>Aumento de SvcO2 para intervalo de 65-75% OU ganho de 5% ou mais.</li>
            <li>Redução do GapCO2 >= 2 pontos.</li>
            <li>Redução do Lactato 30% em 4h ou abaixo de 2.0 em qualquer momento.</li>
            <li>Redução de linhas B pulmonares.</li>
            <li>Redução de PVC para valores < 10 mmHg ou diâmetro de VCI para < 2.0 cm.</li>
            <li>Redução do Gradiente Respiratório (GapCO2 / (CaO2-CvO2)).</li>
        </ul>
    </div>
`;

// =========================================================================
// FUNÇÃO PRINCIPAL: AVALIAÇÃO DO CHOQUE (ITEM 1)
// =========================================================================
function avaliarCriterios() {
    // 1. Obter o estado de cada critério a partir dos checkboxes
    const statusMental = document.getElementById('mentalStatus').checked;
    const tec = document.getElementById('tec').checked;
    const diurese = document.getElementById('diurese').checked;
    const si = document.getElementById('si').checked;
    const mottling = document.getElementById('mottling').checked;
    const hipotensao = document.getElementById('hipotensao').checked;
    const lactato = document.getElementById('lactato').checked;

    // A. Contagem de critérios presentes nas TRÍADES (Critérios de Perfussão - P1 a P5)
    const criteriosPerfusao = [statusMental, tec, diurese, si, mottling];
    const nCriteriosPerfusao = criteriosPerfusao.filter(c => c).length;
    
    // ---------------------------------------------------------------------
    // B. CLÁUSULAS DE DIAGNÓSTICO (Lógica Final)
    // ---------------------------------------------------------------------
    
    // CLÁUSULA 1: Tríade 1
    const clausula1 = (statusMental && tec) && diurese;

    // CLÁUSULA 2: Tríade 2
    const clausula2 = tec && si && mottling;

    // Condição Metabólica Permissiva: (Hipotensão OU Hiperlactatemia)
    const condicaoMetabolicaPermissiva = hipotensao || lactato; 
    
    // Condição estrita (Hipotensão E Hiperlactatemia)
    const condicaoMetabolicaEstrita = hipotensao && lactato;

    // CLÁUSULA 3: Qualquer 2 ou mais critérios de Perf. + (H OU L)
    const clausula3 = (nCriteriosPerfusao >= 2) && condicaoMetabolicaPermissiva;

    // CLÁUSULA 4: Os dois critérios (Hipotensão E Hiperlactatemia) + qualquer 1 dos critérios das tríades
    const clausula4 = condicaoMetabolicaEstrita && (nCriteriosPerfusao >= 1);


    // DIAGNÓSTICO FINAL: Choque é confirmado se QUALQUER UMA das cláusulas for TRUE
    const choqueConfirmado = clausula1 || clausula2 || clausula3 || clausula4;

    // ----------------------------------------------------------------------
    
    // 3. Exibir o resultado
    const resultadoDiv = document.getElementById('resultado');
    const container = document.getElementById('passo1');

    container.style.display = 'none';
    resultadoDiv.style.display = 'block';

    if (choqueConfirmado) {
        resultadoDiv.innerHTML = `
            <h2>✅ CHOQUE CONFIRMADO!</h2>
            <p>O paciente atende aos critérios de inclusão.</p>
            <hr>
            <h3>2.1 Ação Imediata (Desafio Volêmico):</h3>
            <p><strong>Infunda 30ml/kg em 30-60 min e reavalie os critérios do Item 1.</strong></p>
            <button onclick="iniciarDesafioVolumico()">Avançar para Etapa 2.2 (Reavaliação)</button>
        `;
    } else {
        resultadoDiv.innerHTML = `
            <h2>❌ CHOQUE EXCLUÍDO</h2>
            <p>O paciente <strong>NÃO</strong> preenche os critérios para choque neste momento.</p>
            <p>Reavalie o paciente em 30 minutos ou se houver piora clínica.</p>
            <button onclick="window.location.reload()">Reiniciar Protocolo</button>
        `;
    }
}

// =========================================================================
// FLUXO DO PASSO 2 (DESAFIO VOLÊMICO E INTERNAMENTO)
// =========================================================================

function iniciarDesafioVolumico() {
    document.getElementById('resultado').style.display = 'none';

    const container = document.getElementById('protocolo-container');
    container.innerHTML = `
        <div id="passo2-reavaliacao" class="passo">
            <h2>2.2 Reavaliação Pós-Desafio Volêmico</h2>
            ${criteriosMelhoraHTML}
            <p>O desafio volêmico de 30ml/kg foi concluído.</p>
            <p>Houve <strong>Melhora</strong> de algum parâmetro de perfusão/hemodinâmico (Item 1)?</p>
            
            <button onclick="logicaPasso2('sim')">Sim</button>
            <button onclick="logicaPasso2('nao')">Não</button>
        </div>
    `;
}

function logicaPasso2(resposta) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = ''; 

    if (resposta === 'sim') {
        // 2.2.1 Sim: Proceder internamento e acompanhar nas próximas 6 horas
        container.innerHTML = `
            <div id="passo2-1" class="passo">
                <h2>2.2.1 SIM: Internamento e Acompanhamento</h2>
                ${criteriosMelhoraHTML}
                <p>✅ **Ação:** Proceder internamento. Acompanhar por 6 horas para definir local de internação (UTI ou Enfermaria).</p>
                <hr>
                <p>O paciente voltou a piorar dentro das 6h?</p>
                <button onclick="logicaPasso2_1_1('sim')">Sim</button>
                <button onclick="logicaPasso2_1_1('nao')">Não</button>
                
                <hr>
                <p>O paciente **JÁ ESTÁ NA UTI**? (Se sim, pule a reavaliação de internação e vá para o monitoramento)</p>
                <button onclick="logicaPasso3_4()">Sim</button>
            </div>
        `;
    } else {
        // 2.2.2 Não: UTI + Monitorização (Salto para o item 3 e 2.2.2)
        logicaPasso3_4(); 
    }
}

function logicaPasso2_1_1(resposta) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = ''; 

    if (resposta === 'sim') {
        // Voltou a piorar: Considere desafio volêmico + UTI
        container.innerHTML = `
            <div id="passo2-1-1" class="passo">
                <h2>2.2.1.1 SIM: Piora</h2>
                ${criteriosMelhoraHTML}
                <p>🚨 **Ação:** Considere Desafio Volêmico (500 ml em 5 a 10 min) e **Internação em UTI.**</p>
                <button onclick="logicaPasso3_4()">Avançar para Monitorização Avançada</button>
            </div>
        `;
    } else {
        // Manteve estabilidade: Enfermaria
        container.innerHTML = `
            <div id="passo2-1-2" class="passo">
                <h2>2.2.1.2 NÃO: Estabilidade</h2>
                <p>✅ **Ação:** Internar em **Enfermaria** e reavaliar.</p>
                <button onclick="window.location.reload()">Reiniciar Protocolo (Fim do fluxo agudo)</button>
            </div>
        `;
    }
}

function logicaPasso3_4() {
    // Corresponde aos Itens 2.2.2 e 3 (UTI + Monitorização + Gasometria)
    const container = document.getElementById('protocolo-container');
    container.innerHTML = `
        <div id="passo3-e-4" class="passo">
            <h2>3. Monitorização Hemodinâmica e Coleta</h2>
            <p>🚨 **Ação:** **Internação em UTI.**</p>
            <ul>
                <li>Iniciar uso de ferramentas de monitorização hemodinâmica.</li>
                <li>Passar **Acesso Venoso Central** (jugular interna/subclávia, guiado por USG).</li>
                <li>Passar **PAMi** (Femoral se muitos sinais de choque; Radial se poucos).</li>
                <li>Colher **Gasometria Pareada** (arterial e venosa central).</li>
            </ul>
            <hr>
            <h3>4. CÁLCULOS (Requer dados da Gasometria/Monitor)</h3>
            <p>Preencha os dados coletados para avaliar a Hipoperfusão Persistente (Item 4.1).</p>

            <label for="co2-art">CO2 Arterial (PaCO2):</label>
            <input type="number" id="co2-art" placeholder="Ex: 40"> mmHg<br>
            <label for="co2-ven">CO2 Venoso Central (PvCO2):</label>
            <input type="number" id="co2-ven" placeholder="Ex: 46"> mmHg<br>

            <label for="svco2">SvcO2 (Saturação Venosa Central de O2):</label>
            <input type="number" id="svco2" placeholder="Ex: 70">%<br>
            
            <label for="cao2">CaO2 (Conteúdo Arterial de O2):</label>
            <input type="number" id="cao2" placeholder="Ex: 18"> ml/dL<br>
            <label for="cvo2">CvO2 (Conteúdo Venoso de O2):</label>
            <input type="number" id="cvo2" placeholder="Ex: 13"> ml/dL<br>
            
            <label for="pvc">PVC (Pressão Venosa Central):</label>
            <input type="number" id="pvc" placeholder="Ex: 8"> mmHg<br>

            <button onclick="avaliarGapEsvco2()">Calcular e Avaliar Hipoperfusão (Item 4.1)</button>
        </div>
    `;
}

// =========================================================================
// FLUXO DO PASSO 4.1 (AVALIAÇÃO AVANÇADA - GAPCO2, SVCO2)
// =========================================================================
function avaliarGapEsvco2() {
    const pco2Art = parseFloat(document.getElementById('co2-art').value);
    const pco2Ven = parseFloat(document.getElementById('co2-ven').value);
    const svco2 = parseFloat(document.getElementById('svco2').value);
    const cao2 = parseFloat(document.getElementById('cao2').value);
    const cvo2 = parseFloat(document.getElementById('cvo2').value);

    // Validação básica para evitar NaN/Infinity
    if (isNaN(pco2Art) || isNaN(pco2Ven) || isNaN(svco2) || isNaN(cao2) || isNaN(cvo2)) {
        alert("Por favor, preencha todos os campos numéricos para o cálculo (Item 4).");
        return;
    }

    // Cálculos
    const gapCO2 = pco2Ven - pco2Art;
    const diferencaAVO2 = cao2 - cvo2;
    // Nomenclatura corrigida: apenas razão GapCO2/(CaO2-CvO2)
    const razaoRespiratoria = diferencaAVO2 !== 0 ? gapCO2 / diferencaAVO2 : Infinity; 

    // Critério 4.1: hipoperfusão persistente (UM OU MAIS destes devem ser verdadeiros)
    const condicaoGapCO2 = gapCO2 > 6.0;
    const condicaoSvcO2 = svco2 < 65;
    const condicaoRazao = razaoRespiratoria > 1.2;

    // Condição final: (GapCO2 > 6.0 OU SvCO2 < 65% OU Razão > 1.2) E qualquer sinal de hipoperfusão (item 1)
    const hipoperfusaoPersistente = condicaoGapCO2 || condicaoSvcO2 || condicaoRazao;

    const container = document.getElementById('protocolo-container');
    container.innerHTML = '';

    if (hipoperfusaoPersistente) {
        // 4.1.2 Sim > Avaliar preditores de fluidorresponsividade
        container.innerHTML = `
            <div id="passo4-1-2" class="passo">
                <h2>4.1.2 Hipoperfusão Persistente Confirmada</h2>
                <p>⚠️ **Resultados:** GapCO2: ${gapCO2.toFixed(1)} mmHg | SvcO2: ${svco2.toFixed(1)}% | Razão (GapCO2 / $\Delta$CaO2-CvO2): ${razaoRespiratoria.toFixed(2)}</p>
                <p>Pelo menos um critério (GapCO2 > 6.0, SvcO2 < 65% ou Razão > 1.2) foi atendido.</p>
                <p>É necessário avaliar os **preditores de fluidorresponsividade** antes de continuar com os fluidos.</p>
                <hr>
                <h3>4.1.3 Avaliação de Fluidorresponsividade</h3>
                <p>O paciente pode fazer Elevação Passiva das Pernas (PLR)?</p>
                
                <button onclick="avaliarPreditores('plr')">Sim</button>
                <button onclick="avaliarPreditores('sem_plr')">Não</button>
            </div>
        `;
    } else {
        // Se Não tem hipoperfusão persistente
        container.innerHTML = `
            <div id="passo-reavaliacao" class="passo">
                <h2>4.1.1 Choque Revertido/Não Persistente</h2>
                <p>✅ **Resultados:** GapCO2: ${gapCO2.toFixed(1)} mmHg | SvcO2: ${svco2.toFixed(1)}% | Razão (GapCO2 / $\Delta$CaO2-CvO2): ${razaoRespiratoria.toFixed(2)}</p>
                <p>Os parâmetros de hipoperfusão estão controlados.</p>
                <button onclick="logicaPasso5('sim')">Avançar para Causa Base</button>
            </div>
        `;
    }
}

// =========================================================================
// FUNÇÃO AVALIAR PREDITORES (ITEM 4.1.3)
// =========================================================================
function avaliarPreditores(tipo) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = '';

    if (tipo === 'plr') {
        // Se PODE fazer PLR, avançamos para checar a VM para definir a TÉCNICA
        container.innerHTML = `
            <div id="passo4-1-3" class="passo">
                <h2>4.1.3 Preditores de Fluidorresponsividade</h2>
                
                <h3>Situação do Paciente:</h3>
                
                <p>O paciente está em **Ventilação Mecânica Invasiva**?</p>
                <button onclick="avaliarVM('sim')">Sim</button>
                <button onclick="avaliarVM('nao')">Não</button>
            </div>
        `;
    } else if (tipo === 'sem_plr') {
        // Se NÃO PODE fazer PLR, avançamos para avaliar alternativas
        avaliarAlternativas();
    }
}

// =========================================================================
// FUNÇÃO AVALIAR VM (PLR É POSSÍVEL)
// =========================================================================
function avaliarVM(resposta) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = '';

    if (resposta === 'sim') {
        // 4.1.3.2 Em Ventilação Mecânica Invasiva
        container.innerHTML = `
            <div id="passo4-1-3-2" class="passo">
                <h2>4.1.3.2 VM Invasiva</h2>
                ${criteriosMelhoraHTML}
                <p>Selecione a técnica de avaliação:</p>
                <button onclick="avaliarPausaDPP('sim')">DPP / Oclusão Expiratória</button>
                <button onclick="avaliarPausaDPP('nao')">Elevação Passiva das Pernas (PLR)</button>
            </div>
        `;
    } else {
        // 4.1.3.1 Em Ventilação Espontânea: Aqui a tela de PLR é mostrada, pois ele PODE fazer.
        container.innerHTML = `
            <div id="passo4-1-3-1" class="passo">
                <h2>4.1.3.1 Ventilação Espontânea</h2>
                ${criteriosMelhoraHTML}
                <p>✅ **Ação:** Realizar **Elevação Passiva das Pernas (PLR)**.</p>
                <p>O PLR foi **positivo** (melhora dos parâmetros clínicos E/OU aumento > 5% de DC com ECOTT ou 10-15% com monitores)?</p>
                <button onclick="logicaPasso4_2('sim')">Sim</button>
                <button onclick="logicaPasso4_2('nao')">Não</button>
            </div>
        `;
    }
}

// =========================================================================
// NOVA FUNÇÃO: AVALIAR ALTERNATIVAS QUANDO PLR NÃO PODE SER FEITO
// =========================================================================
function avaliarAlternativas() {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = '';

    container.innerHTML = `
        <div id="passo-sem-plr" class="passo">
            <h2>4.1.3. Alternativas de Fluidorresponsividade</h2>
            <p>O paciente não pode fazer Elevação Passiva das Pernas (PLR). Avalie a ventilação para a próxima ação:</p>
            
            <p>O paciente está em **Ventilação Mecânica Invasiva**?</p>
            <button onclick="avaliarAlternativaVM('sim')">Sim</button>
            <button onclick="avaliarAlternativaVM('nao')">Não</button>
        </div>
    `;
}

// =========================================================================
// NOVA FUNÇÃO: LÓGICA DE ALTERNATIVA QUANDO PLR É CONTRAINDICADO - CORRIGIDA
// =========================================================================
function avaliarAlternativaVM(resposta) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = '';

    if (resposta === 'sim') {
        // VM Invasiva (PLR impossível): Ação é tentar DPP/Oclusão (4.1.3.2)
        container.innerHTML = `
            <div id="passo-sem-plr-vm" class="passo">
                <h2>4.1.3.2 Ação Alternativa (VM)</h2>
                ${criteriosMelhoraHTML}
                <p>✅ **Ação:** Como o PLR é impossível, a prioridade é o **DPP ou Oclusão Expiratória** (Manobra de Ventilação Mecânica).</p>
                
                <h3>Critérios Necessários:</h3>
                <ul>
                    <li>Sem arritmia?</li>
                    <li>Sem interação no ventilador (respiração espontânea)?</li>
                    <li>Volume Corrente (VT) 10-12ml/kg predito?</li>
                </ul>
            
                <p>O paciente atende a **TODOS** estes critérios para DPP/Oclusão?</p>
                <button onclick="aplicarPausa('sim')">Sim</button>
                <button onclick="aplicarPausa('nao')">Não</button>
                <hr>
                <p style="font-size: 0.9em; color: #555;">*Se o paciente não atende aos critérios DPP/Oclusão e PLR é impossível, a conduta clínica deve ser de exceção (discutir monitorização invasiva avançada ou iniciar terapia empírica).*</p>
                <button onclick="logicaPasso4_2('nao')">Iniciar Vasopressor/Inotrópico (Opção Empírica)</button>
            </div>
        `;
    } else {
        // Ventilação Espontânea (PLR impossível): Ação é ir direto para intervenção empírica.
        container.innerHTML = `
            <div id="passo-sem-plr-esp" class="passo">
                <h2>4.1.3.1 Ação Alternativa (Espontânea)</h2>
                <p>❌ **Ação:** O paciente não tem técnica dinâmica de fluidorresponsividade segura aplicável. **Proceder com Terapia Empírica:**</p>
                <p>Inicie **Vasopressor** (Noradrenalina) OU Vasopressor + **Inotrópico** (Dobutamina).</p>
                <button onclick="reavaliar30Min()">Próxima Ação</button>
            </div>
        `;
    }
}

// =========================================================================
// FLUXO DE AVALIAÇÃO DPP/OCLUSÃO
// =========================================================================
function avaliarPausaDPP(resposta) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = '';

    if (resposta === 'sim') {
        // Avaliação para DPP/Oclusão Expiratória (Critérios Exigidos)
        container.innerHTML = `
            <div id="passo4-1-3-2-crit" class="passo">
                <h2>4.1.3.2 Critérios para DPP/Oclusão Expiratória</h2>
                ${criteriosMelhoraHTML}
                <p>O paciente atende a **TODOS** os critérios para DPP ou Oclusão Expiratória?</p>
                <ul>
                    <li>Sem arritmia?</li>
                    <li>Sem interação no ventilador (respiração espontânea)?</li>
                    <li>Volume Corrente (VT) 10-12ml/kg predito?</li>
                </ul>
                <button onclick="aplicarPausa('sim')">Sim</button>
                <button onclick="aplicarPausa('nao')">Não</button>
            </div>
        `;
    } else {
        // Se escolher PLR na VM invasiva
        container.innerHTML = `
            <div id="passo4-1-3-2-PLR" class="passo">
                <h2>4.1.3.2 PLR em VM Invasiva</h2>
                ${criteriosMelhoraHTML}
                <p>✅ **Ação:** Realizar **Elevação Passiva das Pernas (PLR)**.</p>
                <p>O PLR foi **positivo** (melhora dos parâmetros clínicos E/OU aumento > 5% de DC com ECOTT ou 10-15% com monitores)?</p>
                <button onclick="logicaPasso4_2('sim')">Sim</button>
                <button onclick="logicaPasso4_2('nao')">Não</button>
            </div>
        `;
    }
}

function aplicarPausa(resposta) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = '';

    if (resposta === 'sim') {
        // Atende aos critérios: Faz DPP ou Oclusão
        container.innerHTML = `
            <div id="passo4-1-3-2-exec" class="passo">
                <h2>4.1.3.2 Execução DPP/Oclusão</h2>
                ${criteriosMelhoraHTML}
                <p>✅ **Ação:** Realizar **DPP ou Oclusão Expiratória** (15s de pausa expiratória manual).</p>
                <p>O preditor foi **positivo** (melhora dos parâmetros clínicos E/OU aumento > 5% de DC com ECOTT ou 10-15% com monitores)?</p>
                <button onclick="logicaPasso4_2('sim')">Sim</button>
                <button onclick="logicaPasso4_2('nao')">Não</button>
            </div>
        `;
    } else {
        // Não atende: Fazer PLR
        container.innerHTML = `
            <div id="passo4-1-3-2-fallback" class="passo">
                <h2>4.1.3.2 Fallback (Não atende critérios)</h2>
                ${criteriosMelhoraHTML}
                <p>❌ **Ação:** Como não atende aos critérios, realizar **Elevação Passiva das Pernas (PLR)**.</p>
                <p>O PLR foi **positivo**?</p>
                <button onclick="logicaPasso4_2('sim')">Sim</button>
                <button onclick="logicaPasso4_2('nao')">Não</button>
            </div>
        `;
    }
}


// =========================================================================
// FLUXO DO PASSO 4.2 (INTERVENÇÃO - Fluidos ou Vasopressor)
// =========================================================================

function logicaPasso4_2(resposta) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = ''; 

    if (resposta === 'sim') {
        // 4.2.1 Sim: Fazer expansão volêmica (500 ml de cristalóide em 5-10 min)
        container.innerHTML = `
            <div id="passo4-2-1" class="passo">
                <h2>4.2.1 Preditor POSITIVO (Fluidorresponsivo)</h2>
                ${criteriosMelhoraHTML}
                <p>✅ **Ação:** Fazer **expansão volêmica** (500 ml de cristalóide em 5-10 min).</p>
                <hr>
                <p style="font-weight: bold;">⚠️ OBS. CRISTALÓIDE:</p>
                <p>O paciente é **neurocrítico**?</p>
                <button onclick="logicaPasso4_2_neuro('sim')">Sim</button>
                <button onclick="logicaPasso4_2_neuro('nao')">Não</button>
            </div>
        `;
    } else {
        // 4.2.2 Não: Iniciar Vasopressor (Noradrenalina) OU vasopressor + inotrópico (Dobutamina)
        container.innerHTML = `
            <div id="passo4-2-2" class="passo">
                <h2>4.2.2 Preditor NEGATIVO (Não Fluidorresponsivo)</h2>
                <p>❌ **Ação:** Iniciar **Vasopressor** (Noradrenalina) OU Vasopressor + **Inotrópico** (Dobutamina).</p>
                <button onclick="reavaliar30Min()">Próxima Ação</button>
            </div>
        `;
    }
}

function logicaPasso4_2_neuro(resposta) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = '';
    
    let cristalóide = (resposta === 'sim') ? 'SF 0,9%' : 'Ringer Lactato';

    container.innerHTML = `
        <div id="passo4-2-1-final" class="passo">
            <h2>4.2.1 Fluidos Definidos</h2>
            ${criteriosMelhoraHTML}
            <p>✅ **Ação:** Fazer expansão volêmica com **${cristalóide}** (500 ml em 5-10 min).</p>
            <button onclick="reavaliar30Min()">Próxima Ação</button>
        </div>
    `;
}

// =========================================================================
// FLUXO DO PASSO 4.3 (REAVALIAÇÃO EM 30 MIN)
// =========================================================================

function reavaliar30Min() {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = `
        <div id="passo4-3" class="passo">
            <h2>4.3 Reavaliação em 30 Minutos</h2>
            ${criteriosMelhoraHTML}
            <p>Após a intervenção (expansão volêmica ou vasopressor/inotrópico), reavalie os parâmetros perfusionais/hemodinâmicos.</p>
            <p>Houve melhora?</p>
            <button onclick="logicaPasso4_3_1('sim')">Sim</button>
            <button onclick="logicaPasso4_3_1('nao')">Não</button>
        </div>
    `;
}

function logicaPasso4_3_1(resposta) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = '';

    if (resposta === 'sim') {
        // 4.3.1.1 Sim: Mantenha as medidas e reavalie a cada 2 horas (Retorno ao Passo 5)
        logicaPasso5('sim');
    } else {
        // 4.3.1.2 Não: Avaliar monitor de DC
        container.innerHTML = `
            <div id="passo4-3-1-2" class="passo">
                <h2>4.3.1.2 Falha na Resposta Inicial</h2>
                <p>❌ **Ação:** Não houve melhora. Tem monitor de Débito Cardíaco (DC)? (Termodiluição ou CAP - Swan-Ganz)</p>
                <button onclick="logicaPasso4_3_1_2_1('sim')">Sim</button>
                <button onclick="logicaPasso4_3_1_2_1('nao')">Não</button>
            </div>
        `;
    }
}

function logicaPasso4_3_1_2_1(resposta) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = '';

    if (resposta === 'sim') {
        // 4.3.1.2.1 Sim (Monitor DC)
        container.innerHTML = `
            <div id="passo4-3-1-2-1" class="passo">
                <h2>4.3.1.2.1 Monitor DC (Termodiluição/PAC)</h2>
                <p>✅ **Ação:** Iniciar monitorização de DC (DC, PAP, PCP, PVC, RVS, EVLW).</p>
                <p>⚠️ **Conduta:** Discuta individualmente com o intensivista cada ponto para nova intervenção (Busca de causa, ajustes finos de vasopressor/inotrópico).</p>
                <button onclick="logicaPasso5('nao')">Avançar para Reavaliação e Causa Base</button>
            </div>
        `;
    } else {
        // 4.1.3.1.2.2.1 Não (Tem ECOTT?)
        container.innerHTML = `
            <div id="passo4-3-1-2-2" class="passo">
                <h2>4.3.1.2.2 Sem Monitor DC</h2>
                <p>Tem **ECOTT** disponível?</p>
                <button onclick="logicaPasso4_3_1_2_2_1('sim')">Sim</button>
                <button onclick="logicaPasso4_3_1_2_2_1('nao')">Não</button>
            </div>
        `;
    }
}

function logicaPasso4_3_1_2_2_1(resposta) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = '';

    if (resposta === 'sim') {
        // 4.1.3.1.2.2.1 Sim (ECOTT)
        container.innerHTML = `
            <div id="passo4-3-1-2-2-1-ecott" class="passo">
                <h2>4.3.1.2.2.1 Avaliação por ECOTT</h2>
                ${criteriosMelhoraHTML}
                <p>✅ **Ação:** Avalie VTI, função sistólica e diastólica de VE, e sistólica do VD (TAPSE) + Linhas B pulmonares + VCI.</p>
                <hr>
                <p>Selecione o achado principal:</p>

                <button onclick="ecottConduta('disfuncao')">Disfunção Sistólica de Câmaras</button>
                <button onclick="ecottConduta('normal_congestionado')">Função Normal + VCI ≥ 2.0 OU Padrão B Pulmonar</button>
                <button onclick="ecottConduta('normal_hipovolemico')">Função Normal + VCI < 2.0 cm E Padrão A Pulmonar</button>
            </div>
        `;
    } else {
        // 4.1.3.1.2.2.2 Não (Sem ECOTT)
        container.innerHTML = `
            <div id="passo4-3-1-2-2-2-semecott" class="passo">
                <h2>4.3.1.2.2.2 Sem ECOTT</h2>
                <p>❌ **Ação:** Fazer novo **desafio volêmico** (250 ml de cristaloide) **E** aumentar vasopressor **E/OU** associar **Vasopressina**.</p>
                <button onclick="logicaPasso5('nao')">Avançar para Reavaliação e Causa Base</button>
            </div>
        `;
    }
}

function ecottConduta(conduta) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = '';
    let acao = '';

    if (conduta === 'disfuncao') {
        acao = 'Associe **inotrópico** ou aumente a vazão (até 20mcg/kg/min se já em uso).';
    } else if (conduta === 'normal_congestionado') {
        acao = 'Associe **Vasopressina** (inicie com 0.06UI/min) como 2º vasopressor **E/OU** aumente **Noradrenalina**. (Não fazer volume!)';
    } else if (conduta === 'normal_hipovolemico') {
        acao = 'Associe **Vasopressina** (0.06UI/min) **E/OU** aumente **Noradrenalina** **E** faça novo **desafio volêmico** (250ml em 5 a 10 min).';
    }

    container.innerHTML = `
        <div id="passo4-3-1-2-2-1-conduta" class="passo">
            <h2>Conduta Baseada no ECOTT</h2>
            <p>🚨 **Ação:** ${acao}</p>
            <button onclick="logicaPasso5('nao')">Avançar para Reavaliação e Causa Base</button>
        </div>
    `;
}

// =========================================================================
// FUNÇÃO FINAL (ITEM 5)
// =========================================================================
function logicaPasso5(melhora) {
    const container = document.getElementById('protocolo-container');
    container.innerHTML = '';

    if (melhora === 'sim') {
        // 5.1 Sim: matenha os suportes e busque tratar a causa base
        container.innerHTML = `
            <div id="passo5-sim" class="passo">
                <h2>5.1 Melhora Confirmada!</h2>
                <p>✅ **Ação:** Mantenha os suportes e busque tratar a **causa base** (Sepse, IAM, TEP, Pneumotórax, Tamponamento).</p>
                <p>Considere descalonar as medidas somente após **6-12h**.</p>
                <hr>
                <p>**Lembrete:** Se Pneumotórax ou Tamponamento, a intervenção deve ser imediata.</p>
                <button onclick="window.location.reload()">Reiniciar Protocolo</button>
            </div>
        `;
    } else {
        // 5.2 Não: Reconsidere diagnósticos
        container.innerHTML = `
            <div id="passo5-nao" class="passo">
                <h2>5.2 Ausência de Melhora</h2>
                <p>❌ **Ação:** **Reconsidere os diagnósticos** e discuta imediatamente com o intensivista.</p>
                <p>Verifique ativamente a presença de Pneumotórax ou Tamponamento.</p>
                <button onclick="window.location.reload()">Reiniciar Protocolo</button>
            </div>
        `;
    }
}

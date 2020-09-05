import React, { Component } from 'react';
import Table from '../../components/Table';
import { ButtonSuccess, ButtonDanger, ButtonPrimary, ButtonDefault, ButtonInfo } from '../../components/Buttons';
import { Row, Column } from '../../components/RowColumn';
import { Text, CheckBox, Select } from '../../components/Inputs';
import { Span } from '../../components/Labels';
import { ScreenComponent } from '../../components/Screen';
import Banner from '../../components/Banner';
import LancamentoStatus from '../LancamentoStatus';
import api from '../../services/api';
import { toast } from 'react-toastify';
import handleSearch from '../../services/search';

const apiService = '/processo';

class Processo extends Component {

    state = {

        page: {
            nomeTitulo: 'Processos',
            buttonTitulo: 'Adicionar Processo',
            showList: true,
            showModalStatus: false
        },


        obj: {
            id: 0,
            referencia: '',
            tipo_operacao: '',
            importador: '',
            exportador: '',
            mercadoria: '',
            criadoEm: '',
            atualizadoEm: '',

            processoServico: []
        },

        list: [],
        listaFiltrada: [],

        clientes: [],
        servicos: [],
        empresas: [],
    }

    componentDidMount() {
        //this.setState({ list: list });
        this.findAll();
    }

    /* ===== Api ===== */

    async listAll() {
        const result = await api.get(apiService);
        const list = result.data || [];
        this.setState({ list, listaFiltrada: list });
    }

    findAll() {
        this.listAll();
        this.findClientes();
        this.findServicos();
        this.findEmpresaEstrangeira();

    }

    async findClientes() {
        const result = await api.get('/cliente/getClientesAtivos');
        const list = result.data || [];
        this.setState({ clientes: list });
    }

    async findServicos() {
        const result = await api.get('/servico/getServicosAtivos');
        const list = result.data || [];
        this.setState({ servicos: list });
    }

    async findEmpresaEstrangeira() {
        const result = await api.get('/empresaexterior/getEmpresasAtivas');
        const list = result.data || [];
        this.setState({ empresas: list });
    }

    // {{ base_url }}/'cliente/getClientesAtivos'
    // {{ base_url }}/servico/getServicosAtivos
    // {{ base_url }}/empresaexterior/getEmpresasAtivas

    handleAddNew = e => {
        let { page } = this.state;

        page.showList = false;

        this.setState({ page });
        this.clearObject();
        this.clearObjectServicoProcesso();
    }

    handleCancelAdd = e => {
        let { page } = this.state;
        page.showList = true;
        this.setState({ page });
    }

    handleSave = async () => {

        if (this.validations()) {
            let { obj } = this.state;

            let response = null;
            let sucesso = false;
            let idProcesso = 0;

            obj.cliente_id = obj.tipo_operacao == 'Importacao' ? obj.importador : obj.exportador;
            obj.empresaexterior_id = obj.tipo_operacao == 'Importacao' ? obj.exportador : obj.importador;
            obj.colaborador_id = 1;

            let resp = '';

            console.log(obj);

            if (obj.id === 0)
                await api.post(apiService, obj).then(response => {
                    sucesso = true;
                    resp = response;
                    idProcesso = response.data.id;
                }).catch(error => {
                    sucesso = false;
                });
            else {
                idProcesso = obj.id;
                await api.put(apiService, obj).then(response => {
                    sucesso = true;
                }).catch(error => {
                    sucesso = false;
                });
            }

            if (sucesso) {

                //resp.id
                obj.processoServico.forEach(servico => {
                    this.handleSaveProcessoServico(servico, idProcesso);
                });

                debugger;

                this.clearObject();
                this.listAll();
                this.setState({ page: { ...this.state.page, showList: true } });
                toast.success('Processo salvo com Sucesso');
            }
            else
                toast.error('Não foi possivel salvar o Processo');

        }
    }

    async handleSaveProcessoServico(servico, idPprocesso) {

        console.log('Brunow');
        console.log(this.state);
        console.log(servico);
        debugger;

        let sucesso = false;

        let objProcessoServico = {
            "processo_id": idPprocesso,
            "servico_id": servico.id,
            "numero_registro": servico.numero_registro,
        }

        if (servico.idProcessoServico && servico.idProcessoServico != 0) {
            objProcessoServico.id = servico.idProcessoServico;
            await api.put('/processoservico', objProcessoServico).then(response => {
                sucesso = true;

            }).catch(error => {
                sucesso = false;
            });
        }
        else
            await api.post('/processoservico', objProcessoServico).then(response => {
                sucesso = true;

            }).catch(error => {
                sucesso = false;
            });


    }

    async getProcessosServicos(id) {

        this.clearObjectServicoProcesso();

        const result = await api.get(`/processoservico/getServicosDoProcesso?idProcesso=${id}`);
        const list = result.data || [];
        let { processoServico } = this.state.obj;
        list.forEach(x => {

            let index = processoServico.findIndex(p => p.id == x.servico_id);

            processoServico[index].idProcessoServico = x.id;
            processoServico[index].numero_registro = x.numero_registro;
            processoServico[index].ativo = x.numero_registro !== "" ? true : false;
            processoServico[index].processo_id = x.processo_id;

        });

        return processoServico;
    }

    handleEdit = async id => {

        let obj = this.state.list.find(x => x.id == id);

        obj.importador = obj.tipo_operacao == 'Importacao' ? obj.cliente.id : obj.empresa.id;
        obj.exportador = obj.tipo_operacao == 'Exportacao' ? obj.cliente.id : obj.empresa.id;


        let servicosDoProcesso = [];

        await this.getProcessosServicos(id).then(resul => {
            servicosDoProcesso = resul;
        });

        if (servicosDoProcesso.length > 0)
            obj.processoServico = servicosDoProcesso

        this.setState({
            obj: obj,
            page: { ...this.state.page, showList: false }
        });

        if (servicosDoProcesso.length == 0)
            this.clearObjectServicoProcesso();
    }

    handleOpenStatus = async processo => {

        let servicosDoProcesso = [];
        await this.getProcessosServicos(processo.id).then(resul => {
            servicosDoProcesso = resul;
        });

        if (servicosDoProcesso.length > 0) {

            let ehValido = false;
            for (let i = 0; i < servicosDoProcesso.length && !ehValido; i++)
                if (servicosDoProcesso[i].numero_registro != '')
                    ehValido = true
            if (ehValido) {
                processo.processoServico = servicosDoProcesso;
                this.setState({ page: { ...this.state.page, showModalStatus: true }, obj: processo });
            }
            else
                toast.error('Não foi encontrado nenhum serviço vinculado a esse Processo');

        }
        else
            toast.error('Não foi encontrado nenhum serviço vinculado a esse Processo');
    }

    handleDelete = id => {

        let list = this.state.list;
        let index = list.findIndex(x => x.id == id);
        list.splice(index, 1);
        this.setState({ list });
    }

    /* ===== Validations ===== */
    validations = () => {

        const { obj } = this.state;
        let errorDescriptions = '';

        if (obj.referencia === '')
            errorDescriptions = "Preencha a Referencia";

        if (obj.mercadoria === '')
            errorDescriptions += "Preencha a Mercadoria";

        if (obj.tipo_operacao === '' || obj.tipo_operacao === "-1")
            errorDescriptions += "Preencha o tipo de Operação";

        if (obj.importador === '' || obj.importador === "-1")
            errorDescriptions += "Selecione quem será o Importador";

        if (obj.exportador === '' || obj.exportador === "-1")
            errorDescriptions += "Selecione quem será o Exportador";

        if (obj.tipo_operacao === '' || obj.tipo_operacao === "-1")
            errorDescriptions += "Preencha o tipo de Operação";

        if (errorDescriptions === '')
            return true;
        else {
            toast.error(errorDescriptions);
            return false;
        }

    }

    /* ===== Clean Objects ===== */
    clearObject = () => {
        //this.setState({ obj: {  } });
    }

    clearObjectServicoProcesso = () => {

        let list = [];
        this.state.servicos.forEach(s => {
            list.push({
                ...s,
                numero_registro: '',
                ativo: false
            });
        });

        this.setState({
            obj: { ...this.state.obj, processoServico: list }
        })

    }

    renderModalStatus = e => {
        return (
            <LancamentoStatus
                processo={this.state.obj}
                onClickClose={(value) => this.setState({ page: { ...this.state.page, showModalStatus: value } })} />
        );
    }

    /* =====  Render ===== */
    renderList() {

        const { listaFiltrada } = this.state;

        return (
            <>
                <Row>

                    <Column grow="1">
                        <Span>Pesquisar</Span>
                        <Text placeholder="Pesquise pela operação, referencia, importador, exportador e mercadoria"
                            onChange={(e) => this.setState({ listaFiltrada: handleSearch(this.state.list, e.target.value) })}
                        />

                    </Column>
                </Row >


                <div style={{ "overflow-x": "auto", "padding": "10px" }}>

                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Operação</th>
                                <th>Referencia</th>
                                <th>Importador</th>
                                <th>Exportador</th>
                                <th>Mercadoria</th>

                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                listaFiltrada.map(l => (
                                    <tr key={l.id}>
                                        <td>{l.id}</td>
                                        <td>{l.tipo_operacao}</td>
                                        <td>{l.referencia}</td>

                                        <td> {l.tipo_operacao == 'Importacao' ? l.cliente.nome : l.empresa.nome} </td>
                                        <td> {l.tipo_operacao == 'Exportacao' ? l.cliente.nome : l.empresa.nome}</td>

                                        <td>{l.mercadoria}</td>

                                        <td>
                                            <Row alignItems="flex-end">
                                                <ButtonInfo class="edit" width="70px" onClick={() => { this.handleOpenStatus(l) }}>Status</ButtonInfo>
                                                <ButtonPrimary class="edit" width="70px" onClick={() => { this.handleEdit(l.id) }}>Editar</ButtonPrimary>
                                                {/*<ButtonDanger class="delete" width="70px" onClick={() => { this.handleDelete(l.id) }}>Excluir</ButtonDanger>*/}
                                            </Row>
                                        </td>

                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </div>

            </>
        );
    }

    atualizaServicoProcesso = (id, valor, tipo) => {

        let { processoServico } = this.state.obj;
        let index = processoServico.findIndex(x => x.id == id);
        processoServico[index][tipo] = valor;
        this.setState({
            obj: {
                ...this.state.obj,
                processoServico
            }
        });
    }

    renderServicos() {

        const { processoServico } = this.state.obj;

        return (
            <>
                {
                    (processoServico || []).map(s =>
                        (
                            <Row justifyContent="space-between">
                                <Column >
                                    <Row>
                                        <CheckBox
                                            type="checkbox"
                                            checked={s.ativo}
                                            onChange={(e) => { this.atualizaServicoProcesso(s.id, e.target.checked, 'ativo') }}
                                        />
                                        <Span>{s.nome_servico}</Span>
                                    </Row>
                                </Column>

                                {
                                    s.ativo ?
                                        (
                                            <Column >
                                                <Row>
                                                    <Span>Número de Registro</Span>
                                                    <Text
                                                        placeholder="Número de Registro"
                                                        value={s.numero_registro}
                                                        onChange={(e) => { this.atualizaServicoProcesso(s.id, e.target.value, 'numero_registro') }}
                                                    />
                                                </Row>
                                            </Column>
                                        ) :
                                        ('')

                                }


                            </Row>
                        ))
                }
            </>
        );
    }

    renderImportadorExportador(obj) {


        if (obj.tipo_operacao !== "-1" && obj.tipo_operacao != "")
            return (
                <Row>
                    <Column grow="1">
                        <Span>Importador</Span>

                        <Select value={obj.importador} onChange={(e) => { this.setState({ obj: { ...obj, importador: e.target.value } }) }}>
                            <option>Selecione um Importador</option>

                            {
                                obj.tipo_operacao == 'Importacao' ?
                                    this.state.clientes.map(c => { return c.tipo != 'Exportador' ? (< option value={c.id} > {c.nome}</option>) : ('') }) :
                                    this.state.empresas.map(c => (<option value={c.id}>{c.nome}</option>))
                            }

                        </Select>

                    </Column>

                    <Column grow="1">
                        <Span>Exportador</Span>

                        <Select value={obj.exportador} onChange={(e) => { this.setState({ obj: { ...obj, exportador: e.target.value } }) }}>
                            <option>Selecione um Exportador</option>
                            {
                                obj.tipo_operacao == 'Exportacao' ?
                                    this.state.clientes.map(c => { return c.tipo != 'Importador' ? (< option value={c.id} > {c.nome}</option>) : ('') }) :
                                    this.state.empresas.map(c => (<option value={c.id}>{c.nome}</option>))
                            }

                        </Select>

                    </Column>
                </Row >
            )
        else
            return ('');
    }

    renderForm() {

        const { obj } = this.state;

        return (
            <>
                <form>
                    <Row>
                        <Column grow="3">
                            <Span>Referencia</Span>
                            <Text placeholder="Informe a Referencia"
                                value={obj.referencia}
                                maxLength={200}
                                onChange={(e) => { this.setState({ obj: { ...obj, referencia: e.target.value } }) }}
                            />
                        </Column>

                        <Column grow="1">
                            <Span>Operação</Span>

                            <Select value={obj.tipo_operacao}
                                onChange={(e) => { this.setState({ obj: { ...obj, tipo_operacao: e.target.value, importador: '', exportador: '' } }) }}
                            >
                                <option value="-1">Selecione o tipo de operação</option>
                                <option value="Exportacao">Exportação</option>
                                <option value="Importacao">Importação</option>
                            </Select>

                        </Column>
                    </Row>

                    {this.renderImportadorExportador(obj)}


                    <Row>
                        <Column grow="1">
                            <Span>Mercadoria</Span>
                            <Text placeholder="Informe a Mercadoria"
                                value={obj.mercadoria}
                                maxLength={200}
                                onChange={(e) => { this.setState({ obj: { ...obj, mercadoria: e.target.value } }) }}
                            />
                        </Column>
                    </Row>

                    <Row>
                        <Column >
                            <Span>Selecione os Serviços referente ao Processo</Span>
                        </Column>
                    </Row>

                    {this.renderServicos()}

                    <Row>
                        <Column grow="1" alignItems="flex-end">
                            <Row>
                                <ButtonSuccess class="edit" width="150px" onClick={this.handleSave}>Salvar</ButtonSuccess>
                                <ButtonDefault class="edit" width="150px" onClick={this.handleCancelAdd}>Cancelar</ButtonDefault>
                            </Row>
                        </Column>
                    </Row>

                </form>
            </>
        );
    }

    render() {

        const { page } = this.state;

        return (
            <>
                {page.showModalStatus ? (this.renderModalStatus()) : ('')}

                <Banner name={page.nomeTitulo} showButtonAdd={page.showList} buttonTitulo={page.buttonTitulo} tamanhoButton="170px"
                    onClickEvent={() => this.handleAddNew()} />
                <ScreenComponent>
                    {page.showList ? (this.renderList()) : (this.renderForm())}
                </ScreenComponent>

            </>
        )
    }
}

export default Processo;
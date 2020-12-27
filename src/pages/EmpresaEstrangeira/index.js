import React, { Component } from 'react';
import Table from '../../components/Table';
import { ButtonSuccess, ButtonDanger, ButtonPrimary, ButtonDefault } from '../../components/Buttons';
import { Row, Column } from '../../components/RowColumn';
import { Text, CheckBox, Select } from '../../components/Inputs';
import { Span } from '../../components/Labels';
import { ScreenComponent } from '../../components/Screen';
import Banner from '../../components/Banner';
//import Message from '../../components/Message';
import api from '../../services/api';
import { toast } from 'react-toastify';
import handleSearch from '../../services/search';

const apiService = '/empresaexterior';

class EmpresaEstrangeira extends Component {

    /* ===== State ===== */
    state = {

        page: {
            nomeTitulo: 'Empresas Estrangeiras',
            tituloButton: 'Adicionar Empresa',
            showList: true
        },

        obj: {
            id: 0,
            nome: '',
            nif: '',
            ativo: true,
            criadoEm: '',
            atualizadoEm: '',
        },

        list: [],
        listaFiltrada: [],

    }

    /* ===== Component Life ===== */
    componentDidMount() {

        /*
        let list = [
            { id: 1, nome: 'Empresa 1', nif: '422.811.638-81', ativo: true, criadoEm: '13/07/2020 08:36', atualizadoEm: '15/07/2020 19:14' },
            { id: 2, nome: 'Empresa 2', nif: '952.512.568-24', ativo: true, criadoEm: '13/07/2020 08:36', atualizadoEm: '15/07/2020 19:14' },
            { id: 3, nome: 'Empresa 3', nif: '952.512.568-24', ativo: true, criadoEm: '13/07/2020 08:36', atualizadoEm: '15/07/2020 19:14' },
        ];
        */


        //this.setState({ list: list });
        this.listAll();
    }


    /* ===== Api ===== */
    async listAll() {
        const result = await api.get(apiService);
        const list = result.data || [];
        this.setState({ list, listaFiltrada: list });
    }


    /* ===== Events =====  */
    handleAddNew = e => {
        let { page } = this.state;

        page.showList = false;

        this.setState({ page });
        this.clearObject();
    }

    handleCancelAdd = e => {
        let { page } = this.state;
        page.showList = true;
        this.setState({ page });
    }

    handleSave = async e => {

        if (this.validations()) {
            let { obj } = this.state;


            let sucesso = false;

            if (obj.id == 0)
                await api.post(apiService, obj).then(response => {
                    sucesso = true;
                }).catch(error => {
                    sucesso = false;
                });
            else
                await api.put(apiService, obj).then(response => {
                    sucesso = true;
                }).catch(error => {
                    sucesso = false;
                });

            if (sucesso) {
                this.clearObject();
                this.listAll();
                this.setState({ page: { ...this.state.page, showList: true } });
                toast.success('Empresa Estrangeira salvo com Sucesso');
            }
            else
                toast.error('Não foi possivel salvar a Empresa');
        }
    }



    handleEdit = id => {

        let obj = this.state.list.find(x => x.id == id);

        this.setState({
            obj,
            page: { ...this.state.page, showList: false }
        });

    }

    handleDelete = id => {
        let list = this.state.list;
        let index = list.findIndex(x => x.id == id);
        list.splice(index, 1);
        this.setState({ list });
    }

    /* ===== Clean Objects ===== */
    clearObject = () => {
        this.setState({ obj: { id: 0, nome: '', nif: '', ativo: true, criadoEm: '', atualizadoEm: '' } });
    }


    /* ===== Validations ===== */
    validations = () => {

        const { obj } = this.state;
        let errorDescriptions = '';

        if (obj.nome == '')
            errorDescriptions = "Informe a descrição";

        if (errorDescriptions == '')
            return true;
        else {
            toast.error(errorDescriptions);
            return false;
        }

    }

    /* =====  Render ===== */


    renderForm() {

        const { obj } = this.state;

        return (
            <form>
                <Row>
                    <Column grow="3">
                        <Span>Descrição</Span>
                        <Text placeholder="Informe a Descrição"
                            value={obj.nome}
                            maxLength={255}
                            onChange={(e) => { this.setState({ obj: { ...obj, nome: e.target.value } }) }}
                        />
                    </Column>

                    <Column grow="1">
                        <Span>NIF</Span>
                        <Text placeholder="Informe o NIF"
                            value={obj.nif}
                            type="text"
                            maxLength={50}
                            onChange={(e) => { this.setState({ obj: { ...obj, nif: e.target.value } }) }}
                        />
                    </Column>


                </Row>


                <Row>
                    <Column >
                        <Row>
                            <CheckBox type="checkbox"
                                checked={obj.ativo}
                                onChange={(e) => { this.setState({ obj: { ...obj, ativo: e.target.checked } }) }}
                            />

                            <Span>Ativo</Span>

                        </Row>
                    </Column>


                </Row>

                <Row>
                    <Column grow="1" alignItems="flex-end">
                        <Row>
                            <ButtonSuccess class="edit" width="150px" onClick={this.handleSave}>Salvar</ButtonSuccess>
                            <ButtonDefault class="edit" width="150px" onClick={this.handleCancelAdd}>Cancelar</ButtonDefault>
                        </Row>
                    </Column>



                </Row>

            </form>
        )
    }

    renderList() {

        const { listaFiltrada } = this.state;

        return (
            <>
                <Row>

                    <Column grow="1">
                        <Span>Pesquisar</Span>
                        <Text placeholder="Pesquise pelo nome ou NIF"
                            onChange={(e) => this.setState({ listaFiltrada: handleSearch(this.state.list, e.target.value) })}
                        />


                    </Column>
                </Row>


                <div style={{ "overflow-x": "auto", "padding": "10px" }}>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>nome</th>
                                <th>NIF</th>
                                <th>Ativo</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                listaFiltrada.map(l => (
                                    <tr key={l.id}>
                                        <td>{l.id}</td>
                                        <td>{l.nome}</td>
                                        <td>{l.nif}</td>
                                        <td>{l.ativo ? 'Sim' : 'Não'}</td>
                                        <td>
                                            <Row alignItems="flex-end">
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

    render() {

        const { page } = this.state;


        return (
            <>
                <Banner name={page.nomeTitulo} showButtonAdd={page.showList} buttonTitulo={page.tituloButton} tamanhoButton="170px"
                    onClickEvent={() => this.handleAddNew()} />
                <ScreenComponent>
                    {
                        page.showList ? (this.renderList()) : (this.renderForm())
                    }
                </ScreenComponent>

            </>
        )
    }
}


export default EmpresaEstrangeira;

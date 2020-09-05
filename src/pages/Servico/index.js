import React, { Component } from 'react';
import Table from '../../components/Table';
import { ButtonSuccess, ButtonPrimary, ButtonDefault } from '../../components/Buttons';
import { Row, Column } from '../../components/RowColumn';
import { Text, CheckBox } from '../../components/Inputs';
import { Span } from '../../components/Labels';
import { ScreenComponent } from '../../components/Screen';
import Banner from '../../components/Banner';
//import Message from '../../components/Message';
import api from '../../services/api';
import { toast } from 'react-toastify';

//import { getToken } from '../../services/auth';
//const token = getToken();
const apiService = '/servico';

class Servico extends Component {


    /* ===== State ===== */
    state = {

        page: {
            nomeTitulo: 'Serviços',
            buttonTitulo: 'Adicionar Serviço',
            showList: true
        },

        obj: {
            id: 0,
            nome_servico: '',
            ativo: true,
            criadoEm: '',
            atualizadoEm: '',
        },

        list: [],
    }

    /* ===== Component Life ===== */
    async componentDidMount() {

        /*
        let list = [
            { id: 1, nome_servico: 'Agenciamento de Cargas', ativo: true },
            { id: 2, nome_servico: 'Assesoria e Desembaraço Aduaneiro', ativo: true },
            { id: 3, nome_servico: 'Transporte Rodoviario', ativo: true },
        ];
        */
        this.listAll();

    }

    /* ===== Api ===== */
    async listAll() {
        
        
        //api.defaults.headers.Authorization = `Bearer ${token}`;
       

        const result = await api.get(apiService);
        const list = result.data || [];
        this.setState({ list });
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

    handleSave = async () => {

        if (this.validations()) {
            let { obj } = this.state;

            let response = null;
            let sucesso = false;


            
            if (obj.id === 0)
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
                toast.success('Serviço salvo com Sucesso');
            }
            else
                toast.error('Não foi possivel salvar o Serviço');
        }
    }

    handleEdit = id => {

        let obj = this.state.list.find(x => x.id === id);

        this.setState({
            obj,
            page: { ...this.state.page, showList: false }
        });

        
    }

    handleDelete = id => {
        let list = this.state.list;
        let index = list.findIndex(x => x.id === id);
        list.splice(index, 1);
        this.setState({ list });
    }

    /* ===== Clean Objects ===== */
    clearObject = () => {
        this.setState({ obj: { id: 0, nome_servico: '', ativo: true, criadoEm: '', atualizadoEm: '' } });
    }


    /* ===== Validations ===== */
    validations = () => {

        const { obj } = this.state;
        let errorDescriptions = '';

        if (obj.nome_servico === '')
            errorDescriptions = "Preencha o campo Descrição";

        if (errorDescriptions === '')
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
                            value={obj.nome_servico}
                            maxLength={200}
                            onChange={(e) => { this.setState({ obj: { ...obj, nome_servico: e.target.value } }) }}
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

        const { list } = this.state;

        return (
            <div style={{ "overflow-x": "auto", "padding": "10px" }}>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Descrição</th>
                            <th>Ativo</th>
                            <th >Ação</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            list.map(servico => (
                                <tr key={servico.id}>
                                    <td>{servico.id}</td>
                                    <td>{servico.nome_servico}</td>
                                    <td>{servico.ativo ? 'Sim' : 'Não'}</td>
                                    <td>
                                        <Row alignItems="flex-end">
                                            <ButtonPrimary class="edit" width="70px" onClick={() => { this.handleEdit(servico.id) }}>Editar</ButtonPrimary>
                                            {/*<ButtonDanger class="delete" width="70px" onClick={() => { this.handleDelete(servico.id) }}>Excluir</ButtonDanger>*/}
                                        </Row>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </div>
        )
    }

    render() {

        const { page } = this.state;

        return (
            <>
                <Banner name={page.nomeTitulo} showButtonAdd={page.showList} buttonTitulo={page.buttonTitulo} tamanhoButton="170px"
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

export default Servico;
import React, { Component } from 'react';
import { Modal, ModalContent } from '../../components/Modal';
import Table from '../../components/Table';
import { ButtonSuccess, ButtonDanger, ButtonPrimary, ButtonDefault } from '../../components/Buttons';
import { Row, Column } from '../../components/RowColumn';
import { TextArea, CheckBox, Select } from '../../components/Inputs';
import { Span } from '../../components/Labels';
import { FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const apiService = '/processostatus';

class LancamentoStatus extends Component {

    state = {
        showList: true,
        processo: {},
        flag: '',
        status: {
            id: 0,
            processo_servico_id: '',
            descricao_status: '',
            notifica_cliente: true,
            exibe_cliente: true,
            created_at: '',
            updated_at: '',
        },
        list: [],
        loadingButton:false
    }

    componentDidMount() {
        this.setState({ processo: this.props.processo, flag: this.props.flag ? this.props.flag : 'colaborador' });
        this.listAll();
    }



    /* ===== Api ===== */
    async listAll() {
        const { id } = this.props.processo;
        const result = await api.get(`/processostatus/getStatusDoProcesso?idProcesso=${id}`);
        const list = result.data || [];
        this.setState({ list });
    }

    /* ===== Clean Objects ===== */
    clearObject = () => {
        this.setState({
            status: {
                id: 0,
                processo_servico_id: '',
                descricao_status: '',
                notifica_cliente: true,
                exibe_cliente: true,
                created_at: '',
                updated_at: '',
            }
        });
    }

    /* ===== Validations ===== */
    validations = () => {

        const { status } = this.state;
        let errorDescriptions = '';

        if (status.descricao_status === '')
            errorDescriptions = "Preencha o campo Descrição do Status";
        if (status.processo_servico_id === '' || status.processo_servico_id == "-1")
            errorDescriptions = "Selecione para qual serviço esse status vai estar vinculado";

        if (errorDescriptions === '')
            return true;
        else {
            toast.error(errorDescriptions);
            return false;
        }

    }

    handleSave = async () => {

        this.setState({loadingButton:true});
        if (this.validations()) {
            let { status } = this.state;

            let response = null;
            let sucesso = false;

            if (status.id === 0)
                await api.post(apiService, status).then(response => {
                    sucesso = true;
                }).catch(error => {
                    sucesso = false;
                });
            else
                await api.put(apiService, status).then(response => {
                    sucesso = true;
                }).catch(error => {
                    sucesso = false;
                });

            if (sucesso) {
                this.clearObject();
                this.listAll();
                this.setState({ showList: true });
                toast.success('Status salvo com Sucesso');
            }
            else
                toast.error('Não foi possivel salvar o Serviço');


        }
        this.setState({loadingButton:false});
    }



    handleEdit = id => {

        let status = this.state.list.find(x => x.id === id);

        this.setState({
            status,
            showList: false
        });
    }

    renderAdicionar = e => {

        const { status, processo, loadingButton } = this.state;

        return (
            <>
                <Row>

                    <Column grow="1">
                        <Span>Descrição do Status</Span>

                        <TextArea rows="3" placeholder="Informe o lançamento do Status do Processo"
                            value={status.descricao_status}
                            maxLength={200}
                            onChange={(e) => { this.setState({ status: { ...status, descricao_status: e.target.value } }) }}
                        />
                    </Column>
                </Row>


                <Row justifyContent="flex-start">
                    <Column grow={1}>
                        <Span>Serviço</Span>
                        <Select
                            value={status.processo_servico_id}
                            onChange={(e) => { this.setState({ status: { ...status, processo_servico_id: e.target.value } }) }}
                        >
                            <option value="-1">{'Selecione o Serviço'}</option>
                            {
                                processo.processoServico.filter(ps => ps.numero_registro !== "").map(ps => {
                                    return (<option value={ps.idProcessoServico}>{ps.nome_servico} - {ps.numero_registro}</option>)
                                })
                            }

                        </Select>

                    </Column>
                </Row>

                <Row>
                    <Column >
                        <Row>
                            <CheckBox type="checkbox"
                                checked={status.exibe_cliente}

                                onChange={(e) => { this.setState({ status: { ...status, exibe_cliente: e.target.checked } }) }}
                            />
                            <Span>Enviar Notificação</Span>
                        </Row>
                    </Column>

                    <Column >
                        <Row>
                            <CheckBox type="checkbox"
                                checked={status.notifica_cliente}
                                onChange={(e) => { this.setState({ status: { ...status, notifica_cliente: e.target.checked } }) }}
                            />
                            <Span>Enviar e-mail</Span>
                        </Row>
                    </Column>

                </Row>

                <Row>
                    <Column >
                        <Row>

                            {
                                loadingButton ?
                                (<ButtonSuccess>Salvando Status</ButtonSuccess>):
                                (<ButtonSuccess onClick={() => this.handleSave()}>Salvar Status</ButtonSuccess>)

                            }




                            <ButtonDefault onClick={() => this.setState({ showList: true })}>Cancelar</ButtonDefault>
                        </Row>
                    </Column>

                </Row>
            </>
        )
    }

    renderList = e => {

        const { list } = this.state;
        console.log(list);
        return (
            <>
                <Row justifyContent="space-between">
                    <Column>
                        <h2>Status</h2>
                    </Column>

                    {
                        this.state.flag == 'colaborador' ?
                            (
                                < Column >
                                    <ButtonSuccess onClick={() => this.setState({ showList: false })}>Adicionar Status</ButtonSuccess>
                                </Column>
                            ) : ('')
                    }

                </Row>

                <Row>
                    <Table>
                        <thead>
                            <tr>

                                <th>Serviço</th>
                                <th>Descrição</th>
                                <th>Data</th>

                                {
                                    this.state.flag == 'colaborador' ?
                                        (
                                            <th>Ação</th>
                                        ) : ('')
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (list || []).map(l =>
                                    (
                                        <tr key={l.id}>

                                            <td>{l.processo_Servico.servico.nome_servico}</td>
                                            <td>{l.descricao_status}</td>
                                            <td>{new Date(l.updated_at).toLocaleString()}</td>

                                            {
                                                this.state.flag == 'colaborador' ?
                                                    (
                                                        <td>
                                                            <ButtonPrimary class="edit" width="70px" onClick={() => { this.handleEdit(l.id) }}>Editar</ButtonPrimary>
                                                        </td>

                                                    ) : ('')
                                            }

                                        </tr>
                                    )
                                )

                            }


                        </tbody>
                    </Table>
                </Row>

            </>
        )
    }

    render() {

        const { showList, processo } = this.state;



        return (
            <Modal>
                <ModalContent>


                    <Row justifyContent="space-between">
                        <Column>
                            <h1>{processo.referencia}</h1>
                        </Column>

                        <Column>
                            <FaTimes onClick={() => this.props.onClickClose(false)} color="#2f333e" size={20} />
                        </Column>
                    </Row>

                    {
                        showList ?
                            (
                                this.renderList()
                            ) :
                            (
                                this.renderAdicionar()
                            )
                    }

                </ModalContent>
            </Modal>

        )
    }
}

export default LancamentoStatus;

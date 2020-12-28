import React, { Component } from 'react'
import { ScreenComponent } from '../../components/Screen';
import { Row, Column } from '../../components/RowColumn';
import Table from '../../components/Table';
import api from '../../services/api';
import { toast } from 'react-toastify';

class Inicio extends Component {

    state = {
        processos: [],
        status: [],
        totalImportadores: 0,
        totalExportadores: 0,

        processosEmAndamento: 0,
        processosFinalizados: '-',

        statusLançados: 0,
        statusVisualizados: '-'
    }

    componentDidMount() {
        this.findAll();
    }

    /* ===== Api ===== */
    findAll() {
        this.listProcessos();
        this.listStatus();
        this.listClientes();
    }

    async listProcessos() {
        const result = await api.get('/processo');
        const list = result.data || [];

        const listProcessosFinalizados = list.filter(x => x.processofinalizado == 1);
        const listProcessosAndamento = list.filter(x => x.processofinalizado == 0);

        this.setState({ processos: list, processosEmAndamento: listProcessosAndamento.length, processosFinalizados: listProcessosFinalizados.length });
    }

    async listStatus() {
        const result = await api.get('/processostatus/getUltimosStatusDoProcesso');
        const list = result.data || [];
        this.setState({ status: list, statusLançados: list.length });
    }

    async listClientes() {
        const result = await api.get('/cliente');
        const list = result.data || [];

        let totalImportadores = 0, totalExportadores = 0;

        list.forEach(element => {

            switch (element.tipo) {
                case "Exportador": ++totalExportadores; break;
                case "Importador": ++totalImportadores; break;
                case "Exportador e Importador": ++totalExportadores; ++totalImportadores; break;
            }
        });

        this.setState({ totalExportadores, totalImportadores });
    }

    render() {

        const {
            processos,
            status,
            totalImportadores,
            totalExportadores,
            processosEmAndamento,
            processosFinalizados,
            statusLançados,
            statusVisualizados } = this.state;

        return (
            <>
                <ScreenComponent>

                    <Row>
                        <Column grow={1} border="1px solid #cecece" margin="10px;" boxShadow="2px 4px #dfdfdf">
                            <h2>Processos</h2>
                            <Row justifyContent="space-between">
                                <span>Em andamento</span>
                                <h3>{processosEmAndamento}</h3>
                            </Row>
                            <Row justifyContent="space-between">
                                <span>Finalizados</span>
                                <h3>{processosFinalizados}</h3>
                            </Row>

                        </Column>

                        <Column grow={1} border="1px solid #cecece" margin="10px;" boxShadow="2px 4px #dfdfdf">
                            <h2>Clientes</h2>
                            <Row justifyContent="space-between">
                                <span>Importadores</span>
                                <h3>{totalImportadores}</h3>
                            </Row>
                            <Row justifyContent="space-between">
                                <span>Exportadores</span>
                                <h3>{totalExportadores}</h3>
                            </Row>
                        </Column>

                        <Column grow={1} border="1px solid #cecece" margin="10px;" boxShadow="2px 4px #dfdfdf">
                            <h2>Status</h2>
                            <Row justifyContent="space-between">
                                <span>Lançados</span>
                                <h3>{statusLançados}</h3>
                            </Row>
                            <Row justifyContent="space-between">
                                <span>Visualizados</span>
                                <h3>{statusVisualizados}</h3>
                            </Row>
                        </Column>


                    </Row>


                    <Row margin="25px 0;">
                        <Column grow={1}>

                            <Row justifyContent="space-between">
                                <h2>Últimos Status Lançados</h2>

                                <a href="#">Ver mais</a>
                            </Row>

                            <Row>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Invoice</th>
                                            <th>Importador</th>
                                            <th>Exportador</th>
                                            <th>Status</th>
                                            <th>Visualizado</th>
                                            <th>Horário de Visualização</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            status.map(l => (
                                                <tr key={l.id}>
                                                    <td>{l.id}</td>

                                                    <td>{l.processo_Servico.processo.referencia}</td>

                                                    <td> {l.processo_Servico.processo.tipo_operacao == 'Importacao' ? l.processo_Servico.processo.cliente.nome : l.processo_Servico.processo.empresa.nome} </td>
                                                    <td> {l.processo_Servico.processo.tipo_operacao == 'Exportacao' ? l.processo_Servico.processo.cliente.nome : l.processo_Servico.processo.empresa.nome}</td>

                                                    <td>{l.descricao_status}</td>
                                                    <td>{l.exibe_cliente == '1' ? 'Não' : 'Sim'}</td>

                                                    <td>{l.exibe_cliente == '2' ? new Date(l.created_at).toLocaleString() : '-'}</td>

                                                </tr>
                                            ))}
                                    </tbody>
                                </Table>
                            </Row>

                        </Column>
                    </Row>


                    <Row>
                        <Column grow={1}>

                            <Row justifyContent="space-between">
                                <h2>Últimos Processos Criados</h2>

                                <a href="#">Ver mais</a>
                            </Row>

                            <Row>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Operação</th>
                                            <th>Invoice</th>
                                            <th>Importador</th>
                                            <th>Exportador</th>
                                            <th>Criado por</th>
                                            <th>Mercadoria</th>

                                            <th>Data de Criação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            processos.map(l => (
                                                <tr key={l.id}>
                                                    <td>{l.id}</td>
                                                    <td>{l.tipo_operacao}</td>
                                                    <td>{l.referencia}</td>

                                                    <td> {l.tipo_operacao == 'Importacao' ? l.cliente.nome : l.empresa.nome} </td>
                                                    <td> {l.tipo_operacao == 'Exportacao' ? l.cliente.nome : l.empresa.nome}</td>

                                                    <td>{l.colaborador.nome}</td>
                                                    <td>{l.mercadoria}</td>

                                                    <td>{new Date(l.created_at).toLocaleString()}</td>

                                                </tr>
                                            ))}

                                    </tbody>
                                </Table>
                            </Row>

                        </Column>
                    </Row>



                </ScreenComponent >


            </>
        );
    }
}

export default Inicio;

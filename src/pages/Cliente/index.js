import React, { Component } from 'react';
import Table from '../../components/Table';
import { ButtonSuccess, ButtonDanger, ButtonPrimary, ButtonDefault, Button } from '../../components/Buttons';
import { Row, Column } from '../../components/RowColumn';
import { Text, CheckBox, Select } from '../../components/Inputs';
import { Span } from '../../components/Labels';
import { ScreenComponent } from '../../components/Screen';
import Banner from '../../components/Banner';
//import Message from '../../components/Message';
import { ImagemPerfilUpload } from '../../components/Image';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { maskCPFouCNPJ } from '../../components/Mask';
import handleSearch from '../../services/search';
import { getToken } from '../../services/auth';
const apiService = '/cliente';

class Cliente extends Component {

    /* ===== State ===== */
    state = {

        page: {
            nomeTitulo: 'Clientes',
            buttonTitulo: 'Adicionar Cliente',
            showList: true
        },

        obj: {
            id: 0,
            nome: '',
            cpf_cnpj: '',
            ativo: true,
            email: '',
            senha: '',
            confirmarSenha: '',
            envio_email: true,
            tipo: '',
            criadoEm: '',
            atualizadoEm: '',
            imagem: null,
            fileImagem: null,
            nome_logo: '',
            nome_path: '',
            alterarSenha: true,
            showButtonAlterarSenha: false

        },

        list: [],
        listaFiltrada: []
    }

    /* ===== Component Life ===== */
    componentDidMount() {

        this.listAll();

        
    }

    /* ===== Api ===== */
    async listAll() {

        //const token = getToken();
        //api.defaults.headers.Authorization = `Bearer ${token}`;
        const result = await api.get(apiService);

        /*        
        api.get(apiService, {
        headers: {
            'Authorization': `token ${token}`
        }
        })
        .then((res) => {
        console.log(res.data)
        })
        .catch((error) => {
        console.error(error)
        })
        */

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

            let response = null;
            let sucesso = false;

            const formData = new FormData();
            formData.append('id', obj.id);

            formData.append('file', obj.fileImagem);
            formData.append('nome', obj.nome);
            formData.append('cpf_cnpj', obj.cpf_cnpj);
            formData.append('email', obj.email);
            if (obj.alterarSenha)
                formData.append('senha', obj.senha);
            formData.append('envio_Email', ((obj.envio_email == true || obj.envio_email == 1) ? 1 : 0));
            formData.append('ativo', ((obj.ativo == true || obj.ativo == 1) ? 1 : 0));
            formData.append('tipo', obj.tipo);
            formData.append('alterarSenha', obj.alterarSenha);

            console.log(obj);

            if (obj.id == 0)
                await api.post(apiService, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }).then(response => {
                    sucesso = true;
                }).catch(error => {
                    sucesso = false;
                });
            else
                await api.put(apiService, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }).then(response => {
                    sucesso = true;
                }).catch(error => {
                    sucesso = false;
                });

            if (sucesso) {
                this.clearObject();
                this.listAll();
                this.setState({ page: { ...this.state.page, showList: true } });
                toast.success('Cliente salvo com Sucesso');
            }
            else
                toast.error('Não foi possivel salvar o Cliente');

        }
    }

    handleEdit = id => {
        let obj = this.state.list.find(x => x.id == id);

        if (obj.logo_path) {
            obj.imagem = `http://localhost:3333/files/${obj.logo_path}`;
        }

        obj.showButtonAlterarSenha = true;
        obj.alterarSenha = false;

        this.setState({
            obj: obj,
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
        this.setState({ obj: { id: 0, nome: '', cpf_cnpj: '', email: '', senha: '', confirmarSenha: '', envio_email: true, tipo: '', ativo: true, criadoEm: '', atualizadoEm: '', alterarSenha: true, showButtonAlterarSenha: false } });
    }

    /* ===== Validations ===== */
    validations = () => {

        const { obj } = this.state;
        let errorDescriptions = '';

        if (obj.nome == '')
            errorDescriptions = `Preencha o campo Nome, `;

        if (obj.cpf_cnpj == '')
            errorDescriptions += "Preencha o campo CPF ou CNPJ, ";

        if (obj.email == '')
            errorDescriptions += "Preencha o campo Email, ";

        if (obj.alterarSenha) {
            if (obj.senha == '')
                errorDescriptions += "Preencha o campo Senha, ";
            else {
                if (obj.senha != obj.confirmarSenha)
                    errorDescriptions += "As senhas informadas não conferem, ";
            }
        }

        if (errorDescriptions == '')
            return true;
        else {
            toast.enableHtml = 
            toast.error(errorDescriptions,{enableHtml: true});
            return false;
        }

    }


    /* ===== Image ===== */
    changeImage = e => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];

            this.setState({
                obj: { ...this.state.obj, imagem: URL.createObjectURL(img), fileImagem: img }
            });
            e.target.value = null;
        }
    }

    getImage(url) {
        this.setState({ obj: { ...this.state.obj, imagem: `http://localhost:3333/files/${url}` } });
    }


    
    async removeImg(obj){
        
        let sucesso = false;
        
        await api.put(`${apiService}/putRemoveImagemCliente/${obj.id}`, JSON.stringify(obj), {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            sucesso = true;
        }).catch(error => {
            sucesso = false;
        });

        if (sucesso) {
            this.setState({ obj: { ...obj, imagem: null } });
            toast.success('Imagem removida com Sucesso');
        }
        else
            toast.error('Não foi possivel remover essa Imagem');
    }
    /* =====  Render ===== */




    renderForm() {

        const { obj } = this.state;

        return (
            <form>


                <Row>
                    <Column grow="3">
                        <Span>Nome</Span>
                        <Text placeholder="Informe o Nome"
                            value={obj.nome}
                            onChange={(e) => { this.setState({ obj: { ...obj, nome: e.target.value } }) }}
                        />
                    </Column>

                    <Column grow="1">
                        <Span>CPF ou CNPJ</Span>
                        <Text placeholder="Informe o CPF ou CNPJ"
                            value={obj.cpf_cnpj}
                            maxLength={18}
                            onChange={(e) => { this.setState({ obj: { ...obj, cpf_cnpj: maskCPFouCNPJ(e.target.value) } }); }}

                        />
                    </Column>

                    <Column grow="1">
                        <Span>Tipo</Span>

                        <Select value={obj.tipo} onChange={(e) => { this.setState({ obj: { ...obj, tipo: e.target.value } }) }}>
                            <option value="Selecione o Tipo">Selecione o Tipo</option>
                            <option value="Exportador">Exportador</option>
                            <option value="Importador">Importador</option>
                            <option value="Exportador e Importador">Exportador e Importador</option>
                        </Select>

                    </Column>
                </Row>

                <Row>
                    <Column grow="3">
                        <Span>Email</Span>
                        <Text placeholder="Informe o E-mail"
                            value={obj.email}
                            onChange={(e) => { this.setState({ obj: { ...obj, email: e.target.value } }) }}
                        />
                    </Column>

                    {

                        (obj.codigo == 0 || obj.alterarSenha) ?
                            (
                                <>
                                    <Column grow="2">
                                        <Span>Senha</Span>
                                        <Text placeholder="Informe a Senha"
                                            type="password"
                                            value={obj.senha}
                                            onChange={(e) => { this.setState({ obj: { ...obj, senha: e.target.value } }) }}
                                        />
                                    </Column>

                                    <Column grow="2">
                                        <Span>Confirmar Senha</Span>
                                        <Text placeholder="Informe a Senha"
                                            type="password"
                                            value={obj.confirmarSenha}
                                            onChange={(e) => { this.setState({ obj: { ...obj, confirmarSenha: e.target.value } }) }}
                                        />
                                    </Column>
                                </>
                            ) : ('')
                    }

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

                    <Column  >
                        <Row>
                            <CheckBox type="checkbox"
                                checked={obj.envio_email}
                                onChange={(e) => { this.setState({ obj: { ...obj, envio_email: e.target.checked } }) }}
                            />

                            <Span>Enviar e-mail</Span>

                        </Row>
                    </Column>
                </Row>

                <Row alignItems="flex-start">
                    <Column grow="1">

                        <Text
                            type="file"
                            onChange={this.changeImage}
                        />


                    </Column>
                    <Column grow="3" alignItems="center">
                        {
                            obj.imagem != null ?
                                (
                                    <>
                                        <ImagemPerfilUpload src={obj.imagem} />
                                        <Button background="white" color="#8b8d90" hBg="#dc3545" hC="white" onClick={() => { this.removeImg(obj) }}>Remover Imagem</Button>
                                    </>
                                ) :
                                ('')
                        }
                    </Column>
                </Row>

                <Row>
                    <Column grow="1" alignItems="flex-end">
                        <Row>

                            {
                                (obj.id != 0) ?
                                    (obj.showButtonAlterarSenha) ?
                                        (
                                            <ButtonPrimary class="edit" width="150px" onClick={() => { this.setState({ obj: { ...obj, showButtonAlterarSenha: false, alterarSenha: true } }) }}>Alterar Senha</ButtonPrimary>
                                        ) : <ButtonPrimary class="edit" width="150px" onClick={() => { this.setState({ obj: { ...obj, showButtonAlterarSenha: true, alterarSenha: false } }) }}>Cancelar Alterar Senha</ButtonPrimary>
                                    : ('')
                            }

                            <ButtonSuccess class="edit" width="150px" onClick={this.handleSave}>Salvar</ButtonSuccess>
                            <ButtonDefault class="edit" width="150px" onClick={this.handleCancelAdd}>Cancelar</ButtonDefault>
                        </Row>
                    </Column>



                </Row>

            </form >
        )
    }

    renderList() {

        const { listaFiltrada } = this.state;

        return (
            <>
                <Row>

                    <Column grow="1">
                        <Span>Pesquisar</Span>
                        <Text placeholder="Pesquise pelo nome, cpf, cnpj ou e-mail"
                            onChange={(e) => this.setState({ listaFiltrada: handleSearch(this.state.list, e.target.value) })}
                        />

                    </Column>
                </Row>


                <div style={{ "overflow-x": "auto", "padding": "10px" }}>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nome</th>
                                <th>Tipo</th>
                                <th>CPF</th>
                                <th>E-mail</th>

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
                                        <td>{l.tipo}</td>
                                        <td>{l.cpf_cnpj}</td>
                                        <td>{l.email}</td>

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

        const { page, showList } = this.state;

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

export default Cliente;
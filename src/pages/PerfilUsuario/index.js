import React, { Component } from 'react';
import Table from '../../components/Table';
import { ButtonSuccess, ButtonPrimary, ButtonDefault } from '../../components/Buttons';
import { Row, Column } from '../../components/RowColumn';
import { Text, CheckBox } from '../../components/Inputs';
import { Span } from '../../components/Labels';
import { ScreenComponent } from '../../components/Screen';
import Banner from '../../components/Banner';
import { getUserToken } from '../../services/auth';
import api from '../../services/api';
import { toast } from 'react-toastify';


//import { getToken } from '../../services/auth';
//const token = getToken();
const apiService = '/servico';

class PerfilUsuario extends Component {


    /* ===== State ===== */
    state = {

        page: {
            nomeTitulo: 'Configurações',
            buttonTitulo: '',
            showList: false
        },

        obj: {
            id: 0,
            tipo: '',
            alterarSenha: false,

            envio_email: 0,
            senha: '',
            confirmarSenha: '',

            nome:'',
            email:'',
            tipo:''
        },

        list: [],
    }

    /* ===== Component Life ===== */
    async componentDidMount() {

        const user = JSON.parse(getUserToken());
        this.setState({obj:{...this.state.obj, id: user.id, nome: user.nome, email: user.email, tipo: user.flag }});

        if(user.flag == 'cliente')
            this.verificaEnviarEmailOp(user.id);

    }

    async verificaEnviarEmailOp(id){
        //envio_email

        const result = await api.get(`/cliente/getClientePorCodigo/${id}`);
        if(result != null)
        {
            this.setState({obj:{...this.state.obj, envio_email: result.data.envio_email}});
        }
    }

    /* ===== Api ===== */


    /* ===== Events =====  */


    handleSave = async () => {

        if (this.validations()) {
            let { obj } = this.state;

            let sucesso = false;

            let urlService = obj.tipo == 'cliente' ? '/cliente/alterarConfiguracoes' : '/colaborador/alterarConfiguracoes'

                await api.put(urlService, obj).then(response => {
                    sucesso = true;
                }).catch(error => {
                    sucesso = false;
                });


            if (sucesso) {

                this.setState({ obj:{...obj, senha:'', confirmarSenha:'', alterarSenha:false} })
                toast.success('Usuario salvo com Sucesso');
            }
            else
                toast.error('Não foi possivel alterar o Usuário');

        }
    }



    /* ===== Clean Objects ===== */
    clearObject = () => {
        this.setState({ obj: { id: 0, nome_servico: '', ativo: true, criadoEm: '', atualizadoEm: '' } });
    }


    /* ===== Validations ===== */
    validations = () => {

        const { obj } = this.state;
        let errorDescriptions = '';

        if (obj.alterarSenha) {
            if (obj.senha == '')
                errorDescriptions += "Preencha o campo Senha, ";
            else {
                if (obj.senha != obj.confirmarSenha)
                    errorDescriptions += "As senhas informadas não conferem, ";
            }
        }
        else
            if(obj.tipo != 'cliente')
                errorDescriptions += "Você não tem nada para ser alterado";

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
                        <h2>{obj.nome}</h2>
                        <span>{obj.email}</span>
                    </Column>
                </Row>


                {
                    obj.tipo == 'cliente'?
                    (
                <Row>
                    <Column >
                        <Row>
                            <CheckBox type="checkbox"
                                checked={obj.envio_email == 1 ? true:false}
                                onChange={(e) => { this.setState({ obj: { ...obj, envio_email: e.target.checked } }) }}
                            />
                            <Span>Receber notificação via e-mail</Span>

                        </Row>
                    </Column>
                </Row>
                    ) : null
                }


                <Row>
                {
                (obj.alterarSenha) ?
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
                    <Column grow="1" alignItems="flex-end">
                        <Row>
                        {

                                    (!obj.alterarSenha) ?
                                        (
                                            <ButtonPrimary class="edit" width="150px" onClick={() => { this.setState({ obj: { ...obj, alterarSenha: true } }) }}>Alterar Senha</ButtonPrimary>
                                        ) : <ButtonPrimary class="edit" width="150px" onClick={() => { this.setState({ obj: { ...obj, alterarSenha: false } }) }}>Cancelar Alterar Senha</ButtonPrimary>


                            }
                            <ButtonSuccess class="edit" width="150px" onClick={this.handleSave}>Salvar</ButtonSuccess>
                        </Row>
                    </Column>
                </Row>

            </form>
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
                       this.renderForm()
                    }
                </ScreenComponent>

            </>
        )
    }
}

export default PerfilUsuario;

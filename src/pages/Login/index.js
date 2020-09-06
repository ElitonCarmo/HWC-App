import React, { Component } from 'react';
import { Form, SubmitButton, List } from './styles';
import { ScreenLogin, LogoImagem } from '../../components/ScreenLogin';

import { ContainerLogin } from '../../components/Container';

import api from '../../services/api';
import { login } from '../../services/auth';
import { toast } from 'react-toastify';

import { Redirect } from "react-router-dom";

const apiService = '/sessions';

class Login extends Component {

    state = { loading: false, email: '', senha: '', redirect: false, linkRedirect: '' }

    btnEntrar = async e => {
        e.preventDefault();

        const { email, senha } = this.state;
        let user = { email, senha }

        this.setState({ loading: true });

        await api.post(apiService, user).then(response => {

            api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
            login(response.data.token, JSON.stringify(response.data.usuario));
            this.setState({ redirect: true, linkRedirect: (response.data.usuario.flag == 'colaborador' ? '/inicio' : '/processocliente') });

        }).catch(error => {
            toast.error('Não foi possivel realizar o Acesso, verifique seu email e senha');
        });

        this.setState({ loading: false });
    }

    renderRedirect() {
        if (this.state.redirect)
            return <Redirect to={{ pathname: this.state.linkRedirect }} />
    }

    render() {

        const { loading, email, senha } = this.state;

        return (
            <ContainerLogin>
                {this.renderRedirect()}
                <ScreenLogin>

                    <LogoImagem>
                        <img src="http://www.hwcomex.com.br/assets/img/logo/hwcomex.png" alt="Logo" />
                    </LogoImagem>

                    <h1>Área de Acesso </h1>

                    <Form onSubmit={this.handleSubmit} >

                        < input type="text"
                            placeholder="Informe seu e-mail"
                            value={email}
                            onChange={
                                (e) => { this.setState({ email: e.target.value }) }}
                        />

                        <   input type="password"
                            placeholder="Informe sua Senha"
                            value={senha}
                            onChange={
                                (e) => { this.setState({ senha: e.target.value }) }}
                        />

                        <SubmitButton loading={loading} onClick={this.btnEntrar} >


                            Entrar

                </SubmitButton>
                    </Form>

                    <List >

                    </List>


                </ScreenLogin >
            </ContainerLogin>
        )
    }
}

export default Login;

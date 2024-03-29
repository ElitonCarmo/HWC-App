import React, { Component } from 'react'
import { MainNav, Li } from './styles';
import { Link } from "react-router-dom";
import { getUserToken } from '../../services/auth';
import { FaHome, FaUserCog, FaUser, FaCopy, FaMap } from 'react-icons/fa'
import { havePermission } from '../../services/permissoes';
import logoUser from '../../images/logoUser.png';

class NavLeft extends Component {

    state = {
        currentPage: 'inicio',
        user: {
            nome: '', flag: '', tipo: '', imagem: '', descricaoSubTitulo: ''
        },
    }

    async componentDidMount() {
        this.configUser();
    }

    async configUser(){
        const user = JSON.parse(getUserToken());


        if (user.logo_path !== null && user.logo_path !== ""){
            user.logo_path = `http://104.131.13.240:3333/files/${user.logo_path}`;
        }
        else
        {
            user.logo_path = logoUser;//'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
        }
     

        if(user.flag == 'colaborador')
            user.descricaoSubTitulo = user.tipo;
        else
            user.descricaoSubTitulo = 'Cliente';

        this.setState({ user });
    }


    renderItem(screen, page, link, Icon) {

        const { currentPage } = this.state;

        return (
            havePermission(screen) ?
                (
                    <Li class={currentPage === page ? 'active' : ''} onClick={() => this.setState({ currentPage: page })}>
                        <Link to={link}><Icon color="#2f333e" size={20} />{page}</Link>
                    </Li>
                ) : ('')
        )
    }

    renderAcessos() {

        const { user } = this.state;
        return (
            <>
                {this.renderItem('Inicio', 'Inicio', '/inicio', FaHome)}
                {this.renderItem('Processo', 'Processos', '/processo', FaCopy)}
                {this.renderItem('ProcessoCliente', 'Processos Cliente', '/processocliente', FaCopy)}
                {this.renderItem('Cliente', 'Clientes', '/cliente', FaUser)}
                {this.renderItem('EmpresaEstrangeira', 'Empresa Estrangeira', '/empresaestrangeira', FaUser)}
                {this.renderItem('Colaborador', 'Colaboradores', '/colaborador', FaUserCog)}
                {this.renderItem('Servico', 'Serviços', '/servico', FaMap)}
                {this.renderItem('PerfilUsuario', 'Configurações', '/perfilUsuario', FaUserCog)}


            </>
        )
    }

    renderNavLeft = e => {

        const { currentPage, permissoes } = this.state;
        const { user } = this.state;

        return (
            <MainNav>
                <div class="content">

                    <div class="top">
                        <div class="user">
                            <img src={user.logo_path} alt="Perfil" />
                            <div class="infoUser">
                                <h1 title={user.email}>{user.nome}</h1>
                                <span>{user.descricaoSubTitulo}</span>
                            </div>
                        </div>

                        <nav>

                            <span class="separador">Menu</span>

                            <ul>

                                {
                                    this.renderAcessos()
                                }



                            </ul>
                        </nav>
                    </div>

                    <div class="side">
                        <img src="http://www.hwcomex.com.br/assets/img/logo/hwcomex.png" alt="Logo" />
                        <span>Versão 1.0</span>
                    </div>
                </div>
            </MainNav>
        )
    }

    render() {

        let showNavLeft = this.props.showNavLeft || true;

        return (
            <>
                {
                    showNavLeft ?
                        (
                            this.renderNavLeft()
                        )
                        :
                        (
                            ''
                        )
                }
            </>
        )

    }
}

export default NavLeft;

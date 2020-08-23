import React, { Component } from 'react'
import { MainHeader } from './styles';

import { FaBars } from 'react-icons/fa'
import { Redirect } from "react-router-dom";
import { logout } from '../../services/auth';


class Header extends Component {

    state = {
        redirect: false
    };

    

    handleLogout = e => {
        logout();
        this.setState({ redirect: true });
    }

    renderRedirect() {
        if (this.state.redirect)
            return <Redirect to={{ pathname: '/' }} />
    }

    render() {
        return (
            <>
                {this.renderRedirect()}
                <MainHeader>
                    <div class="content">

                        <div class="title">
                            <h1>HWC </h1> <span>omex</span>
                         
                        </div>

                        <div class="side">
                            <a onClick={this.handleLogout} >Logout</a>
                        </div>
                    </div>
                </MainHeader>
            </>
        )
    }
}


export default Header;
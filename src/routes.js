import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Login from './pages/Login';
import Inicio from './pages/Inicio';
import Servico from './pages/Servico';
import Colaborador from './pages/Colaborador';
import Cliente from './pages/Cliente';
import Processo from './pages/Processo';
import ProcessoCliente from './pages/ProcessoCliente';
import EmpresaEstrangeira from './pages/EmpresaEstrangeira';

import { isAuthenticated } from './services/auth';
import Header from './components/Header';
import { Container } from './components/Container';
import NavLeft from './components/NavLeft';
import { Screen } from './components/Screen';

//alert(isAuthenticated())

/*
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}

    render={props =>

      isAuthenticated() ? (
        <Component {...props} />
      ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
    }
  />
);
*/

const Wrapper = ({ children }) => (
  <>
    {
      isAuthenticated(children.type.name) ?
        (
          <>
            <Header />
            <Container>
              <NavLeft />
              <Screen>
                {children}
              </Screen>
            </Container>
          </>
        ) :
        (
          <Redirect to={{ pathname: "/" }} />
        )
    }
  </>
);

/*
 <PrivateRoute path="/inicio" component={Wrapper}>
      <Wrapper>
        <Inicio />
      </Wrapper>
    </PrivateRoute>
*/

const Routes = () => (

  <Switch>

    <Route path="/" exact component={Login} />

    <Route path="/inicio" component={Wrapper}>
      <Wrapper>
        <Inicio />
      </Wrapper>
    </Route>

    <Route path="/servico" component={Wrapper}>
      <Wrapper>
        <Servico />
      </Wrapper>
    </Route>


    <Route path="/colaborador" component={Wrapper}>
      <Wrapper>
        <Colaborador />
      </Wrapper>
    </Route>


    <Route path="/cliente" component={Wrapper}>
      <Wrapper>
        <Cliente />
      </Wrapper>
    </Route>

 

    <Route path="/empresaestrangeira" component={Wrapper}>
      <Wrapper>
        <EmpresaEstrangeira />
      </Wrapper>
    </Route>


    <Route path="/processo" component={Wrapper}>
      <Wrapper>
        <Processo />
      </Wrapper>
    </Route>


    <Route path="/processocliente" component={Wrapper}>
      <Wrapper>
        <ProcessoCliente />
      </Wrapper>
    </Route>

  </Switch>
)

export default Routes;
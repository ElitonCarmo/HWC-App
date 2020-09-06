import React, { Component } from 'react';
import Routes from './routes';
import GlobalStyle from './styles/global';

import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { MemoryRouter } from 'react-router-dom';

class App extends Component {

  state = {
    showNavLeft: true
  }

  //updateNavLeft = op => {
  //  this.setState({ ocultarNavLeft: op });
  //}

  render() {

    return (

      <MemoryRouter>
        <Routes />
        <GlobalStyle />
        <ToastContainer autoClose={2500} />
      </MemoryRouter>

    );
  }
}

/*
<BrowserRouter>
       
        <Header showNavLeft={this.state.showNavLeft} onClickBars={(value) => this.setState({ showNavLeft: value })} />
        <Container>
          <NavLeft showNavLeft={this.state.showNavLeft} />
          <Screen>
            <Routes />
          </Screen>
        </Container>

        <GlobalStyle />
        <ToastContainer autoClose={2500}/>
      </BrowserRouter>

*/
export default App;

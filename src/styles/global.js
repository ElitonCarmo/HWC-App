import { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`

    * {
        margin:0;
        padding:0;
        outline:0;
        box-sizing: border-box;
    }

    html, body, #root{
        min-height: calc(100vh - 60px);
    }

    body{
        background: #cfe3ef;

        font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
        text-rendering: optimizeLegibility !important;
        -webkit-font-smoothing: antialiased !important;
    }

    body, input, button {
        color: #222;
        font-size: 14px;
        font-family: Arial, Helvetica, sans-serif;
    }

    button {
        cursor: pointer
    }




`;

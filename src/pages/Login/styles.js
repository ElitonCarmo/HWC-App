import styled, { keyframes, css } from 'styled-components';



export const Form = styled.form`
    margin-top:30px;
    display:flex;
    flex-direction:column;

    input {
        flex: 1;
        border: 1px solid #eee;
        padding: 10px 15px;
        border-radius: 4px;
        font-size:16px;
        margin-bottom:10px;
    }

    input:hover {
        border-color:#343434;
    }
    
`;

export const List = styled.ul`
   list-style:none;
   margin-top:30px;

   li{
       padding:15px 0;
       display: flex;
       flex-direction:row;
       justify-content:space-between;
       align-items:center;
   
        & + li {
            border-top: 1px solid #eee;
        }

        a{
            color: #7165ca;
            text-decoration:none;
        }
    }
`;


const rotate = keyframes`

    from{
        transform: rotate(0deg);
    }
    to{
        transform: rotate(360deg);
    }

`;

export const SubmitButton = styled.button.attrs(props => ({
    type: 'submit',
    disabled: props.loading
}))`

    background:#6a95e2;
    border: 0;
    padding: 0 15px;
    margin-left: 10px;
    border-radius: 4px;
    height:40px;
    font-size:18px;
    color:white;

    display:flex;
    justify-content: center;
    align-items:center;

    &[disabled]{
        cursor: not-allowed;
        opacity:0.6
    }

    svg {
        margin-right:0px !important;
    }

  
`;



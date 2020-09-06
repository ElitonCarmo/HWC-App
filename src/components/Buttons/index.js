import styled from 'styled-components'

export const ButtonSuccess = styled.div`
    border:0;
    color:#fff;
    background:#28a745;
    padding:8px;
    font-weight:400;
    border-radius:5px;
    cursor:pointer;
    text-align:center;
    margin:1px;
    width: ${props => props.width || "200px"};
`
export const ButtonDanger = styled.div`
    border:0;
    color:#fff;
    background:#dc3545;
    padding:8px;
    font-weight:400;
    border-radius:5px;
    cursor:pointer;
    text-align:center;
    margin:1px;
    width: ${props => props.width || "200px"};
`
export const ButtonPrimary = styled.div`
    border:0;
    color:#fff;
    background:#007bff;
    padding:8px;
    font-weight:400;
    border-radius:5px;
    cursor:pointer;
    text-align:center;
    margin:1px;
    width: ${props => props.width || "200px"};
`

export const ButtonDefault = styled.div`
    border:0;
    color:#fff;
    background:#6c757d;
    padding:8px;
    font-weight:400;
    border-radius:5px;
    cursor:pointer;
    text-align:center;
    margin:1px;
    width: ${props => props.width || "200px"};
`

export const ButtonInfo = styled.div`
    border:0;
    color:#fff;
    background:#17a2b8;
    padding:8px;
    font-weight:400;
    border-radius:5px;
    cursor:pointer;
    text-align:center;
    margin:1px;
    width: ${props => props.width || "200px"};
`

export const Button = styled.div`
    border:0;
    color:${props => props.color || "black"};;
    background:${props => props.background || "white"};
    padding:8px;
    font-weight:400;
    border-radius:5px;
    cursor:pointer;
    text-align:center;
    margin:1px;
    width: ${props => props.width || "200px"};

    &:hover{
        background: ${props => props.hBg || "white"};
        color: ${props => props.hC || "black"};
    }
`

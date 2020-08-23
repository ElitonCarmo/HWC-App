import styled from 'styled-components';


export const MainBanner = styled.div`
 
    min-height: 50px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    
    flex-wrap:wrap;
    color:black;
    background:white;
    padding-left:30px;
    padding-right:20px;
    box-shadow: 0 1px 2px rgba(154, 154, 154, 0.5);

    h1{
        color:#2f333e;
        font-size:23px;
    }

    @media(max-width: 800px) {
                
        flex-direction:column;
        justify-content:flex-end;
        align-items:flex-start;
        padding-left:10px;
        margin:0;
    }
`;
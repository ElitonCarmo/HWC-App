import styled from 'styled-components';

const Table = styled.table`

    width:100%;
    border-collapse: collapse;
    border-spacing: 0;
  
    
    h1{
        font-weight:500;
    }

    thead{
        background:#3c5d70;
        color:white;
        th{
            border-bottom: 2px solid #dee2e6;

        }

        
    }

    th, tr, td{
        border-top:1px solid #dee2e6;
        padding:10px;
        min-height:35px;
    }
    
    th{
        text-align:left;
    }

    
`;

export default Table;
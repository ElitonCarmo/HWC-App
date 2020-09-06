import styled from 'styled-components';

export const Row = styled.div`
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
    align-items:${props=> props.alignItems || "center"};
    justify-content:${props=> props.justifyContent || "flex-start"};

    padding:${props=> props.padding || "0"};
    border:${props=> props.border || "none"};
    border-color: ${props=> props.borderColor || "none"};
    color:${props=> props.color || "black"};
    background:${props=> props.background || "white"};
    margin:${props=> props.margin || "0"};
    box-shadow:${props=> props.boxShadow || "none"};
`

export const Column = styled.div`
    display:flex;
    flex-grow:${props => props.grow};
    flex-direction:column;
    align-items:${props=> props.alignItems || "none"};

    padding:${props=> props.padding || "10px"};
    border:${props=> props.border || "none"};
    background:${props=> props.background || "white"};
    margin:${props=> props.margin || "0"};
    box-shadow:${props=> props.boxShadow || "none"};
`

import styled from "styled-components";

export const Span = styled.span`
    font-size:${props => props.fontSize || "15px"};
    margin-right: ${props => props.marginRight || "5px"};
    font-weight: ${props => props.fontWeight || "none"};
    color: ${props => props.color || "#353535"};
    background: ${props => props.background || "white"};

`;

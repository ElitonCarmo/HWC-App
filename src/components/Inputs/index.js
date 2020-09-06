import styled from 'styled-components';

export const Text = styled.input`
   padding:8px;
   font-size:14px;
   border:1px solid #c3c3c3;

   &:hover{
      border:1px solid #5e6370;
   }

   &:active {
      border:1px solid #5e6370;
   }
`

export const TextArea = styled.textarea`
   padding:8px;
   font-size:14px;
   border:1px solid #c3c3c3;

   &:hover{
      border:1px solid #5e6370;
   }
`

export const Select = styled.select`
   padding:8px;
   font-size:14px;
   border:1px solid #c3c3c3;

   option{
      font-size:14px;

   }

   &:hover{
      border:1px solid #5e6370;
   }
`

export const CheckBox = styled.input`
   padding:8px;
   margin-right:10px;
   font-size:14px;
   border:1px solid #c3c3c3;
   width:25px;
   height:25px;

   &:hover{
      border:1px solid #5e6370;
   }
`

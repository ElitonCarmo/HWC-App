import styled from 'styled-components';

export const MainHeader = styled.header`

  background:#2f333e;
  color:white;
  height:60px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.25);
  position:relative;
  z-index:1;

  .content{

    display:flex;
    justify-content: space-between;
    height:100%;

    .title{

      padding:5px;
      padding-left:15px;
      display:flex;
      justify-content:center;
      align-items:center;

      .bars{
        cursor:pointer;
        margin-left:60px;
      }

      span{
        font-size:25px;
      }
    }

    img{
      height:100%;
      /*margin-top:15px;*/
      margin-left:15px;
      margin-right:15px;
    }

    nav{
        height:100%;
        display:flex;
        flex:1;
      ul{

          display:flex;
          align-items:center;
          height:100%;

        li{
          list-style:none;
          padding:10px;
          height:100%;
          display:flex;
          align-items:center;
          cursor:pointer;
          font-size:17px;

          a{
            text-decoration:none;
            color:white;
          }

          /*
          &:hover{
            background:#e0e0e0;
          }
          */
        }
      }
    }

    .side{
      display:flex;
      align-items:center;
      padding-right:15px;
      color:white;
      font-size:17px;
      cursor:pointer;
      position:relative;

      &:hover{
        font-weight:bold;
      }

      a{
        text-decoration:none;
        color:white;
      }

    .options{
        /* */
        display:none;
        /* */
        position:absolute;
        background:red;
        margin-top:60px;
        margin-left:-80px;
        padding:20px;
        width:150px;
        height:150px;

        ul{
          list-style:none;
          display:flex;
          flex-direction:column;
        }
      }




    }
  }

`;


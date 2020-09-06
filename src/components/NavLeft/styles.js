import styled from 'styled-components';

export const Li = styled.li`
    display: ${props => props.display || 'block'} !important;
`

export const MainNav = styled.nav`

    .content{
        display:flex;
        flex-direction:column;
        justify-content:space-between;

        width:230px;
        background:white;

        min-height: calc(100vh - 60px);
        height:100%;


        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
        position:relative;

        .top{
            .user{

                padding:10px;
                height: 70px;
                margin-top:20px;
                margin-bottom:20px;
                display:flex;
                justify-content:flex-start;
                align-items:center;

                img{
                    border-radius:50%;
                    width:70px;
                    height:70px;
                }

                .infoUser{
                    display:flex;
                    justify-content:flex-start;
                    align-items:flex-start;
                    flex-direction:column;

                    h1{
                        font-size:18px;
                    }

                    span{
                        color:#767676;
                    }
                }
            }

            .separador{
                margin-top:10px;
                color:#767676;
                padding-left:10px;
                margin-bottom:10px;
            }

            nav{
                ul{

                    .active{
                        background:#6196b6;
                        color:white;

                        a, svg{color:white !important;}
                    }

                    li{
                        padding:0px;
                        font-size:15px;
                        height:40px;
                        display:flex;
                        align-items:center;
                        justify-content:flex-start;
                        color:#6196b6;
                        cursor:pointer !important;


                        a{
                            text-decoration:none;
                            font-weight:300;
                            margin-left:8px;
                            width:100%;

                            height:40px;
                            display:flex;
                            align-items:center;
                            justify-content:flex-start;

                            svg{
                                margin-right:15px;
                            }
                        }



                        &:hover{
                            background:#7fb0cddb;
                            color:white;
                            a, svg{color:white !important;}
                        }
                    }
                }
            }
        }

        .side{
            display:flex;
            flex-direction:column;
            align-items:center;
            padding-bottom:10px;


            img{
                width:55%;
            }

        }
    }



    @media(max-width: 800px) {
        .content{

            width:110px;
            .user{
                flex-direction:column;

                img{
                    border-radius:50%;
                    width:55px;
                    height:55px;
                }

                .infoUser{
                    display: none !important;

                }
            }

            nav{
                margin-top:40px;

                ul{
                    li{
                        display:flex;
                        flex-direction:column;
                        text-align:center;
                        height:60px !important;

                        a
                        {
                            display:flex;
                            flex-direction:column;
                            align-items:center;
                            justify-content:center !important;
                            height:60px !important;
                            margin-left:0 !important;
                            svg{
                                margin:0 !important;
                            }
                        }


                    }
                }
            }

            .separador{
                margin-top:20px;
            }
        }
    }


`;


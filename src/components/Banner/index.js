import React from 'react'
import { MainBanner } from './styles';
import { ButtonSuccess } from '../Buttons';

function Banner({ name, buttonTitulo, showButtonAdd, tamanhoButton, onClickEvent }) {
    return (
        <MainBanner>
            <h1>{name}</h1>

            {
                showButtonAdd ?
                    (<ButtonSuccess width={tamanhoButton} onClick={onClickEvent}>{buttonTitulo} </ButtonSuccess>) :
                    ('')
            }
        </MainBanner>
    )
}


export default Banner;
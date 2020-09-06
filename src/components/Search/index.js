import React from 'react';

/* =====  Search ===== */
function handleSearch(list, pesquisar) {

    let listaFiltrada = list.filter(x => {
        const keys = Object.keys(x);
        let encontrou = false;

        for (let i = 0; i < keys.length && !encontrou; i++) {
            if (x[keys[i]].toString().toLowerCase().includes(pesquisar.toLowerCase()))
                encontrou = true;
        }
        return encontrou;
    });
    return listaFiltrada;
}

export default Search;

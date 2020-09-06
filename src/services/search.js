import React from 'react';

/* =====  Search ===== */
function handleSearch(list, pesquisar) {

    let listaFiltrada = list.filter(x => {
        const keys = Object.keys(x);
        let encontrou = false;

        for (let i = 0; i < keys.length && !encontrou; i++) {

            if (typeof x[keys[i]] === 'object') {

                try {
                    let listaResultado = [];

                    if (Array.isArray(x[keys[i]]))
                        listaResultado = handleSearch(x[keys[i]], pesquisar);
                    else
                        listaResultado = handleSearch([x[keys[i]]], pesquisar);

                    if (listaResultado.length > 0)
                        encontrou = true;
                }
                catch (e) {
                    encontrou = false;
                }
            }
            else {
                let valor = x[keys[i]].toString().toLowerCase();

                if (keys[i] == 'ativo')
                    valor = x[keys[i]] == 1 ? 'sim' : 'não';

                if (valor.includes(pesquisar.toLowerCase()))
                    encontrou = true;
            }

        }
        return encontrou;
    });
    return listaFiltrada;
}

export default handleSearch;

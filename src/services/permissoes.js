import { getUserToken } from './auth';

export const havePermission = (screen) => {

    let user = JSON.parse(getUserToken());
    let permission = false;

    if (user.flag == 'cliente' && screen == 'ProcessoCliente')
        permission = true;
    else {
        if (user.flag == 'colaborador') {
            permission = true;

            if (user.tipo == 'Colaborador' && screen == 'Colaborador')
                permission = false;
        }
    }

    console.log(permission);
    return permission;
}
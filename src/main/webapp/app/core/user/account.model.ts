import {IAuthority} from 'app/core/authority/authority.model';

export class Account {

    constructor(
    public activated: boolean,
    public authorities: IAuthority[],
    public email: string,
    public firstName: string,
    public langKey: string,
    public lastName: string,
    public login: string,
    public image: string
    ) {}

}

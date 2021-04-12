import {IAuthority} from "../authority/authority.model";

export interface IProfile {
    id?: number;
    name?: string;
    description?: string;
    authorities?: IAuthority[];
}

export class Profile implements IProfile {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public authorities?: IAuthority[]
    ) {
        this.id = id ? id : null;
        this.name = name ? name : null;
        this.description = description ? description : null;
        this.authorities = authorities ? authorities : [];
    }
}

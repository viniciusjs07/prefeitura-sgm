import {Category, ICategory} from './../category/category.model';

export interface IService {
    name?: string;
    id?: string;
    category?: ICategory;
    activated: boolean;
    description?: string;
}

export class Service implements IService {

    name ?: string;
    id ?: string;
    category?: ICategory;
    activated = false;
    description?: string;

    constructor({
                    id, name, category, activated, description,

                }: any = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category && new Category(category.id, category.activated, category.name);
        this.activated = activated;
    }

}

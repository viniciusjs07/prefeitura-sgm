export interface ICategory {
    id?: string;
    activated: boolean;
    name?: string;
    parent?: Category;
    subCategories: Category[];
    idFamily: number;
}

export class Category implements ICategory {

    parent: Category;
    subCategories: Category[];
    idFamily: number;

    constructor(
        public id?: string,
        public activated = true,
        public name: string = '',
        parent: Category = null,
        subCategories: Category[] = [],
        idFamily?
    ) {
        this.parent = parent && new Category(parent.id, parent.activated, parent.name, parent.parent, parent.subCategories, parent.idFamily);
        this.subCategories = subCategories && subCategories.map((json: any) => {
            if (json instanceof Category) {
                return json;
            }
            return new Category(json.id, json.activated, json.name, json.parent, json.subCategories, json.idFamily);
        });
        this.idFamily = idFamily;

    }

}

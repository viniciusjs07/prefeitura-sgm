import {SERVER_API_URL} from 'app/app.constants';
import {map} from 'rxjs/operators';
import {Category} from './category.model';
import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {createRequestOption} from 'app/shared/util/request-util';

@Injectable({providedIn: 'root'})
export class CategoryService {

    private readonly resourceUrl = `${SERVER_API_URL}api/categories`;

    constructor(private readonly http: HttpClient) {
    }

    query(req?: any): Observable<Category[]> {
        const options = createRequestOption(req);

        return this.http.get<Category[]>(this.resourceUrl, {params: options, observe: 'response'})
            .pipe(map((response: HttpResponse<any>) => response.body.map((json) => this.mapJsonToCategory(json))));
    }

    private mapJsonToCategory(json): Category {
        const category = new Category(
            json.id,
            json.activated,
            json.name,
            json.parent,
            (json.subCategories || []),
            json.idFamily
        );
        category.subCategories.forEach((subCategory) => {
            subCategory.parent = category;
        });
        return category;
    }
}

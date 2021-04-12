import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {IService, Service} from './service.model';
import {Observable} from 'rxjs';
import {createRequestOption} from 'app/shared/util/request-util';

@Injectable({providedIn: 'root'})
export class TownHallService {

    private readonly resourceUrl = '/api/services';
    service: IService;

    constructor(private readonly http: HttpClient) {
    }

    create(iService: IService) {
        return this.requestService(iService, 'POST')
    }

    update(iService: IService) {
        return this.requestService(iService, 'PUT')

    }

    requestService(iService: IService, type: any) {
        return this.http.request(new HttpRequest(type, `${this.resourceUrl}`, iService, {
            reportProgress: true
        }));
    }

    find(id: string): Observable<IService> {
        return this.http.get<IService>(`${this.resourceUrl}/${id}`)
            .pipe(map((data: any) => new Service(data)));
    }

    query(req?: any): Observable<HttpResponse<IService[]>> {
        const options = createRequestOption(req);
        return this.http.get<IService[]>(this.resourceUrl, {params: options, observe: 'response'});
    }

    queryActivated(req?: any): Observable<HttpResponse<IService[]>> {
        const options = createRequestOption(req);
        return this.http.get<IService[]>(`${this.resourceUrl}/activated`, {params: options, observe: 'response'});
    }

    changeStatus(id: string): Observable<any> {
        return this.http.post(`${this.resourceUrl}/changeStatus/${id}`, null);
    }

    getService(res: HttpResponse<any>): any[] {
        return res.body.content.map((json) => {
            this.service = {
                id: json.id,
                category: json.category,
                activated: json.activated,
                name: json.name,
                description: json.description,
            };
            return new Service(this.service);
        });
    }
}

import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SERVER_API_URL} from 'app/app.constants';
import {createRequestOption} from 'app/shared/util/request-util';
import {IUser} from './user.model';
import {IAuthority} from "app/core/authority/authority.model";

@Injectable({providedIn: 'root'})
export class UserService {

    public resourceUrl = `${SERVER_API_URL}api/users`;

    constructor(private readonly http: HttpClient) {
    }

    create(user: IUser): Observable<IUser> {
        return this.http.post<IUser>(this.resourceUrl, user);
    }

    update(user: IUser): Observable<IUser> {
        return this.http.put<IUser>(this.resourceUrl, user);
    }

    updateImage(user: IUser): Observable<IUser> {
        return this.http.put<IUser>(`${this.resourceUrl}/image`, user);
    }

    find(login: string): Observable<IUser> {
        return this.http.get<IUser>(`${this.resourceUrl}/${login}`);
    }

    query(req?: any): Observable<HttpResponse<IUser[]>> {
        const options = createRequestOption(req);
        return this.http.get<IUser[]>(this.resourceUrl, {params: options, observe: 'response'});
    }

    changeStatus(login: string): Observable<any> {
        return this.http.delete(`${this.resourceUrl}/${login}/logic`);
    }

    authorities(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http.get<any>(`${SERVER_API_URL}api/users/authorities`, {
            params: options,
            observe: 'response'
        })
            .pipe(map((res: HttpResponse<any>) => this.convertArrayResponse(res)));
    }

    private convertArrayResponse(res: HttpResponse<any>): HttpResponse<any> {
        const iAuthorities: IAuthority[] = res.body.content;
        const content: IAuthority[] = [];
        for (const authority of iAuthorities) {
            content.push(this.convertItemFromServer(authority));
        }
        return res.clone({body: {...res.body, content}});
    }

    /**
     * Convert a returned JSON object to AuthorityModel.
     */
    private convertItemFromServer(authority: IAuthority): IAuthority {
        return Object.assign({}, authority);
    }

    changePassword(passwordForm: any): Observable<any> {  
        return this.http.patch(`${this.resourceUrl}/changepassword`, passwordForm);
    }

    deleteBlinding(userId: string): Observable<any> {
        return this.http.delete(`${this.resourceUrl}/${userId}`);
    }

}

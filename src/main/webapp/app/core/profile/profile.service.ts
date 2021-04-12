import {Injectable} from '@angular/core';
import {SERVER_API_URL} from "app/app.constants";
import {HttpClient, HttpResponse} from '@angular/common/http';
import {IProfile, Profile} from "app/core/profile/profile.model";
import {Observable,} from 'rxjs';
import {map} from 'rxjs/operators';
import {createRequestOption} from "app/shared/util/request-util";

export type EntityResponseType = HttpResponse<IProfile>;

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    public resourceUrl = `${SERVER_API_URL}api/profile`;

    constructor(private readonly http: HttpClient) {
    }

    /**
     * Service of listing all profiles.
     * @param req
     */
    query(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http.get<any>(this.resourceUrl, {
            params: options,
            observe: 'response'
        }).pipe(map((res: HttpResponse<IProfile[]>) => this.convertArrayResponse(res)));

    }

    create(profile: IProfile): Observable<EntityResponseType> {
        const copy = this.convert(profile);
        return this.http.post<IProfile>(this.resourceUrl, copy, {observe: 'response'}).pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    /**
     * Retrieve profile by ID service.
     * @param id
     */
    find(id: string): Observable<EntityResponseType> {
        return this.http.get<IProfile>(`${this.resourceUrl}/${id}`, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    /**
     * Update profile service
     * @param profile
     */
    update(profile: IProfile): Observable<EntityResponseType> {
        const copy = this.convert(profile);
        return this.http.put<IProfile>(this.resourceUrl, copy, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }


    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: IProfile = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ProfileModel.
     */
    private convertItemFromServer(profile: IProfile): IProfile {
        return Object.assign(new Profile(), profile);
    }

    /**
     * Convert a ProfileModel to a JSON which can be sent to the server.
     */
    private convert(profile: IProfile): IProfile {
        return Object.assign({}, profile);
    }

    private convertArrayResponse(res: HttpResponse<any>): HttpResponse<any> {
        const profiles: IProfile[] = res.body.content;
        const content: IProfile[] = [];
        for (const profile of profiles) {
            content.push(this.convertItemFromServer(profile));
        }
        return res.clone({body: {...res.body, content}});
    }
}

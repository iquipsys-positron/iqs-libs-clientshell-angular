export interface IRolesDataService {
    readRoles(params: any, successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    grantRoles(id: string, body: string[], successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
    revokeRoles(id: string, body: string[], successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any>;
}

export interface IRolesDataProvider {

}

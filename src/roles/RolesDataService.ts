import {
    IRolesDataService,
    IRolesDataProvider
} from './IRolesDataService';

class RolesDataService implements IRolesDataService {
    private RESOURCE: string = 'roles';
    private RESOURCE_GRANT: string = 'roles_grant';
    private RESOURCE_REVOKE: string = 'roles_revoke';

    constructor(
        private pipRest: pip.rest.IRestService,
        private iqsOrganization,
        private pipIdentity: pip.services.IIdentityService
    ) {
        "ngInject";
    }

    public readRoles(params: any, successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        params = params || {};
        if (params.user_id && this.pipIdentity.identity) {
            params.user_id = this.pipIdentity.identity.user.id
        }

        return this.pipRest.getResource(this.RESOURCE).query(params, params, successCallback, errorCallback);
    }


    public grantRoles(id: string, body: string[], successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE_GRANT).save({ user_id: id }, body, (data) => {
            if (successCallback)
                successCallback(data);
        }, errorCallback);
    }


    public revokeRoles(id: string, body: string[], successCallback?: (data: string[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        return this.pipRest.getResource(this.RESOURCE_REVOKE).save({ user_id: id }, body, (data) => {
            if (successCallback)
                successCallback(data);
        }, errorCallback);
    }


}


class RolesDataProvider implements IRolesDataProvider {
    private _service: IRolesDataService;

    constructor() {
        "ngInject";
    }

    public $get(
        pipRest: pip.rest.IRestService,
        iqsOrganization,
        pipIdentity: pip.services.IIdentityService
    ) {
        "ngInject";

        if (this._service == null) {
            this._service = new RolesDataService(pipRest, iqsOrganization, pipIdentity);
        }

        return this._service;
    }

}


angular
    .module('iqsShellRolesData', ['pipRest', 'pipServices'])
    .provider('iqsShellRolesData', RolesDataProvider);
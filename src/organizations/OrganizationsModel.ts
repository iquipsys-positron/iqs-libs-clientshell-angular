import { Organization } from './Organization';

import { DataPage } from './DataPage';
import { IShellOrganizationDataService } from './IOrganizationDataService';

export class OrganizationsModel {
    public allOrganizations: Organization[] = [];

    constructor(
        private $location: ng.ILocationService,
        private iqsShellOrganizationData: IShellOrganizationDataService,
        private pipRest: pip.rest.IRestService,
        private pipIdentity: pip.services.IIdentityService
    ) {
        "ngInject";

    }

    private updateIdentity(successCallback?: () => void, errorCallback?: (error: any) => void) {
        this.pipRest.getResource('restoreSessions').call(
            {
                session_id: this.pipIdentity.identity.id
            },
            (data: pip.entry.SessionData) => {
                this.pipIdentity.identity = data;
                if (successCallback) {
                    successCallback();
                }
            },
            (error: any) => {
                if (errorCallback) {
                    errorCallback(error);
                }
                // todo show toas message
            });
    }

    public getOrganizations(successCallback?: (data: Organization[]) => void, errorCallback?: (error: any) => void) {
        this.iqsShellOrganizationData.readOrganizations(null, (data: DataPage<Organization>) => {
            this.getOrganizationCallback(data, successCallback);
        }, errorCallback);
    }


    public getOrganizationById(id: string) {
        return _.find(this.allOrganizations, (organization) => { return organization.id === id; });
    }

    private getOrganizationCallback(data: DataPage<Organization>, successCallback?: (data: Organization[]) => void) {
        this.allOrganizations = data.data;
        if (successCallback) {
            successCallback(this.allOrganizations);
        }
    }

    public updateOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this.iqsShellOrganizationData.updateOrganization(data.id, data, (organization: Organization) => {
            let index: number = _.findIndex(this.allOrganizations, {id: organization.id});
            if (index > -1) {
                this.allOrganizations[index] = organization;
            }
            this.updateIdentity(() => {
                if (successCallback) {
                    successCallback(organization);
                }
            }, errorCallback);

        }, errorCallback);
    }

     public createOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this.iqsShellOrganizationData.saveOrganization(data, (organization: Organization) => {
            this.allOrganizations.push(organization);
            this.updateIdentity(() => {
                if (successCallback) {
                    successCallback(organization);
                }
            }, errorCallback);
        }, errorCallback);
    }

     public deleteOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this.iqsShellOrganizationData.deleteOrganization(data.id, (organization: Organization) => {
            this.allOrganizations = _.filter(this.allOrganizations, {id: !data.id});
            this.updateIdentity(() => {
                if (successCallback) {
                    successCallback(organization);
                }
            }, errorCallback);
        }, errorCallback);
    }

    public demoConnect(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.iqsShellOrganizationData.demoConnect(params, (data: any) => {
            if (successCallback) {
                successCallback(data);
            }
        }, errorCallback);
    }

    public removeOrganization(id: string, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.iqsShellOrganizationData.removeOrganization(id, (data: any) => {
            this.updateIdentity(() => {
                if (successCallback) {
                    successCallback(data);
                }
            }, errorCallback);
        }, errorCallback);
    }

    public clean(): void {
        this.allOrganizations = [];
    }    

    public getUserOrganizations(): Organization[] {
        let s: Organization[] = [];

        _.each(this.pipIdentity.identity.user.organizations, (item: Organization) => {
            let index: number = _.findIndex(this.allOrganizations, (organization: Organization) => {
                return item.id == organization.id
            });
            if (index > -1) {
                s.push(this.allOrganizations[index]);
            }
        });

        return s;
    }
}
import { OrganizationsModel } from './OrganizationsModel';
import { IShellOrganizationViewModel } from './IOrganizationViewModel';

import { Organization } from './Organization';

import { DataPage } from './DataPage';
import { IShellOrganizationDataService } from './IOrganizationDataService';

class OrganizationsViewModel implements IShellOrganizationViewModel {
    public model: OrganizationsModel;

    constructor(
        $location: ng.ILocationService,
        private iqsShellOrganizationData: IShellOrganizationDataService, 
        private pipRest: pip.rest.IRestService,
        private pipIdentity: pip.services.IIdentityService
    ) {

        this.model = new OrganizationsModel($location, iqsShellOrganizationData, pipRest, pipIdentity);
    }

    public initOrganizations( successCallback?: (data: Organization[]) => void, errorCallback?: (error: any) => void) {
        this.model.getOrganizations(successCallback, errorCallback);
    }

    public generateCode(id: string, successCallback?: (data) => void, errorCallback?: (error: any) => void) {
        this.iqsShellOrganizationData.generateCode(id, successCallback, errorCallback);
    }

    public get organizations() {
        return this.model.allOrganizations;
    }

    public get allOrganizations() {
        return this.model.allOrganizations;
    }

    public getUserOrganizations(): Organization[] {
        return this.model.getUserOrganizations();
    }

    public getOrganizationById(id: string): Organization {
        return this.model.getOrganizationById(id)
    }

    public updateOrganization(organization: Organization, successCallback: (Organization) => void, errorCallback: (error: any) => void): void {
        this.model.updateOrganization(organization, successCallback, errorCallback);
    }

    public createOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this.model.createOrganization(data, successCallback, errorCallback);
    }

    public deleteOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this.model.deleteOrganization(data, successCallback, errorCallback);
    }

    public removeOrganization(id: string, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void) {
        this.model.removeOrganization(id, successCallback, errorCallback);
    }

    public demoConnect(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void) {
        this.model.demoConnect(params, successCallback, errorCallback);
    }

    public clean(): void {
        this.model.clean();
    } 
  
}

angular.module('iqsOrganizationsViewModel', ['iqsShellOrganizationData'])
    .service('iqsOrganizationsViewModel', OrganizationsViewModel);
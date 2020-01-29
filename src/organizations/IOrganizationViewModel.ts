import { Organization } from './Organization';

export interface IShellOrganizationViewModel {
    initOrganizations( successCallback?: (data: any[]) => void, errorCallback?: (error: any) => void);
    organizations;
    getOrganizationById(id: string);
    updateOrganization(organization: Organization, successCallback: (Organization) => void, errorCallback: (error: any) => void): void;
    generateCode(id: string, successCallback?: (data) => void, errorCallback?: (error: any) => void);
    deleteOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void);
    createOrganization(data: Organization, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void);
    clean(): void;
    demoConnect(params: any, successCallback?: (data: any) => void, errorCallback?: (error: any) => void);
    removeOrganization(id: string, successCallback?: (data: Organization) => void, errorCallback?: (error: any) => void);
    getUserOrganizations(): Organization[];
}
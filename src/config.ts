import './common';
import './modules';
import './states';
import './rest/index';

export const ShellStateName = 'shell';

export const ClientConfiguration = {
    AddOrganizationNav: true,
    AddOrganizationLanding: true,
    RemoveOrganizationNav: true,
    AddToDemo: true
};

export class ApplicationConfig {
    public id: string;
    public productName?: string;
    public favoritesGroupName: string;
    public defaultFavoritesIds: string[];
}

export const applicationConfigDefault: ApplicationConfig = {
    id: 'unknown',
    productName: 'iQuipsys Positron',
    favoritesGroupName: 'favourites',
    defaultFavoritesIds: [
        'iqs_positron_monitoring',
        'iqs_positron_retrospective',
        'iqs_positron_schedule',
        'iqs_positron_incidents'
    ]
};

export class SessionConfig {
    authorizedState?: string;
    unautorizedState?: string;
    serverUrl?: string;
}

export const defaultSessionConfig: SessionConfig = {
    authorizedState: 'app',
    unautorizedState: 'landing',
    serverUrl: '/',
};

export class ShellModuleConfig {
    application?: ApplicationConfig;
    mock?: boolean;
    session?: SessionConfig;
    [key: string]: any;
}

export const defaultShellModuleConfig = {
    application: applicationConfigDefault,
    mock: false,
    session: defaultSessionConfig
};

(() => {
    // const serverUrls: any = {
    //     production: 'https://facade.positron.iquipsys.net',
    //     stage: 'http://api.positron.stage.iquipsys.net:30018',
    //     local: 'http://localhost:8080',
    //     localDocker: 'http://192.168.99.100:8080'
    // };

    function iqsShellConfig(
        $mdDateLocaleProvider: angular.material.IDateLocaleProvider,
        $mdIconProvider: angular.material.IIconProvider,
        $stateProvider: ng.ui.IStateProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        pipActionsProvider: pip.nav.IActionsProvider,
        pipAnalyticsProvider: pip.support.IAnalyticsProvider,
        pipAuthStateProvider: pip.rest.IAuthStateProvider,
        pipAvatarDataProvider: pip.pictures.IAvatarDataProvider,
        pipEntryProvider: pip.entry.IEntryProvider,
        pipErrorPageConfigServiceProvider: pip.errors.IErrorPageConfigProvider,
        pipPictureDataProvider: pip.pictures.IPictureDataProvider,
        pipRestProvider: pip.rest.IRestProvider,
    ) {
        // Resigter icons for application
        $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);
        $mdIconProvider.iconSet('iqs', 'images/iqs.svg', 512);
        $mdIconProvider.iconSet('webui-icons', 'images/webui-icons.svg', 512);

        pipActionsProvider.primaryGlobalActions = [
            { name: 'global.emergency', icon: 'iqs:emergency', count: 0, event: 'iqsEmergencyPlan' },
            // { name: 'global.incidents', icon: 'icons:bell', count: 0, event: 'iqsIncidentsOpen' },
            { name: 'global.help', icon: 'icons:help', count: 0, event: 'iqsGlobalHelp' }
        ];

        pipActionsProvider.secondaryGlobalActions = [
            { name: 'global.settings', title: 'User settings', /* state: 'settings.user' */ event: 'iqsUserSettings' },
            { name: 'global.signout', title: 'Sign out', state: 'signout' }
        ];

        pipEntryProvider.appbarTitle = 'iQuipsys Positron';
        pipEntryProvider.showIcon = true;
        pipEntryProvider.appbarIcon = 'iqs:iquipsys';
        pipEntryProvider.passwordExpire = true;
        pipEntryProvider.isPostSignup = false;
        pipEntryProvider.useEmailAsLogin = true;
        pipEntryProvider.entryHideObject = {
            changePwdSubTitle: true,
            agreement: true,
            hint: true
        };
        pipEntryProvider.fixedServerUrl = false;

        // Configure REST
        pipRestProvider.lockServerUrl = true;
        // pipRestProvider.serverUrl = serverUrls.localDocker;
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state(ShellStateName, {
                url: '/',
                abstract: true
            });

        // Configure auth states
        pipAuthStateProvider.unauthorizedState = pipAuthStateProvider.unauthorizedState || 'landing';
        pipAuthStateProvider.authorizedState = pipAuthStateProvider.authorizedState || 'app';

        // Configure BLOB paths
        pipAvatarDataProvider.DefaultInitial = '?';
        pipAvatarDataProvider.AvatarRoute = '/api/v1/blobs';
        pipPictureDataProvider.PictureRoute = '/api/v1/blobs';

        // Configure error page provider
        pipErrorPageConfigServiceProvider.configs.NoConnection.RedirectSateDefault = pipAuthStateProvider.authorizedState;
        pipErrorPageConfigServiceProvider.configs.NoConnection.StateIgnored = [pipAuthStateProvider.signinState, pipAuthStateProvider.unauthorizedState];
        pipErrorPageConfigServiceProvider.configs.Unsupported.Active = false;
        // pipErrorPageConfigServiceProvider.configs.Unsupported.Params.supported = {
        //     edge: 12,
        //     firefox: 47,
        //     chrome: 56,
        //     safari: 600
        // };

        // Configure Google analytics
        pipAnalyticsProvider.enable('UA-120239019-2');

        // Configure date localization
        $mdDateLocaleProvider.formatDate = function (date) {
            var m = moment(date);
            return m.isValid() ? m.format('L') : '';
        };
    }

    let cfgm: ng.IModule;
    const requires = ['pipCommonRest', 'pipErrors', 'pipErrors.Unauthorized'];

    try {
        cfgm = angular.module('iqsShellRuntimeConfig');
        requires.forEach(r => {
            if (!cfgm.requires.includes(r)) { cfgm.requires.push(r); }
        });
    } catch (err) {
        cfgm = angular.module('iqsShellRuntimeConfig', requires).constant('SHELL_RUNTIME_CONFIG', defaultShellModuleConfig);
    }

    cfgm.config(function (
        $injector: ng.auto.IInjectorService,
        pipErrorPageConfigServiceProvider: pip.errors.IErrorPageConfigProvider,
        pipAuthStateProvider: pip.rest.IAuthStateProvider,
        pipRestProvider: pip.rest.IRestProvider
    ) {
        const SHELL_RUNTIME_CONFIG = $injector.has('SHELL_RUNTIME_CONFIG') ? $injector.get('SHELL_RUNTIME_CONFIG') : defaultShellModuleConfig;
        const config: ShellModuleConfig = _.defaultsDeep(SHELL_RUNTIME_CONFIG, defaultShellModuleConfig);
        pipRestProvider.serverUrl = config.session.serverUrl;
        pipAuthStateProvider.unauthorizedState = config.session.unautorizedState;
        pipAuthStateProvider.authorizedState = config.session.authorizedState;
        pipErrorPageConfigServiceProvider.configs.NoConnection.RedirectSateDefault = pipAuthStateProvider.authorizedState;
    });

    angular
        .module('iqsShell.Config', [
            // lib
            'ngCookies',
            // main config
            'iqsShellRuntimeConfig',

            // suite
            'pipEntry', 'pipCommonRest', 'pipPictures', 'pipDocuments', 'pipMaps',

            // webui
            'iqsTheme', 'pipTheme',

            'pipLayout', 'pipNav', 'pipDialogs', 'pipBehaviors', 'pipControls',
            'pipSettings', 'pipButtons', 'pipDates', 'pipErrors', 'pipFiles',
            'pipLists', 'pipLocations', 'pipServices', 'pipGuidance', 'pipComposite',
            'pipPictures', 'pipDates', 'pipLocations', 'pipSupport',
            'pipErrors.Unauthorized',

            // States
            'iqsDemo',
            'iqsLanding',

            // Complete data/models/services/resources for each object
            'iqsModules',
            'iqsRest',

            'iqsHttpResponseInterceptor',
            'iqsLoading',
            'iqsEmergencyPlansAux',
            'iqsGlobalHelp'
        ])
        .config(iqsShellConfig);
})();
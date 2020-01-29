/// <reference path="../typings/tsd.d.ts" />

(() => {
    'use strict';

    angular.module('iqsShell', [
        'iqsShell.Templates',
        'iqsShellService',
        'iqsClientShell',
        'iqsHomePanel',
        'iqsOrganization',
        'iqsNavAdminOrganization',
        'pipSettingsResources'
    ]);
})();
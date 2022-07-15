self["webpackHotUpdateconsole_gitops_plugin"]("exposed-environments",{

/***/ "./components/list/GitOpsList.tsx":
/*!****************************************!*\
  !*** ./components/list/GitOpsList.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react?558d");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _patternfly_react_table__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @patternfly/react-table */ "webpack/sharing/consume/default/@patternfly/react-table");
/* harmony import */ var _patternfly_react_table__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _GitOpsEmptyState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../GitOpsEmptyState */ "./components/GitOpsEmptyState.tsx");
/* harmony import */ var _GitOpsTableHeader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./GitOpsTableHeader */ "./components/list/GitOpsTableHeader.tsx");
/* harmony import */ var _GitOpsTableRow__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./GitOpsTableRow */ "./components/list/GitOpsTableRow.tsx");

// import { useTranslation } from 'react-i18next';
// import { Table, TextFilter } from '@console/internal/components/factory';
// import { fuzzyCaseInsensitive } from '@console/internal/components/factory/table-filters';
// import { VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';



// import { VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';

const { Table, TextFilter } = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/internal/components/factory'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const fuzzyCaseInsensitive = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/internal/components/factory/table-filters'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
// const GitOpsTableRow = require('./GitOpsTableRow');
const GitOpsList = ({ appGroups, emptyStateMsg }) => {
    // const { t } = useTranslation();
    const [textFilter, setTextFilter] = react__WEBPACK_IMPORTED_MODULE_0__.useState('');
    const visibleItems = appGroups === null || appGroups === void 0 ? void 0 : appGroups.filter(({ name }) => {
        return fuzzyCaseInsensitive(textFilter, name);
    });
    const hasSyncStatus = (appGroups === null || appGroups === void 0 ? void 0 : appGroups.some(({ sync_status }) => sync_status /* eslint-disable-line @typescript-eslint/camelcase */)) || false;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "gop-gitops-list" },
        appGroups.map((a) => a && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                a.name,
                " ",
                a.repo_url)))),
        !emptyStateMsg && appGroups ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "co-m-pane__filter-row" },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(TextFilter, { value: textFilter, label: 'by name', 
                    // label={t('gitops-plugin~by name')}
                    onChange: (val) => setTextFilter(val) })),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_1__.OuterScrollContainer, null,
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_1__.InnerScrollContainer, null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_1__.TableComposable, { "aria-label": "Applications table", variant: "compact", isStickyHeader: true },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_GitOpsTableHeader__WEBPACK_IMPORTED_MODULE_3__.GitOpsTableHeader
                        // onSort={onSort}
                        // sortDirection={activeSortDirection}
                        // sortIndex={activeSortIndex}
                        , { 
                            // onSort={onSort}
                            // sortDirection={activeSortDirection}
                            // sortIndex={activeSortIndex}
                            hasSyncStatus: hasSyncStatus }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_1__.Tbody, null, appGroups.map(app => {
                            (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_1__.Td, { key: app.name },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, app.name))),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_1__.Td, { width: 10 },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null, app.repo_url)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_1__.Td, null, app.sync_status),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_1__.Td, null, app.last_deployed)));
                        }))))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(Table, { data: visibleItems, "aria-label": 'Environments table', 
                // aria-label={t('gitops-plugin~Environments table')}
                Header: (0,_GitOpsTableHeader__WEBPACK_IMPORTED_MODULE_3__.GitOpsTableHeader)(hasSyncStatus), Row: _GitOpsTableRow__WEBPACK_IMPORTED_MODULE_4__["default"], loaded: !emptyStateMsg, virtualize: true }))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_GitOpsEmptyState__WEBPACK_IMPORTED_MODULE_2__["default"], { emptyStateMsg: emptyStateMsg }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GitOpsList);


/***/ }),

/***/ "./components/list/GitOpsSyncFragment.tsx":
/*!************************************************!*\
  !*** ./components/list/GitOpsSyncFragment.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GrayUnknownIcon": () => (/* binding */ GrayUnknownIcon),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react?558d");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @patternfly/react-core */ "webpack/sharing/consume/default/@patternfly/react-core");
/* harmony import */ var _patternfly_react_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _patternfly_react_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @patternfly/react-icons */ "../node_modules/@patternfly/react-icons/dist/esm/icons/unknown-icon.js");
/* harmony import */ var _patternfly_react_tokens_dist_js_global_disabled_color_100__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @patternfly/react-tokens/dist/js/global_disabled_color_100 */ "../node_modules/@patternfly/react-tokens/dist/js/global_disabled_color_100.js");
/* harmony import */ var _openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openshift-console/dynamic-plugin-sdk */ "webpack/sharing/consume/default/@openshift-console/dynamic-plugin-sdk");
/* harmony import */ var _openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_2__);




// import {
//   GreenCheckCircleIcon,
//   YellowExclamationTriangleIcon,
//   GrayUnknownIcon,
// } from '@console/shared';

const GrayUnknownIcon = ({ className, title }) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_icons__WEBPACK_IMPORTED_MODULE_3__.UnknownIcon, { color: _patternfly_react_tokens_dist_js_global_disabled_color_100__WEBPACK_IMPORTED_MODULE_4__.global_disabled_color_100.value, className: className, title: title }));
const GitOpsSyncFragment = ({ tooltip, count, icon }) => {
    let targetIcon;
    if (icon === 'check') {
        targetIcon = react__WEBPACK_IMPORTED_MODULE_0__.createElement(_openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_2__.GreenCheckCircleIcon, null);
    }
    else if (icon === 'exclamation') {
        targetIcon = react__WEBPACK_IMPORTED_MODULE_0__.createElement(_openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_2__.YellowExclamationTriangleIcon, null);
    }
    else {
        targetIcon = react__WEBPACK_IMPORTED_MODULE_0__.createElement(GrayUnknownIcon, null);
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.Flex, { flex: { default: 'flex_1' } },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.FlexItem, null, count > 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.Tooltip, { isContentLeftAligned: true, content: react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null, tooltip) },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                targetIcon,
                " ",
                count))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
            targetIcon,
            " ",
            count)))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GitOpsSyncFragment);


/***/ }),

/***/ "./components/list/GitOpsTableRow.tsx":
/*!********************************************!*\
  !*** ./components/list/GitOpsTableRow.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react?558d");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @patternfly/react-core */ "webpack/sharing/consume/default/@patternfly/react-core");
/* harmony import */ var _patternfly_react_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "../node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "webpack/sharing/consume/default/react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_4__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/dev-console/src/components/import/render-utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/internal/components/factory'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/internal/components/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/shared'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _GitOpsSyncFragment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./GitOpsSyncFragment */ "./components/list/GitOpsSyncFragment.tsx");
/* harmony import */ var _GitOpsTableRow_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./GitOpsTableRow.scss */ "./components/list/GitOpsTableRow.scss");
/* harmony import */ var _GitOpsTableRow_scss__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_GitOpsTableRow_scss__WEBPACK_IMPORTED_MODULE_7__);











const tableColumnClasses = [
    classnames__WEBPACK_IMPORTED_MODULE_2__('pf-m-width-20'),
    classnames__WEBPACK_IMPORTED_MODULE_2__('pf-m-width-30'),
    classnames__WEBPACK_IMPORTED_MODULE_2__('pf-m-hidden', 'pf-m-visible-on-md', 'pf-m-width-20'),
    classnames__WEBPACK_IMPORTED_MODULE_2__('pf-m-hidden', 'pf-m-visible-on-lg', 'pf-m-width-30'), // Last deployment
];
const getMatchingEnvs = (envs, desiredStatus) => (acc, status, idx) => desiredStatus === status
    ? [...acc, envs[idx]] // 1:1 between a status and an env
    : acc;
const GitOpsTableRow = (props) => {
    const { obj: appGroup } = props;
    const { name, sync_status: syncStatuses = [], environments: envs, last_deployed: lastDeployed = [], repo_url: repoUrl, } = appGroup;
    const { t } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)();
    const syncedEnvs = syncStatuses.reduce(getMatchingEnvs(envs, 'Synced'), []);
    const outOfSyncEnvs = syncStatuses.reduce(getMatchingEnvs(envs, 'OutOfSync'), []);
    const unknownEnvs = syncStatuses.reduce(getMatchingEnvs(envs, 'Unknown'), []);
    const latestDeployedTime = lastDeployed.reduce((leadingDeployedTime, deployedTime) => leadingDeployedTime < deployedTime ? deployedTime : leadingDeployedTime, '');
    const latestDeployedEnv = latestDeployedTime
        ? envs[lastDeployed.indexOf(latestDeployedTime)]
        : '';
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/internal/components/factory'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { className: tableColumnClasses[0] },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_4__.Link, { to: `/environments/${appGroup.name}/overview?url=${appGroup.repo_url}`, title: name }, name)),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/internal/components/factory'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { className: classnames__WEBPACK_IMPORTED_MODULE_2__(tableColumnClasses[1]) },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/internal/components/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { href: repoUrl, additionalClassName: 'co-break-all' },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { marginRight: 'var(--pf-global--spacer--xs)' } }, Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/dev-console/src/components/import/render-utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(repoUrl, 12, t)),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { marginRight: 'var(--pf-global--spacer--xs)' } }, repoUrl))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/internal/components/factory'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { className: classnames__WEBPACK_IMPORTED_MODULE_2__(tableColumnClasses[2], 'pf-u-text-nowrap') }, syncStatuses.length > 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.Flex, { className: "gop-gitops-syncStatus" },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_GitOpsSyncFragment__WEBPACK_IMPORTED_MODULE_6__["default"], { tooltip: syncedEnvs.map((env) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.Split, { className: "gop-gitops-tooltip-text", hasGutter: true, key: `${name}-${env}` },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.SplitItem, null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/shared'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), null)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.SplitItem, { isFilled: true }, env),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.SplitItem, null, t('gitops-plugin~Synced'))))), count: syncedEnvs.length, icon: "check" }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_GitOpsSyncFragment__WEBPACK_IMPORTED_MODULE_6__["default"], { tooltip: outOfSyncEnvs.map((env) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.Split, { className: "gop-gitops-tooltip-text", hasGutter: true, key: `${name}-${env}` },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.SplitItem, null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/shared'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), null)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.SplitItem, { isFilled: true }, env),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.SplitItem, null, t('gitops-plugin~OutOfSync'))))), count: outOfSyncEnvs.length, icon: "exclamation" }),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_GitOpsSyncFragment__WEBPACK_IMPORTED_MODULE_6__["default"], { tooltip: unknownEnvs.map((env) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.Split, { className: "gop-gitops-tooltip-text", hasGutter: true, key: `${name}-${env}` },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.SplitItem, null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/shared'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), null)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.SplitItem, { isFilled: true }, env),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.SplitItem, null, t('gitops-plugin~Unknown'))))), count: unknownEnvs.length, icon: "unknown" }))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, envs.join(', ')))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/internal/components/factory'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { className: tableColumnClasses[3] }, latestDeployedTime !== '' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.Flex, null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.FlexItem, { className: "gop-gitops-lastDeploymentTime", spacer: { default: 'spacerXs' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/internal/components/utils'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), { timestamp: latestDeployedTime }))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.FlexItem, null,
                "(",
                latestDeployedEnv,
                ")"))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, "-")))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GitOpsTableRow);


/***/ }),

/***/ "./components/list/GitOpsTableRow.scss":
/*!*********************************************!*\
  !*** ./components/list/GitOpsTableRow.scss ***!
  \*********************************************/
/***/ (() => {

throw new Error("Module parse failed: Unexpected token (1:0)\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\n> .gop-gitops-syncStatus {\n|   max-width: '100px';\n| }");

/***/ })

});
//# sourceMappingURL=exposed-environments.a4fbf5c42f14ef513a90.hot-update.js.map
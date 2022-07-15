"use strict";
self["webpackHotUpdateconsole_gitops_plugin"]("exposed-environments",{

/***/ "./components/GitOpsEmptyState.tsx":
/*!*****************************************!*\
  !*** ./components/GitOpsEmptyState.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react?558d");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @patternfly/react-core */ "webpack/sharing/consume/default/@patternfly/react-core");
/* harmony import */ var _patternfly_react_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _patternfly_react_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @patternfly/react-icons */ "../node_modules/@patternfly/react-icons/dist/esm/icons/cubes-icon.js");



const GitOpsEmptyState = ({ emptyStateMsg }) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.EmptyState, { variant: _patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.EmptyStateVariant.full },
    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.EmptyStateIcon, { variant: "container", component: _patternfly_react_icons__WEBPACK_IMPORTED_MODULE_2__.CubesIcon }),
    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_patternfly_react_core__WEBPACK_IMPORTED_MODULE_1__.EmptyStateBody, null, emptyStateMsg)));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GitOpsEmptyState);


/***/ }),

/***/ "./components/GitOpsListPage.tsx":
/*!***************************************!*\
  !*** ./components/GitOpsListPage.tsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react?558d");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es */ "../node_modules/lodash-es/map.js");
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-helmet */ "webpack/sharing/consume/default/react-helmet");
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_helmet__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openshift-console/dynamic-plugin-sdk */ "webpack/sharing/consume/default/@openshift-console/dynamic-plugin-sdk");
/* harmony import */ var _openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_gitops_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/gitops-utils */ "./components/utils/gitops-utils.ts");
/* harmony import */ var _list_GitOpsList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./list/GitOpsList */ "./components/list/GitOpsList.tsx");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







// import { PageHeading /*, LoadingBox */ } from '@console/internal/components/utils';
// import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
// import { ProjectModel } from '@console/internal/models';
// import { K8sResourceKind } from '@console/internal/module/k8s';
// import { DevPreviewBadge } from '@console/shared';
// import GitOpsList from './list/GitOpsList';
// import useDefaultSecret from './utils/useDefaultSecret';
// import './GitOpsListPage.scss';
// const projectRes = { isList: true, kind: ProjectModel.kind, optional: true };
const projectRes = { isList: true, kind: 'Project', optional: true };
const GitOpsListPage = () => {
    const [appGroups, setAppGroups] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
    const [emptyStateMsg, setEmptyStateMsg] = react__WEBPACK_IMPORTED_MODULE_0__.useState(null);
    const [namespaces, nsLoaded, nsError] = (0,_openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_3__.useK8sWatchResource)(projectRes);
    // const [namespaces, nsLoaded, nsError] = useK8sWatchResource<K8sResourceKind[]>(projectRes);
    const baseURL = '/api/gitops/pipelines';
    const { t } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)();
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
        let ignore = false;
        const getAppGroups = () => __awaiter(void 0, void 0, void 0, function* () {
            if (nsLoaded) {
                const manifestURLs = (!nsError && (0,_utils_gitops_utils__WEBPACK_IMPORTED_MODULE_4__.getManifestURLs)(namespaces)) || [];
                const [allAppGroups, emptyMsg] = yield (0,_utils_gitops_utils__WEBPACK_IMPORTED_MODULE_4__.fetchAllAppGroups)(baseURL, manifestURLs, t);
                if (ignore)
                    return;
                setAppGroups(allAppGroups);
                setEmptyStateMsg(emptyMsg);
            }
        });
        getAppGroups();
        return () => {
            ignore = true;
        };
    }, [baseURL, namespaces, nsError, nsLoaded, t]);
    // React.useEffect(() => {
    //   let ignore = false;
    //   const getAppGroups = async () => {
    //     if (nsLoaded) {
    //       const manifestURLs = (/*!nsError &&*/ getManifestURLs(namespaces)) || [];
    //       const [allAppGroups, emptyMsg] = await fetchAllAppGroups(baseURL, manifestURLs, t);
    //       if (ignore) return;
    //       setAppGroups(allAppGroups);
    //       setEmptyStateMsg(emptyMsg);
    //     }
    //   };
    //   getAppGroups();
    //   return () => {
    //     ignore = true;
    //   };
    // }, [baseURL, /* namespaces, nsError, nsLoaded, */ t]);
    // React.useEffect(() => {
    //   let ignore = false;
    //   const getAppGroups = async () => {
    //     if (nsLoaded && !appGroups) {
    //       const manifestURLs = (/*!nsError &&*/ getManifestURLs(namespaces)) || [];
    //       const allAppGroups = await fetchAppGroups(baseURL, manifestURLs[0]);
    //       if (ignore) return;
    //       setAppGroups(_.sortBy(_.flatten(_.map(allAppGroups)), ['name']));
    //     }
    //   };
    //   getAppGroups();
    //   return () => {
    //     ignore = true;
    //   };
    // }, [/* namespaces, nsError*/ nsLoaded, t]);
    console.log("APP GROUPS = " + appGroups);
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
        react__WEBPACK_IMPORTED_MODULE_0__.createElement((react_helmet__WEBPACK_IMPORTED_MODULE_1___default()), null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("title", null, t('plugin__console-gitops-plugin~Environments'))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_3__.ListPageHeader, { title: t('gitops-plugin~Environments') }),
        !appGroups && !emptyStateMsg ? (
        // <LoadingBox />
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null)) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_3__.ListPageBody, null,
                t("gitops-plugin~Select an application to view the environment it's deployed in."),
                lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](appGroups, (appGroup) => appGroup && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        appGroup.name,
                        " ",
                        appGroup.repo_url))))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_list_GitOpsList__WEBPACK_IMPORTED_MODULE_5__["default"], { appGroups: appGroups, emptyStateMsg: emptyStateMsg })))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GitOpsListPage);


/***/ }),

/***/ "./components/list/GitOpsList.tsx":
/*!****************************************!*\
  !*** ./components/list/GitOpsList.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

// import { useTranslation } from 'react-i18next';
// import { Table, TextFilter } from '@console/internal/components/factory';
// import { fuzzyCaseInsensitive } from '@console/internal/components/factory/table-filters';
// import { VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';



const { Table, TextFilter } = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module ''"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const GitOpsList = ({ appGroups, emptyStateMsg }) => {
    // const { t } = useTranslation();
    // const [textFilter, setTextFilter] = React.useState('');
    // const visibleItems = appGroups?.filter(({ name }) => {
    // return fuzzyCaseInsensitive(textFilter, name);
    // });
    const hasSyncStatus = (appGroups === null || appGroups === void 0 ? void 0 : appGroups.some(({ sync_status }) => sync_status /* eslint-disable-line @typescript-eslint/camelcase */)) || false;
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: "gop-gitops-list" }, !emptyStateMsg && appGroups ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null,
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
                    }))))))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_GitOpsEmptyState__WEBPACK_IMPORTED_MODULE_2__["default"], { emptyStateMsg: emptyStateMsg }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GitOpsList);


/***/ }),

/***/ "./components/list/GitOpsTableHeader.tsx":
/*!***********************************************!*\
  !*** ./components/list/GitOpsTableHeader.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GitOpsTableColumn": () => (/* binding */ GitOpsTableColumn),
/* harmony export */   "GitOpsTableHeader": () => (/* binding */ GitOpsTableHeader)
/* harmony export */ });
/* harmony import */ var _patternfly_react_table__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @patternfly/react-table */ "webpack/sharing/consume/default/@patternfly/react-table");
/* harmony import */ var _patternfly_react_table__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "../node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react?558d");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);



// import i18n from '@console/internal/i18n';
// import { TableColumn } from '@openshift-console/dynamic-plugin-sdk';
const tableColumnClasses = [
    classnames__WEBPACK_IMPORTED_MODULE_1___default()('pf-m-width-20'),
    classnames__WEBPACK_IMPORTED_MODULE_1___default()('pf-m-width-30'),
    classnames__WEBPACK_IMPORTED_MODULE_1___default()('pf-m-hidden', 'pf-m-visible-on-md', 'pf-m-width-20'),
    classnames__WEBPACK_IMPORTED_MODULE_1___default()('pf-m-hidden', 'pf-m-visible-on-lg', 'pf-m-width-30'), // Last deployment
];
const GitOpsTableColumn = (hasSyncStatus) => {
    // let columns = new Array<TableColumn<1>>();
    return [
        {
            // title: i18n.t('gitops-plugin~Application name'),
            title: 'Application name',
            id: 'name',
            sortField: 'name',
            transforms: [_patternfly_react_table__WEBPACK_IMPORTED_MODULE_0__.sortable],
            props: { className: tableColumnClasses[0] },
        },
        {
            // title: i18n.t('gitops-plugin~Git repository'),
            title: 'Git repository',
            id: 'gitRepository',
            sortField: 'gitRepository',
            transforms: [_patternfly_react_table__WEBPACK_IMPORTED_MODULE_0__.sortable],
            props: { className: tableColumnClasses[1] },
        },
        {
            title: hasSyncStatus
                ? 'Environment status' // i18n.t('gitops-plugin~Environment status')
                : 'Environment',
            id: 'environments',
            sortField: 'environments',
            transforms: [_patternfly_react_table__WEBPACK_IMPORTED_MODULE_0__.sortable],
            props: { className: tableColumnClasses[2] },
        },
        {
            // title: i18n.t('gitops-plugin~Last deployment'),
            title: 'Last deployment',
            id: 'lastDeployment',
            sortField: 'lastDeployment',
            transforms: [_patternfly_react_table__WEBPACK_IMPORTED_MODULE_0__.sortable],
            props: { className: tableColumnClasses[3] },
        },
    ];
};
const GitOpsTableHeader = ({ hasSyncStatus, columns }) => {
    return (react__WEBPACK_IMPORTED_MODULE_2__.createElement(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_0__.Thead, null,
        react__WEBPACK_IMPORTED_MODULE_2__.createElement(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_0__.Th, { hasRightBorder: true, width: 10, rowSpan: 1 }, "Application name"),
        react__WEBPACK_IMPORTED_MODULE_2__.createElement(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_0__.Th, { hasRightBorder: true, width: 10, rowSpan: 1 }, "Git repository"),
        react__WEBPACK_IMPORTED_MODULE_2__.createElement(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_0__.Th, { hasRightBorder: true, width: 10, rowSpan: 1 }, "Environment status"),
        react__WEBPACK_IMPORTED_MODULE_2__.createElement(_patternfly_react_table__WEBPACK_IMPORTED_MODULE_0__.Th, { hasRightBorder: true, width: 10, rowSpan: 1 }, "Last deployment")));
    // return [
    //   {
    //     // title: i18n.t('gitops-plugin~Application name'),
    //     title: 'Application name',
    //     id: 'name',
    //     sortField: 'name',
    //     transforms: [sortable],
    //     props: { className: tableColumnClasses[0] },
    //   },
    //   {
    //     // title: i18n.t('gitops-plugin~Git repository'),
    //     title: 'Git repository',
    //     id: 'gitRepository',
    //     sortField: 'gitRepository',
    //     transforms: [sortable],
    //     props: { className: tableColumnClasses[1] },
    //   },
    //   {
    //     title: hasSyncStatus
    //       ? 'Environment status' // i18n.t('gitops-plugin~Environment status')
    //       : 'Environment', // i18n.t('gitops-plugin~Environment'),
    //     id: 'environments',
    //     sortField: 'environments',
    //     transforms: [sortable],
    //     props: { className: tableColumnClasses[2] },
    //   },
    //   {
    //     // title: i18n.t('gitops-plugin~Last deployment'),
    //     title: 'Last deployment',
    //     id: 'lastDeployment',
    //     sortField: 'lastDeployment',
    //     transforms: [sortable],
    //     props: { className: tableColumnClasses[3] },
    //   },
    // ];
};
// export default GitOpsTableHeader;


/***/ })

});
//# sourceMappingURL=exposed-environments.1c83ad5eeb89ecb070c3.hot-update.js.map
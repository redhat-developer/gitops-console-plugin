"use strict";
self["webpackHotUpdateconsole_gitops_plugin"]("exposed-environments",{

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



const { Table, TextFilter } = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/internal/components/factory'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const fuzzyCaseInsensitive = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@console/internal/components/factory/table-filters'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(Table, { data: visibleItems, "aria-label": t('gitops-plugin~Environments table'), Header: (0,_GitOpsTableHeader__WEBPACK_IMPORTED_MODULE_3__.GitOpsTableHeader)(hasSyncStatus), Row: GitOpsTableRow, loaded: !emptyStateMsg, virtualize: true }))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_GitOpsEmptyState__WEBPACK_IMPORTED_MODULE_2__["default"], { emptyStateMsg: emptyStateMsg }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GitOpsList);


/***/ })

});
//# sourceMappingURL=exposed-environments.150e2be95bee56906baa.hot-update.js.map
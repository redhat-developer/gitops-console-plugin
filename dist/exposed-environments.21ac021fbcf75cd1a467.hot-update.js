self["webpackHotUpdateconsole_gitops_plugin"]("exposed-environments",{

/***/ "./components/GitOpsListPage.tsx":
/*!***************************************!*\
  !*** ./components/GitOpsListPage.tsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
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
/***/ (() => {

throw new Error("Module parse failed: Unexpected token (10:6)\nFile was processed with these loaders:\n * ../node_modules/ts-loader/index.js\nYou may need an additional loader to handle the result of these loaders.\n| import { GitOpsTableHeader } from './GitOpsTableHeader';\n| const { Table, TextFilter } = require('@console/internal/components/factory');\n> const ;\n| const GitOpsList = ({ appGroups, emptyStateMsg }) => {\n|     // const { t } = useTranslation();");

/***/ })

});
//# sourceMappingURL=exposed-environments.21ac021fbcf75cd1a467.hot-update.js.map
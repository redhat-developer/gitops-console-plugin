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
/* harmony import */ var _GitOpsTableRow__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_GitOpsTableRow__WEBPACK_IMPORTED_MODULE_4__);

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
                Header: (0,_GitOpsTableHeader__WEBPACK_IMPORTED_MODULE_3__.GitOpsTableHeader)(hasSyncStatus), Row: (_GitOpsTableRow__WEBPACK_IMPORTED_MODULE_4___default()), loaded: !emptyStateMsg, virtualize: true }))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_GitOpsEmptyState__WEBPACK_IMPORTED_MODULE_2__["default"], { emptyStateMsg: emptyStateMsg }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GitOpsList);


/***/ }),

/***/ "./components/list/GitOpsTableRow.tsx":
/*!********************************************!*\
  !*** ./components/list/GitOpsTableRow.tsx ***!
  \********************************************/
/***/ (() => {

// import * as React from 'react';
// import { Flex, FlexItem, Split, SplitItem } from '@patternfly/react-core';
// import * as classNames from 'classnames';
// import { useTranslation } from 'react-i18next';
// import { Link } from 'react-router-dom';
// import { routeDecoratorIcon } from '@console/dev-console/src/components/import/render-utils';
// import { RowFunctionArgs, TableData } from '@console/internal/components/factory';
// import { ExternalLink, Timestamp } from '@console/internal/components/utils';
// import {
//   GreenCheckCircleIcon,
//   YellowExclamationTriangleIcon,
//   GrayUnknownIcon,
// } from '@console/shared';
// import { GitOpsAppGroupData } from '../utils/gitops-types';
// import GitOpsSyncFragment from './GitOpsSyncFragment';
// import './GitOpsTableRow.scss';
// const tableColumnClasses = [
//   classNames('pf-m-width-20'), // Application name
//   classNames('pf-m-width-30'), // Git repository
//   classNames('pf-m-hidden', 'pf-m-visible-on-md', 'pf-m-width-20'), // Environments
//   classNames('pf-m-hidden', 'pf-m-visible-on-lg', 'pf-m-width-30'), // Last deployment
// ];
// const getMatchingEnvs = (envs: string[], desiredStatus: string) => (
//   acc: string[],
//   status: string,
//   idx: number,
// ): string[] =>
//   desiredStatus === status
//     ? [...acc, envs[idx]] // 1:1 between a status and an env
//     : acc;
// const GitOpsTableRow: React.FC<RowFunctionArgs<GitOpsAppGroupData>> = (props) => {
//   const { obj: appGroup } = props;
//   const {
//     name,
//     sync_status: syncStatuses = [],
//     environments: envs,
//     last_deployed: lastDeployed = [],
//     repo_url: repoUrl,
//   } = appGroup;
//   const { t } = useTranslation();
//   const syncedEnvs: string[] = syncStatuses.reduce(getMatchingEnvs(envs, 'Synced'), []);
//   const outOfSyncEnvs: string[] = syncStatuses.reduce(getMatchingEnvs(envs, 'OutOfSync'), []);
//   const unknownEnvs: string[] = syncStatuses.reduce(getMatchingEnvs(envs, 'Unknown'), []);
//   const latestDeployedTime = lastDeployed.reduce(
//     (leadingDeployedTime, deployedTime) =>
//       leadingDeployedTime < deployedTime ? deployedTime : leadingDeployedTime,
//     '',
//   );
//   const latestDeployedEnv = latestDeployedTime
//     ? envs[lastDeployed.indexOf(latestDeployedTime)]
//     : '';
//   return (
//     <>
//       <TableData className={tableColumnClasses[0]}>
//         <Link to={`/environments/${appGroup.name}/overview?url=${appGroup.repo_url}`} title={name}>
//           {name}
//         </Link>
//       </TableData>
//       <TableData className={classNames(tableColumnClasses[1])}>
//         <ExternalLink href={repoUrl} additionalClassName={'co-break-all'}>
//           <span style={{ marginRight: 'var(--pf-global--spacer--xs)' }}>
//             {routeDecoratorIcon(repoUrl, 12, t)}
//           </span>
//           <span style={{ marginRight: 'var(--pf-global--spacer--xs)' }}>{repoUrl}</span>
//         </ExternalLink>
//       </TableData>
//       <TableData className={classNames(tableColumnClasses[2], 'pf-u-text-nowrap')}>
//         {syncStatuses.length > 0 ? (
//           <Flex className="gop-gitops-syncStatus">
//             <GitOpsSyncFragment
//               tooltip={syncedEnvs.map((env) => (
//                 <Split className="gop-gitops-tooltip-text" hasGutter key={`${name}-${env}`}>
//                   <SplitItem>
//                     <GreenCheckCircleIcon />
//                   </SplitItem>
//                   <SplitItem isFilled>{env}</SplitItem>
//                   <SplitItem>{t('gitops-plugin~Synced')}</SplitItem>
//                 </Split>
//               ))}
//               count={syncedEnvs.length}
//               icon="check"
//             />
//             <GitOpsSyncFragment
//               tooltip={outOfSyncEnvs.map((env) => (
//                 <Split className="gop-gitops-tooltip-text" hasGutter key={`${name}-${env}`}>
//                   <SplitItem>
//                     <YellowExclamationTriangleIcon />
//                   </SplitItem>
//                   <SplitItem isFilled>{env}</SplitItem>
//                   <SplitItem>{t('gitops-plugin~OutOfSync')}</SplitItem>
//                 </Split>
//               ))}
//               count={outOfSyncEnvs.length}
//               icon="exclamation"
//             />
//             <GitOpsSyncFragment
//               tooltip={unknownEnvs.map((env) => (
//                 <Split className="gop-gitops-tooltip-text" hasGutter key={`${name}-${env}`}>
//                   <SplitItem>
//                     <GrayUnknownIcon />
//                   </SplitItem>
//                   <SplitItem isFilled>{env}</SplitItem>
//                   <SplitItem>{t('gitops-plugin~Unknown')}</SplitItem>
//                 </Split>
//               ))}
//               count={unknownEnvs.length}
//               icon="unknown"
//             />
//           </Flex>
//         ) : (
//           <span>{envs.join(', ')}</span>
//         )}
//       </TableData>
//       <TableData className={tableColumnClasses[3]}>
//         {latestDeployedTime !== '' ? (
//           <Flex>
//             <FlexItem className="gop-gitops-lastDeploymentTime" spacer={{ default: 'spacerXs' }}>
//               <span>
//                 <Timestamp timestamp={latestDeployedTime} />
//               </span>
//             </FlexItem>
//             <FlexItem>({latestDeployedEnv})</FlexItem>
//           </Flex>
//         ) : (
//           <span>-</span>
//         )}
//       </TableData>
//     </>
//   );
// };
// export default GitOpsTableRow;


/***/ })

});
//# sourceMappingURL=exposed-environments.f56fd2327c260b7a9259.hot-update.js.map
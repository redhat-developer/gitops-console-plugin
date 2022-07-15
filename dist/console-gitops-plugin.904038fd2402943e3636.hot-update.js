"use strict";
self["webpackHotUpdateconsole_gitops_plugin"]("console-gitops-plugin",{

/***/ "webpack/container/entry/console-gitops-plugin":
/*!***********************!*\
  !*** container entry ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var moduleMap = {
	"environments": () => {
		return Promise.all(/*! exposed-environments */[__webpack_require__.e("vendors-node_modules_patternfly_react-icons_dist_esm_icons_cubes-icon_js-node_modules_classna-a785fe"), __webpack_require__.e("exposed-environments")]).then(() => (() => ((__webpack_require__(/*! ./components/GitOpsListPage */ "./components/GitOpsListPage.tsx")))));
	}
};
var get = (module, getScope) => {
	__webpack_require__.R = getScope;
	getScope = (
		__webpack_require__.o(moduleMap, module)
			? moduleMap[module]()
			: Promise.resolve().then(() => {
				throw new Error('Module "' + module + '" does not exist in container.');
			})
	);
	__webpack_require__.R = undefined;
	return getScope;
};
var init = (shareScope, initScope) => {
	if (!__webpack_require__.S) return;
	var name = "default"
	var oldScope = __webpack_require__.S[name];
	if(oldScope && oldScope !== shareScope) throw new Error("Container initialization failed as it has already been initialized with a different share scope");
	__webpack_require__.S[name] = shareScope;
	return __webpack_require__.I(name, initScope);
};

// This exports getters to disallow modifications
__webpack_require__.d(exports, {
	get: () => (get),
	init: () => (init)
});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("ef6740a0abbaccb627d0")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=console-gitops-plugin.904038fd2402943e3636.hot-update.js.map
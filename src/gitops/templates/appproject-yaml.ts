export const defaultAppProjectYamlTemplate = `
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: my-app-project
spec:
  description: "Starter AppProject template - WARNING: Uses wildcards (*) allowing any repo/namespace/cluster. Restrict for production."
  sourceRepos:
    - "*"         # Allow any repo (user can tighten later)
  destinations:
    - namespace: "*"
      server: "*" # Allow any destination (user can tighten later)
  clusterResourceWhitelist:
    - group: "*"
      kind: "*"   # Allow all cluster-scoped resources initially
  namespaceResourceWhitelist:
    - group: "*"
      kind: "*"   # Allow all namespaced resources initially
  namespaceResourceBlacklist: []
`;

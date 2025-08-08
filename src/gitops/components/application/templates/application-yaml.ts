export const defaultApplicationYamlTemplate = `
apiVersion: "argoproj.io/v1alpha1"
kind: "Application"
metadata:
  name: "myapp"
spec:
  destination:
    server: "https://kubernetes.default.svc"
  project: default
  source:
    path: "."
    repoURL: "https://"
    targetRevision: master
  syncPolicy:
    automated:
      prune: true
      selfHeal: false
`;

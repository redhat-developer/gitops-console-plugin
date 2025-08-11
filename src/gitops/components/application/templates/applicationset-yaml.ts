export const defaultApplicationSetYamlTemplate = `
apiVersion: "argoproj.io/v1alpha1"
kind: "ApplicationSet"
metadata:
  name: "myappset"
spec:
  generators:
    - list:
        elements:
          - name: "myapp"
            cluster: "in-cluster"
            url: "https://kubernetes.default.svc"
  template:
    metadata:
      name: "{{name}}-{{cluster}}"
    spec:
      project: default
      source:
        repoURL: "https://"
        targetRevision: HEAD
        path: "."
      destination:
        server: "{{url}}"
        namespace: "{{name}}"
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
`;

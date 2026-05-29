export const defaultImageUpdaterYamlTemplate = `
apiVersion: argocd-image-updater.argoproj.io/v1alpha1
kind: ImageUpdater
metadata:
  name: my-image-updater
spec:
  applicationRefs:
    - namePattern: "app-001"
      images:
        - alias: "test"
          imageName: "test:1.2.3"
`;

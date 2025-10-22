export const defaultRolloutYamlTemplate = `
apiVersion: "argoproj.io/v1alpha1"
kind: "Rollout"
metadata:
  name: "example"
  annotations:
    rollout.argoproj.io/revision: '1'
spec:
  replicas: 1
  selector:
    matchLabels:
      app: example
  template:
    metadata:
      labels:
        app: example
  strategy:
    canary:
      steps:
        - setWeight: 10
`;

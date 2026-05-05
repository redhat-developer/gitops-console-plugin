# OpenShift Console GitOps Plugin
Based on [Openshift Console dynamic plugin](https://github.com/openshift/console/tree/master/frontend/packages/console-dynamic-plugin-sdk), this plugin implement the console elements for GitOps.


## Building
### Option 1: Without running Console locally

In one terminal window, run:

1. `pnpm install`
2. `pnpm run start`

In another terminal window, run:

1. `oc login` (requires [oc](https://console.redhat.com/openshift/downloads) and an [OpenShift cluster](https://console.redhat.com/openshift/create))
2. Create a route to expose the backend service, `cluster-route.yaml`  and run `oc apply -f cluster-route.yaml`
```
kind: Route
apiVersion: route.openshift.io/v1
metadata:
    name: cluster
    namespace: openshift-gitops
spec: 
  to:
    kind: Service
    name: cluster
  port:
    targetPort: 8080
  tls:
    termination: reencrypt
    insecureEdgeTerminationPolicy: Allow
```
3. `pnpm run start-console` (requires [Docker](https://www.docker.com) or [podman 3.2.0+](https://podman.io))

This will run the OpenShift console in a container connected to the cluster
you've logged into. The plugin HTTP server runs on port 9001 with CORS enabled.
Navigate to <http://localhost:9000/envdynamic> to see the running plugin.

#### Running start-console with Apple silicon and podman

If you are using podman on a Mac with Apple silicon, `pnpm run start-console`
might fail since it runs an amd64 image. You can work around the problem with
[qemu-user-static](https://github.com/multiarch/qemu-user-static) by running
these commands:

```bash
podman machine ssh
sudo -i
rpm-ostree install qemu-user-static
systemctl reboot
```

### Option 2: Have Console running locally

In plugin directory, run

1. `pnpm install`
2. `pnpm run start`

In your local `console/` directory

1. Sign into a new cluster and run the `oc login` command
2. Create a route to expose the backend service, `cluster-route.yaml`  and run `oc apply -f cluster-route.yaml`
```
kind: Route
apiVersion: route.openshift.io/v1
metadata:
    name: cluster
    namespace: openshift-gitops
spec: 
  to:
    kind: Service
    name: cluster
  port:
    targetPort: 8080
  tls:
    termination: reencrypt
    insecureEdgeTerminationPolicy: Allow
```

3. Set up the environment and run console with `gitops-plugin`
```
source ./contrib/oc-environment.sh
./bin/bridge -plugins gitops-plugin=http://localhost:9001/
```

## Testing

Unit tests use [Jest](https://jestjs.io/) with inline snapshots (`toMatchInlineSnapshot()`), so expected values live directly in the test source files.

```bash
# Run all tests
pnpm test

# Run tests and update inline snapshots
pnpm test:update

# Run tests with coverage report
pnpm test:coverage
```

When a component's rendered output or a utility's return value changes, the inline snapshots will fail. Run `pnpm test:update` to accept the new output — the diff will show exactly what changed.

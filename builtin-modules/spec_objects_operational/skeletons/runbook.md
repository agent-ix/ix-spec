---
id: RUN-001
title: "Restore artifact-store availability"
artifact_type: runbook
---
<!-- runbook authoring skeleton (spec-objects-operational). Contract (manifest
     body_extraction):
     - Frontmatter MUST carry id, title, and artifact_type: runbook.
     - "## Steps" (H2) is REQUIRED; its body is extracted as `steps`.
     - Steps are an ordered list of concrete, executable actions with the
       exact commands the operator runs. -->
# [RUN-001] Restore artifact-store availability

Use this runbook when ALR-001 pages for an availability burn against SLO-001.

## Steps

1. Acknowledge the page and confirm the burn rate on the availability
   dashboard so a flapping probe is ruled out.
2. Check pod health: `kubectl get pods -n apps -l app=artifact-store`. Restart
   any pod stuck in `CrashLoopBackOff` with `kubectl delete pod <name> -n apps`.
3. Compare error onset with the deploy history. If a release shipped within
   the last hour, roll it back: `helm rollback artifact-store -n apps`.
4. If errors persist, inspect dependency health — PostgreSQL connections and
   object-storage latency — via `kubectl logs deploy/artifact-store -n apps`.
5. Once the success ratio recovers above target for 15 minutes, resolve the
   page and open an incident record (see INC-001 for the expected shape).

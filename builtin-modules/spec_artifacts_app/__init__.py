"""spec-artifacts-app — Filament Module pack.

Ships the pack's ``manifest.yaml`` as resource data. The filament-core
activation pipeline (via cloudmanager-local-sync ``load_pack_manifest``)
imports this package and reads ``MANIFEST_PATH``.
"""

from pathlib import Path

PACK_ROOT = Path(__file__).resolve().parent
MANIFEST_PATH = PACK_ROOT / "manifest.yaml"

__all__ = ["MANIFEST_PATH", "PACK_ROOT"]

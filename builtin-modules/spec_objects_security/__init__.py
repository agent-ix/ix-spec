"""spec-objects-security — Filament Module pack.

Ships the pack's ``manifest.yaml`` as resource data. Consumers (the
filament-core-service activation pipeline, reached via
cloudmanager-local-sync) import this package and read ``MANIFEST_PATH``.
"""

from pathlib import Path

PACK_ROOT = Path(__file__).resolve().parent
MANIFEST_PATH = PACK_ROOT / "manifest.yaml"

__all__ = ["MANIFEST_PATH", "PACK_ROOT"]

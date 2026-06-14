"""spec-artifacts-process — Filament Module pack.

Ships the pack's ``manifest.yaml``, ``schemas/*.json`` and ``examples/`` as
resource data. The filament-core activation pipeline (via
cloudmanager-local-sync ``load_pack_manifest``) imports this package and
reads ``MANIFEST_PATH`` to register the pack's archetypes/object_types.
"""

from pathlib import Path

PACK_ROOT = Path(__file__).resolve().parent
MANIFEST_PATH = PACK_ROOT / "manifest.yaml"
SCHEMAS_DIR = PACK_ROOT / "schemas"
EXAMPLES_DIR = PACK_ROOT / "examples"

__all__ = [
    "MANIFEST_PATH",
    "SCHEMAS_DIR",
    "EXAMPLES_DIR",
    "PACK_ROOT",
]

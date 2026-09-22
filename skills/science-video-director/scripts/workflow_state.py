"""Shared workflow state, proposal fingerprints and append-only event logging.

PROJECT.json remains the single source of truth.  This module only adds a
small, project-local audit trail so a resumed session can see what happened
without maintaining a second state file.
"""
from __future__ import annotations

import hashlib
import json
from copy import deepcopy
from datetime import datetime
from pathlib import Path


STATE_SCHEMA = "science-video-workflow-v1"
DEFAULT_EVENTS = "qa/workflow-events.jsonl"


def now() -> str:
    return datetime.now().astimezone().isoformat()


def canonical_digest(value) -> str:
    payload = json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
        allow_nan=False,
    ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def proposal_fingerprint(proposal: dict) -> str:
    """Hash only the user-facing proposal, never its confirmation history."""
    value = deepcopy(proposal)
    value.pop("confirmation", None)
    value.pop("confirmation_history", None)
    return canonical_digest(value)


def event_path(root: Path, manifest: dict | None = None) -> Path:
    relative = ((manifest or {}).get("paths") or {}).get("events") or DEFAULT_EVENTS
    path = (root / relative).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError(f"Event log escapes project: {relative}")
    return path


def _load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def _save_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def _event_lines(path: Path) -> list[dict]:
    if not path.is_file():
        return []
    lines: list[dict] = []
    for line_number, line in enumerate(path.read_text(encoding="utf-8-sig").splitlines(), 1):
        if not line.strip():
            continue
        try:
            value = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"workflow event log line {line_number} is not valid JSON") from exc
        if not isinstance(value, dict):
            raise ValueError(f"workflow event log line {line_number} is not an object")
        lines.append(value)
    return lines


def verify_events(root: Path, manifest: dict | None = None) -> dict:
    """Verify the append-only hash chain without changing project files."""
    path = event_path(root, manifest)
    events = _event_lines(path)
    previous = None
    errors: list[str] = []
    for index, event in enumerate(events, 1):
        if event.get("prev_sha256") != previous:
            errors.append(f"workflow event {index}: previous hash does not match")
        saved = event.get("event_sha256")
        body = {key: value for key, value in event.items() if key != "event_sha256"}
        if not saved or canonical_digest(body) != saved:
            errors.append(f"workflow event {index}: event hash does not match")
        previous = saved
    return {"path": path, "events": events, "errors": errors}


def record_event(
    root: Path,
    event_type: str,
    *,
    phase: str | None = None,
    details: dict | None = None,
    actor: str = "assistant",
) -> dict:
    """Append an event and update the compact workflow summary in PROJECT.json."""
    root = Path(root).resolve()
    manifest_path = root / "PROJECT.json"
    manifest = _load_json(manifest_path)
    path = event_path(root, manifest)
    previous_events = verify_events(root, manifest)
    if previous_events["errors"]:
        raise ValueError("Cannot append to a tampered workflow event log: " + "; ".join(previous_events["errors"]))
    previous_hash = previous_events["events"][-1].get("event_sha256") if previous_events["events"] else None
    event = {
        "event_id": f"E{len(previous_events['events']) + 1:04d}",
        "timestamp": now(),
        "type": event_type,
        "phase": phase or (manifest.get("workflow") or {}).get("phase"),
        "actor": actor,
        "details": details or {},
        "prev_sha256": previous_hash,
    }
    event["event_sha256"] = canonical_digest(event)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as stream:
        stream.write(json.dumps(event, ensure_ascii=False, separators=(",", ":")) + "\n")

    workflow = manifest.setdefault("workflow", {})
    workflow.setdefault("state_schema", STATE_SCHEMA)
    workflow["last_event_id"] = event["event_id"]
    workflow["last_event_at"] = event["timestamp"]
    if phase:
        workflow["phase"] = phase
    if event_type == "opening_plan_built":
        workflow.update({"phase": "opening_plan", "opening_plan_status": "awaiting_user", "production_unlocked": False})
    elif event_type == "opening_plan_confirmed":
        workflow.update({"phase": "directing", "opening_plan_status": "confirmed", "production_unlocked": True})
        fingerprint = event.get("details", {}).get("proposal_fingerprint")
        if fingerprint:
            workflow["confirmed_proposal_fingerprint"] = fingerprint
    elif event_type == "revision_frozen":
        workflow["phase"] = "review"
    _save_json(manifest_path, manifest)
    return event

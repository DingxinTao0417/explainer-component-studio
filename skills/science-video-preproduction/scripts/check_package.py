#!/usr/bin/env python3
"""Read-only checks for AI and mixed-source PRODUCTION.json v1/v2 packages."""

import argparse
import hashlib
import json
import math
from pathlib import Path
import re
import struct
import subprocess
import sys
from urllib.parse import urlparse


FIELDS = [
    "subject_definitions", "summary", "retention_analysis",
    "detailed_description", "overall_soundscape", "non_diegetic_music",
]
ROLES = {"subject_style", "composition_target", "start_frame", "end_state"}
VISUAL_MODES = {"ai_animation", "ai_image", "external_video", "external_image",
                "screen_record", "graphic", "user_media"}
ASSET_MODES = {"external_video", "external_image", "graphic", "user_media"}


def frame_grid(duration):
    frames = max(5, round(duration * 24))
    return frames + (5 - frames % 17) % 17


def cover_audio(duration):
    frames = max(5, math.ceil(duration * 24))
    return frames + (5 - frames % 17) % 17


def image_size(path):
    data = path.read_bytes()
    if data[:8] == b"\x89PNG\r\n\x1a\n" and data[12:16] == b"IHDR":
        return struct.unpack(">II", data[16:24])
    if data[:2] != b"\xff\xd8":
        return None
    offset = 2
    sof = {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
           0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}
    while offset + 4 <= len(data):
        if data[offset] != 0xFF:
            break
        while offset < len(data) and data[offset] == 0xFF:
            offset += 1
        if offset >= len(data):
            break
        marker = data[offset]
        offset += 1
        if marker in (0xD9, 0xDA):
            break
        if marker in {0x01, *range(0xD0, 0xD8)}:
            continue
        if offset + 2 > len(data):
            break
        length = int.from_bytes(data[offset:offset + 2], "big")
        if length < 2 or offset + length > len(data):
            break
        if marker in sof and length >= 7:
            height, width = struct.unpack(">HH", data[offset + 3:offset + 7])
            return width, height
        offset += length
    raise ValueError("无法读取 JPEG 尺寸")


def audio_duration(path, ffprobe):
    result = subprocess.run(
        [ffprobe, "-v", "error", "-select_streams", "a:0",
         "-show_entries", "stream=codec_type,duration:format=duration",
         "-of", "json", str(path)],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
        timeout=30, check=True,
    )
    info = json.loads(result.stdout)
    streams = info.get("streams", [])
    if not streams:
        raise ValueError("文件没有音轨")
    value = streams[0].get("duration")
    if value in (None, "N/A"):
        value = info.get("format", {}).get("duration")
    duration = float(value)
    if not math.isfinite(duration) or duration <= 0:
        raise ValueError("音轨时长无效")
    return duration


def validate(root, for_video=False, ffprobe="ffprobe"):
    root = Path(root).resolve()
    report = {"project": str(root), "mode": "for-video" if for_video else "draft",
              "errors": [], "pending": [], "warnings": [], "shots": []}

    def error(message):
        report["errors"].append(message)

    def pending(message):
        report["errors" if for_video else "pending"].append(message)

    def file_path(value, label, required=True):
        if not value:
            if required:
                error(f"{label}：未指定文件")
            return None
        if not isinstance(value, str):
            error(f"{label}：文件路径应为字符串")
            return None
        path = (root / value).resolve()
        if Path(value).is_absolute() or not path.is_relative_to(root):
            error(f"{label}：应使用项目内相对路径")
            return None
        if not path.is_file():
            error(f"{label}：文件不存在 {value}")
            return None
        if path.stat().st_size == 0:
            error(f"{label}：文件为空 {value}")
            return None
        return path

    def finish():
        report["ok"] = not report["errors"]
        report["video_static_checks_passed"] = for_video and report["ok"]
        return report

    try:
        data = json.loads((root / "PRODUCTION.json").read_text(encoding="utf-8-sig"))
    except (OSError, ValueError) as exc:
        error(f"无法读取 PRODUCTION.json：{exc}")
        return finish()
    if not isinstance(data, dict) or data.get("schema_version") not in (1, 2):
        error("需要 PRODUCTION.json schema_version 1 或 2")
        return finish()
    if data.get("audio_mode") not in {"narration", "silent"}:
        error("audio_mode 应为 narration 或 silent")
    shots = data.get("shots")
    if not isinstance(shots, list) or not shots:
        error("shots 必须是非空列表")
        return finish()

    def load_index(filename):
        path = root / filename
        if not path.exists():
            return {}
        try:
            entries = json.loads(path.read_text(encoding="utf-8-sig"))
        except (OSError, ValueError) as exc:
            error(f"{filename}：无法读取 {exc}")
            return {}
        if not isinstance(entries, list):
            error(f"{filename}：顶层应为列表")
            return {}
        index = {}
        for item in entries:
            if not isinstance(item, dict) or not isinstance(item.get("id"), str) or not item["id"].strip():
                error(f"{filename}：每项需要字符串 id")
                continue
            if item["id"] in index:
                error(f"{filename}：重复 id {item['id']}")
            index[item["id"]] = item
        return index

    assets = load_index("ASSETS.json")
    recordings = load_index("RECORDINGS.json")
    checked_assets = set()
    checked_recordings = set()
    all_shot_ids = {s.get("id") for s in shots
                    if isinstance(s, dict) and isinstance(s.get("id"), str)}

    def check_asset(aid):
        if aid in checked_assets:
            return
        checked_assets.add(aid)
        asset = assets[aid]
        name = f"素材 {aid}"
        kind = asset.get("kind")
        if kind not in ASSET_MODES:
            error(f"{name}：素材种类无效")
        if not asset.get("description"):
            error(f"{name}：缺少画面内容说明")
        if kind in {"external_video", "external_image"}:
            url = asset.get("source_url")
            parsed = urlparse(url) if isinstance(url, str) else None
            if not parsed or parsed.scheme not in {"http", "https"} or not parsed.netloc:
                error(f"{name}：缺少具体来源页链接")
            if kind == "external_video" and not asset.get("source_locator"):
                pending(f"{name}：拟用视频片段尚未定位")
        if asset.get("status") not in {"found", "reviewed", "acquired"}:
            error(f"{name}：获取状态无效")
        if asset.get("license_status") not in {"confirmed", "pending"}:
            error(f"{name}：使用条件状态应为 confirmed 或 pending")
        elif asset.get("license_status") != "confirmed":
            pending(f"{name}：采用素材的使用条件待确认")
        elif not asset.get("license_evidence"):
            error(f"{name}：已确认使用条件但缺少依据")
        if asset.get("reviewed") is not True:
            pending(f"{name}：尚未查看内容")
        path = file_path(asset.get("local_file"), name, False)
        if not asset.get("local_file"):
            pending(f"{name}：尚未取得项目内文件")
            if asset.get("status") == "acquired":
                error(f"{name}：声称已获取但没有文件路径")
        if path and asset.get("sha256") != hashlib.sha256(path.read_bytes()).hexdigest():
            error(f"{name}：文件 SHA-256 不一致或未记录")

    def check_recording(rid):
        if rid in checked_recordings:
            return
        checked_recordings.add(rid)
        recording = recordings[rid]
        name = f"录屏任务 {rid}"
        for key in ("purpose", "application", "setup", "fallback"):
            if not recording.get(key):
                error(f"{name}：缺少 {key}")
        verification = recording.get("verification", {})
        if not isinstance(verification, dict):
            error(f"{name}：verification 应为对象")
            verification = {}
        if verification.get("status") not in {"observed", "documented", "unverified"}:
            error(f"{name}：步骤核对状态无效")
        elif verification.get("status") == "unverified":
            pending(f"{name}：操作路径待核实")
        elif not verification.get("evidence"):
            error(f"{name}：缺少 UI 观测或官方说明依据")
        steps = recording.get("steps")
        if not isinstance(steps, list) or not steps:
            error(f"{name}：缺少逐步操作")
            steps = []
        for index, step in enumerate(steps, 1):
            if not isinstance(step, dict):
                error(f"{name} 第 {index} 步应为对象")
                continue
            for key in ("start_state", "action", "expected_result"):
                if not isinstance(step.get(key), str) or not step[key].strip():
                    error(f"{name} 第 {index} 步：缺少 {key}")
            file_path(step.get("input_file"), f"{name} 第 {index} 步输入", False)
            sid = step.get("narration_shot_id")
            if sid is not None and (not isinstance(sid, str) or sid not in all_shot_ids):
                error(f"{name} 第 {index} 步：旁白镜头 ID 不存在")
        file_path(recording.get("local_file"), name, False)
        if not recording.get("local_file"):
            pending(f"{name}：等待用户实际录制")
        if recording.get("reviewed") is not True:
            pending(f"{name}：尚未查看录制文件")

    script_path = file_path(data.get("script_file"), "逐字稿")
    spoken = []
    ids = set()
    for shot in shots:
        if not isinstance(shot, dict):
            error("每个镜头必须是对象")
            continue
        sid = shot.get("id")
        if not isinstance(sid, str) or not sid:
            error("每个镜头需要非空字符串 id")
            continue
        if sid in ids:
            error(f"镜头 {sid} 重复")
        ids.add(sid)
        label = f"镜头 {sid}"
        line = shot.get("narration")
        if not isinstance(line, str):
            error(f"{label}：narration 应为字符串，无声停留可用空字符串")
        else:
            spoken.append(line)
        if not shot.get("visual_goal"):
            error(f"{label}：缺少讲解目标")
        mode = shot.get("visual_mode", "ai_animation" if data["schema_version"] == 1 else None)
        if mode not in VISUAL_MODES:
            error(f"{label}：visual_mode 无效或未指定")
        if data["schema_version"] == 2:
            if shot.get("section") not in {"hook", "body", "ending"}:
                error(f"{label}：section 应为 hook / body / ending")
            if not shot.get("source_reason"):
                error(f"{label}：缺少画面来源选择理由")
        ai_image = mode in {"ai_animation", "ai_image"}
        h3 = mode == "ai_animation"
        file_path(shot.get("image_prompt_file"), f"{label} 制图提示词", ai_image)
        asset_ids = shot.get("asset_ids", [])
        if not isinstance(asset_ids, list) or any(not isinstance(a, str) for a in asset_ids):
            error(f"{label}：asset_ids 应为字符串列表")
            asset_ids = []
        if mode in ASSET_MODES and not asset_ids:
            pending(f"{label}：尚未选择实际素材")
        if mode in ASSET_MODES and asset_ids and not any(assets.get(a, {}).get("kind") == mode for a in asset_ids):
            error(f"{label}：没有与主要画面来源匹配的素材")
        for aid in asset_ids:
            if aid not in assets:
                error(f"{label}：素材 ID {aid} 不存在于 ASSETS.json")
            else:
                check_asset(aid)
        if mode == "screen_record":
            rid = shot.get("recording_id")
            if not rid:
                pending(f"{label}：尚未编写录屏任务")
            elif not isinstance(rid, str) or rid not in recordings:
                error(f"{label}：录屏任务 ID 不存在于 RECORDINGS.json")
            else:
                check_recording(rid)
        refs = shot.get("references", [])
        if not isinstance(refs, list):
            error(f"{label}：references 应为列表")
            refs = []
        if ai_image and not refs:
            pending(f"{label}：参考图尚未生成")
        for index, ref in enumerate(refs, 1):
            rlabel = f"{label} Picture {index}"
            if not isinstance(ref, dict):
                error(f"{rlabel}：素材记录应为对象")
                continue
            image_path = file_path(ref.get("file"), rlabel)
            if ref.get("role") not in ROLES:
                error(f"{rlabel}：参考职责无效")
            if ref.get("reviewed") is not True:
                pending(f"{rlabel}：尚未查看图片")
            if image_path:
                if ref.get("sha256") != hashlib.sha256(image_path.read_bytes()).hexdigest():
                    error(f"{rlabel}：SHA-256 不一致或未记录")
                try:
                    dimensions = image_size(image_path)
                    if dimensions is None:
                        pending(f"{rlabel}：检查器只支持 PNG/JPEG 尺寸；请使用已查看的 PNG/JPEG 工作副本")
                    elif tuple([ref.get("width"), ref.get("height")]) != dimensions:
                        error(f"{rlabel}：记录尺寸与实际 {dimensions} 不一致")
                except (ValueError, struct.error) as exc:
                    error(f"{rlabel}：{exc}")
        video_path = file_path(shot.get("video_prompt_file"), f"{label} H3 提示词", False)
        if h3 and not shot.get("video_prompt_file"):
            pending(f"{label}：H3 提示词尚未完成")
        if video_path and h3:
            prompt = video_path.read_text(encoding="utf-8-sig")
            found = re.findall(r"(?m)^([a-z_]+):[ \t]*$", prompt)
            if found != FIELDS:
                error(f"{label}：H3 六字段缺失、重复或顺序错误")
            else:
                contents = re.split(r"(?m)^[a-z_]+:[ \t]*$", prompt)[1:]
                if any(not content.strip() for content in contents):
                    error(f"{label}：H3 字段内容为空")
            picture_ids = {int(x) for x in re.findall(r"<Picture (\d+)>", prompt)}
            if (refs or for_video) and picture_ids != set(range(1, len(refs) + 1)):
                error(f"{label}：Picture 标签与参考图数量不一致")
            if re.search(r"<(?:Audio|Video) \d+>", prompt):
                error(f"{label}：当前图像参考/独立旁白包未声明 H3 音视频参考")
        timing = shot.get("timing", {})
        if not isinstance(timing, dict):
            error(f"{label}：timing 应为对象")
            continue
        duration = timing.get("duration_sec")
        if isinstance(duration, bool) or not isinstance(duration, (int, float)) or not math.isfinite(duration) or duration <= 0:
            error(f"{label}：duration_sec 必须是正数")
            continue
        row = {"id": sid, "visual_mode": mode, "planned_seconds": duration,
               "timeline_frames": math.ceil(duration * 24)}
        if h3:
            row["frame_grid_frames"] = frame_grid(duration)
        if timing.get("basis") not in {"estimated", "audio"}:
            error(f"{label}：时长依据应为 estimated 或 audio")
        needs_audio = data.get("audio_mode") == "narration" and isinstance(line, str) and bool(line.strip())
        audio_path = file_path(timing.get("audio_file"), f"{label} 配音", False)
        if needs_audio and not timing.get("audio_file"):
            pending(f"{label}：待制作对应逐字稿的新配音")
        if needs_audio and timing.get("basis") != "audio":
            pending(f"{label}：时长尚未按实际配音校准")
        if timing.get("basis") == "audio" and not audio_path:
            error(f"{label}：声明按音频测时，但音频不存在")
        if audio_path:
            try:
                actual = audio_duration(audio_path, ffprobe)
                row.update(audio_seconds=actual,
                           minimum_frames_covering_audio=cover_audio(actual) if h3 else math.ceil(actual * 24))
                if timing.get("basis") == "audio" and abs(actual - duration) > 0.1:
                    error(f"{label}：音频实测 {actual:.3f} 秒与记录 {duration:.3f} 秒不一致")
                frames = row.get("frame_grid_frames", row["timeline_frames"])
                if actual > frames / 24 + 0.001:
                    error(f"{label}：当前画面时长不足以容纳完整配音")
            except (OSError, ValueError, TypeError, subprocess.SubprocessError) as exc:
                pending(f"{label}：无法测量配音，请检查 ffprobe 与媒体文件：{exc}")
        report["shots"].append(row)
    if script_path:
        script = script_path.read_text(encoding="utf-8-sig")
        normalize = lambda text: re.sub(r"\s+", "", text)
        if normalize(script) != normalize("".join(spoken)):
            error("分镜旁白未按顺序完整覆盖逐字稿：存在漏句、重复或未同步的改稿")
    return finish()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("project", type=Path)
    parser.add_argument("--for-video", action="store_true")
    parser.add_argument("--ffprobe", default="ffprobe")
    args = parser.parse_args()
    result = validate(args.project, args.for_video, args.ffprobe)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())

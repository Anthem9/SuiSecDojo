#!/usr/bin/env python3
"""Minimal local badge proof service for Dojo Pass badge minting.

The service is intentionally stateless. It reads a development Ed25519 key from
outside the repository, checks a Sui testnet UserProgress object, and signs the
BCS payload expected by dojo_pass::mint_badge.
"""

from __future__ import annotations

import argparse
import json
import urllib.request
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives import serialization


BADGE_REQUIREMENTS = {
    "1": {"1"},
    "2": {"2"},
    "3": {"3"},
    "4": {"6", "10"},
    "5": set(),
}


def address_bytes(address: str) -> bytes:
    clean = address[2:] if address.startswith("0x") else address
    return bytes.fromhex(clean.rjust(64, "0"))


def proof_message(owner: str, badge_type: str, expires_epoch: int, nonce: int) -> bytes:
    return (
        address_bytes(owner)
        + int(badge_type).to_bytes(8, "little")
        + int(expires_epoch).to_bytes(8, "little")
        + int(nonce).to_bytes(8, "little")
    )


def rpc_call(rpc_url: str, method: str, params: list) -> dict:
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params,
    }
    req = urllib.request.Request(
        rpc_url,
        data=json.dumps(payload).encode(),
        headers={"content-type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=15) as response:
        body = json.loads(response.read().decode())
    if "error" in body:
        raise ValueError(body["error"])
    return body["result"]


def rpc_get_object(rpc_url: str, object_id: str) -> dict:
    return rpc_call(rpc_url, "sui_getObject", [object_id, {"showContent": True, "showOwner": True, "showType": True}])


def rpc_current_epoch(rpc_url: str) -> int:
    state = rpc_call(rpc_url, "suix_getLatestSuiSystemState", [])
    return int(state["epoch"])


def completed_challenges(progress_object: dict, owner: str) -> set[str]:
    data = progress_object.get("data") or {}
    owner_field = data.get("owner")
    if isinstance(owner_field, dict):
        actual_owner = owner_field.get("AddressOwner")
        if actual_owner and actual_owner.lower() != owner.lower():
            raise ValueError("progress object owner does not match request owner")
    content = data.get("content") or {}
    if content.get("dataType") != "moveObject":
        raise ValueError("progress object is not a Move object")
    fields = content.get("fields") or {}
    return {str(item) for item in fields.get("completed_challenges", [])}


def make_handler(private_key: Ed25519PrivateKey, rpc_url: str, expires_epoch_delta: int):
    class Handler(BaseHTTPRequestHandler):
        def do_POST(self):  # noqa: N802
            if self.path != "/badge-proof":
                self.send_error(404)
                return
            try:
                length = int(self.headers.get("content-length", "0"))
                request = json.loads(self.rfile.read(length).decode())
                owner = str(request["owner"])
                badge_type = str(request["badgeType"])
                progress_object_id = str(request["progressObjectId"])
                required = BADGE_REQUIREMENTS.get(badge_type)
                if required is None:
                    raise ValueError("unsupported badge type")
                completed = completed_challenges(rpc_get_object(rpc_url, progress_object_id), owner)
                if not required.issubset(completed):
                    raise ValueError("badge requirements are not satisfied")
                expires_epoch = rpc_current_epoch(rpc_url) + expires_epoch_delta
                nonce = int(time.time() * 1000)
                message = proof_message(owner, badge_type, expires_epoch, nonce)
                signature = private_key.sign(message).hex()
                self.respond({"expiresEpoch": str(expires_epoch), "nonce": str(nonce), "signature": signature})
            except Exception as exc:  # noqa: BLE001
                self.respond({"error": str(exc)}, status=400)

        def respond(self, payload: dict, status: int = 200):
            body = json.dumps(payload).encode()
            self.send_response(status)
            self.send_header("access-control-allow-origin", "*")
            self.send_header("content-type", "application/json")
            self.send_header("content-length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, fmt, *args):
            print(fmt % args)

    return Handler


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--key-file", default="/Users/anitya/Development/.secrets/suisec-dojo/dojo-pass-proof-ed25519.json")
    parser.add_argument("--rpc-url", default="https://fullnode.testnet.sui.io:443")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8787)
    parser.add_argument("--expires-epoch-delta", type=int, default=2)
    args = parser.parse_args()

    secret = json.loads(Path(args.key_file).read_text())
    private_key = Ed25519PrivateKey.from_private_bytes(bytes.fromhex(secret["privateKeyHex"]))
    public_key = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw,
    ).hex()
    print(f"Badge proof service public key: {public_key}")
    print(f"Listening on http://{args.host}:{args.port}/badge-proof")
    HTTPServer((args.host, args.port), make_handler(private_key, args.rpc_url, args.expires_epoch_delta)).serve_forever()


if __name__ == "__main__":
    main()

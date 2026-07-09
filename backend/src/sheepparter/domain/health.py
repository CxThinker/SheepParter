from dataclasses import dataclass
from typing import Literal


@dataclass(frozen=True, slots=True)
class HealthStatus:
    service: str
    version: str
    status: Literal["ok"] = "ok"

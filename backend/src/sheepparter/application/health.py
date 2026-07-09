from sheepparter.domain.health import HealthStatus


class CheckHealth:
    def __init__(self, service_name: str, service_version: str) -> None:
        self._service_name = service_name
        self._service_version = service_version

    def execute(self) -> HealthStatus:
        return HealthStatus(service=self._service_name, version=self._service_version)

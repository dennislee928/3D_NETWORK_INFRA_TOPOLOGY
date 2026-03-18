from pathlib import Path
import sysconfig


target = Path(sysconfig.get_paths()["purelib"]) / "ryu" / "app" / "wsgi.py"

old = """class _AlreadyHandledResponse(Response):
    # XXX: Eventlet API should not be used directly.
    from eventlet.wsgi import ALREADY_HANDLED
    _ALREADY_HANDLED = ALREADY_HANDLED

    def __call__(self, environ, start_response):
        return self._ALREADY_HANDLED
"""

new = """class _AlreadyHandledResponse(Response):
    # Eventlet >= 0.30.3 replaced ALREADY_HANDLED with WSGI_LOCAL.already_handled.
    def __call__(self, environ, start_response):
        import eventlet.wsgi

        if hasattr(eventlet.wsgi, 'ALREADY_HANDLED'):
            return eventlet.wsgi.ALREADY_HANDLED

        eventlet.wsgi.WSGI_LOCAL.already_handled = True
        return []
"""

text = target.read_text()
if old not in text:
    raise SystemExit(f"Expected Ryu compatibility block not found in {target}")

target.write_text(text.replace(old, new))

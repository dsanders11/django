from django.apps import apps
from django.template import Library
from django.utils.functional import lazy

register = Library()

_static = None


@register.simple_tag
def static(path):
    global _static
    if _static is None:
        if apps.is_installed('django.contrib.staticfiles'):
            from django.contrib.staticfiles.templatetags.staticfiles import static as _static
        else:
            from django.templatetags.static import static as _static
    return _static(path)


static_lazy = lazy(static, str)

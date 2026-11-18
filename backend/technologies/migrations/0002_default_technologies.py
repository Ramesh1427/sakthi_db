from django.db import migrations


def create_defaults(apps, schema_editor):
    Technology = apps.get_model('technologies', 'Technology')
    for order, name in enumerate(['PostgreSQL', 'Oracle', 'MySQL']):
        Technology.objects.get_or_create(name=name, defaults={'order': order})


class Migration(migrations.Migration):
    dependencies = [('technologies', '0001_initial')]
    operations = [migrations.RunPython(create_defaults, migrations.RunPython.noop)]

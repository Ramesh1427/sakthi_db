import django.db.models.deletion
from django.db import migrations, models


def assign_default(apps, schema_editor):
    """Existing rows go under the first technology (PostgreSQL); re-tag them from the dashboard."""
    Technology = apps.get_model('technologies', 'Technology')
    Model = apps.get_model('labs', 'Lab')
    default = Technology.objects.order_by('order', 'id').first()
    if default is None:
        default = Technology.objects.create(name='PostgreSQL', order=0)
    Model.objects.filter(technology__isnull=True).update(technology=default)


class Migration(migrations.Migration):
    atomic = False   # PostgreSQL cannot mix schema changes and data updates in one transaction

    dependencies = [('labs', '0001_initial'), ('technologies', '0002_default_technologies')]

    operations = [
        migrations.AddField(model_name='lab', name='technology',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='labs', to='technologies.technology')),
        migrations.RunPython(assign_default, migrations.RunPython.noop),
        migrations.AlterField(model_name='lab', name='technology',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='labs', to='technologies.technology')),
    ]

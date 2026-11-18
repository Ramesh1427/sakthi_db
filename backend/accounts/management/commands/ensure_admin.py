from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update the staff admin user on Render."

    def handle(self, *args, **options):
        if not getattr(settings, "ON_RENDER", False):
            self.stdout.write("Not on Render, skipping.")
            return
        User = get_user_model()
        username = settings.PROD_ADMIN_USERNAME
        user, created = User.objects.get_or_create(username=username)
        user.is_staff = True
        user.is_superuser = True
        user.set_password(settings.PROD_ADMIN_PASSWORD)
        user.save()
        self.stdout.write(f'Admin "{username}" {"created" if created else "updated"}.')
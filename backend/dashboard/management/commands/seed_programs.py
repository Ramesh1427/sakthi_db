from django.core.management.base import BaseCommand
from courses.models import Course

PROGRAMS = [
    ('Oracle DBA', 'Oracle DBA Fundamentals',
     'Oracle architecture, installation, user and tablespace management, and backup and recovery with RMAN. A good starting point for beginners.',
     'Oracle 19c, Architecture, RMAN, SQL*Plus'),
    ('Oracle DBA', 'Oracle Advanced DBA',
     'RAC setup, Data Guard, ASM, performance tuning, AWR/ASH, ADDM and OEM 13c cloud control.',
     'RAC, DataGuard, ASM, Tuning'),
    ('PostgreSQL DBA', 'PostgreSQL DBA Essentials',
     'Installation, configuration, roles, vacuum, backups with pg_dump, WAL and basic replication.',
     'PG 15/16, pgAdmin, Vacuum, WAL'),
    ('PostgreSQL DBA', 'PostgreSQL Advanced DBA',
     'Streaming and logical replication, partitioning, pgBouncer, high availability and Patroni clusters.',
     'Replication, Partitioning, Patroni, HA'),
    ('Security', 'DB Security & Auditing',
     'TDE, VPD, Label Security, Oracle Audit Vault, pg_audit, SSL setup and vulnerability assessment.',
     'TDE, VPD, pg_audit, SSL'),
    ('Cloud', 'Cloud DBA (AWS / Azure)',
     'RDS Oracle and RDS PostgreSQL, Aurora, Azure Database, migration strategies and cloud monitoring.',
     'AWS RDS, Aurora, Azure DB, Migration'),
]


class Command(BaseCommand):
    help = 'Add the six DBA programs as courses (safe to run again; existing courses are left alone)'

    def handle(self, *args, **opts):
        added = 0
        for category, name, description, tags in PROGRAMS:
            _, created = Course.objects.get_or_create(name=name, defaults={'category': category, 'description': description, 'tags': tags})
            added += created
        self.stdout.write(self.style.SUCCESS(f'{added} course(s) added.'))

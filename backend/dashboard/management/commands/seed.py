from django.core.management.base import BaseCommand
from blogs.models import Blog
from courses.models import Course, Module, Topic
from interviews.models import Question
from home.models import HeroSlide
from labs.models import Lab
from technologies.models import Technology
from videos.models import Video


class Command(BaseCommand):
    help = 'Load sample content (replace it from the admin dashboard)'

    def handle(self, *args, **opts):
        if Course.objects.exists():
            self.stdout.write('Already seeded.')
            return
        oracle = Course.objects.create(category='Oracle DBA', name='Oracle DBA Fundamentals',
            description='Install, administer and back up Oracle databases.', tags='Oracle, DBA, RMAN')
        python = Course.objects.create(category='Python', name='Python with AI',
            description='Python programming and practical AI.', tags='Python, AI')
        for course, modules in [
            (oracle, [('Architecture', ['SGA and PGA', 'Background processes']), ('Backup', ['RMAN configuration', 'Recovery scenarios'])]),
            (python, [('Python Basics', ['Introduction', 'Variables', 'Conditions']), ('Loops and Functions', ['Loops', 'Functions', 'OOPs'])]),
        ]:
            for mo, (title, topics) in enumerate(modules):
                m = Module.objects.create(course=course, title=title, order=mo)
                for to, t in enumerate(topics):
                    Topic.objects.create(module=m, title=t, order=to)   # add each video link in the dashboard
        Video.objects.create(title='Demo session 1', description='Replace with your real YouTube link.',
            youtube_url='https://www.youtube.com/results?search_query=SakthiDB+Technology')
        pg, _ = Technology.objects.get_or_create(name='PostgreSQL', defaults={'order': 0})
        ora, _ = Technology.objects.get_or_create(name='Oracle', defaults={'order': 1})
        my, _ = Technology.objects.get_or_create(name='MySQL', defaults={'order': 2})
        Lab.objects.create(technology=pg, title='PostgreSQL backup with pg_dump', description='Take and restore logical backups.')
        Lab.objects.create(technology=ora, title='Oracle RMAN backup lab', description='Hands-on backup and restore.')
        Lab.objects.create(technology=my, title='MySQL replication lab', description='Set up a source and replica.')
        Question.objects.create(technology=pg, question='What is MVCC in PostgreSQL?', answer='Multi-Version Concurrency Control lets readers and writers work without blocking each other.')
        Question.objects.create(technology=ora, question='What is the SGA?', answer='The System Global Area is the shared memory region of an Oracle instance.')
        Question.objects.create(technology=my, question='InnoDB vs MyISAM?', answer='InnoDB supports transactions and row-level locking; MyISAM does not.')
        Blog.objects.create(technology=pg, title='Getting started with PostgreSQL', content='First PostgreSQL post. Edit it from the dashboard.')
        Blog.objects.create(technology=ora, title='Welcome to SakthiDB', content='First Oracle post. Edit it from the dashboard.')
        for i, (t, x, b, l, a) in enumerate([
            ('Start your career in database administration', 'Learn Oracle DBA step by step, from architecture to backup and recovery.', 'View courses', '#courses', 'db'),
            ('Learn Python and put AI to work', 'Python programming and AI, taught through practice.', 'Watch a demo', '#videos', 'code'),
            ('Practice in labs, not just slides', 'Follow guided lab exercises and revise with interview questions.', 'See the labs', '#labs', 'terminal')]):
            HeroSlide.objects.create(title=t, text=x, button_text=b, button_link=l, art=a, order=i)
        self.stdout.write(self.style.SUCCESS('Sample data loaded.'))

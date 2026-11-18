from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from enrollments.models import Enrollment
from .models import Course

CURRICULUM = {'modules': [
    {'title': 'Basics', 'topics': [
        {'title': 'Introduction', 'video_url': 'https://youtu.be/AAAAAAAAAAA', 'is_free_preview': True},
        {'title': 'Variables', 'video_url': 'https://youtu.be/BBBBBBBBBBB'},
        {'title': 'Conditions', 'video_url': ''}]},
    {'title': 'Advanced', 'topics': [{'title': 'OOPs', 'video_url': 'https://youtu.be/CCCCCCCCCCC'}]},
]}


class CourseTests(APITestCase):
    def setUp(self):
        self.staff = User.objects.create_user('admin1', password='pw', is_staff=True)
        self.student = User.objects.create_user('student1', password='pw')
        self.other = User.objects.create_user('student2', password='pw')
        self.course = Course.objects.create(category='Python', name='Python with AI')
        self.client.force_authenticate(self.staff)
        r = self.client.put(f'/api/courses/{self.course.pk}/curriculum/', CURRICULUM, format='json')
        assert r.status_code == 200, r.data
        self.client.force_authenticate(None)
        Enrollment.objects.create(user=self.student, course=self.course)

    def topics(self, user=None):
        self.client.force_authenticate(user)
        data = self.client.get(f'/api/courses/{self.course.pk}/').data
        return data, {t['title']: t for m in data['modules'] for t in m['topics']}

    def test_crud_permissions(self):
        url = '/api/courses/'
        payload = {'category': 'SQL', 'name': 'SQL basics'}
        self.assertEqual(self.client.get(url).status_code, 200)
        self.assertEqual(self.client.post(url, payload, format='json').status_code, 401)
        self.client.force_authenticate(self.student)
        self.assertEqual(self.client.post(url, payload, format='json').status_code, 403)
        self.client.force_authenticate(self.staff)
        r = self.client.post(url, payload, format='json')
        self.assertEqual(r.status_code, 201)
        pk = r.data['id']
        self.assertEqual(self.client.patch(f'{url}{pk}/', {'name': 'SQL Pro'}, format='json').status_code, 200)
        self.assertEqual(self.client.delete(f'{url}{pk}/').status_code, 204)

    def test_anonymous_sees_syllabus_but_only_free_preview_video(self):
        data, t = self.topics(None)
        self.assertFalse(data['has_access'])
        self.assertEqual([m['title'] for m in data['modules']], ['Basics', 'Advanced'])
        self.assertEqual(t['Introduction']['video_url'], 'https://youtu.be/AAAAAAAAAAA')
        self.assertIsNone(t['Variables']['video_url'])
        self.assertTrue(t['Variables']['has_video'])      # UI can show "locked"
        self.assertIsNone(t['OOPs']['video_url'])

    def test_student_without_access_cannot_see_videos(self):
        data, t = self.topics(self.other)
        self.assertFalse(data['has_access'])
        self.assertIsNone(t['Variables']['video_url'])

    def test_student_with_access_sees_all_videos(self):
        data, t = self.topics(self.student)
        self.assertTrue(data['has_access'])
        self.assertEqual(t['Variables']['video_url'], 'https://youtu.be/BBBBBBBBBBB')
        self.assertEqual(t['OOPs']['video_url'], 'https://youtu.be/CCCCCCCCCCC')
        self.assertIsNone(t['Conditions']['video_url'])    # no video added yet

    def test_staff_sees_everything(self):
        _, t = self.topics(self.staff)
        self.assertEqual(t['Variables']['video_url'], 'https://youtu.be/BBBBBBBBBBB')

    def test_list_endpoint_also_hides_locked_videos(self):
        self.client.force_authenticate(None)
        topics = [t for c in self.client.get('/api/courses/').data for m in c['modules'] for t in m['topics']]
        self.assertEqual(sum(1 for t in topics if t['video_url']), 1)   # only the free preview

    def test_curriculum_only_staff(self):
        url = f'/api/courses/{self.course.pk}/curriculum/'
        self.assertEqual(self.client.put(url, CURRICULUM, format='json').status_code, 401)
        self.client.force_authenticate(self.student)
        self.assertEqual(self.client.put(url, CURRICULUM, format='json').status_code, 403)

    def test_curriculum_replaces_and_validates(self):
        url = f'/api/courses/{self.course.pk}/curriculum/'
        self.client.force_authenticate(self.staff)
        r = self.client.put(url, {'modules': [{'title': 'Loops', 'topics': [{'title': 'for loop'}]}]}, format='json')
        self.assertEqual(r.status_code, 200)
        self.assertEqual([m['title'] for m in r.data['modules']], ['Loops'])
        self.assertEqual(self.client.put(url, {'modules': [{'title': '', 'topics': []}]}, format='json').status_code, 400)
        bad = {'modules': [{'title': 'X', 'topics': [{'title': 'T', 'video_url': 'not a url'}]}]}
        self.assertEqual(self.client.put(url, bad, format='json').status_code, 400)
        self.assertEqual(self.client.put(url, {'modules': 'x'}, format='json').status_code, 400)

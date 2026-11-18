from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from .models import Video


class VideoAPITests(APITestCase):
    url = '/api/videos/'
    payload = {'title': 'Demo', 'youtube_url': 'https://youtube.com/watch?v=abc'}

    def setUp(self):
        self.staff = User.objects.create_user('admin1', password='pw', is_staff=True)
        self.student = User.objects.create_user('student1', password='pw')

    def test_public_can_list(self):
        self.assertEqual(self.client.get(self.url).status_code, 200)

    def test_public_cannot_create(self):
        self.assertEqual(self.client.post(self.url, self.payload, format='json').status_code, 401)

    def test_non_staff_cannot_create(self):
        self.client.force_authenticate(self.student)
        self.assertEqual(self.client.post(self.url, self.payload, format='json').status_code, 403)

    def test_staff_full_crud(self):
        self.client.force_authenticate(self.staff)
        r = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(r.status_code, 201)
        pk = r.data['id']
        r = self.client.patch(f'{self.url}{pk}/', {'title': 'Demo 2'}, format='json')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(self.client.delete(f'{self.url}{pk}/').status_code, 204)
        self.assertEqual(Video.objects.count(), 0)

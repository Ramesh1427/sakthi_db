from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from .models import HeroSlide


class HeroSlideTests(APITestCase):
    def setUp(self):
        self.staff = User.objects.create_user('admin1', password='pw', is_staff=True)
        HeroSlide.objects.create(title='Visible', order=1)
        HeroSlide.objects.create(title='Hidden', order=2, is_active=False)

    def test_public_sees_only_active_slides_in_order(self):
        r = self.client.get('/api/hero-slides/')
        self.assertEqual([s['title'] for s in r.data], ['Visible'])

    def test_staff_sees_all_and_can_crud(self):
        self.client.force_authenticate(self.staff)
        self.assertEqual(len(self.client.get('/api/hero-slides/').data), 2)
        r = self.client.post('/api/hero-slides/', {'title': 'New', 'art': 'code'}, format='json')
        self.assertEqual(r.status_code, 201)
        self.assertEqual(self.client.patch(f"/api/hero-slides/{r.data['id']}/", {'is_active': False}, format='json').status_code, 200)
        self.assertEqual(self.client.delete(f"/api/hero-slides/{r.data['id']}/").status_code, 204)

    def test_public_cannot_write(self):
        self.assertEqual(self.client.post('/api/hero-slides/', {'title': 'x'}, format='json').status_code, 401)

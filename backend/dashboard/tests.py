from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from .models import Enquiry


class DashboardTests(APITestCase):
    def setUp(self):
        self.staff = User.objects.create_user('admin1', password='pw', is_staff=True)

    def test_visitor_can_submit_enquiry(self):
        r = self.client.post('/api/enquiries/', {'name': 'Ravi', 'phone': '9999', 'is_read': True}, format='json')
        self.assertEqual(r.status_code, 201)
        self.assertFalse(Enquiry.objects.get().is_read)

    def test_visitor_cannot_read_enquiries(self):
        self.assertEqual(self.client.get('/api/enquiries/').status_code, 401)

    def test_stats_staff_only(self):
        self.assertEqual(self.client.get('/api/dashboard/stats/').status_code, 401)
        self.client.force_authenticate(self.staff)
        r = self.client.get('/api/dashboard/stats/')
        self.assertEqual(r.status_code, 200)
        self.assertIn('courses', r.data)

    def test_staff_can_mark_enquiry_read(self):
        e = Enquiry.objects.create(name='A')
        self.client.force_authenticate(self.staff)
        r = self.client.patch(f'/api/enquiries/{e.pk}/', {'is_read': True}, format='json')
        self.assertTrue(r.data['is_read'])

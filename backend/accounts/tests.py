import os

from django.contrib.auth.models import User
from django.core.management import call_command
from django.test import TestCase
from rest_framework.test import APITestCase


class AuthTests(APITestCase):
    def setUp(self):
        User.objects.create_user('admin1', password='pw12345', is_staff=True)
        User.objects.create_user('student1', password='pw12345')

    def login(self, u, p='pw12345'):
        return self.client.post('/api/auth/login/', {'username': u, 'password': p})

    def test_staff_login_returns_token_and_flag(self):
        r = self.login('admin1')
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.data['is_staff'])
        self.assertIn('token', r.data)

    def test_student_can_log_in_but_is_not_staff(self):
        r = self.login('student1')
        self.assertEqual(r.status_code, 200)
        self.assertFalse(r.data['is_staff'])

    def test_wrong_password(self):
        self.assertEqual(self.login('admin1', 'nope').status_code, 400)

    def test_me_requires_token(self):
        self.assertEqual(self.client.get('/api/auth/me/').status_code, 401)
        token = self.login('admin1').data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        self.assertTrue(self.client.get('/api/auth/me/').data['is_staff'])

    def test_register_creates_non_staff_user(self):
        r = self.client.post('/api/auth/register/', {'username': 'newbie', 'password': 'Str0ng-pass-1'})
        self.assertEqual(r.status_code, 201)
        self.assertFalse(User.objects.get(username='newbie').is_staff)
        self.assertFalse(r.data['is_staff'])

    def test_register_rejects_duplicates_and_weak_passwords(self):
        self.assertEqual(self.client.post('/api/auth/register/', {'username': 'STUDENT1', 'password': 'Str0ng-pass-1'}).status_code, 400)
        self.assertEqual(self.client.post('/api/auth/register/', {'username': 'x1', 'password': '123'}).status_code, 400)
        self.assertEqual(self.client.post('/api/auth/register/', {'username': '', 'password': 'Str0ng-pass-1'}).status_code, 400)

    def test_students_cannot_use_staff_endpoints(self):
        token = self.login('student1').data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        self.assertEqual(self.client.get('/api/dashboard/stats/').status_code, 403)
        self.assertEqual(self.client.get('/api/enquiries/').status_code, 403)


class EnsureAdminTests(TestCase):
    def test_creates_staff_user_from_env(self):
        os.environ['ADMIN_USERNAME'], os.environ['ADMIN_PASSWORD'] = 'boss', 'S3cret-pass!'
        try:
            call_command('ensure_admin')
        finally:
            del os.environ['ADMIN_USERNAME'], os.environ['ADMIN_PASSWORD']
        u = User.objects.get(username='boss')
        self.assertTrue(u.is_staff and u.is_superuser and u.check_password('S3cret-pass!'))

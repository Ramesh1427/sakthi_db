from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from courses.models import Course
from .models import Enrollment


class StudentAccessTests(APITestCase):
    def setUp(self):
        self.staff = User.objects.create_user('admin1', password='pw', is_staff=True)
        self.stu = User.objects.create_user('stu', password='pw')
        self.c1 = Course.objects.create(category='Python', name='Python')
        self.c2 = Course.objects.create(category='SQL', name='SQL')

    def test_only_staff_can_manage(self):
        self.assertEqual(self.client.get('/api/students/').status_code, 401)
        self.client.force_authenticate(self.stu)
        self.assertEqual(self.client.get('/api/students/').status_code, 403)
        r = self.client.put(f'/api/students/{self.stu.pk}/access/', {'course_ids': [self.c1.pk]}, format='json')
        self.assertEqual(r.status_code, 403)

    def test_grant_and_revoke(self):
        self.client.force_authenticate(self.staff)
        url = f'/api/students/{self.stu.pk}/access/'
        r = self.client.put(url, {'course_ids': [self.c1.pk, self.c2.pk]}, format='json')
        self.assertEqual(r.data['course_ids'], [self.c1.pk, self.c2.pk])
        r = self.client.put(url, {'course_ids': [self.c2.pk]}, format='json')
        self.assertEqual(r.data['course_ids'], [self.c2.pk])
        self.assertEqual(Enrollment.objects.filter(user=self.stu).count(), 1)
        row = self.client.get('/api/students/').data[0]
        self.assertEqual((row['username'], row['course_ids']), ('stu', [self.c2.pk]))

    def test_list_excludes_staff_and_bad_input_rejected(self):
        self.client.force_authenticate(self.staff)
        self.assertEqual([s['username'] for s in self.client.get('/api/students/').data], ['stu'])
        r = self.client.put(f'/api/students/{self.stu.pk}/access/', {'course_ids': 'x'}, format='json')
        self.assertEqual(r.status_code, 400)

    def test_delete_student(self):
        self.client.force_authenticate(self.staff)
        self.assertEqual(self.client.delete(f'/api/students/{self.stu.pk}/').status_code, 204)
        self.assertEqual(self.client.delete(f'/api/students/{self.staff.pk}/').status_code, 404)

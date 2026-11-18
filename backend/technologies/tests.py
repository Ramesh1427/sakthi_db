from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from labs.models import Lab
from .models import Technology


class TechnologyTests(APITestCase):
    def setUp(self):
        self.staff = User.objects.create_user('admin1', password='pw', is_staff=True)

    def test_defaults_exist_with_postgresql_first(self):
        names = [t['name'] for t in self.client.get('/api/technologies/').data]
        self.assertEqual(names[:3], ['PostgreSQL', 'Oracle', 'MySQL'])

    def test_public_cannot_write(self):
        self.assertEqual(self.client.post('/api/technologies/', {'name': 'MongoDB'}, format='json').status_code, 401)

    def test_staff_can_add_rename_delete(self):
        self.client.force_authenticate(self.staff)
        r = self.client.post('/api/technologies/', {'name': 'MongoDB', 'order': 9}, format='json')
        self.assertEqual(r.status_code, 201)
        self.assertEqual(self.client.patch(f"/api/technologies/{r.data['id']}/", {'name': 'Mongo'}, format='json').status_code, 200)
        self.assertEqual(self.client.delete(f"/api/technologies/{r.data['id']}/").status_code, 204)

    def test_cannot_delete_technology_in_use(self):
        tech = Technology.objects.get(name='Oracle')
        Lab.objects.create(title='RMAN', technology=tech)
        self.client.force_authenticate(self.staff)
        r = self.client.delete(f'/api/technologies/{tech.pk}/')
        self.assertEqual(r.status_code, 400)
        self.assertTrue(Technology.objects.filter(pk=tech.pk).exists())

    def test_labs_expose_technology_for_filtering(self):
        tech = Technology.objects.get(name='MySQL')
        Lab.objects.create(title='Replication', technology=tech)
        row = self.client.get('/api/labs/').data[0]
        self.assertEqual((row['technology'], row['technology_name']), (tech.pk, 'MySQL'))

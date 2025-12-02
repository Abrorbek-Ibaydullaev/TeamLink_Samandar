"""
Tests for Workspaces app
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from .models import Workspace, WorkspaceMember, WorkspaceInvitation

User = get_user_model()


class WorkspaceTests(TestCase):
    """Test workspace creation and management"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='TestPass123!'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_workspace(self):
        """Test creating a new workspace"""
        payload = {
            'name': 'My Test Workspace',
            'description': 'A workspace for testing'
        }
        response = self.client.post('/api/v1/workspaces/', payload)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['name'], 'My Test Workspace')

        # Verify user is added as owner
        workspace = Workspace.objects.get(name='My Test Workspace')
        self.assertEqual(workspace.owner, self.user)

        member = WorkspaceMember.objects.get(
            workspace=workspace, user=self.user)
        self.assertEqual(member.role, 'owner')

    def test_list_workspaces(self):
        """Test listing user's workspaces"""
        # Create workspace
        workspace = Workspace.objects.create(
            name='Test Workspace',
            slug='test-workspace',
            owner=self.user
        )
        WorkspaceMember.objects.create(
            workspace=workspace,
            user=self.user,
            role='owner'
        )

        response = self.client.get('/api/v1/workspaces/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Test Workspace')

    def test_update_workspace(self):
        """Test updating workspace details"""
        workspace = Workspace.objects.create(
            name='Test Workspace',
            slug='test-workspace',
            owner=self.user
        )
        WorkspaceMember.objects.create(
            workspace=workspace,
            user=self.user,
            role='owner'
        )

        payload = {
            'name': 'Updated Workspace',
            'description': 'Updated description'
        }
        response = self.client.patch(
            f'/api/v1/workspaces/{workspace.id}/',
            payload
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

        workspace.refresh_from_db()
        self.assertEqual(workspace.name, 'Updated Workspace')


class WorkspaceMemberTests(TestCase):
    """Test workspace member management"""

    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_user(
            email='owner@example.com',
            username='owner',
            password='TestPass123!'
        )
        self.member_user = User.objects.create_user(
            email='member@example.com',
            username='member',
            password='TestPass123!'
        )

        self.workspace = Workspace.objects.create(
            name='Test Workspace',
            slug='test-workspace',
            owner=self.owner
        )
        WorkspaceMember.objects.create(
            workspace=self.workspace,
            user=self.owner,
            role='owner'
        )

        self.client.force_authenticate(user=self.owner)

    def test_list_members(self):
        """Test listing workspace members"""
        response = self.client.get(
            f'/api/v1/workspaces/{self.workspace.id}/members/'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)

    def test_update_member_role(self):
        """Test updating member role"""
        # Add member
        member = WorkspaceMember.objects.create(
            workspace=self.workspace,
            user=self.member_user,
            role='member'
        )

        payload = {'role': 'admin'}
        response = self.client.patch(
            f'/api/v1/workspaces/{self.workspace.id}/members/{member.id}/',
            payload
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        member.refresh_from_db()
        self.assertEqual(member.role, 'admin')

    def test_remove_member(self):
        """Test removing member from workspace"""
        member = WorkspaceMember.objects.create(
            workspace=self.workspace,
            user=self.member_user,
            role='member'
        )

        response = self.client.delete(
            f'/api/v1/workspaces/{self.workspace.id}/members/{member.id}/'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        member.refresh_from_db()
        self.assertFalse(member.is_active)


class WorkspaceInvitationTests(TestCase):
    """Test workspace invitation system"""

    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_user(
            email='owner@example.com',
            username='owner',
            password='TestPass123!'
        )

        self.workspace = Workspace.objects.create(
            name='Test Workspace',
            slug='test-workspace',
            owner=self.owner
        )
        WorkspaceMember.objects.create(
            workspace=self.workspace,
            user=self.owner,
            role='owner'
        )

        self.client.force_authenticate(user=self.owner)

    def test_create_invitation(self):
        """Test creating workspace invitation"""
        payload = {
            'email': 'newuser@example.com',
            'role': 'member',
            'message': 'Join our team!'
        }
        response = self.client.post(
            f'/api/v1/workspaces/{self.workspace.id}/invitations/',
            payload
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])

        # Verify invitation was created
        invitation = WorkspaceInvitation.objects.get(
            workspace=self.workspace,
            email='newuser@example.com'
        )
        self.assertEqual(invitation.status, 'pending')
        self.assertIsNotNone(invitation.token)


# Run tests with: python manage.py test apps.workspaces

from django.core.management.base import BaseCommand
from core.models import User, Workspace, Project, Column, Task, Membership


class Command(BaseCommand):
    help = 'Seed demo data for TaskLink'

    def handle(self, *args, **options):
        # Create a demo user
        user, created = User.objects.get_or_create(
            username='demo',
            defaults={'email': 'demo@tasklink.local', 'is_staff': False}
        )
        if created:
            user.set_password('demo123')
            user.save()
            self.stdout.write(f"Created user: demo (password: demo123)")
        else:
            self.stdout.write(f"User 'demo' already exists")

        # Create a workspace
        workspace, created = Workspace.objects.get_or_create(
            name='Demo Workspace',
            defaults={}
        )
        if created:
            self.stdout.write(f"Created workspace: {workspace.name}")

        # Add user to workspace
        Membership.objects.get_or_create(
            user=user,
            workspace=workspace,
            defaults={'role': 'owner'}
        )

        # Create a project
        project, created = Project.objects.get_or_create(
            workspace=workspace,
            name='Sample Project',
            defaults={'archived': False}
        )
        if created:
            self.stdout.write(f"Created project: {project.name}")

        # Create columns
        col_todo, _ = Column.objects.get_or_create(
            project=project, title='To Do', defaults={'order': 0})
        col_in_progress, _ = Column.objects.get_or_create(
            project=project, title='In Progress', defaults={'order': 1})
        col_done, _ = Column.objects.get_or_create(
            project=project, title='Done', defaults={'order': 2})
        self.stdout.write("Created columns")

        # Create sample tasks
        Task.objects.get_or_create(
            column=col_todo,
            title='Setup frontend',
            defaults={'description': 'Initialize React app', 'order': 0}
        )
        Task.objects.get_or_create(
            column=col_todo,
            title='Setup backend',
            defaults={'description': 'Initialize Django app', 'order': 1}
        )
        Task.objects.get_or_create(
            column=col_in_progress,
            title='Implement WebSocket chat',
            defaults={'description': 'Add real-time chat', 'order': 0}
        )
        Task.objects.get_or_create(
            column=col_done,
            title='Design database',
            defaults={'description': 'Create ERD', 'order': 0}
        )
        self.stdout.write("Created sample tasks")
        self.stdout.write(self.style.SUCCESS('Demo data seeded successfully!'))

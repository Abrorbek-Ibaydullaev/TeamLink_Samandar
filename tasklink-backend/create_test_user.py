#!/usr/bin/env python
from django.contrib.auth import get_user_model
import os
import sys
import django

# Setup Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(__file__))
django.setup()


User = get_user_model()

# Check existing users
print("=== Existing Users ===")
users = User.objects.all()
if users.exists():
    for u in users:
        print(f"  - username: {u.username}, email: {u.email}")
else:
    print("  No users found.")

# Create test user
print("\n=== Creating Test User ===")
email = "test@example.com"
username = "testuser"
password = "TestPassword123"

user, created = User.objects.get_or_create(
    email=email,
    defaults={'username': username}
)

if created:
    user.set_password(password)
    user.save()
    print(f"✓ Created user: {email} / {password}")
else:
    # Update password if user exists
    user.set_password(password)
    user.save()
    print(f"✓ Updated password for existing user: {email} / {password}")

print("\n=== All Users ===")
for u in User.objects.all():
    print(f"  - username: {u.username}, email: {u.email}")
